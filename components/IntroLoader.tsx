"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cardCover } from "@/lib/case-study-visuals";
import { INTRO_KEY } from "@/lib/intro";

const DURATION = 1500;
const DECK = ["jeam", "quriz", "nomory", "offstories", "synqra"];
const LINES = ["Sorting the case studies", "Lining up the mockups", "Opening the studio"];

/**
 * A short first-load moment: the five case study covers drop onto a stack while a counter
 * runs to 100, then the stack lifts away and the page slides in from underneath. Any click
 * or key skips it. The head script in the layout hides it before paint when it should not
 * run (seen this session, another page, reduced motion, or a museum visit), and CSS hides it
 * on its own after a few seconds if scripts never run.
 */
export default function IntroLoader() {
  const [phase, setPhase] = useState<"run" | "leave" | "done">("run");
  const [count, setCount] = useState(0);
  // Covers mount only once the intro is really playing, so other visits never fetch them.
  const [active, setActive] = useState(false);
  const leaving = useRef(false);

  useEffect(() => {
    if (document.documentElement.getAttribute("data-intro") !== "play") {
      setPhase("done");
      return;
    }
    setActive(true);
    let frame = 0;
    let timer = 0;
    const start = performance.now();
    const leave = () => {
      if (leaving.current) return;
      leaving.current = true;
      cancelAnimationFrame(frame);
      setCount(100);
      setPhase("leave");
      try { sessionStorage.setItem(INTRO_KEY, "1"); } catch {}
      timer = window.setTimeout(() => {
        setPhase("done");
        document.documentElement.removeAttribute("data-intro");
      }, 750);
    };
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      // Ease out, so the last few percent take their time like a real load.
      setCount(Math.round(100 * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
      else timer = window.setTimeout(leave, 220);
    };
    frame = requestAnimationFrame(tick);
    const skip = () => leave();
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, []);

  if (phase === "done") return null;
  const line = LINES[Math.min(LINES.length - 1, Math.floor(count / 34))];

  return (
    <div className={`intro${phase === "leave" ? " is-leaving" : ""}`} aria-hidden="true">
      <div className="intro-deck">
        {active && DECK.map((slug, i) => {
          const cover = cardCover(slug);
          return cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={slug} src={cover.src} alt="" className="intro-card" style={{ "--i": i } as CSSProperties} decoding="async" />
          ) : null;
        })}
      </div>
      <div className="intro-meta">
        <span className="intro-name">Hisyam Fakhrudin</span>
        <span className="intro-line">{count >= 100 ? "Welcome in" : line}</span>
        <span className="intro-count">{String(count).padStart(3, "0")}</span>
      </div>
      <span className="intro-bar" style={{ transform: `scaleX(${count / 100})` }} />
      <span className="intro-skip">Tap or click to skip</span>
    </div>
  );
}
