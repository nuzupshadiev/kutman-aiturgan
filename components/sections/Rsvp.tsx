"use client";

import { useId, useRef, useState, type FormEvent } from "react";

import { templateContent } from "@/data/template-content";
import { t, translations, type Language } from "@/data/translations";
import {
  createSubmissionId,
  MAX_GUESTS,
  MAX_NAME_LENGTH,
  RsvpConfigurationError,
  submitRsvp,
  type Attendance,
} from "@/lib/rsvp";

import "@/app/styles/sections/rsvp.css";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * What the form has to say, kept as a reference rather than as finished words.
 *
 * A guest can switch language while a message is on screen, so every message
 * is stored by name and translated at render.
 */
type OwnMessage = Extract<
  keyof typeof translations.rsvp,
  | "success"
  | "guestCountInvalid"
  | "networkError"
  | "serverError"
  | "configurationError"
  | "nameRequired"
  | "nameTooLong"
  | "attendanceRequired"
>;

type Feedback = { kind: "none" } | { kind: "own"; key: OwnMessage };

const NO_FEEDBACK: Feedback = { kind: "none" };

/**
 * Guest questionnaire.
 *
 * It posts to the site's own `/api/rsvp` route, which writes the answer to
 * Google Sheets. Nothing is ever reported as sent unless the server said so,
 * the answers stay in the fields after a failure, and one filled-in form keeps
 * a single submission id so a retry after a timeout is not counted as a second
 * guest.
 */
