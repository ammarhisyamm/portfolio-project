"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { createPortal, preload } from "react-dom";

const SEEN_KEY = "hisyam.home-entrance.seen.v3";
type Phase = "idle" | "cutting" | "released" | "opening" | "open" | "entering" | "fading";
const NOTES = [
  { label: "A note from the studio", title: "Considered, not complicated.", text: "A collection of digital work, explorations, and the thinking behind them." },
  { label: "Behind these doors", title: "Take a closer look.", text: "Explore selected projects, or visit the Playground for interface studies in the gallery." },
];

// Separate arms share a pivot: the blades actually close across the ribbon.
function CuttingScissors() {
  return <svg viewBox="0 0 150 110" fill="none" aria-hidden="true">
    <defs><linearGradient id="entrance-steel" x1="35" y1="25" x2="120" y2="75" gradientUnits="userSpaceOnUse"><stop stopColor="#fff4df" /><stop offset=".45" stopColor="#b4b5b3" /><stop offset=".65" stopColor="#fff" /><stop offset="1" stopColor="#777b7b" /></linearGradient></defs>
    <g className="entrance-scissor-arm entrance-scissor-upper"><path d="M67 55 140 49 133 57 70 62Z" fill="url(#entrance-steel)" stroke="#e9dfce" strokeWidth=".6" /><path d="M69 57 44 55" stroke="#b99866" strokeWidth="8" /><ellipse cx="28" cy="55" rx="19" ry="12" stroke="#c4a575" strokeWidth="6" /></g>
    <g className="entrance-scissor-arm entrance-scissor-lower"><path d="M67 55 137 60 129 51 70 48Z" fill="url(#entrance-steel)" stroke="#e9dfce" strokeWidth=".6" /><path d="M69 55 44 55" stroke="#a88755" strokeWidth="8" /><ellipse cx="28" cy="55" rx="19" ry="12" stroke="#af8953" strokeWidth="6" /></g>
    <circle cx="69" cy="55" r="5" fill="#c9ab76" stroke="#f3d9ac" /><path d="m67 55 4-1" stroke="#6e563a" />
  </svg>;
}

type EntranceArtwork = { title: string; image: string };

