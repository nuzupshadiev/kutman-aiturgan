import type { Metadata, Viewport } from "next";
import { Comfortaa, Marmelad } from "next/font/google";
import localFont from "next/font/local";

import { invitation } from "@/data/invitation";
import { isLanguage, t, type Language } from "@/data/translations";
import ZoomController, { ZOOM_BOOTSTRAP_SCRIPT } from "@/components/ZoomController";
import RevealController from "@/components/RevealController";

import "./globals.css";

/* The countdown widget's own two faces. */
const marmelad = Marmelad({
  weight: "400",
  subsets: ["latin", "cyrillic"],
  variable: "--font-marmelad",
  display: "swap",
});

const comfortaa = Comfortaa({
  subsets: ["latin", "cyrillic"],
  variable: "--font-comfortaa",
  display: "swap",
});

/*
 * Every face the invitation uses is served from this repository — no webfont
 * service is contacted — and all of them are subset to Latin and the full
 * Cyrillic block, so a guest on a phone downloads a fraction of the originals
 * and still gets any name an operator types, Ң, Ө and Ү included.
 */

/*
 * The design's own family. Its artboards choose a face by weight, so the two
 * that are actually set live under one family name: 100 is the inscriptional
 * roman of the envelope's capitals, 400 the serif every running line is in.
 */
const primer = localFont({
  src: [
    { path: "./fonts/playfair-display.woff2", weight: "100", style: "normal" },
    { path: "./fonts/forum.woff2", weight: "400", style: "normal" },
  ],
  variable: "--font-primer",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
  // The two faces have different metrics, so a fallback adjusted to either one
  // would shift the other; the design's boxes are sized for the real faces.
  adjustFontFallback: false,
});

/*
 * The copperplate every lettered line is set in: the couple's names, the date,
 * each section heading and the programme's stops. It carries Ң, Ө and Ү, which
 * the face the artboard reached for does not.
 */
const script = localFont({
  src: "./fonts/bickham-script-pro.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-script",
  display: "swap",
  fallback: ["Brush Script MT", "cursive"],
  adjustFontFallback: false,
});

const language: Language = isLanguage(invitation.defaultLanguage)
  ? invitation.defaultLanguage
  : "ru";

const OPEN_GRAPH_LOCALES = { ru: "ru_RU", ky: "ky_KG" } as const;

/**
 * The public origin every URL in the share preview is made absolute against —
 * WhatsApp and Telegram ignore an `og:image` that is not. Vercel provides the
 * production domain on its own; NEXT_PUBLIC_SITE_URL overrides it when the
 * invitation is served from a custom domain.
 */
function resolveSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return new URL(explicit);
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) return new URL(`https://${production}`);
  const preview = process.env.VERCEL_URL?.trim();
  if (preview) return new URL(`https://${preview}`);
  return new URL("http://localhost:3000");
}

const title = t(invitation.metadata.title, language);
const description = t(invitation.metadata.description, language);
const shareTitle = t(invitation.metadata.openGraphTitle, language);
const shareDescription = t(invitation.metadata.openGraphDescription, language);
const shareImage = {
  url: invitation.metadata.openGraphImage,
  width: 1200,
  height: 630,
  type: "image/jpeg",
  alt: t(invitation.metadata.openGraphImageAlt, language),
};

export const metadata: Metadata = {
  metadataBase: resolveSiteUrl(),
  title,
  description,
  applicationName: t(invitation.metadata.titleSuffix, language),
  robots: { index: false, follow: false },
  icons: { icon: "/assets/3732-346-Group_203.png" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: `${t(invitation.people.groom.name, language)} & ${t(invitation.people.bride.name, language)}`,
    title: shareTitle,
    description: shareDescription,
    locale: OPEN_GRAPH_LOCALES[language],
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: shareTitle,
    description: shareDescription,
    images: [shareImage],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// Typed explicitly rather than with the generated `LayoutProps`, so `tsc` also
// passes on a clean checkout, before the first build writes `.next/types`.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang={language}
      className={`${primer.variable} ${script.variable} ${marmelad.variable} ${comfortaa.variable}`}
      // `--zoom` is written onto this element before first paint, so the markup
      // the server sent never matches what hydration finds here.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: ZOOM_BOOTSTRAP_SCRIPT }} />
      </head>
      <body>
        {children}
        <ZoomController />
        <RevealController />
      </body>
    </html>
  );
}
