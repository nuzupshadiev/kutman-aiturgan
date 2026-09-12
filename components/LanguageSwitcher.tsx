"use client";

import { t, translations, type Language } from "@/data/translations";

import styles from "./LanguageSwitcher.module.css";

interface LanguageSwitcherProps {
  language: Language;
  onChange: (language: Language) => void;
}

const LANGUAGES: Language[] = ["ru", "ky"];

/**
 * RU / KY, in a cream pill in the corner of the letter. A pair of pressable
 * buttons rather than a menu, so the choice is one tap on a phone and the
 * current language is announced as pressed.
 */
export default function LanguageSwitcher({ language, onChange }: LanguageSwitcherProps) {
  return (
    <div
      className={styles.root}
      role="group"
      aria-label={t(translations.languageSwitcher.label, language)}
    >
      {LANGUAGES.map((option) => {
        const active = option === language;
        return (
          <button
            type="button"
            key={option}
            className={`${styles.option} ${active ? styles.option_active : ""}`}
            aria-pressed={active}
            aria-label={t(translations.languageSwitcher.switchTo[option], language)}
            onClick={() => onChange(option)}
          >
            {translations.languageSwitcher.short[option]}
          </button>
        );
      })}
    </div>
  );
}
