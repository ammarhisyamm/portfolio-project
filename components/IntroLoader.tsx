"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { INTRO_EXPLORATIONS } from "@/lib/intro-explorations";
import { INTRO_KEY, shouldPlayIntro } from "@/lib/intro";

const DURATION = 1500;
const LINES = ["Gathering the explorations", "A few ideas, in motion", "Opening the studio"];

/**
 * A short first-load moment: website and mobile explorations drop onto a stack while a counter
 * runs to 100, then the stack lifts away and the page slides in from underneath. Any click
 * or key skips it. The head script in the layout hides it before paint when it should not
 * run (seen this session, another page, reduced motion, or a museum visit), and CSS hides it
 * on its own after a few seconds if scripts never run.
 */
export default function IntroLoader() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<"run" | "leave" | "done">("run");
  const [count, setCount] = useState(0);
  // Covers mount only once the intro is really playing, so other visits never fetch them.
  const [active, setActive] = useState(false);
  const completed = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    if (completed.current || !shouldPlayIntro()) {
      root.removeAttribute("data-intro");
      setPhase("done");
      return;
    }
    let leaving = false;
    setCount(0);
    setPhase("run");
    setActive(true);
    root.setAttribute("data-intro", "play");
    let frame = 0;
    let timer = 0;
    const start = performance.now();
    const leave = () => {
      if (leaving) return;
      leaving = true;
      completed.current = true;
      window.clearTimeout(timer);
      root.setAttribute("data-intro", "leaving");
      cancelAnimationFrame(frame);
      setCount(100);
      setPhase("leave");
      try { sessionStorage.setItem(INTRO_KEY, "1"); } catch {}
      timer = window.setTimeout(() => {
        setPhase("done");
        root.removeAttribute("data-intro");
        window.dispatchEvent(new Event("portfolio:intro-complete"));
      }, 900);
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
      root.removeAttribute("data-intro");
      setActive(false);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, [pathname]);

  if (phase === "done") return null;
  const line = LINES[Math.min(LINES.length - 1, Math.floor(count / 34))];

  return (
    <div className={`intro${phase === "leave" ? " is-leaving" : ""}`} aria-hidden="true">
      <div className="intro-deck">
        {active && INTRO_EXPLORATIONS.map((cover, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={cover.src} src={cover.src} alt="" className="intro-card" style={{ "--i": i } as CSSProperties} decoding="async" />
        ))}
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
