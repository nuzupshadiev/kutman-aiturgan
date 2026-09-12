"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./NoiseOverlay.module.css";

const SHUFFLE_MS = 100;

/**
 * Animated paper-grain film laid over the page, blended with `soft-light`.
 * Matching the source, it is only rendered from 480px up.
 */
export default function NoiseOverlay() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 480px)");
    const sync = () => setEnabled(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const setHeight = () =>
      document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`);
    setHeight();
    window.addEventListener("resize", setHeight);

    // A task (rather than a frame) so the fade still runs in a background tab.
    const reveal = setTimeout(() => setVisible(true), 0);
    const shuffle = setInterval(() => {
      const el = layer.current;
      if (!el) return;
      el.style.backgroundPosition = `${Math.floor(Math.random() * 100)}% ${Math.floor(
        Math.random() * 100,
      )}%`;
    }, SHUFFLE_MS);

    return () => {
      window.removeEventListener("resize", setHeight);
      clearTimeout(reveal);
      clearInterval(shuffle);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={layer}
      className={`${styles.noise} ${visible ? styles.visible : ""}`}
      aria-hidden="true"
    />
  );
}
