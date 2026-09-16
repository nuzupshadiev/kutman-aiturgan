import { isLanguage } from "@/data/translations";
import { bishkekDateTime } from "@/lib/date";
import { appendRowOnce, SheetsConfigurationError } from "@/lib/google-sheets";
import {
  MAX_GUESTS,
  MAX_NAME_LENGTH,
  SUBMISSION_ID_PATTERN,
  type RsvpPayload,
} from "@/lib/rsvp";

/** A real answer is well under 300 bytes. */
const MAX_BODY_BYTES = 4_096;

/** The columns the guest list is kept in, written once on an empty sheet. */
const HEADER = ["Жөнөтүлгөн убакыт", "Аты-жөнү", "Келеби", "Конок саны", "Тил", "ID"] as const;
const ATTENDANCE_LABEL = { yes: "Келет", no: "Келбейт" } as const;
const LANGUAGE_LABEL = { ky: "кыргызча", ru: "орусча" } as const;

const fail = (status: number, code: string) =>
  Response.json({ success: false, code }, { status });

/**
 * The answer exactly as the form would send it, or null. Everything is checked
 * again here: the browser's own validation is a convenience, not a guarantee.
 */
function parseAnswer(value: unknown): RsvpPayload | null {
  if (typeof value !== "object" || value === null) return null;
  const input = value as Record<string, unknown>;

  const guestName =
    typeof input.guestName === "string"
      ? input.guestName.replace(/\p{Cc}/gu, " ").replace(/\s+/gu, " ").trim()
      : "";
  if (!guestName || guestName.length > MAX_NAME_LENGTH) return null;

  const { attendance, guestCount, language, submissionId } = input;
  if (attendance !== "yes" && attendance !== "no") return null;
  if (!isLanguage(language)) return null;
  if (typeof submissionId !== "string" || !SUBMISSION_ID_PATTERN.test(submissionId)) return null;
  if (typeof guestCount !== "number" || !Number.isInteger(guestCount)) return null;
  if (attendance === "yes" ? guestCount < 1 || guestCount > MAX_GUESTS : guestCount !== 0) {
    return null;
  }

  return { guestName, attendance, guestCount, language, submissionId };
}

/** Saves one guest's answer as a row in the Google Sheet. */
export async function POST(request: Request) {
  const declaredLength = Number(request.headers.get("content-length"));
  if (declaredLength > MAX_BODY_BYTES) return fail(413, "too_large");

  const text = await request.text().catch(() => "");
  if (text.length > MAX_BODY_BYTES) return fail(413, "too_large");

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return fail(400, "invalid_json");
  }

  const answer = parseAnswer(body);
  if (!answer) return fail(400, "invalid_answer");

  try {
    await appendRowOnce(HEADER, [
      bishkekDateTime(Date.now()),
      answer.guestName,
      ATTENDANCE_LABEL[answer.attendance],
      answer.guestCount,
      LANGUAGE_LABEL[answer.language],
      answer.submissionId,
    ]);
    return Response.json({ success: true });
  } catch (error) {
    if (error instanceof SheetsConfigurationError) {
      console.error(`[rsvp] Google Sheets is not configured: ${error.message}`);
      return fail(503, "not_configured");
    }
    console.error("[rsvp] The answer could not be saved to Google Sheets:", error);
    return fail(502, "storage_failed");
  }
}
