import "server-only";

import { createSign } from "node:crypto";

/**
 * A minimal Google Sheets client for the guest form, talking to the REST API
 * with a service account — no SDK, so the serverless function stays small and
 * starts fast.
 *
 * Everything it needs comes from server-only environment variables. None of
 * them is prefixed `NEXT_PUBLIC_`, and this module refuses to be imported into
 * a Client Component, so the key can never reach a guest's browser.
 */

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SHEETS_API = "https://sheets.googleapis.com/v4/spreadsheets";
const SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const TIMEOUT_MS = 10_000;
/** A token this close to expiry is renewed rather than risked on a request. */
const TOKEN_MARGIN_MS = 60_000;

interface SheetsConfig {
  clientEmail: string;
  privateKey: string;
  spreadsheetId: string;
  /** Empty means the spreadsheet's first tab. */
  sheetName: string;
}

/** A variable is missing or unreadable: the deployment has to be fixed. */
export class SheetsConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SheetsConfigurationError";
  }
}

/** Google answered, but not with what was asked for. */
export class SheetsRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SheetsRequestError";
  }
}

/**
 * `.env` files and the Vercel dashboard both keep the PEM on one line with
 * literal `\n`, and a key pasted together with its surrounding quotes still
 * has them.
 */
function normalisePrivateKey(value: string | undefined): string {
  if (!value) return "";
  return value
    .trim()
    .replace(/^(["'])([\s\S]*)\1$/u, "$2")
    .replace(/\\n/gu, "\n");
}

function readConfig(): SheetsConfig {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL?.trim() ?? "";
  const privateKey = normalisePrivateKey(process.env.GOOGLE_PRIVATE_KEY);
  const spreadsheetId = process.env.GOOGLE_SHEET_ID?.trim() ?? "";
  const missing = [
    !clientEmail && "GOOGLE_CLIENT_EMAIL",
    !privateKey && "GOOGLE_PRIVATE_KEY",
    !spreadsheetId && "GOOGLE_SHEET_ID",
  ].filter(Boolean);
  if (missing.length > 0) {
    throw new SheetsConfigurationError(`Missing environment variables: ${missing.join(", ")}`);
  }
  return {
    clientEmail,
    privateKey,
    spreadsheetId,
    sheetName: process.env.GOOGLE_SHEET_NAME?.trim() ?? "",
  };
}

const base64url = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");

/** Reused across requests while the function instance stays warm. */
let cachedToken: { value: string; expiresAt: number } | null = null;

async function accessToken(config: SheetsConfig): Promise<string> {
  if (cachedToken && cachedToken.expiresAt - TOKEN_MARGIN_MS > Date.now()) {
    return cachedToken.value;
  }

  const issuedAt = Math.floor(Date.now() / 1000);
  const unsigned = `${base64url({ alg: "RS256", typ: "JWT" })}.${base64url({
    iss: config.clientEmail,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: issuedAt,
    exp: issuedAt + 3600,
  })}`;

  let signature: string;
  try {
    signature = createSign("RSA-SHA256").update(unsigned).sign(config.privateKey, "base64url");
  } catch {
    throw new SheetsConfigurationError("GOOGLE_PRIVATE_KEY is not a valid PEM private key");
  }

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${signature}`,
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const body = (await response.json().catch(() => null)) as {
    access_token?: unknown;
    expires_in?: unknown;
    error?: unknown;
  } | null;

  if (!response.ok || typeof body?.access_token !== "string") {
    throw new SheetsRequestError(
      `Token request failed (${response.status}${body?.error ? `: ${String(body.error)}` : ""})`,
    );
  }

  const lifetime = typeof body.expires_in === "number" ? body.expires_in : 3600;
  cachedToken = { value: body.access_token, expiresAt: Date.now() + lifetime * 1000 };
  return cachedToken.value;
}

async function sheetsRequest<T>(config: SheetsConfig, path: string, init?: RequestInit) {
  const token = await accessToken(config);
  const response = await fetch(`${SHEETS_API}/${encodeURIComponent(config.spreadsheetId)}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const body = (await response.json().catch(() => null)) as
    | (T & { error?: { message?: string } })
    | null;

  if (!response.ok) {
    // A revoked or rotated key invalidates the cached token too.
    if (response.status === 401) cachedToken = null;
    throw new SheetsRequestError(
      `Sheets API answered ${response.status}${body?.error?.message ? `: ${body.error.message}` : ""}`,
    );
  }
  return body as T;
}

/** `A1:F1` on the configured tab, quoted the way A1 notation wants it. */
function a1(config: SheetsConfig, range: string): string {
  if (!config.sheetName) return range;
  return `'${config.sheetName.replace(/'/gu, "''")}'!${range}`;
}

/** 1 → A … 26 → Z; the guest form never needs more columns than that. */
const columnLetter = (index: number) => String.fromCharCode(64 + index);

type Cell = string | number;

/**
 * Appends `row` under `header`, writing the header first on an empty sheet.
 *
 * The row's last cell is its unique id. A row whose id is already in that
 * column is not written again, so a guest whose first attempt timed out after
 * it had in fact been saved is still booked once. Returns whether a new row was
 * written.
 *
 * Values are sent `RAW`, so a name that starts with `=` stays a name and is
 * never evaluated as a formula.
 */
export async function appendRowOnce(
  header: readonly string[],
  row: readonly Cell[],
): Promise<boolean> {
  const config = readConfig();
  const lastColumn = columnLetter(header.length);
  const id = String(row[row.length - 1]);

  const ranges = [a1(config, `A1:${lastColumn}1`), a1(config, `${lastColumn}:${lastColumn}`)];
  const query = ranges.map((range) => `ranges=${encodeURIComponent(range)}`).join("&");
  const existing = await sheetsRequest<{ valueRanges?: Array<{ values?: Cell[][] }> }>(
    config,
    `/values:batchGet?${query}`,
  );

  const headerRow = existing.valueRanges?.[0]?.values?.[0] ?? [];
  const ids = existing.valueRanges?.[1]?.values ?? [];
  if (ids.some((cells) => String(cells[0]) === id)) return false;

  const values = headerRow.length === 0 ? [[...header], [...row]] : [[...row]];
  await sheetsRequest(
    config,
    `/values/${encodeURIComponent(ranges[0])}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    { method: "POST", body: JSON.stringify({ values }) },
  );
  return true;
}
