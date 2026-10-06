"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent, type PointerEvent } from "react";
import { createPortal, preload } from "react-dom";
import { animate, type AnimationPlaybackControls } from "motion";

const SEEN_KEY = "hisyam.home-entrance.seen.v3";
type Phase = "idle" | "cutting" | "released" | "opening" | "open" | "entering" | "fading";
const NOTES = [
  { label: "A note from the studio", title: "Considered, not complicated.", text: "A collection of digital work, explorations, and the thinking behind them." },
  { label: "Behind these doors", title: "Take a closer look.", text: "Explore selected projects, or visit the Playground for interface studies in the gallery." },
];

// Brushed-steel blades, champagne-brass handles, and a layered central rivet.
function CuttingScissors() {
  return <svg viewBox="0 0 180 120" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="entrance-steel" x1="68" y1="48" x2="166" y2="75" gradientUnits="userSpaceOnUse"><stop stopColor="#fff" /><stop offset=".17" stopColor="#c9c9c4" /><stop offset=".34" stopColor="#f8f4eb" /><stop offset=".58" stopColor="#8e918e" /><stop offset=".76" stopColor="#f5f2e9" /><stop offset="1" stopColor="#777a79" /></linearGradient>
      <linearGradient id="entrance-brass" x1="18" y1="29" x2="74" y2="60" gradientUnits="userSpaceOnUse"><stop stopColor="#f6e6c3" /><stop offset=".28" stopColor="#a88048" /><stop offset=".5" stopColor="#ead3a2" /><stop offset=".72" stopColor="#80603b" /><stop offset="1" stopColor="#d7b578" /></linearGradient>
      <radialGradient id="entrance-rivet" cx="0" cy="0" r="1" gradientTransform="matrix(0 8 -8 0 88 59)" gradientUnits="userSpaceOnUse"><stop stopColor="#fff3d4" /><stop offset=".42" stopColor="#bf9b64" /><stop offset=".72" stopColor="#715536" /><stop offset="1" stopColor="#ead2a4" /></radialGradient>
    </defs>
    <g className="entrance-scissor-arm entrance-scissor-upper">
      <path d="m84 60 80-15 4 4-75 20-9-9Z" fill="url(#entrance-steel)" stroke="#f7f0e4" strokeWidth=".8" />
      <path d="m95 61 60-12" stroke="#fff" strokeOpacity=".72" strokeWidth="1" />
      <path d="m88 59-31 6" stroke="url(#entrance-brass)" strokeWidth="10" />
      <ellipse cx="34" cy="70" rx="23" ry="15" stroke="#493522" strokeWidth="10" /><ellipse cx="34" cy="70" rx="23" ry="15" stroke="url(#entrance-brass)" strokeWidth="7" /><ellipse cx="34" cy="70" rx="17" ry="10" stroke="#f1d7a8" strokeOpacity=".5" strokeWidth="1" />
    </g>
    <g className="entrance-scissor-arm entrance-scissor-lower">
      <path d="m84 60 78 16 2-5-73-20-7 9Z" fill="url(#entrance-steel)" stroke="#f7f0e4" strokeWidth=".8" />
      <path d="m95 60 58 13" stroke="#fff" strokeOpacity=".68" strokeWidth="1" />
      <path d="m88 61-31-9" stroke="url(#entrance-brass)" strokeWidth="10" />
      <ellipse cx="34" cy="43" rx="23" ry="15" stroke="#493522" strokeWidth="10" /><ellipse cx="34" cy="43" rx="23" ry="15" stroke="url(#entrance-brass)" strokeWidth="7" /><ellipse cx="34" cy="43" rx="17" ry="10" stroke="#f1d7a8" strokeOpacity=".5" strokeWidth="1" />
    </g>
    <circle cx="88" cy="60" r="8" fill="#37291b" /><circle cx="88" cy="60" r="6.5" fill="url(#entrance-rivet)" stroke="#f4dfb8" strokeWidth=".8" /><path d="m85 60 6 0" stroke="#725631" strokeWidth="1" />
  </svg>;
}

