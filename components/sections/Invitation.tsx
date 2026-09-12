"use client";

import { Fragment, type CSSProperties } from "react";

import { invitation } from "@/data/invitation";
import { templateContent } from "@/data/template-content";
import { t, translations, type Language } from "@/data/translations";
import { monthName, parseIsoDate, weekOfDate } from "@/lib/date";
import { messageLines } from "@/lib/message";
import FitLine from "@/components/FitLine";

import "@/app/styles/sections/invitation.css";

/* Traced from the calendar artwork, in its own 325x100 coordinates. */
const HEART =
  "M144.019 33.7757C142.352 34.1845 139.49 35.6313 137.886 36.9208C135.842 38.5562 133.609 41.9529 132.696 44.815C131.313 49.2181 131.784 54.4704 133.954 58.1502C134.961 59.9115 136.754 61.7671 151.284 76.6119C159.273 84.6949 161.883 87.2109 162.481 87.2109C163.047 87.2109 166.412 84.0029 176.791 73.5926C190.063 60.2574 190.346 59.9429 191.604 57.3325C193.082 54.2817 193.711 51.2624 193.365 48.5576C192.296 39.7513 185.471 33.4297 177.042 33.4297C172.482 33.4297 168.613 35.1595 164.871 38.8707L162.701 41.0094L160.027 38.4933C157.291 35.8829 154.744 34.4047 152.039 33.7757C150.309 33.3668 145.749 33.3982 144.019 33.7757Z";

const LOCALES = { ru: "ru-RU", ky: "ky-KG" } as const;

/** The welcome note, the wedding-day calendar and the venue. */
export default function Invitation({ language }: { language: Language }) {
  const { date } = invitation.event;
  const weddingDay = parseIsoDate(date).day;
  const week = weekOfDate(date);
  /** Which of the seven columns the heart sits behind. */
  const markedColumn = week.indexOf(weddingDay);

  const names = {
    groom: t(invitation.people.groom.name, language),
    bride: t(invitation.people.bride.name, language),
  };
  const lines = messageLines(t(invitation.weddingDetails.customMessage, language));

  // The script line under the calendar reads as part of a sentence, so the
  // month keeps the lowercase it would have inside one.
  const monthLine = t(templateContent.message.monthLine, language).replace(
    "{{month}}",
    monthName(date, language).toLocaleLowerCase(LOCALES[language]),
  );

  return (
    <div
      id="r1101164281"
      className="section"
      style={{ paddingBottom: "10px", backgroundColor: "#fffdf6" }}
    >
      <div className="zb">
        <div className="zb-board">
          <div className="zb-bg" />
          <div className="zb-filter" />

          <div className="zb-group zb-group_flow" data-el="1782281658693000003">
            <div className="zb-mol" data-mol="1782281658693000003">
              <div className="zb-group zb-el_flow zb-group_flow" data-el="1782281615455000001">
                <div className="zb-mol" data-mol="1782281615455000001">
                  <div
                    className="zb-el zb-el_flow zb-el_fit zb-el_script"
                    data-el="1782896015570"
                    data-kind="text"
                  >
                    <div className="zb-atom">
                      <FitLine>{t(templateContent.message.heading, language)}</FitLine>
                    </div>
                  </div>

                  <div
                    className="zb-el zb-el_flow t-animate"
                    data-el="1743094174954"
                    data-kind="text"
                  >
                    <div className="zb-atom">
                      {lines.map((line, index) =>
                        line.kind === "text" ? (
                          <p className="message__text" key={`text-${index}`}>
                            {line.value}
                          </p>
                        ) : (
                          <p className="message__names" key={`names-${index}`}>
                            {line.names.map((who, position) => (
                              <Fragment key={who}>
                                {position > 0 ? (
                                  <span className="message__and">
                                    {t(templateContent.hero.and, language)}
                                  </span>
                                ) : null}
                                <FitLine className="message__name">{names[who]}</FitLine>
                              </Fragment>
                            ))}
                          </p>
                        ),
                      )}

                      <p className="message__hosts-label">
                        {t(templateContent.message.hostsLabel, language)}
                      </p>
                      <FitLine className="message__hosts">
                        {t(invitation.weddingDetails.hosts, language)}
                      </FitLine>
                    </div>
                  </div>

                  <div
                    className="zb-el zb-el_flow t-animate calendar"
                    data-el="1747918802796"
                    data-kind="text"
                  >
                    <div className="zb-atom">
                      <div className="calendar__row calendar__row_week" aria-hidden="true">
                        {translations.calendar.weekdaysShort[language].map((day) => (
                          <span key={day}>{day}</span>
                        ))}
                      </div>
                      {markedColumn >= 0 ? (
                        <svg
                          className="calendar__heart"
                          style={{ "--marked": markedColumn } as CSSProperties}
                          viewBox="131 33 63 55"
                          role="presentation"
                          focusable="false"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d={HEART} />
                        </svg>
                      ) : null}
                      <div className="calendar__row calendar__row_days">
                        {week.map((day, index) => (
                          <span
                            key={day ?? `empty-${index}`}
                            className={day === weddingDay ? "calendar__day_marked" : undefined}
                            aria-current={day === weddingDay ? "date" : undefined}
                          >
                            {day ?? ""}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div
                    className="zb-el zb-el_flow zb-el_fit zb-el_script t-animate"
                    data-el="1782896076657000001"
                    data-kind="text"
                  >
                    <div className="zb-atom">
                      <FitLine>{monthLine}</FitLine>
                    </div>
                  </div>

                  <div
                    className="zb-el zb-el_flow t-animate"
                    data-el="1749814439762"
                    data-kind="image"
                  >
                    <div className="zb-atom">
                      <img
                        className="zb-atom__img"
                        src="/assets/3835-353-OBJECTS.svg"
                        width={398}
                        height={147}
                        alt=""
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="zb-group zb-el_flow zb-group_flow" data-el="1782281648248000002">
                <div className="zb-mol" data-mol="1782281648248000002">
                  <div
                    className="zb-el zb-el_flow t-animate"
                    data-el="1749814501407"
                    data-kind="text"
                  >
                    <div className="zb-atom">{t(templateContent.venue.eyebrow, language)}</div>
                  </div>
                  <div
                    className="zb-el zb-el_flow t-animate"
                    data-el="1749814501397"
                    data-kind="text"
                  >
                    <div className="zb-atom">{t(invitation.venue.name, language)}</div>
                  </div>
                  <div
                    className="zb-el zb-el_flow t-animate"
                    data-el="1749814501368"
                    data-kind="text"
                  >
                    <div className="zb-atom">{t(invitation.venue.address, language)}</div>
                  </div>
                  <div
                    className="zb-el zb-el_flow t-animate"
                    data-el="1749814501411"
                    data-kind="button"
                  >
                    <a
                      className="zb-atom"
                      href={invitation.venue.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="zb-atom__button-content">
                        <span className="zb-atom__button-text">
                          {t(translations.venue.openMap, language)}
                        </span>
                      </div>
                      <span className="zb-atom__button-border" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
