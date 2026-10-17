"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent, type PointerEvent } from "react";
import { createPortal, preload } from "react-dom";
import { animate, type AnimationPlaybackControls } from "motion";
import type { EntranceStage } from "@/lib/museum/entrance-stage";

const SEEN_KEY = "hisyam.home-entrance.seen.v3";
const CUT_DURATION = 2300, CLOSE_AT = .76;
type Phase = "idle" | "cutting" | "released" | "opening" | "open" | "entering" | "fading";
const BUBBLE: Partial<Record<Phase, string>> = {
  idle: "Hi, I'm Nailong! Pick a spot and I'll cut the ribbon.",
  cutting: "Snip, snip…",
  released: "Ta-da!",
  opening: "Come on in! I'll meet you inside.",
  open: "Come on in! I'll meet you inside.",
};
const NOTES = [
  { label: "A note from the studio", title: "Considered, not complicated.", text: "A collection of digital work, explorations, and the thinking behind them." },
  { label: "Behind these doors", title: "Take a closer look.", text: "Explore selected projects, or step into the showcase for interface studies." },
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
  const cutAnimations = useRef<Animation[]>([]);
  const slitRef = useRef<HTMLSpanElement>(null);
  // Nailong, the 3D doorkeeper. Without WebGL the brass scissors cut alone.
  const stageModule = useRef<typeof import("@/lib/museum/entrance-stage") | null>(null);
  const stage = useRef<EntranceStage | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [guide, setGuide] = useState(false);

  const revealHome = useCallback(() => {
    if (revealed.current) return;
    revealed.current = true;
    window.dispatchEvent(new Event("studio:entered"));
  }, []);

  const finish = useCallback(() => {
    pointerAnimation.current?.stop();
    stage.current?.dispose(); stage.current = null;
    cutAnimations.current.forEach(animation => animation.cancel());
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
      // Nailong arrives with the scene, but a slow network never holds the doors shut.
      const doorkeeper = Promise.race([
        import("@/lib/museum/entrance-stage").then(module => { stageModule.current = module; }).catch(() => {}),
        new Promise<void>(resolve => window.setTimeout(resolve, 4000)),
      ]);
      // Reveal one complete scene, never a ribbon floating over unloaded doors.
      Promise.all([doorkeeper, ...assets.map(src => new Promise<void>(resolve => {
        const image = new Image();
        image.onload = () => { image.decode().catch(() => {}).then(() => resolve()); };
        image.onerror = () => resolve(); // A failed asset must not trap the visitor.
        image.src = src;
      }))]).then(() => { if (!cancelled) setVisible(true); });
    }
    if (seen && !replay) document.documentElement.removeAttribute("data-studio-pending");
    return () => {
      cancelled = true;
      stage.current?.dispose(); stage.current = null;
      pointerAnimation.current?.stop();
      cutAnimations.current.forEach(animation => animation.cancel());
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
    if (phase === "opening") stage.current?.stepAside();
  }, [phase]);

  // Start Nailong once the scene is on screen, and keep it standing on the
  // doors' threshold whenever the layout changes.
  useEffect(() => {
    const canvas = canvasRef.current, dialog = dialogRef.current, module = stageModule.current;
    if (!visible || !canvas || !dialog || !module) return;
    let instance: EntranceStage;
    try {
      instance = module.createEntranceStage(canvas, {
        reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        onAnchor: (x, y) => { if (bubbleRef.current) bubbleRef.current.style.transform = `translate(${x}px, ${y}px)`; },
        onSnip: () => snipFabric(),
      });
    } catch { return; }
    stage.current = instance; setGuide(true);
    const measure = () => {
      const box = canvas.getBoundingClientRect(), door = dialog.querySelector(".home-entrance-portal")?.getBoundingClientRect(), ribbon = ribbonRef.current?.getBoundingClientRect();
      if (!door || !ribbon || !box.width) return;
      instance.layout({ width: box.width, height: box.height, door: { left: door.left - box.left, right: door.right - box.left, top: door.top - box.top, bottom: door.bottom - box.top }, ribbonY: ribbon.top + ribbon.height / 2 - box.top });
    };
    measure(); instance.start();
    const observer = new ResizeObserver(() => { if (!busy.current) measure(); });
    observer.observe(dialog);
    return () => { observer.disconnect(); instance.dispose(); if (stage.current === instance) stage.current = null; };
    // snipFabric only reads refs; the stage lives as long as the dialog.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

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
    setCutPosition(selectedPosition);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("fading");
      timers.current.push(window.setTimeout(finish, 200));
      return;
    }
    setPhase("cutting");
    let walk = 0;
    if (stage.current && rect) {
      // Nailong walks over first; the fabric starts giving when the blades arrive.
      const box = canvasRef.current?.getBoundingClientRect();
      walk = stage.current.cut(rect.left + rect.width * selectedPosition / 100 - (box?.left ?? 0));
    } else {
      if (scissors) snipScissors(scissors, width * (selectedPosition - 68) / 100);
      snipFabric();
    }
    // Safety fallback for browsers that never resolve the animation (e.g. background tabs).
    timers.current.push(window.setTimeout(releaseRibbon, walk + CUT_DURATION + 600));
  };

  // A real cut, not a sweep: the open blades slide onto the fabric at the
  // chosen point, squeeze shut (accelerating, like a hand), reopen, push a
  // little deeper and close through. The slit grows with each bite and the
  // ribbon gives under the blades; the final close releases the fabric.
  const squeeze = "cubic-bezier(.55,0,.8,.35)", release = "cubic-bezier(.2,.75,.3,1)", settle = "cubic-bezier(.23,1,.32,1)";
  const snipScissors = (scissors: HTMLElement, x: number) => {
    const upper = scissors.querySelector<SVGGElement>(".entrance-scissor-upper"), lower = scissors.querySelector<SVGGElement>(".entrance-scissor-lower");
    const timing = { duration: CUT_DURATION, fill: "forwards" as const };
    const blade = (sign: number) => [
      { offset: 0, transform: `rotate(${sign * 18}deg)`, easing: settle },
      { offset: .16, transform: `rotate(${sign * 31}deg)` },
      { offset: .22, transform: `rotate(${sign * 31}deg)`, easing: squeeze },
      { offset: .37, transform: `rotate(${sign * 3}deg)` },
      { offset: .41, transform: `rotate(${sign * 2}deg)`, easing: release },
      { offset: .53, transform: `rotate(${sign * 25}deg)` },
      { offset: .57, transform: `rotate(${sign * 25}deg)`, easing: squeeze },
      { offset: CLOSE_AT, transform: "rotate(0deg)" },
      { offset: .82, transform: "rotate(0deg)", easing: release },
      { offset: 1, transform: `rotate(${sign * 14}deg)` },
    ];
    const animations = [scissors.animate([
      { offset: 0, opacity: 0, transform: `translate(${x - 30}px, -34px) rotate(-7deg)`, easing: settle },
      { offset: .16, opacity: 1, transform: `translate(${x - 3}px, -11px) rotate(-1deg)`, easing: settle },
      { offset: .22, opacity: 1, transform: `translate(${x}px, -9px) rotate(0deg)`, easing: squeeze },
      { offset: .37, opacity: 1, transform: `translate(${x}px, -5px) rotate(0deg)` },
      { offset: .45, opacity: 1, transform: `translate(${x}px, -5px) rotate(0deg)`, easing: settle },
      { offset: .57, opacity: 1, transform: `translate(${x}px, 2px) rotate(.5deg)`, easing: squeeze },
      { offset: CLOSE_AT, opacity: 1, transform: `translate(${x}px, 5px) rotate(0deg)` },
      { offset: .84, opacity: 1, transform: `translate(${x}px, 4px) rotate(0deg)`, easing: "cubic-bezier(.5,0,.75,0)" },
      { offset: 1, opacity: 0, transform: `translate(${x + 22}px, -42px) rotate(8deg)` },
    ], timing)];
    if (upper) animations.push(upper.animate(blade(-1), timing));
    if (lower) animations.push(lower.animate(blade(1), timing));
    cutAnimations.current.push(...animations);
  };

  // The slit grows with each bite and the ribbon gives under the blades; the
  // final close releases the fabric. Shared by Nailong and the fallback scissors.
  const snipFabric = () => {
    const animations: Animation[] = [];
    if (slitRef.current) {
      const bite = slitRef.current.animate([
        { offset: 0, transform: "scaleY(0)" }, { offset: .26 / CLOSE_AT, transform: "scaleY(0)", easing: squeeze },
        { offset: .37 / CLOSE_AT, transform: "scaleY(.55)" }, { offset: .57 / CLOSE_AT, transform: "scaleY(.55)", easing: squeeze },
        { offset: 1, transform: "scaleY(1)" },
      ], { duration: CUT_DURATION * CLOSE_AT, fill: "forwards" });
      animations.push(bite);
      bite.finished.then(releaseRibbon, () => {});
    }
    // The fabric gives a little under each bite, then springs back.
    dialogRef.current?.querySelectorAll<HTMLElement>(".entrance-ribbon-piece").forEach(piece => animations.push(piece.animate([
      { offset: 0, transform: "translateY(0)" }, { offset: .3, transform: "translateY(0)", easing: squeeze },
      { offset: .37, transform: "translateY(1.5px) skewY(.4deg)", easing: release }, { offset: .47, transform: "translateY(0)" },
      { offset: .66, transform: "translateY(0)", easing: squeeze }, { offset: CLOSE_AT, transform: "translateY(2px) skewY(.6deg)" },
    ], { duration: CUT_DURATION * CLOSE_AT })));
    cutAnimations.current.push(...animations);
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
    const box = canvasRef.current?.getBoundingClientRect();
    stage.current?.point(rect.left + rect.width * position / 100 - (box?.left ?? 0));
  };

  const resetScissors = () => {
    if (busy.current || !scissorsRef.current) return;
    stage.current?.point(null);
    pointerAnimation.current?.stop();
    pointerAnimation.current = animate(scissorsRef.current, { transform: "translateX(0px)" }, { type: "spring", duration: .5, bounce: .2 });
  };

  if (!visible) return null;
  const released = !["idle", "cutting"].includes(phase);
  const opened = ["opening", "open", "entering", "fading"].includes(phase);
  return createPortal(<div ref={dialogRef} className="home-entrance" style={{ "--cut-position": `${cutPosition}%` } as CSSProperties} tabIndex={-1} data-phase={phase} data-started={phase !== "idle"} data-released={released} data-open={opened} role="dialog" aria-modal="true" aria-labelledby="studio-welcome" data-lenis-prevent onWheel={event => { if (event.deltaY > 5) stepInside(); }} onTouchStart={event => { touchStart.current = event.touches[0]?.clientY ?? 0; }} onTouchEnd={event => { if (touchStart.current - (event.changedTouches[0]?.clientY ?? touchStart.current) > 35) stepInside(); }}>
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
        <span ref={slitRef} className="entrance-ribbon-slit" aria-hidden="true" />
        <button ref={ribbonRef} className="entrance-ribbon-target" type="button" onClick={cut} onPointerMove={followRibbon} onPointerLeave={resetScissors} aria-label="Cut the ribbon to open the doors" disabled={phase !== "idle"}>
          <span className="entrance-ribbon-focus" />
          <span ref={scissorsRef} className="entrance-scissors-position">{guide ? <span className="entrance-cut-mark" /> : <span className="entrance-scissors"><CuttingScissors /></span>}</span>
        </button>
        <div className="entrance-fibres" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ "--dx": `${(i % 2 ? 1 : -1) * (8 + i * 3)}px`, "--dy": `${-18 + i * 5}px`, "--turn": `${i * 37}deg` } as CSSProperties} />)}</div>
        </div>
      </div>
      <canvas ref={canvasRef} className="entrance-nailong" aria-hidden="true" />
      {guide && <div ref={bubbleRef} className="entrance-nailong-anchor" aria-hidden="true">{BUBBLE[phase] && <p key={phase} className="entrance-nailong-bubble">{BUBBLE[phase]}</p>}</div>}
      <div className="entrance-field-notes">{NOTES.map((item, i) => <div className="entrance-note" key={item.label}><button type="button" disabled={phase !== "idle"} aria-expanded={note === i} aria-controls={`studio-note-${i}`} onClick={() => setNote(note === i ? null : i)}><span aria-hidden="true">+</span>{item.label}</button>{note === i && <div id={`studio-note-${i}`} className="entrance-note-card"><strong>{item.title}</strong><p>{item.text}</p></div>}</div>)}</div>
    </div>
    <div className="entrance-status" role="status" aria-live="polite">{phase === "idle" ? <><span className="entrance-status-line" />{guide ? "Click a spot on the ribbon. Nailong will cut it." : "Hover over the doors. Click to cut."}<span className="entrance-status-touch">{guide ? "Tap the ribbon. Nailong will cut it." : "Tap the doors to cut the ribbon."}</span></> : phase === "cutting" ? "A small opening ceremony…" : phase === "released" ? "The ribbon is cut." : phase === "opening" ? "The doors are opening…" : phase === "open" ? "Scroll to step inside — or click the doorway." : "Welcome in."}</div>
  </div>, document.body);
}
