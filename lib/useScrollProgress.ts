"use client";

import { useEffect, useState, type RefObject } from "react";

import { artboardWidthFor } from "./breakpoints";

/** A value that can differ per artboard width, with a fallback. */
type PerBreakpoint = Partial<Record<number, number>> & { default: number };

type Options = {
  /** Where the animated element sits inside `ref`, in artboard pixels. */
  from: PerBreakpoint;
  /** Scroll distance, in artboard pixels, over which progress goes 0 → 1. */
  distance: PerBreakpoint;
  /** How far above that point the animation starts, in artboard pixels. */
  offset: PerBreakpoint;
};

function pick(map: PerBreakpoint, width: number) {
  return map[width] ?? map.default;
}

/**
 * Progress (0 → 1) of a scroll-linked animation, measured the way the source
 * design does: from a fixed point inside `ref`, offset by a trigger margin,
 * over a fixed scroll distance — all three scaled by the artboard zoom.
 *
 * `ref` points at an element that never moves (the section), so the animation
 * it drives can never feed back into its own measurement.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  { from, distance, offset }: Options,
) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const viewportWidth = document.documentElement.clientWidth;
      const artboard = artboardWidthFor(viewportWidth);
      const zoom = (window.innerWidth || viewportWidth) / artboard;
      const anchor = el.getBoundingClientRect().top + window.scrollY + pick(from, artboard) * zoom;
      const start = anchor - pick(offset, artboard) * zoom;
      const span = pick(distance, artboard) * zoom;
      const next = span <= 0 ? 1 : (window.scrollY - start) / span;
      setProgress(Math.min(1, Math.max(0, next)));
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref, from, distance, offset]);

  return progress;
}
