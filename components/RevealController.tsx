"use client";

import { useEffect } from "react";

const REVEAL_DELAY_MS = 250;

/**
 * Adds `t-animate_started` to every `.t-animate` element the first time it
 * enters the viewport, 250 ms after the intersection fires.
 */
export default function RevealController() {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".t-animate"));
    if (targets.length === 0) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      targets.forEach((el) => el.classList.add("t-animate_started"));
      return;
    }

    const timers = new Set<ReturnType<typeof setTimeout>>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        const timer = setTimeout(() => {
          entry.target.classList.add("t-animate_started");
          timers.delete(timer);
        }, REVEAL_DELAY_MS);
        timers.add(timer);
      });
    });

    targets.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return null;
}
