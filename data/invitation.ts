/**
 * Customer data. Every value here is a plain string literal — nothing
 * computed, nothing imported into a value, no template strings, no spreads —
 * so the whole invitation can be re-targeted by editing this one object.
 *
 * Design copy, section headings and decorative wording belong in
 * `data/template-content.ts`, never here.
 */
import type { InvitationData } from "@/types/invitation";

export const invitation = {
  slug: "kutman-aiturgan",
  type: "wedding",
  defaultLanguage: "ky",
  people: {
    bride: {
      name: {
        ru: "Айтурган",
        ky: "Айтурган",
      },
    },
    groom: {
      name: {
        ru: "Кутман",
        ky: "Кутман",
      },
    },
  },
  // The date drives the whole invitation: the calendar on the letter opens on
  // this month with this day ringed, the line under it names the month, the
  // hero prints the day, month and year down the card, and the countdown runs
  // to this instant.
  event: {
    date: "2026-10-03",
    startTime: "17:00",
  },
  venue: {
    name: {
      ru: "Ресторан «Айкокул»",
      ky: "«Айкокул» рестораны",
    },
    address: {
      ru: "Ошская область, город Гульча",
      ky: "Ош облусу, Гүлчө шаары",
    },
    mapUrl: "https://2gis.kg/bishkek/firm/70000001113175304",
  },
  weddingDetails: {
    // The placeholders mark where the names belong. This design lifts them out
    // of the sentence and sets them large in copperplate, one name to a line,
    // with the rest of the message running above and below.
    customMessage: {
      ru: "Наши дети {{groom}} и {{bride}} создают семью. От всего сердца приглашаем вас на торжественный вечер, посвящённый этому радостному дню, и будем рады видеть вас нашим дорогим гостем!",
      ky: "Балдарыбыз {{groom}} жана {{bride}} баш кошкон кубанычтуу күнгө арналган салтанаттуу кечебизге келип, кадырлуу коногубуз болууга сиздерди чын жүрөктөн чакырабыз!",
    },
    // Printed under the message behind a "Той ээлери," label the design
    // supplies, and again on the closing card under "С любовью," — so the
    // value itself names only who is hosting.
    hosts: {
      ru: "Урмат & Гулсара",
      ky: "Урмат & Гулсара",
    },
  },
  timeline: {
    // Time and title only. The ribbon this design draws the programme along
    // has five drawn stops; fewer items simply leave the later ones empty, and
    // a sixth has nowhere on the ribbon to stand and is not rendered.
    items: [
      {
        time: "16:00",
        title: {
          ru: "Сбор гостей",
          ky: "Конокторду тосуу",
        },
      },
      {
        time: "17:00",
        title: {
          ru: "Начало торжества",
          ky: "Тойдун башталышы",
        },
      },
      {
        time: "19:30",
        title: {
          ru: "Праздничная программа",
          ky: "Майрамдык программа",
        },
      },
      {
        time: "21:30",
        title: {
          ru: "Праздничный торт",
          ky: "Той тортун кесүү",
        },
      },
      {
        time: "22:30",
        title: {
          ru: "Завершение вечера",
          ky: "Кеченин аякташы",
        },
      },
    ],
  },
  assets: {
    music: "/audio/jax-wedding.m4a",
  },
  metadata: {
    /** A generic occasion label with no names in it. */
    titleSuffix: {
      ru: "приглашение на свадьбу",
      ky: "үйлөнүү тоюна чакыруу",
    },
    /** The browser tab title. */
    title: {
      ru: "Кутман & Айтурган — приглашение на свадьбу",
      ky: "Кутман & Айтурган — үйлөнүү тоюна чакыруу",
    },
    description: {
      ru: "3 октября 2026 года в 17:00, ресторан «Айкокул», город Гульча. Сердечно приглашаем вас на нашу свадьбу!",
      ky: "2026-жылдын 3-октябры, саат 17:00, Гүлчө шаары, «Айкокул» рестораны. Тойго чын жүрөктөн чакырабыз!",
    },
    /** What WhatsApp, Telegram and other messengers show on a shared link. */
    openGraphTitle: {
      ru: "Кутман & Айтурган — приглашение на свадьбу",
      ky: "Кутман & Айтурган — үйлөнүү тоюна чакыруу",
    },
    openGraphDescription: {
      ru: "03.10.2026 · 17:00 · Ошская область, город Гульча, ресторан «Айкокул»",
      ky: "03.10.2026 · саат 17:00 · Ош облусу, Гүлчө шаары, «Айкокул» рестораны",
    },
    /** 1200×630 JPEG in `public`, kept small enough for WhatsApp to show it. */
    openGraphImage: "/assets/share-kutman-aiturgan.jpg",
    openGraphImageAlt: {
      ru: "Кутман & Айтурган, 03.10.2026",
      ky: "Кутман & Айтурган, 03.10.2026",
    },
  },
} satisfies InvitationData;
