/**
 * The design is authored on five fixed-width artboards. At runtime the widest
 * artboard that fits the viewport is selected and scaled up to fill it, which
 * is what keeps the layout proportional on every device.
 */
export const ARTBOARD_WIDTHS = [320, 480, 640, 960, 1200] as const;

export type ArtboardWidth = (typeof ARTBOARD_WIDTHS)[number];

/** Width of the artboard that a given viewport width renders. */
export function artboardWidthFor(viewportWidth: number): ArtboardWidth {
  let match: ArtboardWidth = ARTBOARD_WIDTHS[0];
  for (const width of ARTBOARD_WIDTHS) {
    if (viewportWidth >= width) match = width;
  }
  return match;
}

/** Scale factor applied to the artboard so it fills the viewport exactly. */
export function zoomFor(viewportWidth: number): number {
  return Number((viewportWidth / artboardWidthFor(viewportWidth)).toFixed(4));
}
