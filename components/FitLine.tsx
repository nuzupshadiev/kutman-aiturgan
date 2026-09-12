"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

/**
 * One line of display type, shrunk until it fits the width it is given.
 *
 * The artboard reserves a fixed box for the couple's names, and an operator's
 * names are as long as they are — a name that would run past the card is set
 * smaller instead of overflowing it. Nothing is ever scaled up, so a short
 * name keeps the size the design chose for it.
 *
 * Both widths are read the same way, so the `zoom` the artboard is scaled with
 * cancels out of the ratio.
 */
export default function FitLine({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const box = useRef<HTMLSpanElement>(null);
  const line = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const outer = box.current;
    const inner = line.current;
    if (!outer || !inner) return;

    // Some of the artboard's boxes are drawn wider than the board they sit on
    // and bleed off its edges by design, so the board is the real limit.
    const board = outer.closest(".zb-board");

    const fit = () => {
      // The size the design chose, before any previous fit narrowed it.
      inner.style.fontSize = "";
      const available = Math.min(
        outer.getBoundingClientRect().width,
        board ? board.getBoundingClientRect().width : Number.POSITIVE_INFINITY,
      );
      const natural = inner.getBoundingClientRect().width;
      if (!available || !natural || natural <= available) return;
      // Setting the size rather than scaling keeps the line in the layout, so
      // it is still centred in its box once it has been shrunk. Both widths
      // are measured the same way, so the artboard's `zoom` cancels out.
      const base = Number.parseFloat(window.getComputedStyle(inner).fontSize);
      inner.style.fontSize = `${(base * available) / natural}px`;
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(outer);
    // Web fonts land after first paint, and they change the line's width.
    document.fonts?.ready.then(fit).catch(() => {});
    return () => observer.disconnect();
  }, [children]);

  return (
    <span ref={box} className={`fit-line ${className ?? ""}`.trim()}>
      <span ref={line} className="fit-line__inner">
        {children}
      </span>
    </span>
  );
}
