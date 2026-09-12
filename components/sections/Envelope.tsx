"use client";

import { useEffect } from "react";

import { templateContent } from "@/data/template-content";
import { t, translations, type Language } from "@/data/translations";
import { useMusic } from "@/components/MusicProvider";

import "@/app/styles/sections/envelope.css";

interface EnvelopeProps {
  language: Language;
  opened: boolean;
  onOpen: () => void;
}

/**
 * Opening screen: a sealed envelope. Clicking the wax seal slides the flaps
 * apart, fades the envelope away and starts the music.
 */
export default function Envelope({ language, opened, onOpen }: EnvelopeProps) {
  const { play } = useMusic();

  useEffect(() => {
    document.body.classList.toggle("is-locked", !opened);
    return () => document.body.classList.remove("is-locked");
  }, [opened]);

  const open = () => {
    if (opened) return;
    onOpen();
    window.scrollTo(0, 0);
    play();
  };

  return (
    <div
      id="r1101357071"
      className={`section envelope ${opened ? "envelope_opened" : ""}`}
      aria-hidden={opened}
    >
      <div className="zb">
        <div className="zb-board">
          <div className="zb-bg" />
          <div className="zb-filter" />

          <div className="zb-el envelope__paper" data-el="1749882681621" data-kind="shape">
            <div
              className="zb-atom zb-bgimg"
              style={{
                backgroundImage:
                  "url('/assets/6565-373-iPhone_14__15_Pro_-_.webp'), linear-gradient(0turn,rgba(59,80,125,1) 0%,rgba(42,72,136,1) 100%)",
              }}
              role="img"
            />
          </div>

          <div className="zb-el envelope__front" data-el="1749841897942" data-kind="image">
            <div className="zb-atom">
              <img
                className="zb-atom__img"
                src="/assets/3030-343-Mask_group4567_1.webp"
                width={1504}
                height={804}
                alt=""
                fetchPriority="high"
              />
            </div>
          </div>

          <div className="zb-el envelope__flap" data-el="1749841831092" data-kind="image">
            <div className="zb-atom">
              <img
                className="zb-atom__img"
                src="/assets/3534-303-Mask_group_5.webp"
                width={1472}
                height={818}
                alt=""
                fetchPriority="high"
              />
            </div>
          </div>

          <div className="zb-el envelope__title" data-el="1749882026856" data-kind="text">
            <div className="zb-atom">
              <span className="envelope__title-caps">
                {t(templateContent.envelope.invitedFirst, language)}
              </span>
              <span className="envelope__title-caps">
                {t(templateContent.envelope.invitedSecond, language)}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="zb-el envelope__seal"
            data-el="1749841935512"
            data-kind="image"
            onClick={open}
            aria-label={t(translations.intro.openAccessible, language)}
          >
            <div className="zb-atom">
              <img
                className="zb-atom__img"
                src="/assets/seal-blank.webp"
                width={281}
                height={245}
                alt=""
                fetchPriority="high"
              />
              <span className="envelope__seal-text">
                {t(templateContent.envelope.seal, language)}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
