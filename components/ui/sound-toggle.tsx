"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "sound-muted";
const TARGET_VOLUME = 0.35;
const FADE_MS = 900;

function readMuted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function writeMuted(muted: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, muted ? "1" : "0");
  } catch {
    /* storage blocked: the choice just won't persist */
  }
}

/**
 * Looping background track with a floating mute button in the bottom-left
 * corner. Browsers block autoplay with sound, so if the first play() is
 * refused the track starts on the visitor's first click or key press, unless
 * they muted it on an earlier visit. The button stays hidden unless the audio
 * file exists, so a missing file never shows a dead control.
 */
export function SoundToggle({
  src,
  labelOn,
  labelOff,
}: {
  src: string;
  /** Accessible label while the music is playing ("Turn sound off"). */
  labelOn: string;
  /** Accessible label while the music is stopped ("Turn sound on"). */
  labelOff: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const [available, setAvailable] = useState(false);
  const [playing, setPlaying] = useState(false);

  function fadeTo(target: number, then?: () => void) {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current);
    const from = audio.volume;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / FADE_MS);
      audio.volume = from + (target - from) * t;
      if (t < 1) fadeRef.current = requestAnimationFrame(step);
      else {
        fadeRef.current = null;
        then?.();
      }
    };
    fadeRef.current = requestAnimationFrame(step);
  }

  function start() {
    const audio = audioRef.current;
    if (!audio) return Promise.resolve(false);
    return audio.play().then(
      () => {
        fadeTo(TARGET_VOLUME);
        return true;
      },
      () => false,
    );
  }

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    audioRef.current = audio;

    // Show the button only once the file is known to exist. Media events are
    // unreliable here: browsers defer loading audio in background tabs.
    let alive = true;
    fetch(src, { method: "HEAD" })
      .then((r) => alive && setAvailable(r.ok))
      .catch(() => alive && setAvailable(false));
    const onError = () => setAvailable(false);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener("error", onError);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    const unlockEvents = ["pointerdown", "keydown"] as const;
    const unlock = (e: Event) => {
      // A click on the toggle itself is handled by the toggle.
      if ((e.target as Element | null)?.closest?.("[data-sound-toggle]")) return;
      removeUnlock();
      if (!readMuted()) start();
    };
    const removeUnlock = () =>
      unlockEvents.forEach((t) => window.removeEventListener(t, unlock));

    if (!readMuted()) {
      start().then((ok) => {
        if (!ok) unlockEvents.forEach((t) => window.addEventListener(t, unlock));
      });
    }

    return () => {
      alive = false;
      removeUnlock();
      if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current);
      audio.pause();
      audio.removeEventListener("error", onError);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.src = "";
      audioRef.current = null;
    };
  }, [src]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      writeMuted(true);
      fadeTo(0, () => audio.pause());
    } else {
      writeMuted(false);
      start();
    }
  }

  return (
    <button
      type="button"
      data-sound-toggle
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? labelOn : labelOff}
      title={playing ? labelOn : labelOff}
      className={cn(
        "fixed bottom-5 left-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
        available ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <span className="flex h-4 items-center gap-[3px]" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={cn(
              "sound-bar w-[2px] rounded-full bg-white transition-[height,opacity] duration-300",
              playing ? "h-full opacity-90" : "h-[3px] opacity-50",
            )}
            style={
              playing
                ? { animationDelay: `${[-0.2, -0.6, -0.1, -0.8, -0.4][i]}s` }
                : { animation: "none" }
            }
          />
        ))}
      </span>
    </button>
  );
}
