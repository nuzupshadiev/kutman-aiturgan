/**
 * The invitation message marks where the couple belongs with `{{bride}}` and
 * `{{groom}}`, and this design lifts the pair onto display lines of their own —
 * set large in the copperplate the names on the card are set in — with the
 * sentence running above and below them.
 *
 * So the message is cut at every placeholder, in the order the operator wrote
 * them, and the pieces are grouped into lines. Two names separated by nothing
 * more than a connective ("и", "менен", "&") come back as one line; anything
 * longer between them keeps its own line, so a sentence like "…нашего сына
 * {{groom}} и нашей невестки {{bride}}…" is never left with a stranded
 * fragment.
 */
export type MessageSegment =
  | { kind: "text"; value: string }
  | { kind: "name"; who: "groom" | "bride" };

export type MessageLine =
  | { kind: "text"; value: string }
  | { kind: "names"; names: Array<"groom" | "bride">; joiner?: string };

const PLACEHOLDER = /\{\{\s*(groom|bride)\s*\}\}/gu;

/**
 * The punctuation that closed the clause the names were lifted out of. It
 * belongs to a sentence that is no longer on this line, so a fragment opening
 * with it would read as a stray dash under the couple.
 */
const ORPHANED_PUNCTUATION = /^[\s.,;:!?…—–-]+/u;

/** Longer than this between two names and each name keeps its own line. */
const MAX_JOINER_LENGTH = 8;

function clean(value: string, followsName: boolean): string {
  const trimmed = value.trim();
  return followsName ? trimmed.replace(ORPHANED_PUNCTUATION, "") : trimmed;
}

export function splitCoupleMessage(message: string): MessageSegment[] {
  const segments: MessageSegment[] = [];
  let cursor = 0;

  for (const match of message.matchAll(PLACEHOLDER)) {
    const start = match.index ?? 0;
    const text = clean(message.slice(cursor, start), segments.length > 0);
    if (text) segments.push({ kind: "text", value: text });
    segments.push({ kind: "name", who: match[1] as "groom" | "bride" });
    cursor = start + match[0].length;
  }

  const tail = clean(message.slice(cursor), segments.length > 0);
  if (tail) segments.push({ kind: "text", value: tail });

  // A message written without placeholders still opens on the couple, rather
  // than leaving the block with no names in it at all.
  if (!segments.some((segment) => segment.kind === "name")) {
    return [
      { kind: "name", who: "groom" },
      { kind: "name", who: "bride" },
      ...segments,
    ];
  }

  return segments;
}

export function messageLines(message: string): MessageLine[] {
  const segments = splitCoupleMessage(message);
  const lines: MessageLine[] = [];

  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index];
    if (segment.kind === "text") {
      lines.push({ kind: "text", value: segment.value });
      continue;
    }

    const joiner = segments[index + 1];
    const partner = segments[index + 2];
    if (
      joiner?.kind === "text" &&
      joiner.value.length <= MAX_JOINER_LENGTH &&
      partner?.kind === "name"
    ) {
      lines.push({
        kind: "names",
        names: [segment.who, partner.who],
        joiner: joiner.value,
      });
      index += 2;
      continue;
    }

    if (joiner?.kind === "name") {
      lines.push({ kind: "names", names: [segment.who, joiner.who] });
      index += 1;
      continue;
    }

    lines.push({ kind: "names", names: [segment.who] });
  }

  return lines;
}