export default function HomeEntrance({ artworks = [] }: { artworks?: EntranceArtwork[] }) {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [note, setNote] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<HTMLButtonElement>(null);
  const doorwayRef = useRef<HTMLButtonElement>(null);
  const scissorsRef = useRef<HTMLSpanElement>(null);
  const timers = useRef<number[]>([]);
  const busy = useRef(false);
  const revealed = useRef(false);
  const touchStart = useRef(0);
  const entryStarted = useRef(false);

  const revealHome = useCallback(() => {
    if (revealed.current) return;
    revealed.current = true;
    window.dispatchEvent(new Event("studio:entered"));
  }, []);

  const finish = useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    try { sessionStorage.setItem(SEEN_KEY, "1"); } catch { /* Storage may be blocked. */ }
    setVisible(false);
    revealHome();
  }, [revealHome]);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(SEEN_KEY) === "1"; } catch { /* Still allow entry. */ }
    const replay = new URLSearchParams(window.location.search).get("entrance") === "1";
    if (replay || !seen) {
      ["studio-room-v3", "studio-door-v3", "studio-ribbon-v3"].forEach(asset => preload(`/images/${asset}.webp`, { as: "image" }));
    }
    setVisible(replay || !seen);
    if (seen && !replay) document.documentElement.removeAttribute("data-studio-pending");
    return () => {
      timers.current.forEach(window.clearTimeout);
      document.documentElement.removeAttribute("data-studio-pending");
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    document.documentElement.removeAttribute("data-studio-pending");
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.documentElement.style.overflow;
    const siblings = Array.from(document.body.children).filter((el): el is HTMLElement => el instanceof HTMLElement && el !== dialogRef.current && !["SCRIPT", "STYLE"].includes(el.tagName));
    const previousInert = siblings.map(el => el.inert);
    siblings.forEach(el => { el.inert = true; });
    document.documentElement.style.overflow = "hidden";
    dialogRef.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); finish(); }
      if (event.key !== "Tab") return;
      const items = Array.from(dialogRef.current?.querySelectorAll<HTMLButtonElement>("button:not([disabled])") ?? []);
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = previousOverflow;
      siblings.forEach((el, i) => { el.inert = previousInert[i]; });
      previousFocus?.focus({ preventScroll: true });
    };
  }, [visible, finish]);

  useEffect(() => {
    if (phase === "open") doorwayRef.current?.focus({ preventScroll: true });
  }, [phase]);

  const cut = () => {
    if (busy.current) return;
    busy.current = true;
    setNote(null);
    scissorsRef.current?.style.removeProperty("transform");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("fading");
      timers.current.push(window.setTimeout(finish, 200));
      return;
    }
    setPhase("cutting");
    // The cut completes before ribbon release; the doors never move while sealed.
    const sequence: [number, Phase][] = [[1100, "released"], [1850, "opening"], [3150, "open"]];
    sequence.forEach(([delay, next]) => timers.current.push(window.setTimeout(() => setPhase(next), delay)));
  };

  const stepInside = () => {
    if (phase !== "open" || entryStarted.current) return;
    entryStarted.current = true;
    setPhase("entering");
    timers.current.push(window.setTimeout(() => { revealHome(); setPhase("fading"); }, 1200));
    timers.current.push(window.setTimeout(finish, 1800));
  };

  const followRibbon = (event: PointerEvent<HTMLButtonElement>) => {
    if (busy.current || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(rect.width * .15, Math.min(event.clientX - rect.left, rect.width * .86)) - rect.width * .62;
    scissorsRef.current!.style.transform = `translate(${x}px, ${Math.max(-18, Math.min(18, event.clientY - rect.top - rect.height / 2))}px)`;
  };

  if (!visible) return null;
  const released = !["idle", "cutting"].includes(phase);
  const opened = ["opening", "open", "entering", "fading"].includes(phase);
  return createPortal(<div ref={dialogRef} className="home-entrance" tabIndex={-1} data-phase={phase} data-released={released} data-open={opened} role="dialog" aria-modal="true" aria-labelledby="studio-welcome" data-lenis-prevent onWheel={event => { if (event.deltaY > 5) stepInside(); }} onTouchStart={event => { touchStart.current = event.touches[0]?.clientY ?? 0; }} onTouchEnd={event => { if (touchStart.current - (event.changedTouches[0]?.clientY ?? touchStart.current) > 35) stepInside(); }}>
    <div className="entrance-scene">
      <div className="home-entrance-room" aria-hidden="true" />
      <div className="home-entrance-vignette" aria-hidden="true" />
      <div className="home-entrance-copy"><p className="home-entrance-kicker">A quiet room for considered digital work</p><h1 id="studio-welcome">Welcome to the studio.</h1><p>A space for the work, the experiments,<br />and the thinking in between.</p></div>
      <div className="home-entrance-portal">
        <button ref={doorwayRef} type="button" className="entrance-inner-room" onClick={stepInside} disabled={phase !== "open"} aria-label="Step inside the studio" aria-hidden={phase !== "open"}>
          <span className="entrance-inner-light" aria-hidden="true" />
          <span>Hisyam Design</span>
          <span className="entrance-inner-caption">Selected work, on view.</span>
          {artworks.length > 0 && <span className="entrance-inner-gallery" aria-hidden="true">{artworks.map((artwork, i) => <span className="entrance-inner-artwork" key={artwork.title} style={{ transitionDelay: `${i * 80}ms` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={artwork.image} alt="" decoding="async" />
            <span>{artwork.title}</span>
          </span>)}</span>}
          <span className="entrance-inner-enter">Enter the portfolio ↗</span>
        </button>
        <div className="home-entrance-door home-entrance-door-left" aria-hidden="true" />
        <div className="home-entrance-door home-entrance-door-right" aria-hidden="true" />
        <div className="entrance-ribbon-piece entrance-ribbon-left" aria-hidden="true" />
        <div className="entrance-ribbon-piece entrance-ribbon-right" aria-hidden="true" />
        <button ref={ribbonRef} className="entrance-ribbon-target" type="button" onClick={cut} onPointerMove={followRibbon} onPointerLeave={() => { if (!busy.current) scissorsRef.current?.style.removeProperty("transform"); }} aria-label="Cut the ribbon and enter the studio" disabled={phase !== "idle"}>
          <span className="entrance-ribbon-focus" />
          <span ref={scissorsRef} className="entrance-scissors-position"><span className="entrance-scissors"><CuttingScissors /></span></span>
        </button>
        <div className="entrance-fibres" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ "--dx": `${(i % 2 ? 1 : -1) * (18 + i * 5)}px`, "--dy": `${-40 + i * 11}px`, "--turn": `${i * 37}deg` } as CSSProperties} />)}</div>
      </div>
      <div className="entrance-field-notes">{NOTES.map((item, i) => <div className="entrance-note" key={item.label}><button type="button" disabled={phase !== "idle"} aria-expanded={note === i} aria-controls={`studio-note-${i}`} onClick={() => setNote(note === i ? null : i)}><span aria-hidden="true">+</span>{item.label}</button>{note === i && <div id={`studio-note-${i}`} className="entrance-note-card"><strong>{item.title}</strong><p>{item.text}</p></div>}</div>)}</div>
    </div>
    <header className="home-entrance-header"><span>Hisyam Design</span><span>Welcome / 01</span></header>
    <div className="entrance-status" role="status" aria-live="polite">{phase === "idle" ? <><span className="entrance-status-line" />Hover over the ribbon. Click to cut.<span className="entrance-status-touch">Tap the ribbon to enter.</span></> : phase === "cutting" ? "A small opening ceremony…" : phase === "released" ? "The ribbon is cut." : phase === "opening" ? "The doors are opening…" : phase === "open" ? "Scroll to step inside — or click the doorway." : "Welcome in."}</div>
    <button type="button" className="home-entrance-skip" onClick={finish}>Skip intro <span aria-hidden="true">↗</span></button>
  </div>, document.body);
}
