"use client";

import { t, translations, type Language } from "@/data/translations";
import { countdownParts } from "@/lib/date";
import { useNow } from "@/lib/use-now";

import styles from "./Countdown.module.css";

const UNITS = ["days", "hours", "minutes", "seconds"] as const;

/**
 * Days / hours / minutes / seconds left until the wedding.
 *
 * `target` is the event instant, anchored to the venue's own timezone, so the
 * figures count down to the moment the celebration begins wherever the guest
 * happens to be reading. Until hydration the clock reads 0 and the figures are
 * left blank rather than printing a number the server guessed.
 */
export default function Countdown({ target, language }: { target: number; language: Language }) {
  const now = useNow();
  const started = now > 0;
  const left = countdownParts(target, now);

  return (
    <div className={styles.timer}>
      {UNITS.map((key, index) => (
        <span key={key}>
          {index > 0 && <span className={styles.separator}>:</span>}
          <span className={styles.element}>
            <span className={styles.value}>{started ? left[key] : ""}</span>
            <span className={styles.label}>{t(translations.countdown[key], language)}</span>
          </span>
        </span>
      ))}
    </div>
  );
}
