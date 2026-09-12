"use client";

import { useRef } from "react";

import { templateContent } from "@/data/template-content";
import { t, type Language } from "@/data/translations";
import { invitationData } from "@/lib/invitation-data";
import { useScrollProgress } from "@/lib/useScrollProgress";
import FitLine from "@/components/FitLine";

import "@/app/styles/sections/timing.css";

type Stop = {
  groupId: string;
  iconId: string;
  titleId: string;
  timeId: string;
  icon: string;
  iconSize: [number, number];
};

/**
 * The five stops drawn along the ribbon, in the order it passes them. Each one
 * is a fixed place on the artboard, so the programme fills as many of them as
 * the invitation has items and a sixth item has nowhere to stand.
 */
const STOPS: Stop[] = [
  {
    groupId: "1782896620447000002",
    iconId: "1782896682476",
    titleId: "1782896536003",
    timeId: "1782896597946000001",
    icon: "/assets/6663-396-Group_1321315242.svg",
    iconSize: [142, 128],
  },
  {
    groupId: "1782896766256000003",
    iconId: "1782896766257000006",
    titleId: "1782896766257000005",
    timeId: "1782896766256000004",
    icon: "/assets/3537-343-Group_1321315243.svg",
    iconSize: [66, 111],
  },
  {
    groupId: "1782896879058000007",
    iconId: "1782896879059000010",
    titleId: "1782896879059000009",
    timeId: "1782896879058000008",
    icon: "/assets/3739-663-Group.svg",
    iconSize: [120, 97],
  },
  {
    groupId: "1782896939638000011",
    iconId: "1782896939638000014",
    titleId: "1782896939638000013",
    timeId: "1782896939638000012",
    icon: "/assets/6335-636-Group_1321315245.svg",
    iconSize: [89, 135],
  },
  {
    groupId: "1782896976248000015",
    iconId: "1782896976249000018",
    titleId: "1782896976248000017",
    timeId: "1782896976248000016",
    icon: "/assets/3065-366-Group_1321315248.svg",
    iconSize: [97, 137],
  },
];

/** Where the mask starts inside the section, in artboard px. */
const RIBBON_FROM = { 320: 0, 480: 52, 640: 44, 960: 44, default: 51 };
/** Scroll distance (artboard px) over which the ribbon finishes drawing. */
const RIBBON_DISTANCE = { 320: 1400, default: 1000 };
/** Head start before the ribbon begins drawing, in artboard px. */
const RIBBON_OFFSET = { 320: 300, default: 100 };

export default function Timing({ language }: { language: Language }) {
  const section = useRef<HTMLDivElement>(null);
  const items = invitationData.timeline?.items ?? [];
  const programme = STOPS.slice(0, items.length).map((stop, index) => ({
    ...stop,
    ...items[index],
  }));
  const progress = useScrollProgress(section, {
    from: RIBBON_FROM,
    distance: RIBBON_DISTANCE,
    offset: RIBBON_OFFSET,
  });

  return (
    <div id="r2410896781" className="section" ref={section}>
      <div className="zb">
        <div className="zb-board">
          <div className="zb-bg" />
          <div className="zb-filter" />

          {/* The golden ribbon, uncovered from top to bottom by the mask below. */}
          <div className="zb-el" data-el="1782284177986" data-kind="image">
            <div className="zb-atom">
              <img
                className="zb-atom__img"
                src="/assets/3632-306-Group.svg"
                width={321}
                height={2245}
                alt=""
                loading="lazy"
              />
            </div>
          </div>

          <div
            className="zb-el timing__mask"
            data-el="1749815009138"
            data-kind="shape"
            style={{ "--ribbon-progress": progress } as React.CSSProperties}
          >
            <div className="zb-atom" />
          </div>

          <div className="zb-el zb-el_script" data-el="1782896163068000001" data-kind="text">
            <div className="zb-atom">
              <FitLine>{t(templateContent.schedule.heading, language)}</FitLine>
            </div>
          </div>

          {programme.map((entry) => (
            <div key={entry.groupId} className="zb-group zb-group_flow" data-el={entry.groupId}>
              <div className="zb-mol" data-mol={entry.groupId}>
                <div className="zb-el zb-el_flow" data-el={entry.iconId} data-kind="image">
                  <div className="zb-atom">
                    <img
                      className="zb-atom__img"
                      src={entry.icon}
                      width={entry.iconSize[0]}
                      height={entry.iconSize[1]}
                      alt=""
                      loading="lazy"
                    />
                  </div>
                </div>
                <div
                  className="zb-el zb-el_flow zb-el_script"
                  data-el={entry.titleId}
                  data-kind="text"
                >
                  <div className="zb-atom">
                    <FitLine>{t(entry.title, language)}</FitLine>
                  </div>
                </div>
                <div className="zb-el zb-el_flow t-animate" data-el={entry.timeId} data-kind="text">
                  <div className="zb-atom">{entry.time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
