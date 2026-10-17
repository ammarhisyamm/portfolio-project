"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, BookOpen, ChevronLeft, ChevronRight, Camera, Download, Footprints, Layers, Lightbulb, Mouse, Plus, RotateCcw, Sparkles, Wrench, X } from "lucide-react";
import type { CaseStudy, SiteContent } from "@/lib/content";
import type { BlogSummary } from "@/lib/blog";
import { museumContent } from "@/lib/museum/content";
import { MUSEUM_GUIDE, MUSEUM_ROOMS, type MuseumController, type MuseumExhibit, type MuseumRoom, type ShowcaseItem } from "@/lib/museum/types";
import { caseStudyCover } from "@/lib/case-study-visuals";
import CaseStudyOverlay from "./CaseStudyOverlay";
import ContactForm from "./ContactForm";
import { ProcessIcon } from "./ProcessIcon";
import Socials from "./Socials";
import { industryMeta } from "@/lib/industry-meta";
import { capabilityMeta } from "@/lib/capability-meta";
import { toolLogoFor } from "@/lib/tool-logos";

const VIEW_KEY = "hisyam.portfolio.view.v1";
const FOUND_KEY = "hisyam.museum.secrets.v1";
const SEEN_KEY = "hisyam.home-entrance.seen.v3";

/** True when the door-opening screen has to play first (once per session, or when replayed with ?entrance=1). */
function requestDoors() {
  let seen = false;
  try { seen = sessionStorage.getItem(SEEN_KEY) === "1"; } catch { /* Still allow entry. */ }
  if (seen && new URLSearchParams(window.location.search).get("entrance") !== "1") return false;
  window.setTimeout(() => window.dispatchEvent(new Event("museum:doors")), 0);
  return true;
}

