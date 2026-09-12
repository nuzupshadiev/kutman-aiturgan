# Blue letter

A bilingual (Russian / Kyrgyz) wedding invitation template for the Invitation
Admin system.

A sealed navy envelope with a gold wax seal opens onto a letter: the couple's
names in copperplate on an ornate cartouche, the address to the guests, the day
ringed on a calendar, the programme drawn along a gold ribbon, a guest form and
a countdown.

The envelope is the first thing on screen — there is no loading step before it —
and it is shown in `invitation.defaultLanguage`, which ships as Kyrgyz.

---

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
```

Other scripts:

```bash
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm run build        # production build
npm run start        # serve the production build
```

Copy `.env.example` to `.env.local` if you want the guest form to reach a real
RSVP API while developing. Without it the form shows a localized configuration
message instead of pretending to send anything.

---

## The invitation data contract

Every customer-specific value lives in **`data/invitation.ts`**, in a single
exported object literal named exactly `invitation`. The Invitation Admin
rewrites that object through the TypeScript AST when it generates a real
invitation, so the file obeys a few rules:

- plain string literals only — nothing computed, no template strings, no
  spreads, no imports used as values;
- every human-readable value is `{ ru, ky }`, never one language in both slots;
- `type` is `"wedding"`, matching the entry in the admin's `data/templates.ts`;
- `rsvp.endpoint` ships empty; the admin writes the absolute RSVP API URL into
  it at generation time.

Required by the contract: `slug`, `type`, `people.bride.name`,
`people.groom.name`, `event.date`, `event.startTime`, `venue.name`,
`venue.address`, `venue.mapUrl`, `weddingDetails.customMessage`,
`weddingDetails.hosts`, `rsvp.endpoint`.

`event.date` drives four places at once: the calendar opens on that month with
that day inside the heart, the calligraphic line under it names the month, the
hero prints day, month and two-digit year down the card, and the countdown runs
to `event.date` + `event.startTime` in Bishkek time.

Optional capabilities this template declares, honoured when the operator fills
them in:

| Key | Effect when absent or empty |
| --- | --- |
| `timeline.items` | The ribbon is drawn with no stops on it. |
| `assets.music` | No music toggle is rendered on the hero. |

This design has **no dress-code section**, so `weddingDetails.dressCode` is not
declared. Anything an operator types in that field is ignored — add the key back
to `data/invitation.ts` and a section that reads it if the dress code is wanted.

The ribbon has **five** drawn stops. Fewer timeline items leave the later ones
empty; a sixth has nowhere on the ribbon to stand and is not rendered.

`weddingDetails.customMessage` may contain `{{groom}}` and `{{bride}}`
placeholders. The design cuts the message at them and sets each name large in
copperplate on a line of its own, with the sentence running above and below;
`weddingDetails.hosts` closes the block under a label the design supplies. A
message written without placeholders still renders — it simply opens on the
couple.

**Design copy belongs in `data/template-content.ts`; reusable interface strings
belong in `data/translations.ts`.** Never write a name, a date or a venue into
either of them: the admin rewrites only `data/invitation.ts`, so anything else
would ship to a real customer as somebody else's wedding.

---

## RSVP integration

The guest form posts directly to the central RSVP API. It never talks to a
database and this repository contains no `app/api/rsvp` route.

`lib/rsvp.ts` resolves the endpoint in this order:

1. `process.env.NEXT_PUBLIC_RSVP_API_URL` + `/api/rsvp`, when the deployment
   sets it;
2. the absolute URL the admin wrote into `invitation.rsvp.endpoint`.

Neither available is treated as a visible, localized configuration error.

The payload the server accepts:

```jsonc
{
  "invitationSlug": "…",     // invitation.slug, ≤120 characters
  "guestName": "…",          // trimmed, non-empty, ≤120 characters
  "attendance": "yes",       // "yes" | "no"
  "guestCount": 2,           // 1–20 when attending, 0 when not
  "language": "ru",          // "ru" | "ky"
  "submissionId": "…"        // 8–64 chars of [A-Za-z0-9_-], stable across retries
}
```

`submissionId` is generated once per filled-in form and reused on retry, so a
resend after a timeout is recognised as the same guest instead of booking them
twice. Success is reported only when the server answers `success: true`; form
values survive every failure.

---

## How the layout works

The invitation is drawn on **artboards**: fixed-width canvases (1200 / 960 /
640 / 480 / 320 px, one per breakpoint) with every element absolutely
positioned on them. At runtime each artboard is scaled up to the window with
`zoom`, so the design keeps its exact proportions on any screen instead of
reflowing.

- `components/ZoomController.tsx` publishes `--zoom` and `--artboard-width`
  (also inlined in `<head>` so nothing renders unscaled).
- `app/styles/zero-block.css` holds the engine: `.zb-board`, `.zb-el`,
  `.zb-group`, `.zb-atom`.
- `app/styles/sections/*.css` holds one artboard's geometry each, with the
  per-breakpoint overrides.

Two artboards fill the viewport (`height: 100vh`) and therefore centre their
content vertically; a few others *hug* their content, so their height comes
from the flow group inside them rather than a fixed value. Both cases are
called out in the relevant stylesheet.

### Lines that have to fit

The artboard measured every calligraphic line around the one short word its
sample data happened to use, and left it `width: auto; white-space: nowrap` —
so a longer name, heading or programme title from a real invitation would grow
straight past the board.

Two pieces fix that, and they go together:

- `zb-el_fit` (in `app/globals.css`) gives such an element the width it was
  allotted instead of letting it grow to its content;
- `components/FitLine.tsx` measures the line against that box — never wider
  than the `.zb-board` it sits on — and reduces its font size until it fits.
  Nothing is ever scaled up, so the design's own short lines are untouched.

---

## Type

Every face lives in **`app/fonts`** and is loaded through `next/font/local` in
`app/layout.tsx` — nothing font-related sits in `public`, no webfont service is
contacted, and Next preloads each file and serves it from the same origin.

| Face | Where | Exposed as |
| --- | --- | --- |
| Playfair Display | the envelope's capitals | `--t-headline-font`, weight 100 |
| Forum | every running line | `--t-text-font`, weight 400 |
| Bickham Script Pro | all the calligraphy | `--t-script-font` |

The first two share one family, because the artboards pick a face by weight:
`font-weight: 100` is the roman, `400` the serif. The artboards reach for seven
more weights that nothing is set in any more — the calligraphic lines they
mapped to weight 800 are set in the script instead, since that face has no
**Ң, Ө or Ү** and dropped a Kyrgyz line into a sans-serif mid-word. Elements
carrying `zb-el_script` are moved onto the script for exactly that reason.

All three are subset to Latin plus the **whole** Cyrillic block (U+0400–04FF),
not to the glyphs the sample data happens to use — an operator can type any
Russian or Kyrgyz name. Their OpenType layout features are kept, including the
`swsh` alternates the couple's names are set with. Together they weigh 259 KB
instead of the 695 KB the unsubset originals did.

To replace one: drop the `.woff2` into `app/fonts`, point `layout.tsx` at it,
and check it still carries Ң, Ө and Ү. Subset with:

```bash
pyftsubset face.woff2 --output-file=out.woff2 --flavor=woff2 \
  --unicodes='U+0020-007E,U+00A0,U+00AB,U+00BB,U+00AD,U+0400-04FF,U+2010-2015,U+2018-201F,U+2026,U+2039,U+203A,U+20BD' \
  --layout-features='*' --name-IDs='*' --notdef-outline --no-hinting
```

Two more faces come from Google Fonts for the countdown alone: Marmelad and
Comfortaa, both requested with the Cyrillic subset.

Each replaced block sets `--u`, one unit of the artwork it stands in for, so it
scales with its box at every breakpoint exactly as the old flattened image did.

---

## Assets

`public` holds only what the browser fetches by URL: the artwork in
`public/assets` and the track in `public/audio`. Nothing else — no fonts, no
build inputs, no leftovers from sections that have been removed. Every `<img>`
carries its intrinsic size so the page reserves space before the image arrives.

The share image (`metadata.openGraph.images`) is kept under the 420 KB the
Invitation Admin allows a share preview; the audio is only requested once a
guest breaks the seal.

---

## Accessibility and motion

- The letter behind the envelope is `inert` until the seal is broken, so a
  guest on a keyboard cannot tab into a form they cannot see.
- The guest form labels every field, associates its validation messages, and
  announces status through an `aria-live` region.
- Decorative artwork carries empty alt text.
- `prefers-reduced-motion` disables the scroll reveals.

| Effect | Where |
| --- | --- |
| Envelope opening (flaps 5 s, paper dissolves 2 s) | `components/sections/Envelope.tsx` |
| Fade-in-up on first view | `components/RevealController.tsx` + `app/styles/reveal.css` |
| Ribbon drawn as you scroll the programme | `components/sections/Timing.tsx` |
| Grain overlay (≥ 480 px) | `components/NoiseOverlay.tsx` |
