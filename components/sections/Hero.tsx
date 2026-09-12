"use client";

import { Fragment } from "react";

import { invitation } from "@/data/invitation";
import { templateContent } from "@/data/template-content";
import { t, translations, type Language } from "@/data/translations";
import { parseIsoDate } from "@/lib/date";
import FitLine from "@/components/FitLine";
import { useMusic } from "@/components/MusicProvider";

import "@/app/styles/sections/hero.css";

const pad = (value: number) => String(value).padStart(2, "0");

/** Day, month and two-digit year, stacked down the card between gold dots. */
function dateParts(isoDate: string): string[] {
  const { year, month, day } = parseIsoDate(isoDate);
  return [pad(day), pad(month), pad(year % 100)];
}

/** Opening card: the couple's monogram, names and the wedding date. */
export default function Hero({ language }: { language: Language }) {
  const { playing, available, play, pause } = useMusic();
  const parts = dateParts(invitation.event.date);

  return (
    <div id="r1101164271" className="section">
      <div className="zb">
        <div className="zb-board">
          <div className="zb-bg" />
          <div className="zb-filter" />

          <div className="zb-el" data-el="1749832756085" data-kind="image">
            <div className="zb-atom">
              <img
                className="zb-atom__img"
                src="/assets/3434-616-ChatGPT_Image_24__20.webp"
                width={787}
                height={1585}
                alt=""
                fetchPriority="high"
              />
            </div>
          </div>

          <div className="zb-group zb-group_flow" data-el="1782285267450000001">
            <div className="zb-mol" data-mol="1782285267450000001">
              <div className="zb-group zb-el_flow" data-el="174339788327959000">
                <div className="zb-mol" data-mol="174339788327959000">
                  {available ? (
                    <>
                      <button
                        type="button"
                        className={`zb-el music-toggle ${playing ? "" : "music-toggle_hidden"}`}
                        data-el="1743397845116"
                        data-kind="image"
                        onClick={pause}
                        aria-label={t(translations.music.pause, language)}
                      >
                        <div className="zb-atom">
                          <img
                            className="zb-atom__img"
                            src="/assets/3666-626-photo.webp"
                            width={135}
                            height={135}
                            alt=""
                          />
                        </div>
                      </button>
                      <button
                        type="button"
                        className={`zb-el music-toggle ${playing ? "music-toggle_hidden" : ""}`}
                        data-el="1743397845121"
                        data-kind="image"
                        onClick={play}
                        aria-label={t(translations.music.play, language)}
                      >
                        <div className="zb-atom">
                          <img
                            className="zb-atom__img"
                            src="/assets/3063-626-photo.webp"
                            width={128}
                            height={129}
                            alt=""
                          />
                        </div>
                      </button>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="zb-el zb-el_flow couple" data-el="1749832950443" data-kind="text">
                <div className="zb-atom">
                  <FitLine className="couple__name">
                    {t(invitation.people.groom.name, language)}
                  </FitLine>
                  <span className="couple__amp">{t(templateContent.hero.and, language)}</span>
                  <FitLine className="couple__name">
                    {t(invitation.people.bride.name, language)}
                  </FitLine>
                </div>
              </div>

              <div className="zb-el zb-el_flow" data-el="1749833025397" data-kind="text">
                <div className="zb-atom">{t(templateContent.hero.announcement, language)}</div>
              </div>

              <div
                className="zb-el zb-el_flow wedding-date"
                data-el="1749833142019"
                data-kind="text"
              >
                <div className="zb-atom">
                  {parts.map((part, index) => (
                    <Fragment key={index}>
                      {index > 0 ? <span className="wedding-date__dot" /> : null}
                      <span className="wedding-date__part">{part}</span>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
