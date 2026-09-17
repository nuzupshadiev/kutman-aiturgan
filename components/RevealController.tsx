"use client";

import { useEffect } from "react";

const REVEAL_DELAY_MS = 250;

/**
 * Adds `t-animate_started` to every `.t-animate` element the first time it
 * enters the viewport, 250 ms after it does.
 *
 * Each element is measured against the viewport directly rather than watched
 * by an IntersectionObserver. Until it is revealed an element sits 100px below
 * its place, which pushes the last lines of a section past the section's
 * clipped bottom edge — and an observer counts a clipped element as never
 * visible, so the venue address, the map button and the last programme time
 * would stay transparent for good.
 */
export default function RevealController() {
  useEffect(() => {
    const waiting = new Set(document.querySelectorAll<HTMLElement>(".t-animate"));
    if (waiting.size === 0) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      waiting.forEach((el) => el.classList.add("t-animate_started"));
      return;
    }

    const timers = new Set<ReturnType<typeof setTimeout>>();
    let frame = 0;

    const check = () => {
      frame = 0;
      waiting.forEach((el) => {
        const { top, bottom } = el.getBoundingClientRect();
        // A hidden element measures 0x0 at the origin and waits for a resize.
        if (bottom <= 0 || top >= window.innerHeight) return;
        waiting.delete(el);
        const timer = setTimeout(() => {
          el.classList.add("t-animate_started");
          timers.delete(timer);
        }, REVEAL_DELAY_MS);
        timers.add(timer);
      });
      if (waiting.size === 0) unlisten();
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };

    const unlisten = () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();

    return () => {
      unlisten();
      cancelAnimationFrame(frame);
      timers.forEach(clearTimeout);
    };
  }, []);

  return null;
}
