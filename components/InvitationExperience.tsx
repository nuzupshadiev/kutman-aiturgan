"use client";

import { useCallback, useEffect, useState } from "react";

import { invitation } from "@/data/invitation";
import { isLanguage, type Language } from "@/data/translations";
import { invitationData } from "@/lib/invitation-data";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import { MusicProvider } from "@/components/MusicProvider";
import NoiseOverlay from "@/components/NoiseOverlay";

import CountdownSection from "@/components/sections/CountdownSection";
import Envelope from "@/components/sections/Envelope";
import Farewell from "@/components/sections/Farewell";
import Hero from "@/components/sections/Hero";
import Invitation from "@/components/sections/Invitation";
import Rsvp from "@/components/sections/Rsvp";
import Timing from "@/components/sections/Timing";

const DEFAULT_LANGUAGE: Language = isLanguage(invitation.defaultLanguage)
  ? invitation.defaultLanguage
  : "ru";

/**
 * The whole invitation, and the two pieces of state it shares: the language
 * every section reads, and whether the guest has broken the seal — the tap
 * behind that is also the gesture browsers want before audio may play.
 */
export default function InvitationExperience() {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const open = useCallback(() => setOpened(true), []);

  return (
    <MusicProvider track={invitationData.assets?.music}>
      <Envelope language={language} opened={opened} onOpen={open} />

      {/*
        The switcher belongs to the letter, not to the envelope: it appears
        once the seal is broken, so nothing but the envelope is on screen
        until it is tapped.
      */}
      {opened ? <LanguageSwitcher language={language} onChange={setLanguage} /> : null}

      {/*
        The letter is behind the envelope, not gone: without this a guest on a
        keyboard would tab straight past the seal into a form they cannot see.
      */}
      <main inert={!opened}>
        <Hero language={language} />
        <Invitation language={language} />
        <Timing language={language} />
        <Rsvp language={language} />
        <CountdownSection language={language} />
        <Farewell language={language} />
      </main>

      <NoiseOverlay />
    </MusicProvider>
  );
}
