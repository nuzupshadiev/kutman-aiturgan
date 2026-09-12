/**
 * Copy and decoration that belong to the Blue letter design itself — the
 * lettering on the envelope, section headings, eyebrows and alt text. Nothing
 * here is customer data: the Invitation Admin never rewrites this file, so a
 * name, a date or a venue must never be written into it.
 */

export const templateContent = {
  envelope: {
    /** The two lines of inscriptional capitals pressed into the flap. */
    invitedFirst: { ru: "Вы", ky: "Сиз" },
    invitedSecond: { ru: "приглашены", ky: "чакырылдыңыз" },
    /** Stamped into the wax seal a guest presses to open the letter. */
    seal: { ru: "Нажмите", ky: "Басыңыз" },
  },
  hero: {
    announcement: { ru: "Мы женимся!", ky: "Биз үйлөнүп жатабыз!" },
    and: { ru: "&", ky: "&" },
  },
  message: {
    heading: { ru: "Дорогие гости!", ky: "Урматтуу коноктор!" },
    /**
     * The calligraphic line under the calendar. `{{month}}` is filled with the
     * name of the month the wedding falls in, so the line follows the date
     * instead of naming a month of its own.
     */
    monthLine: { ru: "Наш {{month}}", ky: "{{month}} айыбыз" },
    /** The line introducing the families, printed above `hosts`. */
    hostsLabel: { ru: "Хозяева торжества,", ky: "Той ээлери," },
  },
  countdown: {
    /** Two lines, set in two different faces, as the design draws them. */
    headingFirst: { ru: "Мы скажем", ky: "Тойго чейин" },
    headingSecond: { ru: "«да» через...", ky: "калган убакыт" },
  },
  venue: {
    eyebrow: { ru: "Место торжества", ky: "Той өтүүчү жер" },
  },
  schedule: {
    heading: { ru: "Программа торжества", ky: "Той программасы" },
  },
  rsvp: {
    heading: { ru: "Подтвердите присутствие", ky: "Катышууңузду ырастаңыз" },
    intro: {
      ru: "Пожалуйста, подтвердите своё присутствие, чтобы мы могли спланировать нашу свадьбу наилучшим образом.",
      ky: "Тоюбузду жакшы уюштурушубуз үчүн, катыша аларыңызды алдын ала билдирип коюңуз.",
    },
    namePlaceholder: { ru: "Ваше имя", ky: "Атыңыз" },
  },
  footer: {
    /** Printed above `weddingDetails.hosts`, which signs the letter. */
    closingLabel: { ru: "С любовью,", ky: "Урматтоо менен," },
  },
} as const;
