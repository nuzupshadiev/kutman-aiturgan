import type { Language } from "@/data/translations";

export type Attendance = "yes" | "no";

export const MAX_GUESTS = 20;
export const MAX_NAME_LENGTH = 120;
/** What a submission id may look like; checked again by the server. */
export const SUBMISSION_ID_PATTERN = /^[A-Za-z0-9_-]{8,64}$/u;

export interface RsvpPayload {
  guestName: string;
  attendance: Attendance;
  guestCount: number;
  language: Language;
  submissionId: string;
}

/**
 * The site's own route handler. It holds the Google credentials on the server,
 * so the form only ever talks to its own origin.
 */
const RSVP_ENDPOINT = "/api/rsvp";

/** The server has no Google Sheets credentials to write the answer with. */
export class RsvpConfigurationError extends Error {
  constructor() {
    super("RSVP storage is not configured.");
    this.name = "RsvpConfigurationError";
  }
}

/** The request reached the server and the answer was not saved. */
export class RsvpServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RsvpServerError";
  }
}

/**
 * A stable id for one filled-in form, reused on retry so a resend after a
 * timeout is recognised as the same guest instead of booking them twice.
 */
export function createSubmissionId(): string {
  const cryptoRef = globalThis.crypto;
  if (cryptoRef?.randomUUID) return cryptoRef.randomUUID().replace(/-/gu, "");
  const bytes = new Uint8Array(16);
  if (cryptoRef?.getRandomValues) cryptoRef.getRandomValues(bytes);
  else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function submitRsvp(payload: RsvpPayload): Promise<void> {
  const response = await fetch(RSVP_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      guestName: payload.guestName.trim(),
      attendance: payload.attendance,
      guestCount: payload.attendance === "no" ? 0 : payload.guestCount,
      language: payload.language,
      submissionId: payload.submissionId,
    }),
  });

  const result: unknown = await response.json().catch(() => null);
  const record =
    typeof result === "object" && result !== null ? (result as Record<string, unknown>) : null;

  if (response.ok && record?.success === true) return;
  if (record?.code === "not_configured") throw new RsvpConfigurationError();
  throw new RsvpServerError(
    typeof record?.code === "string" ? record.code : `HTTP ${response.status}`,
  );
}
