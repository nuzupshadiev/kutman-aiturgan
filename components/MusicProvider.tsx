"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const VOLUME = 0.4;

type MusicContextValue = {
  playing: boolean;
  /** False when the invitation ships without a track. */
  available: boolean;
  play: () => void;
  pause: () => void;
};

const MusicContext = createContext<MusicContextValue | null>(null);

/**
 * Background score for the letter, shared by the seal and the hero toggle.
 *
 * `track` comes from the invitation data; with no track the provider still
 * works and the hero simply has no toggle to show.
 */
export function MusicProvider({ track, children }: { track?: string; children: ReactNode }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (audio.current) audio.current.volume = VOLUME;
  }, []);

  const play = useCallback(() => {
    if (!track) return;
    // The toggle flips immediately, even when autoplay is blocked, so the
    // control always reflects the user's intent.
    setPlaying(true);
    audio.current?.play().catch(() => {});
  }, [track]);

  const pause = useCallback(() => {
    audio.current?.pause();
    setPlaying(false);
  }, []);

  const value = useMemo(
    () => ({ playing, available: Boolean(track), play, pause }),
    [playing, track, play, pause],
  );

  return (
    <MusicContext.Provider value={value}>
      {track ? (
        <audio ref={audio} preload="none" onEnded={() => setPlaying(false)} src={track} />
      ) : null}
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used inside <MusicProvider>");
  return ctx;
}
