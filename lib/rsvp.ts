import { invitation } from "@/data/invitation";
import type { Language } from "@/data/translations";

export type Attendance = "yes" | "no";

export interface RsvpPayload {
  guestName: string;
  attendance: Attendance;
  guestCount: number;
  language: Language;
  submissionId: string;
}

/** The RSVP API is not reachable: neither the env var nor the data file has it. */
export class RsvpConfigurationError extends Error {
  constructor() {
    super("RSVP endpoint is not configured.");
    this.name = "RsvpConfigurationError";
  }
}

/** The request reached the server and it refused the answer. */
export class RsvpServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RsvpServerError";
  }
}

/**
 * Prefers the deployment's own environment variable and falls back to the
 * absolute URL the Invitation Admin writes into `invitation.rsvp.endpoint`.
 * Never a relative path and never localhost: both would break a deployed
 * invitation.
 */
export function resolveRsvpEndpoint(): string {
  const base = process.env.NEXT_PUBLIC_RSVP_API_URL?.trim().replace(/\/+$/u, "");
  if (base) return `${base}/api/rsvp`;
  return invitation.rsvp.endpoint.trim();
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

export async function submitRsvp(payload: RsvpPayload, fallbackMessage: string) {
  const endpoint = resolveRsvpEndpoint();
  if (!endpoint) throw new RsvpConfigurationError();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      invitationSlug: invitation.slug,
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
  const message = typeof record?.message === "string" ? record.message : undefined;

  if (!response.ok || record?.success !== true) {
    throw new RsvpServerError(message || fallbackMessage);
  }

  return record;
}
