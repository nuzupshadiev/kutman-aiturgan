"use client";

import { useSyncExternalStore } from "react";

/**
 * A one-second clock shared by every subscriber, stopped whenever nobody is
 * subscribed — the countdown unmounts its interval instead of waking a phone's
 * main thread once a second for a section scrolled far off screen.
 *
 * Exposed through `useSyncExternalStore` so the server renders a placeholder
 * and the browser takes over after hydration, with no state written during an
 * effect and no hydration mismatch.
 */
let current = Date.now();
let timer: number | undefined;
const listeners = new Set<() => void>();

function tick() {
  current = Date.now();
  for (const listener of listeners) listener();
}

function start() {
  if (timer !== undefined) return;
  timer = window.setInterval(tick, 1000);
}

function stop() {
  if (timer === undefined) return;
  window.clearInterval(timer);
  timer = undefined;
}

/**
 * A backgrounded tab gets no clock at all: waking once a second behind a locked
 * screen drains a battery for a countdown nobody is reading.
 */
function onVisibility() {
  if (document.visibilityState === "visible" && listeners.size > 0) {
    tick();
    start();
  } else {
    stop();
  }
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  if (listeners.size === 1) {
    document.addEventListener("visibilitychange", onVisibility);
    if (document.visibilityState === "visible") start();
  }
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0) {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    }
  };
}

const getSnapshot = () => current;
/** 0 means "not running yet": the countdown renders dashes until hydration. */
const getServerSnapshot = () => 0;

export function useNow(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