export default function MuseumExperience({ content, posts = [] }: { content: SiteContent; posts?: BlogSummary[] }) {
  const data = useMemo(() => museumContent(content, posts), [content, posts]);
  const [mounted, setMounted] = useState(false), [active, setActive] = useState(false);
  const [ready, setReady] = useState(false), [entered, setEntered] = useState(false);
  const [room, setRoom] = useState<MuseumRoom>("work"), [focusId, setFocusId] = useState<string | null>(null);
  const [lights, setLights] = useState(true), [firstPerson, setFirstPerson] = useState(false);
  const [collection, setCollection] = useState(false), [selected, setSelected] = useState<MuseumExhibit | null>(null);
  const [study, setStudy] = useState<CaseStudy | null>(null), [error, setError] = useState(false);
  const [found, setFound] = useState<string[]>([]), [guide, setGuide] = useState(false);
  const [shot, setShot] = useState<number | null>(null), [reading, setReading] = useState<string | null>(null);
  const secretTotal = data.exhibits.filter(item => item.secret).length;
  const mountRef = useRef<HTMLDivElement>(null), controller = useRef<MuseumController | null>(null);
  const mapPlayer = useRef<HTMLSpanElement>(null), stick = useRef<HTMLSpanElement>(null);
  const dialog = useRef<HTMLDialogElement>(null), studyLayer = useRef<HTMLDivElement>(null);
  const paused = useRef(true), latestSelect = useRef<(id: string) => void>(() => {});
  const joystickPointer = useRef<number | null>(null);
  // A room picked from Nailong's dialog waits until the dialog has closed and the scene runs again.
  const pendingVisit = useRef<MuseumRoom | null>(null);
  const currentRoom = MUSEUM_ROOMS.find(item => item.id === room)!;
  const focused = data.exhibits.find(item => item.id === focusId);
  const published = content.caseStudies.filter(item => item.published).sort((a, b) => a.featured_order - b.featured_order);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    let museum = false;
    try { museum = sessionStorage.getItem(VIEW_KEY) === "museum"; } catch { /* View preference is optional. */ }
    if (query.get("museum") === "1" || query.get("entrance") === "1") museum = true;
    if (query.get("view") === "classic") museum = false;
    setActive(museum); setMounted(true);
    setEntered(museum ? !requestDoors() : true);
    if (!museum) document.documentElement.removeAttribute("data-studio-pending");
    const onEntered = () => setEntered(true);
    window.addEventListener("studio:entered", onEntered);
    return () => window.removeEventListener("studio:entered", onEntered);
  }, []);

  const choose = useCallback((id: string) => {
    if (id === "work-collection") { setCollection(true); return; }
    if (id === MUSEUM_GUIDE) { setGuide(true); return; }
    const exhibit = data.exhibits.find(item => item.id === id);
    if (!exhibit) return;
    setSelected(exhibit); setReading(exhibit.post ?? null);
    if (exhibit.secret) setFound(current => {
      if (current.includes(id)) return current;
      const next = [...current, id];
      try { sessionStorage.setItem(FOUND_KEY, JSON.stringify(next)); } catch { /* Progress is a nicety. */ }
      return next;
    });
  }, [data]);
  useEffect(() => {
    try { const saved = JSON.parse(sessionStorage.getItem(FOUND_KEY) ?? "[]"); if (Array.isArray(saved)) setFound(saved.filter((id): id is string => typeof id === "string")); } catch { /* Start fresh. */ }
  }, []);
  useEffect(() => { latestSelect.current = choose; }, [choose]);

  useEffect(() => {
    paused.current = !entered || !!selected || collection || guide || !!study;
    controller.current?.setPaused(paused.current);
    if (!paused.current && pendingVisit.current) { controller.current?.visit(pendingVisit.current); pendingVisit.current = null; }
  }, [entered, selected, collection, guide, study]);

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
        onPlayer: (x, z, yaw) => { if (mapPlayer.current) mapPlayer.current.style.transform = `translate(${(x + 31) / 45 * 222 + 9}px, ${(z + 34) / 48 * 156 + 18}px) rotate(${yaw}rad)`; },
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
    if ((selected || collection || guide) && !dialog.current.open) dialog.current.showModal();
    if (!selected && !collection && !guide && dialog.current.open) dialog.current.close();
  }, [selected, collection, guide]);

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
    setSelected(null); setCollection(false); setGuide(false); setStudy(null); setError(false); setActive(museum);
    // Entering the museum the first time plays the door-opening screen while the scene builds behind it.
    if (museum) setEntered(!requestDoors());
    try { sessionStorage.setItem(VIEW_KEY, museum ? "museum" : "classic"); } catch { /* No persistent preference required. */ }
  }
  function visit(next: MuseumRoom) { controller.current?.visit(next); }
  function inspectStudy(item: CaseStudy) { setSelected(null); setCollection(false); setGuide(false); setStudy(item); }
  function closeDialog() { setSelected(null); setCollection(false); setGuide(false); setShot(null); setReading(null); }
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
  if (!active) return <div className="museum-classic-entry panel">
    <div><span className="kicker">The 3D museum</span><p className="museum-classic-copy">Prefer to wander? Walk through the work, the showcase and the studio as a small museum.</p></div>
    <button type="button" onClick={() => changeView(true)}><Footprints size={16} aria-hidden="true" />Explore the 3D museum<ArrowRight size={15} aria-hidden="true" /></button>
    {error && <p role="status">The 3D view could not open in this browser. You can explore the full portfolio below, or try again.</p>}
  </div>;

  const showcase = selected?.showcase?.length ? selected.showcase : null;
  const selectedStudy = selected?.studySlug ? content.caseStudies.find(item => item.slug === selected.studySlug) : undefined;

  return createPortal(<section className="museum-world" aria-label="Hisyam's interactive museum" data-lenis-prevent data-ready={ready}>
    <div className="museum-renderer" ref={mountRef} />
    <div className="museum-world-shade" aria-hidden="true" />
    <header className="museum-world-header">
      <button type="button" className="museum-world-mark" aria-label="Return to Selected work" onClick={() => visit("work")} disabled={!ready}>h</button>
      <nav className="museum-world-nav" aria-label="Museum rooms">{MUSEUM_ROOMS.filter(item => !item.hidden).map(item => <button type="button" key={item.id} aria-current={room === item.id ? "location" : undefined} disabled={!ready} onClick={() => visit(item.id)}>{item.label}<span aria-hidden="true" /></button>)}</nav>
      <div className="museum-world-utilities">
        {data.available && <span className="museum-world-available"><i aria-hidden="true" />Available for work</span>}
        <button type="button" title="Browse the collection" aria-label="Browse the collection" disabled={!ready} onClick={() => setCollection(true)}><Layers size={17} aria-hidden="true" /></button>
        <button type="button" title={lights ? "Dim the lights" : "Turn on the lights"} aria-label={lights ? "Dim the lights" : "Turn on the lights"} aria-pressed={lights} onClick={() => { controller.current?.setLights(!lights); setLights(!lights); }} disabled={!ready}><Lightbulb size={17} /></button>
        <button type="button" title={firstPerson ? "Show character" : "First-person camera"} aria-label={firstPerson ? "Show character" : "First-person camera"} aria-pressed={firstPerson} onClick={() => { controller.current?.setPerspective(!firstPerson); setFirstPerson(!firstPerson); }} disabled={!ready}><Camera size={18} /></button>
        <button type="button" className="museum-classic-toggle" onClick={() => changeView(false)}><BookOpen size={16} aria-hidden="true" /><span>Classic view</span></button>
      </div>
    </header>
    <div className="museum-game-guide" aria-label="Movement controls">
      <div><span className="museum-key-group">{["W", "A", "S", "D"].map(key => <kbd key={key}>{key}</kbd>)}</span><span>Move</span></div>
      <div><Mouse size={19} strokeWidth={1.3} aria-hidden="true" /><span>Drag to look around</span></div>
      <div><kbd>E</kbd><span>Inspect a display</span><kbd className="museum-run-key">Shift</kbd><span>Run</span></div>
    </div>
    <div className="museum-interaction-prompt" aria-live="polite">
      {focusId === MUSEUM_GUIDE ? <button type="button" className="museum-guide-prompt" onClick={() => controller.current?.select(MUSEUM_GUIDE)}><kbd>E</kbd><span>Ask Nailong for directions</span><ArrowRight size={17} aria-hidden="true" /></button> : focused ? <button type="button" className={focused.secret ? "museum-secret-prompt" : undefined} onClick={() => controller.current?.select(focused.id)}><kbd>E</kbd>{focused.secret && <Sparkles size={15} aria-hidden="true" />}<span>{focused.secret ? found.includes(focused.id) ? focused.title : focused.id === "secret-cat" ? "Say hello to the cat" : "Something is hidden here" : focused.title}</span><ArrowRight size={17} aria-hidden="true" /></button> : <span>Walk toward a display, or click its artwork.</span>}
    </div>
    <div className="museum-mini-map" aria-label="Museum map">
      <span className="museum-map-heading">The museum{secretTotal > 0 && <span className="museum-map-secrets"><Sparkles size={10} aria-hidden="true" />{found.filter(id => data.exhibits.some(item => item.id === id)).length}/{secretTotal} hidden finds</span>}</span>
      <div className="museum-map-plan">
        <svg viewBox="0 0 240 200" aria-hidden="true"><path d="M149.6 170.8H95.3V140.5 M95.3 132.7V85 M95.3 74.5V19.6H228.5V170.8H174.3" fill="none" stroke="currentColor" strokeWidth="1" /><path d="M105.7 144.8H218.2 M105.7 92.8H218.2 M105.7 44H218.2" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="2 3" /><path d="M144.2 31.6H179.7" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M116.5 138.4h5.9v9.4h-5.9Z M116.5 122.2h5.9v9.4h-5.9Z M116.5 105.9h5.9v9.4h-5.9Z M116.5 74.7h5.9v9.4h-5.9Z M116.5 59.8h5.9v9.4h-5.9Z M116.5 44.8h5.9v9.4h-5.9Z M201.4 138.4h5.9v9.4h-5.9Z M201.4 122.2h5.9v9.4h-5.9Z M201.4 105.9h5.9v9.4h-5.9Z M201.4 74.7h5.9v9.4h-5.9Z M201.4 59.8h5.9v9.4h-5.9Z M201.4 44.8h5.9v9.4h-5.9Z M155.8 43.7h12.3v3.2h-12.3Z M137.8 158.6h4.9v5.5h-4.9Z" fill="currentColor" opacity=".55" /><path d="M95.3 132.7H87.9V115.5H18.9V161H87.9V140.5H95.3" fill="none" stroke="currentColor" strokeWidth="1" />{(room === "studio" || found.length > 0) && <path d="M95.3 85H87.9V111.9H18.9V47.6H87.9V74.5H95.3" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />}<circle className="museum-map-guide" cx="171.3" cy="162.3" r="2.6" /></svg>
        <span className="museum-map-player" ref={mapPlayer} aria-hidden="true" />
        {MUSEUM_ROOMS.filter(item => !item.hidden || room === item.id || found.length > 0).map(item => <button type="button" key={item.id} className={`museum-map-room museum-map-${item.id}`} aria-label={`Go to ${item.label}`} aria-current={room === item.id ? "location" : undefined} onClick={() => visit(item.id)} disabled={!ready}><i aria-hidden="true" /><span>{item.label}</span></button>)}
      </div>
    </div>
    <div className="museum-mobile-controls">
      <div className="museum-joystick" aria-label="Movement joystick" onPointerDown={event => { joystickPointer.current = event.pointerId; event.currentTarget.setPointerCapture(event.pointerId); moveJoystick(event); }} onPointerMove={moveJoystick} onPointerUp={resetJoystick} onPointerCancel={resetJoystick}><span className="museum-joystick-thumb" ref={stick} /><ArrowUp className="joystick-north" size={13} /><ArrowDown className="joystick-south" size={13} /><ArrowLeft className="joystick-west" size={13} /><ArrowRight className="joystick-east" size={13} /></div>
      <button type="button" className="museum-mobile-run" aria-label="Hold to run" onPointerDown={event => { event.currentTarget.setPointerCapture(event.pointerId); controller.current?.running(true); }} onPointerUp={() => controller.current?.running(false)} onPointerCancel={() => controller.current?.running(false)}><Footprints size={20} aria-hidden="true" /><span>Run</span></button>
      <span className="museum-mobile-look">Drag the room to look around</span>
    </div>
    {!ready && <div className="museum-world-loading" role="status"><span className="museum-loading-monogram">h</span><h2>Opening the museum</h2><p>Preparing the room and hanging the collection.</p><span className="museum-loading-line" aria-hidden="true" /><button type="button" onClick={() => changeView(false)}>Open classic view<ArrowRight size={14} /></button></div>}
    <dialog ref={dialog} className={`museum-exhibit-dialog${showcase ? " museum-showcase-dialog" : ""}${selected?.post || selected?.postIndex ? " museum-reading-dialog" : ""}`} aria-labelledby="museum-dialog-title" onCancel={event => { if (shot !== null) { event.preventDefault(); setShot(null); } else closeDialog(); }} onClose={closeDialog}>
      <div className="museum-dialog-top"><span>{guide ? "Nailong · Doorkeeper" : collection ? "The collection" : selected?.secret ? `Hidden find · ${found.length} of ${secretTotal}` : currentRoom.label}</span><button type="button" aria-label="Close exhibit" onClick={closeDialog}><X size={20} /></button></div>
      {guide ? <><h2 id="museum-dialog-title">Hi! Can I help you find something?</h2><p>I keep an eye on the doors. Pick a room and I will point you the right way.</p><div className="museum-guide-rooms">{MUSEUM_ROOMS.filter(item => !item.hidden).map(item => <button type="button" key={item.id} onClick={() => { pendingVisit.current = item.id; closeDialog(); }}><span>{item.number}</span><span><strong>{item.label}</strong><small>{item.description}</small></span><ArrowRight size={17} aria-hidden="true" /></button>)}</div><p className="museum-guide-hint">{found.length > 0 || room === "studio" ? "You found the quiet room off the hall. Nice work." : "Psst… one door near About is easy to miss."}</p></> : collection ? <><h2 id="museum-dialog-title">A closer look at the work.</h2><p>Choose a project to explore the thinking, the decisions, and the final design.</p><div className="museum-collection-list">{published.map(item => <button type="button" key={item.slug} onClick={() => inspectStudy(item)}>{(item.thumbnail || item.hero_image || caseStudyCover(item.slug)) && <img src={item.thumbnail || item.hero_image || caseStudyCover(item.slug)} alt={item.thumbnail_alt || item.title} />}<span><strong>{item.title}</strong><small>{[item.category, item.year].filter(Boolean).join(" / ")}</small></span><ArrowRight size={18} aria-hidden="true" /></button>)}{!published.length && <p>New work will appear here as projects are published.</p>}</div></> : selected && <>
        <h2 id="museum-dialog-title">{selected.title}</h2><p className="museum-dialog-subtitle">{selected.subtitle}</p>
        {showcase && <ShowcaseWall items={showcase} shot={shot} setShot={setShot} />}
        {selected.image && !showcase && !selected.album && !selected.post && <div className="museum-dialog-image"><img src={selected.image} alt={`${selected.title} exhibit`} /></div>}
        {!(selected.post && reading) && <p className="museum-dialog-description">{selected.description}</p>}
        {selected.chips && selected.chips.length > 0 && <div className="museum-dialog-skills">{selected.chips.map(item => { const CapIcon = selected.capabilityChips ? capabilityMeta[item.toLowerCase()]?.icon ?? Sparkles : undefined; return <span key={item}>{CapIcon ? <CapIcon size={15} strokeWidth={1.8} aria-hidden="true" /> : <ProcessIcon label={item} />}{item}</span>; })}</div>}
        {selected.tools && selected.tools.length > 0 && <div className="museum-dialog-skills museum-dialog-tools">{selected.tools.map(item => { const logo = toolLogoFor(item); return <span key={item}>{logo ? <img className="museum-tool-logo" src={logo.src} alt="" aria-hidden="true" loading="lazy" /> : <ProcessIcon label={item} fallback={Wrench} />}{item}</span>; })}</div>}
        {selected.steps && <ol className="museum-steps">{selected.steps.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{step.title}</strong><p>{step.description}</p></div></li>)}</ol>}
        {selected.timeline && <div className="museum-accordion">{selected.timeline.map((item, index) => <details key={item.title + item.meta} className="museum-accordion-item" open={index === 0}><summary><span><strong>{item.title}</strong><small>{item.meta}</small></span><Plus size={16} aria-hidden="true" /></summary><ul className="museum-process-points">{item.points.map(point => <li key={point}>{point}</li>)}</ul>{item.images && item.images.length > 0 && <div className="museum-experience-photos">{item.images.map(src => <img key={src} src={src} alt="" loading="lazy" decoding="async" />)}</div>}</details>)}</div>}
        {selected.album && selected.album.length > 0 && <ul className="museum-album">{selected.album.map(photo => <li key={photo.image}><img src={photo.image} alt={photo.alt || photo.title} loading="lazy" decoding="async" /><strong>{photo.title}</strong>{photo.note && <small>{photo.note}</small>}</li>)}</ul>}
        {selected.form && <div className="museum-contact-form"><ContactForm email={content.contact.email} /></div>}
        {(selected.post || selected.postIndex) && <ReadingDesk posts={posts} reading={reading} setReading={setReading} index={!!selected.postIndex} />}
        {selected.list && <ul className="museum-process-points">{selected.list.map(point => <li key={point}>{point}</li>)}</ul>}
        {selected.industries && selected.industries.length > 0 && <><p className="museum-dialog-label">Industries I have designed for</p><div className="museum-industry-grid">{selected.industries.map(item => { const Icon = industryMeta[item.toLowerCase()] ?? Sparkles; return <span key={item}><Icon size={15} strokeWidth={1.8} aria-hidden="true" />{item}</span>; })}</div></>}
        {selected.socials && selected.socials.length > 0 && <div className="museum-socials"><Socials items={selected.socials} /></div>}
        {selected.images && selected.images.length > 0 && <div className="museum-secret-photos">{selected.images.map(src => <img key={src} src={src} alt="" />)}</div>}
        {!selected.form && !selected.post && !selected.postIndex && <div className="museum-dialog-actions">{selected.cv && <a className="museum-secondary-action" href={selected.cv.href} download={selected.cv.file} target="_blank" rel="noreferrer">{selected.cv.label}<Download size={16} aria-hidden="true" /></a>}{(selected.secret || showcase) && !selected.href ? <button type="button" className="museum-primary-action" onClick={closeDialog}>{showcase ? "Back to the hall" : selected.action}<ArrowRight size={17} aria-hidden="true" /></button> : selected.external && selected.href ? <a className="museum-primary-action" href={selected.href} target="_blank" rel="noreferrer">{selected.action}<ArrowRight size={17} aria-hidden="true" /></a> : selectedStudy ? <button type="button" className="museum-primary-action" onClick={() => inspectStudy(selectedStudy)}>View case study<ArrowRight size={17} aria-hidden="true" /></button> : selected.href ? <Link className="museum-primary-action" href={selected.href}>{selected.action}<ArrowRight size={17} aria-hidden="true" /></Link> : <Link className="museum-primary-action" href="/about-us">More about my work<ArrowRight size={17} aria-hidden="true" /></Link>}</div>}
      </>}
    </dialog>
    <div ref={studyLayer} className="museum-study-layer"><CaseStudyOverlay cs={study} onClose={() => setStudy(null)} /></div>
    <button type="button" className="museum-reset-view" title="Return to the entrance hall" aria-label="Return to the entrance hall" disabled={!ready} onClick={() => visit("work")}><RotateCcw size={15} /></button>
  </section>, document.body);
}

