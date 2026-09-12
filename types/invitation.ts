import type { Language, LocalizedText } from "@/data/translations";

export type InvitationType =
  | "wedding"
  | "kyz_uzatuu"
  | "tushoo_toi"
  | "sunnot_toi";

export interface TimelineItem {
  time: string;
  title: LocalizedText;
}

/**
 * The shape `data/invitation.ts` is checked against.
 *
 * Optional members are the ones an operator may leave out or switch off, so
 * every section that reads one hides itself rather than printing an empty
 * card.
 */
export interface InvitationData {
  slug: string;
  type: InvitationType;
  defaultLanguage: Language;
  people: {
    bride: { name: LocalizedText };
    /** A wedding is the only type that names two people. */
    groom: { name: LocalizedText };
  };
  event: { date: string; startTime: string };
  venue: {
    name: LocalizedText;
    address: LocalizedText;
    mapUrl: string;
  };
  weddingDetails: {
    customMessage: LocalizedText;
    hosts: LocalizedText;
  };
  timeline?: { items: TimelineItem[] };
  assets?: {
    music?: string;
  };
  metadata: {
    /** The occasion label, naming nobody; the admin reads it, never rewrites it. */
    titleSuffix: LocalizedText;
    /** Rewritten per customer: the tab title and the shared-link title. */
    title: LocalizedText;
    description: LocalizedText;
    openGraphTitle: LocalizedText;
    openGraphDescription: LocalizedText;
  };
  rsvp: { endpoint: string };
}
