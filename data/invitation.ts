/**
 * Customer data. The Invitation Admin rewrites this object through the
 * TypeScript AST when it generates a real invitation, so every value here is a
 * plain string literal — nothing computed, nothing imported into a value, no
 * template strings, no spreads.
 *
 * Design copy, section headings and decorative wording belong in
 * `data/template-content.ts`, never here.
 */
import type { InvitationData } from "@/types/invitation";

export const invitation = {
  slug: "blue-letter-wedding",
  type: "wedding",
  defaultLanguage: "ky",
  // The sample names are chosen so that neither of them occurs inside an
  // ordinary word anywhere else on the page: verification scans the built
  // invitation for them, and a name that is also a common word would be found
  // in a sentence that has nothing to do with it.
  people: {
    bride: {
      name: {
        ru: "Айчүрөк",
        ky: "Айчүрөк",
      },
    },
    groom: {
      name: {
        ru: "Мырзабек",
        ky: "Мырзабек",
      },
    },
  },
  // The date drives the whole invitation: the calendar on the letter opens on
  // this month with this day ringed, the line under it names the month, the
  // hero prints the day, month and year down the card, and the countdown runs
  // to this instant.
  event: {
    date: "2027-09-18",
    startTime: "17:00",
  },
  venue: {
    name: {
      ru: "Банкетный зал «Гранд Холл»",
      ky: "«Гранд Холл» банкет залы",
    },
    address: {
      ru: "Бишкек, проспект Манаса, 40",
      ky: "Бишкек, Манас проспекти, 40",
    },
    mapUrl: "https://maps.google.com/?q=Bishkek",
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
      ru: "Мырзабек & Айчүрөк",
      ky: "Мырзабек & Айчүрөк",
    },
  },
  timeline: {
    // Time and title only: the admin substitutes exactly those two values when
    // an operator supplies their own schedule, so anything else written here
    // would survive into a row it no longer describes.
    //
    // The ribbon this design draws the programme along has five drawn stops.
    // Fewer items simply leave the later ones empty; a sixth has nowhere on
    // the ribbon to stand and is not rendered.
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
        time: "19:00",
        title: {
          ru: "Праздничная программа",
          ky: "Майрамдык программа",
        },
      },
      {
        time: "22:00",
        title: {
          ru: "Праздничный торт",
          ky: "Той тортун кесүү",
        },
      },
      {
        time: "23:00",
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
    // A generic occasion label with no names in it: the admin leaves it alone
    // and reads it to compose the title, so the page keeps this template's own
    // wording.
    titleSuffix: {
      ru: "приглашение на свадьбу",
      ky: "үйлөнүү тоюна чакыруу",
    },
    // Rewritten per customer, in the browser tab and in every shared link.
    title: {
      ru: "Мырзабек & Айчүрөк — приглашение на свадьбу",
      ky: "Мырзабек & Айчүрөк — үйлөнүү тоюна чакыруу",
    },
    description: {
      ru: "Свадебное приглашение: дата и время, программа вечера, адрес торжества и анкета гостя.",
      ky: "Үйлөнүү тоюна чакыруу: датасы жана убактысы, кечтин программасы, той өтүүчү жердин дареги жана конок анкетасы.",
    },
    openGraphTitle: {
      ru: "Мырзабек & Айчүрөк — приглашение на свадьбу",
      ky: "Мырзабек & Айчүрөк — үйлөнүү тоюна чакыруу",
    },
    openGraphDescription: {
      ru: "Свадебное приглашение: дата и время, программа вечера, адрес торжества и анкета гостя.",
      ky: "Үйлөнүү тоюна чакыруу: датасы жана убактысы, кечтин программасы, той өтүүчү жердин дареги жана конок анкетасы.",
    },
  },
  rsvp: {
    /** The Invitation Admin writes the absolute RSVP API URL here. */
    endpoint: "",
  },
} satisfies InvitationData;