export default function Rsvp({ language }: { language: Language }) {
  const fieldId = useId();
  const nameId = `${fieldId}-name`;
  const countId = `${fieldId}-count`;
  const [guestName, setGuestName] = useState("");
  const [attendance, setAttendance] = useState<Attendance | "">("");
  const [guestCount, setGuestCount] = useState("1");
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState<Feedback>(NO_FEEDBACK);
  const [nameError, setNameError] = useState<OwnMessage | "">("");
  const [attendanceError, setAttendanceError] = useState<OwnMessage | "">("");
  const [countError, setCountError] = useState<OwnMessage | "">("");
  const submissionId = useRef<string>("");

  const attending = attendance === "yes";
  const busy = status === "submitting";

  /** What the field currently holds, as a number the buttons can move. */
  const count = Number.parseInt(guestCount, 10);
  const step = (by: number) => {
    // Counted from the value in the field, not from this render's copy of it,
    // so tapping the button quickly still moves one guest per tap.
    setGuestCount((current) => {
      const from = Number.parseInt(current, 10);
      const base = Number.isFinite(from) ? from : 1;
      return String(Math.min(MAX_GUESTS, Math.max(1, base + by)));
    });
    if (countError) setCountError("");
  };

  const say = (key: OwnMessage) => t(translations.rsvp[key], language);
  const message = feedback.kind === "own" ? say(feedback.key) : "";

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;

    const name = guestName.trim();
    if (!name) {
      setNameError("nameRequired");
      setStatus("idle");
      setFeedback(NO_FEEDBACK);
      return;
    }
    if (name.length > MAX_NAME_LENGTH) {
      setNameError("nameTooLong");
      return;
    }
    setNameError("");

    if (attendance !== "yes" && attendance !== "no") {
      setAttendanceError("attendanceRequired");
      return;
    }
    setAttendanceError("");

    const count = attendance === "no" ? 0 : Number(guestCount);
    if (attendance === "yes" && (!Number.isInteger(count) || count < 1 || count > MAX_GUESTS)) {
      setCountError("guestCountInvalid");
      setStatus("error");
      setFeedback({ kind: "own", key: "guestCountInvalid" });
      return;
    }
    setCountError("");

    if (!submissionId.current) submissionId.current = createSubmissionId();
    setStatus("submitting");
    setFeedback(NO_FEEDBACK);

    try {
      await submitRsvp({
        guestName: name,
        attendance,
        guestCount: count,
        language,
        submissionId: submissionId.current,
      });
      setStatus("success");
      setFeedback({ kind: "own", key: "success" });
    } catch (error) {
      setStatus("error");
      if (error instanceof RsvpConfigurationError) {
        setFeedback({ kind: "own", key: "configurationError" });
      } else if (error instanceof TypeError) {
        setFeedback({ kind: "own", key: "networkError" });
      } else {
        setFeedback({ kind: "own", key: "serverError" });
      }
    }
  };

  return (
    <div id="r1101164311" className="section">
      <div className="zb">
        <div className="zb-board">
          <div className="zb-bg" />
          <div className="zb-filter" />

          <div className="zb-group zb-group_flow" data-el="1782282373357000006">
            <div className="zb-mol" data-mol="1782282373357000006">
              <div
                className="zb-el zb-el_flow zb-el_script"
                data-el="1782896220088000001"
                data-kind="text"
              >
                <div className="zb-atom">{t(templateContent.rsvp.heading, language)}</div>
              </div>

              <div className="zb-el zb-el_flow t-animate" data-el="1748067547812" data-kind="text">
                <div className="zb-atom">{t(templateContent.rsvp.intro, language)}</div>
              </div>

              <div
                className="zb-el zb-el_flow t-animate"
                data-el="1782282356383000001"
                data-kind="form"
              >
                <div className="zb-atom zb-atom__form">
                  <form className="rsvp" onSubmit={submit} noValidate>
                    <div className="rsvp__group">
                      <div className="rsvp__title" id={`${fieldId}-attendance`}>
                        {t(translations.rsvp.attendance, language)}
                      </div>
                      <div
                        className="rsvp__choices rsvp__choices_radio"
                        role="radiogroup"
                        aria-labelledby={`${fieldId}-attendance`}
                      >
                        {(["yes", "no"] as const).map((option) => (
                          <label key={option} className="rsvp__choice">
                            <input
                              type="radio"
                              name="attendance"
                              value={option}
                              checked={attendance === option}
                              className="rsvp__control"
                              aria-describedby={
                                attendanceError ? `${fieldId}-attendance-error` : undefined
                              }
                              onChange={() => {
                                setAttendance(option);
                                if (attendanceError) setAttendanceError("");
                              }}
                            />
                            <span className="rsvp__indicator rsvp__indicator_radio" />
                            <span className="rsvp__choice-text">
                              {t(
                                option === "yes"
                                  ? translations.rsvp.attendanceYes
                                  : translations.rsvp.attendanceNo,
                                language,
                              )}
                            </span>
                          </label>
                        ))}
                      </div>
                      {attendanceError ? (
                        <p className="rsvp__error" id={`${fieldId}-attendance-error`}>
                          {say(attendanceError)}
                        </p>
                      ) : null}
                    </div>

                    <div className="rsvp__group">
                      <label className="rsvp__title" htmlFor={nameId}>
                        {t(translations.rsvp.guestName, language)}
                      </label>
                      <input
                        id={nameId}
                        name="guestName"
                        type="text"
                        className="rsvp__input"
                        value={guestName}
                        maxLength={MAX_NAME_LENGTH}
                        autoComplete="name"
                        placeholder={t(templateContent.rsvp.namePlaceholder, language)}
                        aria-invalid={nameError ? true : undefined}
                        aria-describedby={nameError ? `${nameId}-error` : undefined}
                        onChange={(event) => {
                          setGuestName(event.target.value);
                          if (nameError) setNameError("");
                        }}
                      />
                      {nameError ? (
                        <p className="rsvp__error" id={`${nameId}-error`}>
                          {say(nameError)}
                        </p>
                      ) : null}
                    </div>

                    {/* Asked only of the guests who are coming. */}
                    {attending ? (
                      <div className="rsvp__group">
                        <label className="rsvp__title" htmlFor={countId}>
                          {t(translations.rsvp.guestCount, language)}
                        </label>
                        <div className="rsvp__counter">
                          <button
                            type="button"
                            className="rsvp__step"
                            onClick={() => step(-1)}
                            disabled={count <= 1}
                            aria-label={t(translations.rsvp.guestCountLess, language)}
                          >
                            −
                          </button>
                          {/*
                            Still a real number field, so a guest can type a
                            larger party rather than press the button ten times,
                            and assistive technology reads it as one control.
                          */}
                          <input
                            id={countId}
                            name="guestCount"
                            type="number"
                            inputMode="numeric"
                            min={1}
                            max={MAX_GUESTS}
                            step={1}
                            className="rsvp__count"
                            value={guestCount}
                            aria-invalid={countError ? true : undefined}
                            aria-describedby={`${countId}-hint${countError ? ` ${countId}-error` : ""}`}
                            onChange={(event) => {
                              setGuestCount(event.target.value);
                              if (countError) setCountError("");
                            }}
                          />
                          <button
                            type="button"
                            className="rsvp__step"
                            onClick={() => step(1)}
                            disabled={count >= MAX_GUESTS}
                            aria-label={t(translations.rsvp.guestCountMore, language)}
                          >
                            +
                          </button>
                        </div>
                        <p className="rsvp__hint" id={`${countId}-hint`}>
                          {t(translations.rsvp.guestCountHint, language)}
                        </p>
                        {countError ? (
                          <p className="rsvp__error" id={`${countId}-error`}>
                            {say(countError)}
                          </p>
                        ) : null}
                      </div>
                    ) : null}

                    <button
                      type="submit"
                      className="rsvp__submit"
                      disabled={busy || status === "success"}
                    >
                      {t(busy ? translations.rsvp.submitting : translations.rsvp.submit, language)}
                    </button>

                    <p
                      className={`rsvp__status ${status === "error" ? "rsvp__status_error" : ""}`}
                      role="status"
                      aria-live="polite"
                      aria-label={t(translations.rsvp.statusRegion, language)}
                    >
                      {message}
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
