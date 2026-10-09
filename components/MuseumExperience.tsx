"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, BookOpen, Camera, Footprints, Layers, Lightbulb, Mouse, RotateCcw, X } from "lucide-react";
import type { CaseStudy, SiteContent } from "@/lib/content";
import { museumContent } from "@/lib/museum/content";
import { MUSEUM_ROOMS, type MuseumController, type MuseumExhibit, type MuseumRoom } from "@/lib/museum/types";
import { caseStudyCover } from "@/lib/case-study-visuals";
import CaseStudyOverlay from "./CaseStudyOverlay";

const VIEW_KEY = "hisyam.portfolio.view.v1";

export default function MuseumExperience({ content }: { content: SiteContent }) {
  const data = useMemo(() => museumContent(content), [content]);
  const [mounted, setMounted] = useState(false), [active, setActive] = useState(true);
  const [ready, setReady] = useState(false), [entered, setEntered] = useState(false);
  const [room, setRoom] = useState<MuseumRoom>("work"), [focusId, setFocusId] = useState<string | null>(null);
  const [lights, setLights] = useState(true), [firstPerson, setFirstPerson] = useState(false);
  const [collection, setCollection] = useState(false), [selected, setSelected] = useState<MuseumExhibit | null>(null);
  const [study, setStudy] = useState<CaseStudy | null>(null), [error, setError] = useState(false);
  const mountRef = useRef<HTMLDivElement>(null), controller = useRef<MuseumController | null>(null);
  const mapPlayer = useRef<HTMLSpanElement>(null), stick = useRef<HTMLSpanElement>(null);
  const dialog = useRef<HTMLDialogElement>(null), studyLayer = useRef<HTMLDivElement>(null);
  const paused = useRef(true), latestSelect = useRef<(id: string) => void>(() => {});
  const joystickPointer = useRef<number | null>(null);
  const currentRoom = MUSEUM_ROOMS.find(item => item.id === room)!;
  const focused = data.exhibits.find(item => item.id === focusId);
  const published = content.caseStudies.filter(item => item.published).sort((a, b) => a.featured_order - b.featured_order);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    let classic = false;
    try { classic = sessionStorage.getItem(VIEW_KEY) === "classic"; } catch { /* View preference is optional. */ }
    if (query.get("museum") === "1" || query.get("entrance") === "1") classic = false;
    if (query.get("view") === "classic") classic = true;
    setActive(!classic); setMounted(true);
    setEntered(!document.documentElement.hasAttribute("data-studio-pending") && !document.querySelector(".home-entrance"));
    const onEntered = () => setEntered(true);
    window.addEventListener("studio:entered", onEntered);
    return () => window.removeEventListener("studio:entered", onEntered);
  }, []);

  const choose = useCallback((id: string) => {
    if (id === "work-collection") { setCollection(true); return; }
    const exhibit = data.exhibits.find(item => item.id === id);
    if (exhibit) setSelected(exhibit);
  }, [data]);
  useEffect(() => { latestSelect.current = choose; }, [choose]);

  useEffect(() => {
    paused.current = !entered || !!selected || collection || !!study;
    controller.current?.setPaused(paused.current);
  }, [entered, selected, collection, study]);

  useEffect(() => {
    if (!mounted || !active || !mountRef.current) return;
    setReady(false); setRoom("work"); setFocusId(null); setLights(true); setFirstPerson(false);
    const abort = new AbortController();
    const html = document.documentElement;
    const shell = document.querySelector<HTMLElement>("[data-portfolio-shell]");
    const previousOverflow = html.style.overflow, previousInert = shell?.inert;
    html.setAttribute("data-museum-view", "true"); html.style.overflow = "hidden";
    if (shell) shell.inert = true;
    import("@/lib/museum/scene").then(async ({ createMuseumScene }) => {
      if (abort.signal.aborted || !mountRef.current) return;
      const api = await createMuseumScene({
        mount: mountRef.current, data, signal: abort.signal, reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        onReady: () => { if (!abort.signal.aborted) setReady(true); }, onRoom: setRoom, onFocus: setFocusId,
        onInteract: id => latestSelect.current(id),
        onPlayer: (x, z, yaw) => { if (mapPlayer.current) mapPlayer.current.style.transform = `translate(${(x + 14) / 28 * 142 + 19}px, ${(z + 34) / 48 * 156 + 18}px) rotate(${yaw}rad)`; },
        onError: () => { if (!abort.signal.aborted) { setError(true); setActive(false); } },
      });
      if (abort.signal.aborted) { api.dispose(); return; }
      controller.current = api; api.setPaused(paused.current);
    }).catch(cause => { if (!abort.signal.aborted && cause?.name !== "AbortError") { setError(true); setActive(false); } });
    return () => {
      abort.abort(); controller.current?.dispose(); controller.current = null;
      html.removeAttribute("data-museum-view"); html.style.overflow = previousOverflow;
      if (shell) shell.inert = previousInert ?? false;
    };
  }, [active, mounted, data]);

  useEffect(() => {
    if (!dialog.current) return;
    if ((selected || collection) && !dialog.current.open) dialog.current.showModal();
    if (!selected && !collection && dialog.current.open) dialog.current.close();
  }, [selected, collection]);

  useEffect(() => {
    if (!study || !studyLayer.current) return;
    const previous = document.activeElement as HTMLElement | null;
    const panel = studyLayer.current.querySelector<HTMLElement>("[role=dialog]");
    if (!panel) return;
    const siblings = Array.from(studyLayer.current.parentElement?.children ?? []).filter((element): element is HTMLElement => element instanceof HTMLElement && element !== studyLayer.current);
    const previousInert = siblings.map(element => element.inert);
    siblings.forEach(element => { element.inert = true; });
    const focusables = () => Array.from(panel.querySelectorAll<HTMLElement>("button,a[href],input,textarea,[tabindex='0']")).filter(element => !element.hasAttribute("disabled"));
    focusables()[0]?.focus({ preventScroll: true });
    const onTab = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = focusables(), first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    panel.addEventListener("keydown", onTab);
    return () => { panel.removeEventListener("keydown", onTab); siblings.forEach((element, index) => { element.inert = previousInert[index]; }); previous?.focus({ preventScroll: true }); };
  }, [study]);

  function changeView(museum: boolean) {
    setSelected(null); setCollection(false); setStudy(null); setError(false); setActive(museum);
    try { sessionStorage.setItem(VIEW_KEY, museum ? "museum" : "classic"); } catch { /* No persistent preference required. */ }
  }
  function visit(next: MuseumRoom) { controller.current?.visit(next); }
  function inspectStudy(item: CaseStudy) { setSelected(null); setCollection(false); setStudy(item); }
  function closeDialog() { setSelected(null); setCollection(false); }
  function moveJoystick(event: PointerEvent<HTMLDivElement>) {
    if (joystickPointer.current !== event.pointerId) return;
    const rect = event.currentTarget.getBoundingClientRect();
    let x = (event.clientX - rect.left - rect.width / 2) / 37, y = (event.clientY - rect.top - rect.height / 2) / 37;
    const length = Math.max(1, Math.hypot(x, y)); x /= length; y /= length;
    if (stick.current) stick.current.style.transform = `translate(${x * 28}px,${y * 28}px)`;
    controller.current?.move(x, y);
  }
  function resetJoystick() { joystickPointer.current = null; controller.current?.move(0, 0); if (stick.current) stick.current.style.transform = "translate(0,0)"; }

  if (!mounted) return null;
  if (!active) return <div className="museum-classic-entry">
    <button type="button" onClick={() => changeView(true)}><Footprints size={16} aria-hidden="true" />Explore the 3D museum<ArrowRight size={15} aria-hidden="true" /></button>
    {error && <p role="status">The 3D view could not open in this browser. You can explore the full portfolio below, or try again.</p>}
  </div>;

  const processIndex = selected?.id.startsWith("process-") ? Number(selected.id.split("-")[1]) : -1;
  const selectedStudy = selected?.studySlug ? content.caseStudies.find(item => item.slug === selected.studySlug) : undefined;

  return createPortal(<section className="museum-world" aria-label="Hisyam's interactive museum" data-lenis-prevent data-ready={ready}>
    <div className="museum-renderer" ref={mountRef} />
    <div className="museum-world-shade" aria-hidden="true" />
    <header className="museum-world-header">
      <button type="button" className="museum-world-mark" aria-label="Return to Selected work" onClick={() => visit("work")} disabled={!ready}>h</button>
      <nav className="museum-world-nav" aria-label="Museum rooms">{MUSEUM_ROOMS.map(item => <button type="button" key={item.id} aria-current={room === item.id ? "location" : undefined} disabled={!ready} onClick={() => visit(item.id)}>{item.label}<span aria-hidden="true" /></button>)}</nav>
      <div className="museum-world-utilities">
        {data.available && <span className="museum-world-available"><i aria-hidden="true" />Available for work</span>}
        <button type="button" title={lights ? "Dim the lights" : "Turn on the lights"} aria-label={lights ? "Dim the lights" : "Turn on the lights"} aria-pressed={lights} onClick={() => { controller.current?.setLights(!lights); setLights(!lights); }} disabled={!ready}><Lightbulb size={17} /></button>
        <button type="button" title={firstPerson ? "Show character" : "First-person camera"} aria-label={firstPerson ? "Show character" : "First-person camera"} aria-pressed={firstPerson} onClick={() => { controller.current?.setPerspective(!firstPerson); setFirstPerson(!firstPerson); }} disabled={!ready}><Camera size={18} /></button>
        <button type="button" className="museum-classic-toggle" onClick={() => changeView(false)}><BookOpen size={16} aria-hidden="true" /><span>Classic view</span></button>
      </div>
    </header>
    <div className="museum-room-copy" key={room}>
      <span className="museum-room-number">{currentRoom.number}</span>
      <h1>{currentRoom.label}</h1><p>{currentRoom.description}</p>
      <button type="button" className="museum-collection-trigger" disabled={!ready} onClick={() => setCollection(true)}><Layers size={14} aria-hidden="true" />Browse the collection<ArrowRight size={14} aria-hidden="true" /></button>
    </div>
    <nav className="museum-room-rail" aria-label="Gallery destinations">{MUSEUM_ROOMS.map(item => <button type="button" key={item.id} onClick={() => visit(item.id)} aria-label={`Walk to ${item.label}`} aria-current={room === item.id ? "location" : undefined} disabled={!ready}><span>{item.number}</span><i>{item.label}</i></button>)}</nav>
    <div className="museum-game-guide" aria-label="Movement controls">
      <div><span className="museum-key-group">{["W", "A", "S", "D"].map(key => <kbd key={key}>{key}</kbd>)}</span><span>Move</span></div>
      <div><Mouse size={19} strokeWidth={1.3} aria-hidden="true" /><span>Drag to look around</span></div>
      <div><kbd>E</kbd><span>Inspect a display</span><kbd className="museum-run-key">Shift</kbd><span>Run</span></div>
    </div>
    <div className="museum-interaction-prompt" aria-live="polite">
      {focused ? <button type="button" onClick={() => choose(focused.id)}><kbd>E</kbd><span>{focused.title}</span><ArrowRight size={17} aria-hidden="true" /></button> : <span>Walk toward a display, or click its artwork.</span>}
    </div>
    <div className="museum-mini-map" aria-label="Museum map">
      <span className="museum-map-heading">The museum</span>
      <div className="museum-map-plan">
        <svg viewBox="0 0 180 200" aria-hidden="true"><path d="M19 18H161V174H19Z M19 77H31 M149 77H161 M19 128H31 M149 128H161 M19 172H66 M114 172H161" fill="none" stroke="currentColor" strokeWidth="1" /><path d="M47 106H133M69 29V45M95 29V45M124 29V45M31 143V151M149 143V151" fill="none" stroke="currentColor" strokeWidth="4" /><circle cx="90" cy="132" r="22" fill="none" stroke="currentColor" strokeWidth=".6" /></svg>
        <span className="museum-map-player" ref={mapPlayer} aria-hidden="true" />
        {MUSEUM_ROOMS.map(item => <button type="button" key={item.id} className={`museum-map-room museum-map-${item.id}`} aria-label={`Go to ${item.label}`} aria-current={room === item.id ? "location" : undefined} onClick={() => visit(item.id)} disabled={!ready}><i aria-hidden="true" /><span>{item.label}</span></button>)}
      </div>
    </div>
    <div className="museum-mobile-controls">
      <div className="museum-joystick" aria-label="Movement joystick" onPointerDown={event => { joystickPointer.current = event.pointerId; event.currentTarget.setPointerCapture(event.pointerId); moveJoystick(event); }} onPointerMove={moveJoystick} onPointerUp={resetJoystick} onPointerCancel={resetJoystick}><span className="museum-joystick-thumb" ref={stick} /><ArrowUp className="joystick-north" size={13} /><ArrowDown className="joystick-south" size={13} /><ArrowLeft className="joystick-west" size={13} /><ArrowRight className="joystick-east" size={13} /></div>
      <button type="button" className="museum-mobile-run" aria-label="Hold to run" onPointerDown={event => { event.currentTarget.setPointerCapture(event.pointerId); controller.current?.running(true); }} onPointerUp={() => controller.current?.running(false)} onPointerCancel={() => controller.current?.running(false)}><Footprints size={20} aria-hidden="true" /><span>Run</span></button>
      <span className="museum-mobile-look">Drag the room to look around</span>
    </div>
    {!ready && <div className="museum-world-loading" role="status"><span className="museum-loading-monogram">h</span><h2>Opening the museum</h2><p>Preparing the room and hanging the collection.</p><span className="museum-loading-line" aria-hidden="true" /><button type="button" onClick={() => changeView(false)}>Open classic view<ArrowRight size={14} /></button></div>}
    <dialog ref={dialog} className="museum-exhibit-dialog" aria-labelledby="museum-dialog-title" onCancel={closeDialog} onClose={closeDialog}>
      <div className="museum-dialog-top"><span>{collection ? "The collection" : currentRoom.label}</span><button type="button" aria-label="Close exhibit" onClick={closeDialog}><X size={20} /></button></div>
      {collection ? <><h2 id="museum-dialog-title">A closer look at the work.</h2><p>Choose a project to explore the thinking, the decisions, and the final design.</p><div className="museum-collection-list">{published.map(item => <button type="button" key={item.slug} onClick={() => inspectStudy(item)}>{(item.thumbnail || item.hero_image || caseStudyCover(item.slug)) && <img src={item.thumbnail || item.hero_image || caseStudyCover(item.slug)} alt={item.thumbnail_alt || item.title} />}<span><strong>{item.title}</strong><small>{[item.category, item.year].filter(Boolean).join(" / ")}</small></span><ArrowRight size={18} aria-hidden="true" /></button>)}{!published.length && <p>New work will appear here as projects are published.</p>}</div></> : selected && <>
        <h2 id="museum-dialog-title">{selected.title}</h2><p className="museum-dialog-subtitle">{selected.subtitle}</p>
        {selected.image && <div className="museum-dialog-image"><img src={selected.image} alt={`${selected.title} exhibit`} /></div>}
        <p className="museum-dialog-description">{selected.description}</p>
        {processIndex >= 0 && <ul className="museum-process-points">{content.experience[processIndex]?.points.slice(1).map(point => <li key={point}>{point}</li>)}</ul>}
        {selected.id === "about-tools" && <div className="museum-dialog-skills">{content.about.capabilities.slice(0, 8).map(item => <span key={item}>{item}</span>)}</div>}
        <div className="museum-dialog-actions">{selectedStudy ? <button type="button" className="museum-primary-action" onClick={() => inspectStudy(selectedStudy)}>View case study<ArrowRight size={17} aria-hidden="true" /></button> : selected.href ? <Link className="museum-primary-action" href={selected.href}>{selected.action}<ArrowRight size={17} aria-hidden="true" /></Link> : <Link className="museum-primary-action" href="/about-us">More about my work<ArrowRight size={17} aria-hidden="true" /></Link>}{selected.room === "contact" && <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>}</div>
      </>}
    </dialog>
    <div ref={studyLayer} className="museum-study-layer"><CaseStudyOverlay cs={study} onClose={() => setStudy(null)} /></div>
    <button type="button" className="museum-reset-view" title="Return to the entrance hall" aria-label="Return to the entrance hall" disabled={!ready} onClick={() => visit("work")}><RotateCcw size={15} /></button>
  </section>, document.body);
}
