import { invitation } from "@/data/invitation";
import { templateContent } from "@/data/template-content";
import { t, type Language } from "@/data/translations";
import FitLine from "@/components/FitLine";

import "@/app/styles/sections/farewell.css";

/** Closing card, signed by whoever is hosting. */
export default function Farewell({ language }: { language: Language }) {
  return (
    <div
      id="r1101289341"
      className="section"
      style={{ paddingBottom: "45px", backgroundColor: "#fffdf6" }}
    >
      <div className="zb">
        <div className="zb-board">
          <div className="zb-bg" />
          <div className="zb-filter" />

          <div className="zb-el" data-el="1749838012929" data-kind="image">
            <div className="zb-atom">
              <img
                className="zb-atom__img"
                src="/assets/3930-353-ChatGPT_Image_24__20.webp"
                width={1585}
                height={787}
                alt=""
                loading="lazy"
              />
            </div>
          </div>

          <div
            className="zb-el zb-el_fit zb-el_script"
            data-el="1782896419412000001"
            data-kind="text"
          >
            <div className="zb-atom">
              <FitLine>{t(templateContent.footer.closingLabel, language)}</FitLine>
              <FitLine>{t(invitation.weddingDetails.hosts, language)}</FitLine>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