/** The Reading Room: the article list, or one article fetched and read in place. */
function ReadingDesk({ posts, reading, setReading, index }: { posts: BlogSummary[]; reading: string | null; setReading: (slug: string | null) => void; index: boolean }) {
  const [article, setArticle] = useState<{ slug: string; body: string; url: string; title: string; dateLabel: string } | null>(null);
  const [failed, setFailed] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!reading) return;
    const abort = new AbortController();
    setFailed(false);
    fetch(`/api/blog/${encodeURIComponent(reading)}`, { signal: abort.signal })
      .then(res => res.ok ? res.json() : Promise.reject(new Error(String(res.status))))
      .then(data => { setArticle(data); scroller.current?.scrollTo({ top: 0 }); })
      .catch(cause => { if (cause?.name !== "AbortError") setFailed(true); });
    return () => abort.abort();
  }, [reading]);
  const summary = posts.find(post => post.slug === reading);
  if (!reading) return <ul className="museum-post-list">{posts.map(post => <li key={post.slug}><button type="button" onClick={() => setReading(post.slug)}>
    {post.cover && <img src={post.cover} alt="" loading="lazy" decoding="async" />}
    <span><strong>{post.title}</strong><small>{[post.date && new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }), `${post.readingMinutes} min read`].filter(Boolean).join(" · ")}</small></span>
    <ArrowRight size={17} aria-hidden="true" />
  </button></li>)}{!posts.length && <li className="museum-post-empty">New articles will appear here soon.</li>}</ul>;
  const ready = article?.slug === reading;
  return <div className="museum-article">
    {index && <button type="button" className="museum-article-back" onClick={() => setReading(null)}><ArrowLeft size={16} aria-hidden="true" />All articles</button>}
    {!ready && !failed && <p className="museum-article-status" role="status">Opening the article…</p>}
    {failed && <p className="museum-article-status" role="status">This article could not load here. <Link href={`/blog/${reading}`}>Open it on its own page</Link>.</p>}
    {ready && <>
      {index ? <><p className="museum-article-meta">{article.dateLabel}{summary ? ` · ${summary.readingMinutes} min read` : ""}</p><h3>{article.title}</h3></> : summary && <p className="museum-article-meta">{summary.readingMinutes} min read</p>}
      <div ref={scroller} className="museum-article-body blog-prose" dangerouslySetInnerHTML={{ __html: article.body }} />
    </>}
    <div className="museum-dialog-actions">
      <Link className="museum-primary-action" href={`/blog/${reading}`}>Open the full page<ArrowRight size={17} aria-hidden="true" /></Link>
      {ready && article.url && <a href={article.url} target="_blank" rel="noreferrer">Read on Substack</a>}
    </div>
  </div>;
}

