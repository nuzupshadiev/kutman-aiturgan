import { invitation } from "@/data/invitation";
import { templateContent } from "@/data/template-content";
import { t, type Language } from "@/data/translations";
import { eventTimestamp } from "@/lib/date";
import Countdown from "@/components/Countdown";
import FitLine from "@/components/FitLine";

import "@/app/styles/sections/countdown.css";

/** The wedding instant, anchored to the venue's own timezone. */
const WEDDING_AT = eventTimestamp(invitation.event.date, invitation.event.startTime);

export default function CountdownSection({ language }: { language: Language }) {
  return (
    <div
      id="r1101164321"
      className="section"
      style={{
        paddingTop: "30px",
        paddingBottom: "15px",
        backgroundColor: "#fffdf6",
      }}
    >
      <div className="zb">
        <div className="zb-board">
          <div className="zb-bg" />
          <div className="zb-filter" />

          <div className="zb-group zb-group_flow" data-el="1782282158842000001">
            <div className="zb-mol" data-mol="1782282158842000001">
              <div
                className="zb-el zb-el_flow zb-el_fit zb-el_script"
                data-el="1782896298414000001"
                data-kind="text"
              >
                <div className="zb-atom">
                  <FitLine>{t(templateContent.countdown.headingFirst, language)}</FitLine>
                </div>
              </div>
              <div
                className="zb-el zb-el_flow zb-el_fit zb-el_script"
                data-el="1782896351373000002"
                data-kind="text"
              >
                <div className="zb-atom">
                  <FitLine>{t(templateContent.countdown.headingSecond, language)}</FitLine>
                </div>
              </div>
              <div className="zb-el zb-el_flow t-animate" data-el="1749838197979" data-kind="html">
                <div className="zb-atom zb-atom__html">
                  <Countdown target={WEDDING_AT} language={language} />
                </div>
              </div>
              <div className="zb-el zb-el_flow t-animate" data-el="1749838991888" data-kind="image">
                <div className="zb-atom">
                  <img
                    className="zb-atom__img"
                    src="/assets/3132-313-Group.svg"
                    width={247}
                    height={190}
                    alt=""
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
