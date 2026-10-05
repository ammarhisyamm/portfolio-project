"use client";

import { Scissors } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const SEEN_KEY = "hisyam.home-entrance.seen";

type EntrancePhase = "idle" | "cutting" | "open";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function HomeEntrance() {
  const [hydrated, setHydrated] = useState(false);
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<EntrancePhase>("idle");
  const cutButtonRef = useRef<HTMLButtonElement>(null);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    const hasSeen = window.sessionStorage.getItem(SEEN_KEY) === "1";
    setVisible(!hasSeen);
    setHydrated(true);

    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  useEffect(() => {
    if (visible && phase === "idle") {
      cutButtonRef.current?.focus({ preventScroll: true });
    }
  }, [visible, phase]);

  useEffect(() => {
    if (!visible) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        skipEntrance();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visible]);

  const finishEntrance = () => {
    window.sessionStorage.setItem(SEEN_KEY, "1");
    setVisible(false);
  };

  const skipEntrance = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    finishEntrance();
  };

  const cutRibbon = () => {
    if (phase !== "idle") return;

    if (prefersReducedMotion()) {
      setPhase("open");
      finishEntrance();
      return;
    }

    setPhase("cutting");
    const openTimer = window.setTimeout(() => setPhase("open"), 340);
    const finishTimer = window.setTimeout(finishEntrance, 820);
    timersRef.current.push(openTimer, finishTimer);
  };

  if (!hydrated || !visible) return null;

  return createPortal(
    (
    <div
      className="home-entrance"
      data-phase={phase}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Hisyam Design"
    >
      <div className="home-entrance-room" aria-hidden="true" />
      <div className="home-entrance-vignette" aria-hidden="true" />

      <div className="home-entrance-header">
        <span className="home-entrance-eyebrow">Hisyam Design</span>
        <span className="home-entrance-index">01 / 01</span>
      </div>

      <div className="home-entrance-copy">
        <p className="home-entrance-kicker">A quiet room for considered digital work</p>
        <h1>Welcome to the studio.</h1>
        <p className="home-entrance-instruction">
          {phase === "idle" ? "Cut the ribbon to enter" : phase === "cutting" ? "Opening the gallery…" : "Welcome in"}
        </p>
      </div>

      <div className="home-entrance-portal" aria-hidden="true">
        <div className="home-entrance-glow" />
        <div className="home-entrance-doorway">
          <div className="home-entrance-door home-entrance-door-left">
            <span className="home-entrance-panel-line" />
            <span className="home-entrance-door-handle" />
          </div>
          <div className="home-entrance-door home-entrance-door-right">
            <span className="home-entrance-panel-line" />
            <span className="home-entrance-door-handle" />
          </div>
        </div>
        <div className="home-entrance-ribbon home-entrance-ribbon-left" />
        <div className="home-entrance-ribbon home-entrance-ribbon-right" />
        <div className="home-entrance-ribbon-knot" />
        <span className="home-entrance-scissor-swipe" aria-hidden="true">
          <Scissors size={42} strokeWidth={1.35} />
        </span>
        <div className="home-entrance-cut-spray" />
      </div>

      <button
        ref={cutButtonRef}
        type="button"
        className="home-entrance-cut"
        onClick={cutRibbon}
        disabled={phase !== "idle"}
        aria-label="Cut the ribbon and enter the studio"
      >
        <span className="home-entrance-cut-icon" aria-hidden="true">
          <Scissors size={18} strokeWidth={1.8} />
        </span>
        <span>{phase === "idle" ? "Cut ribbon" : "Entering"}</span>
      </button>

      <button type="button" className="home-entrance-skip" onClick={skipEntrance}>
        Skip intro <span aria-hidden="true">↗</span>
      </button>
    </div>
    ),
    document.body,
  );
}