/** A wall of portfolio shots: thumbnails in a grid, one shot opened full size
 * (landing pages scroll their full length) with previous and next. */
function ShowcaseWall({ items, shot, setShot }: { items: ShowcaseItem[]; shot: number | null; setShot: (index: number | null) => void }) {
  const viewer = useRef<HTMLDivElement>(null);
  useEffect(() => { viewer.current?.scrollTo({ top: 0 }); viewer.current?.focus({ preventScroll: true }); }, [shot]);
  if (shot === null) return <ul className="museum-showcase-grid">{items.map((item, index) => <li key={item.src}>
    <button type="button" onClick={() => setShot(index)} aria-label={`Open ${item.title}, ${item.subtitle}`}>
      <img src={item.thumb} alt="" decoding="async" />
      <span><strong>{item.title}</strong><small>{item.subtitle}</small></span>
    </button>
  </li>)}</ul>;
  const item = items[shot], step = (delta: number) => setShot((shot + delta + items.length) % items.length);
  return <div className="museum-showcase-view">
    <div className="museum-showcase-bar">
      <button type="button" onClick={() => setShot(null)}><ArrowLeft size={16} aria-hidden="true" />All work</button>
      <span aria-live="polite"><strong>{item.title}</strong> · {item.subtitle} <small>{shot + 1} / {items.length}</small></span>
      <span className="museum-showcase-steps">
        <button type="button" aria-label="Previous" onClick={() => step(-1)}><ChevronLeft size={18} /></button>
        <button type="button" aria-label="Next" onClick={() => step(1)}><ChevronRight size={18} /></button>
      </span>
    </div>
    <div className="museum-showcase-frame" ref={viewer} tabIndex={0} onKeyDown={event => { if (event.key === "ArrowRight") step(1); if (event.key === "ArrowLeft") step(-1); }}>
      <img src={item.src} alt={`${item.title}, ${item.subtitle}`} />
    </div>
  </div>;
}