export default function HomeEntrance() {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [note, setNote] = useState<number | null>(null);
  const [cutPosition, setCutPosition] = useState(68);
  const dialogRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<HTMLButtonElement>(null);
  const doorwayRef = useRef<HTMLButtonElement>(null);
  const scissorsRef = useRef<HTMLSpanElement>(null);
  const hoverPosition = useRef(68);
  const pendingCutPosition = useRef(68);
  const timers = useRef<number[]>([]);
  const busy = useRef(false);
  const revealed = useRef(false);
  const touchStart = useRef(0);
  const entryStarted = useRef(false);
  const pointerAnimation = useRef<AnimationPlaybackControls | null>(null);
  const cutCompleted = useRef(false);

  const revealHome = useCallback(() => {
    if (revealed.current) return;
    revealed.current = true;
    window.dispatchEvent(new Event("studio:entered"));
  }, []);

  const finish = useCallback(() => {
    pointerAnimation.current?.stop();
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    try { sessionStorage.setItem(SEEN_KEY, "1"); } catch { /* Storage may be blocked. */ }
    setVisible(false);
    revealHome();
  }, [revealHome]);

  useEffect(() => {
    let cancelled = false;
    let seen = false;
    try { seen = sessionStorage.getItem(SEEN_KEY) === "1"; } catch { /* Still allow entry. */ }
    const replay = new URLSearchParams(window.location.search).get("entrance") === "1";
    if (replay || !seen) {
      document.documentElement.setAttribute("data-studio-pending", "true");
      const assets = ["studio-room-v3", "studio-doors-v4", "studio-ribbon-v4"].map(asset => `/images/${asset}.webp`);
      assets.forEach(src => preload(src, { as: "image" }));
      // Reveal one complete scene, never a ribbon floating over unloaded doors.
      Promise.all(assets.map(src => new Promise<void>(resolve => {
        const image = new Image();
        image.onload = () => { image.decode().catch(() => {}).then(() => resolve()); };
        image.onerror = () => resolve(); // A failed asset must not trap the visitor.
        image.src = src;
      }))).then(() => { if (!cancelled) setVisible(true); });
    }
    if (seen && !replay) document.documentElement.removeAttribute("data-studio-pending");
    return () => {
      cancelled = true;
      pointerAnimation.current?.stop();
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
      if (items.length === 0) { event.preventDefault(); return; }
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

  const releaseRibbon = () => {
    if (cutCompleted.current || !busy.current) return;
    cutCompleted.current = true;
    setCutPosition(pendingCutPosition.current);
    setPhase("released");
    // The animation's actual completion releases the fabric, not a second clock.
    timers.current.push(window.setTimeout(() => setPhase("opening"), 850));
    timers.current.push(window.setTimeout(() => setPhase("open"), 2150));
  };

  const cut = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (busy.current) return;
    busy.current = true;
    setNote(null);
    pointerAnimation.current?.stop();
    const scissors = scissorsRef.current;
    const width = ribbonRef.current?.getBoundingClientRect().width ?? 1;
    const rect = ribbonRef.current?.getBoundingClientRect();
    let selectedPosition = hoverPosition.current;
    // Pointer clicks (including touch-generated clicks) can cut wherever they
    // land on the door; keyboard activation keeps the last/default position.
    if (event.detail > 0 && rect) {
      selectedPosition = Math.max(8, Math.min(92, (event.clientX - rect.left) / rect.width * 100));
      if (selectedPosition > 42 && selectedPosition < 58) selectedPosition = selectedPosition < 50 ? 42 : 58;
    }
    pendingCutPosition.current = selectedPosition;
    if (scissors) {
      // Freeze the pointer-follow spring and sweep to both ends before returning
      // for the final snip at the selected point.
      const startX = width * (selectedPosition - 68) / 100;
      scissors.style.transform = `translateX(${startX}px)`;
      const near = selectedPosition < 50 ? 92 : 8;
      const far = selectedPosition < 50 ? 8 : 92;
      scissors.style.setProperty("--sweep-from", `${startX}px`);
      scissors.style.setProperty("--sweep-near", `${width * (near - 68) / 100}px`);
      scissors.style.setProperty("--sweep-far", `${width * (far - 68) / 100}px`);
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("fading");
      timers.current.push(window.setTimeout(finish, 200));
      return;
    }
    setPhase("cutting");
    // Safety fallback for browsers that suppress animationend (e.g. background tabs).
    timers.current.push(window.setTimeout(releaseRibbon, 3700));
  };

  const stepInside = () => {
    if (phase !== "open" || entryStarted.current) return;
    entryStarted.current = true;
    setPhase("entering");
    timers.current.push(window.setTimeout(() => { revealHome(); setPhase("fading"); }, 1200));
    timers.current.push(window.setTimeout(finish, 1800));
  };

  const followRibbon = (event: PointerEvent<HTMLButtonElement>) => {
    if (busy.current || event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    // Hover can happen anywhere on the doors; scissors stay on the ribbon and
    // avoid the wax seal's center so the visual target still feels physical.
    let position = Math.max(8, Math.min(92, (event.clientX - rect.left) / rect.width * 100));
    if (position > 42 && position < 58) position = position < 50 ? 42 : 58;
    hoverPosition.current = position;
    const x = rect.width * (position - 68) / 100;
    pointerAnimation.current?.stop();
    if (scissorsRef.current) pointerAnimation.current = animate(scissorsRef.current, { transform: `translateX(${x}px)` }, { type: "spring", duration: .5, bounce: .2 });
  };

  const resetScissors = () => {
    if (busy.current || !scissorsRef.current) return;
    pointerAnimation.current?.stop();
    pointerAnimation.current = animate(scissorsRef.current, { transform: "translateX(0px)" }, { type: "spring", duration: .5, bounce: .2 });
  };

  if (!visible) return null;
  const released = !["idle", "cutting"].includes(phase);
  const opened = ["opening", "open", "entering", "fading"].includes(phase);
  return createPortal(<div ref={dialogRef} className="home-entrance" style={{ "--cut-position": `${cutPosition}%` } as CSSProperties} tabIndex={-1} data-phase={phase} data-started={phase !== "idle"} data-released={released} data-open={opened} role="dialog" aria-modal="true" aria-labelledby="studio-welcome" data-lenis-prevent onAnimationEnd={event => { if (event.animationName === "entrance-snip-upper") releaseRibbon(); }} onWheel={event => { if (event.deltaY > 5) stepInside(); }} onTouchStart={event => { touchStart.current = event.touches[0]?.clientY ?? 0; }} onTouchEnd={event => { if (touchStart.current - (event.changedTouches[0]?.clientY ?? touchStart.current) > 35) stepInside(); }}>
    <div className="entrance-scene">
      <div className="home-entrance-room" aria-hidden="true" />
      <div className="home-entrance-vignette" aria-hidden="true" />
      <div className="home-entrance-copy">
        <h1 id="studio-welcome">Welcome to my portfolio.</h1>
      </div>
      <div className="home-entrance-portal">
        <div className="entrance-jamb" aria-hidden="true" />
        <div className="entrance-threshold" aria-hidden="true" />
        <button ref={doorwayRef} type="button" className="entrance-inner-room" onClick={stepInside} disabled={phase !== "open"} aria-label="Step inside the studio" aria-hidden={phase !== "open"}>
          <span className="entrance-inner-light" aria-hidden="true" />
        </button>
        <div className="home-entrance-door home-entrance-door-left" aria-hidden="true" />
        <div className="home-entrance-door home-entrance-door-right" aria-hidden="true" />
        <div className="entrance-ribbon-stage">
        <div className="entrance-ribbon-piece entrance-ribbon-left" aria-hidden="true" />
        <div className="entrance-ribbon-piece entrance-ribbon-right" aria-hidden="true" />
        <button ref={ribbonRef} className="entrance-ribbon-target" type="button" onClick={cut} onPointerMove={followRibbon} onPointerLeave={resetScissors} onAnimationEnd={event => { if (event.animationName === "entrance-scissor-sweep") releaseRibbon(); }} aria-label="Cut the ribbon to open the doors" disabled={phase !== "idle"}>
          <span className="entrance-ribbon-focus" />
          <span ref={scissorsRef} className="entrance-scissors-position"><span className="entrance-scissors"><CuttingScissors /></span></span>
        </button>
        <div className="entrance-fibres" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ "--dx": `${(i % 2 ? 1 : -1) * (8 + i * 3)}px`, "--dy": `${-18 + i * 5}px`, "--turn": `${i * 37}deg` } as CSSProperties} />)}</div>
        </div>
      </div>
      <div className="entrance-field-notes">{NOTES.map((item, i) => <div className="entrance-note" key={item.label}><button type="button" disabled={phase !== "idle"} aria-expanded={note === i} aria-controls={`studio-note-${i}`} onClick={() => setNote(note === i ? null : i)}><span aria-hidden="true">+</span>{item.label}</button>{note === i && <div id={`studio-note-${i}`} className="entrance-note-card"><strong>{item.title}</strong><p>{item.text}</p></div>}</div>)}</div>
    </div>
    <div className="entrance-status" role="status" aria-live="polite">{phase === "idle" ? <><span className="entrance-status-line" />Hover over the doors. Click to cut.<span className="entrance-status-touch">Tap the doors to cut the ribbon.</span></> : phase === "cutting" ? "A small opening ceremony…" : phase === "released" ? "The ribbon is cut." : phase === "opening" ? "The doors are opening…" : phase === "open" ? "Scroll to step inside — or click the doorway." : "Welcome in."}</div>
  </div>, document.body);
}
