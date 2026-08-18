"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Plus, X } from "lucide-react";
import type { VisitorNote } from "@/lib/notes";

const COLORS: Record<string, { bg: string; border: string; text: string }> = {
  cream: { bg: "#f6f1e3", border: "#e4d9bb", text: "#3a3423" },
  yellow: { bg: "#f7ecc4", border: "#e4d48f", text: "#3d3620" },
  pink: { bg: "#f3deda", border: "#e0bdb6", text: "#43241f" },
  blue: { bg: "#dde7f2", border: "#b9cee3", text: "#20303f" },
  sage: { bg: "#dfe8dc", border: "#bfd1ba", text: "#23331f" },
  lavender: { bg: "#e6e0ef", border: "#cdc1e0", text: "#2e2740" },
  ink: { bg: "#161616", border: "#000000", text: "#ffffff" },
};

const COLOR_KEYS = ["cream", "yellow", "pink", "blue", "sage", "lavender"] as const;

function shortDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function NotePaper({ note, large }: { note: VisitorNote; large?: boolean }) {
  const c = COLORS[note.color] ?? COLORS.cream;
  const isDark = note.color === "ink";
  return (
    <div
      className={`relative flex h-full w-full flex-col rounded-[14px] border p-4 shadow-soft transition-shadow duration-300 group-hover:shadow-[0_16px_36px_-16px_rgba(22,22,22,0.2)] ${
        large ? "p-5 sm:p-6" : ""
      }`}
      style={{ background: c.bg, borderColor: c.border, color: c.text }}
    >
      <span
        aria-hidden="true"
        className={`absolute -top-2.5 left-1/2 h-3 w-8 -translate-x-1/2 rotate-2 ${isDark ? "bg-white/20" : "bg-white/55"}`}
        style={{ clipPath: "polygon(4% 0, 96% 8%, 100% 100%, 0 94%)" }}
      />
      <p
        className={`leading-relaxed ${large ? "text-[15px] sm:text-[16px]" : "text-[13px] line-clamp-5"}`}
      >
        {note.message}
      </p>
      <div className={`mt-auto flex items-center justify-between gap-2 ${large ? "pt-6" : "pt-3"}`}>
        <span className="font-mono text-[10px] uppercase tracking-[0.06em] opacity-70">
          — {note.name}
        </span>
        {note.created_at && (
          <span className="font-mono text-[9px] tracking-[0.04em] opacity-45">
            {shortDate(note.created_at)}
          </span>
        )}
      </div>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-2 bottom-2 flex justify-center opacity-0 transition-all duration-300 group-hover:opacity-100"
      >
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.08em] ${
            isDark ? "bg-white/90 text-ink" : "bg-ink/85 text-white"
          }`}
        >
          Read note <ArrowRight size={10} aria-hidden="true" />
        </span>
      </span>
    </div>
  );
}

function NoteButton({
  note,
  onClick,
  rot,
}: {
  note: VisitorNote;
  onClick: () => void;
  rot: number;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={`Read note from ${note.name}`}
      className="group block w-full cursor-pointer text-left"
      initial={{ opacity: 0, y: 16, rotate: rot * 1.6 }}
      whileInView={{ opacity: 1, y: 0, rotate: rot }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -4, rotate: rot * 0.25, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <NotePaper note={note} />
    </motion.button>
  );
}

function DragNote({
  note,
  rot,
  onClick,
  className,
  base,
  drags,
  onDrag,
  suppressRef,
}: {
  note: VisitorNote;
  rot: number;
  onClick: () => void;
  className?: string;
  base?: string;
  drags: Record<string, { x: number; y: number }>;
  onDrag: (id: string, pos: { x: number; y: number }) => void;
  suppressRef: { current: boolean };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const moveRef = useRef<{
    startX: number;
    startY: number;
    rect: DOMRect;
    parent: DOMRect;
    moved: boolean;
  } | null>(null);
  const [active, setActive] = useState(false);
  const d = drags[note.id];

  function onWinMove(e: PointerEvent) {
    const m = moveRef.current;
    if (!m) return;
    let dx = e.clientX - m.startX;
    let dy = e.clientY - m.startY;
    if (!m.moved) {
      if (Math.hypot(dx, dy) < 6) return;
      m.moved = true;
    }
    const minX = m.parent.left + 8 - m.rect.left;
    const maxX = m.parent.right - m.rect.right - 8;
    const minY = m.parent.top + 8 - m.rect.top;
    const maxY = m.parent.bottom - m.rect.bottom - 8;
    dx = Math.min(Math.max(dx, minX), maxX);
    dy = Math.min(Math.max(dy, minY), maxY);
    onDrag(note.id, { x: dx, y: dy });
  }

  function onWinUp(e: PointerEvent) {
    const m = moveRef.current;
    if (m && m.moved) {
      suppressRef.current = true;
    }
    moveRef.current = null;
    setActive(false);
    window.removeEventListener("pointermove", onWinMove);
    window.removeEventListener("pointerup", onWinUp);
    window.removeEventListener("pointercancel", onWinUp);
  }

  return (
    <div
      ref={ref}
      onPointerDown={(e) => {
        const el = ref.current;
        if (!el) return;
        suppressRef.current = false;
        moveRef.current = {
          startX: e.clientX,
          startY: e.clientY,
          rect: el.getBoundingClientRect(),
          parent: el.parentElement!.getBoundingClientRect(),
          moved: false,
        };
        setActive(true);
        window.addEventListener("pointermove", onWinMove);
        window.addEventListener("pointerup", onWinUp);
        window.addEventListener("pointercancel", onWinUp);
      }}
      className={`absolute touch-none select-none ${className ?? ""} ${active ? "z-30 cursor-grabbing" : ""}`}
      style={{
        transform: `${base ?? ""} translate(${d?.x ?? 0}px, ${d?.y ?? 0}px)`,
        transition: active ? "none" : "transform 0.2s ease",
      }}
    >
      <NoteButton
        note={note}
        onClick={() => {
          if (suppressRef.current) {
            suppressRef.current = false;
            return;
          }
          onClick();
        }}
        rot={rot}
      />
    </div>
  );
}

export default function StickyNoteWall({ notes: initial }: { notes: VisitorNote[] }) {
  const [notes, setNotes] = useState<VisitorNote[]>(initial);
  const [composerOpen, setComposerOpen] = useState(false);
  const [readerIndex, setReaderIndex] = useState<number | null>(null);
  const [carIndex, setCarIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [color, setColor] = useState<string>("yellow");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [pinned, setPinned] = useState(false);
  const [drags, setDrags] = useState<Record<string, { x: number; y: number }>>({});
  const carouselRef = useRef<HTMLDivElement>(null);
  const closeReaderRef = useRef<HTMLButtonElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const suppressClick = useRef(false);

  const featured = notes.find((n) => n.color !== "ink") ?? notes[0];
  const inkNote = notes.find((n) => n.color === "ink");
  const secondaries = [
    inkNote,
    ...notes.filter((n) => n.id !== featured?.id && n.id !== inkNote?.id).slice(0, 2),
  ].filter(Boolean) as VisitorNote[];
  const count = notes.length;

  const next = useCallback(() => {
    setReaderIndex((i) => (i === null ? null : (i + 1) % Math.max(notes.length, 1)));
  }, [notes.length]);
  const prev = useCallback(() => {
    setReaderIndex((i) =>
      i === null ? null : (i - 1 + Math.max(notes.length, 1)) % Math.max(notes.length, 1)
    );
  }, [notes.length]);

  useEffect(() => {
    const modalOpen = composerOpen || readerIndex !== null;
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setComposerOpen(false);
        setReaderIndex(null);
      }
      if (readerIndex !== null) {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          next();
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          prev();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [composerOpen, readerIndex, next, prev]);

  useEffect(() => {
    if (readerIndex !== null) closeReaderRef.current?.focus();
  }, [readerIndex]);

  function onCarouselScroll() {
    const el = carouselRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 16 : el.clientWidth;
    setCarIndex(Math.max(0, Math.min(notes.length - 1, Math.round(el.scrollLeft / step))));
  }

  function openComposer() {
    setError("");
    setComposerOpen(true);
    window.setTimeout(() => composerRef.current?.querySelector("textarea")?.focus(), 60);
  }

  async function submit() {
    if (posting || !message.trim()) return;
    setPosting(true);
    setError("");
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim(), name: name.trim(), color }),
      });
      const d = await res.json();
      if (!res.ok || d.error) throw new Error(d.error ?? "Something went wrong");
      if (d.note) {
        setNotes((p) => [d.note as VisitorNote, ...p]);
        setPinned(true);
        window.setTimeout(() => setPinned(false), 4000);
      }
      setComposerOpen(false);
      setMessage("");
      setName("");
      setColor("yellow");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setPosting(false);
    }
  }

  function handleDrag(id: string, pos: { x: number; y: number }) {
    setDrags((p) => ({ ...p, [id]: pos }));
  }

  const secondaryLayout = [
    "left-4 top-8 w-36 z-10",
    "right-4 top-20 w-36 z-10",
    "bottom-8 left-16 w-36 z-10",
  ];

  return (
    <MotionConfig reducedMotion="user">
      <section className="mx-auto w-full max-w-[720px] px-4 sm:px-6 lg:px-8" aria-label="Guestbook">
        <motion.div
          className="panel px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-12">
            <div className="min-w-0">
              <span className="kicker">Guestbook</span>
              <h2 className="mt-4 text-[clamp(40px,4.5vw,56px)] font-normal leading-[1.05] tracking-[-0.05em]">
                Leave Something Behind.
              </h2>
              <p className="mt-5 max-w-[380px] text-[15px] leading-[1.7] text-sub">
                You made it this far. Leave me a thought, idea, feedback, or just say hi.
              </p>

              <div className="mt-8 hidden items-center gap-4 lg:flex">
                <button type="button" onClick={openComposer} className="btn btn-primary">
                  <Plus size={15} aria-hidden="true" />
                  Leave a note
                </button>
                <AnimatePresence>
                  {pinned && (
                    <motion.span
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-accent-ink"
                    >
                      <Check size={13} aria-hidden="true" />
                      Pinned. Thanks for stopping by.
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <p className="mt-5 hidden font-mono text-[11px] uppercase tracking-[0.06em] text-muted lg:block">
                {count} people have left something behind.
              </p>
            </div>

            <div className="min-w-0">
              {/* Desktop / tablet stage */}
              {featured && (
                <div className="note-wall relative hidden h-[360px] overflow-hidden rounded-[16px] border border-line lg:block">
                  {featured && (
                    <DragNote
                      note={featured}
                      onClick={() => setReaderIndex(notes.indexOf(featured))}
                      rot={-1.5}
                      className="left-1/2 top-1/2 z-20 w-44"
                      base="translate(-50%, -50%)"
                      drags={drags}
                      onDrag={handleDrag}
                      suppressRef={suppressClick}
                    />
                  )}
                  {secondaries.map((n, i) => (
                    <DragNote
                      key={n.id}
                      note={n}
                      onClick={() => setReaderIndex(notes.indexOf(n))}
                      rot={[-2.5, 2, -1][i % 3]}
                      className={secondaryLayout[i % secondaryLayout.length]}
                      drags={drags}
                      onDrag={handleDrag}
                      suppressRef={suppressClick}
                    />
                  ))}
                </div>
              )}

              {/* Mobile / tablet carousel */}
              <div className="lg:hidden">
                <div
                  ref={carouselRef}
                  onScroll={onCarouselScroll}
                  className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-2"
                >
                  {notes.length > 0 ? (
                    notes.map((n) => (
                      <div key={n.id} data-card className="w-[76%] shrink-0 snap-center">
                        <NoteButton note={n} onClick={() => setReaderIndex(notes.indexOf(n))} rot={-1} />
                      </div>
                    ))
                  ) : (
                    <p className="px-2 py-8 text-sm text-sub">No notes yet — be the first to leave one.</p>
                  )}
                </div>

                {notes.length > 0 && (
                  <div className="mt-3 flex items-center justify-center gap-1 font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
                    {carIndex + 1} / {notes.length}
                  </div>
                )}

                <div className="mt-5 flex flex-col items-center gap-3">
                  <button type="button" onClick={openComposer} className="btn btn-primary">
                    <Plus size={15} aria-hidden="true" />
                    Leave a note
                  </button>
                  <AnimatePresence>
                    {pinned && (
                      <motion.span
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-accent-ink"
                      >
                        <Check size={13} aria-hidden="true" />
                        Pinned. Thanks for stopping by.
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
                    {count} people have left something behind.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Reader modal */}
      <AnimatePresence>
        {readerIndex !== null && notes[readerIndex] && (
          <motion.div
            className="note-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setReaderIndex(null)}
          >
            <motion.div
              ref={composerRef}
              role="dialog"
              aria-modal="true"
              aria-label={`Note from ${notes[readerIndex].name}`}
              className="note-modal"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
                  Note {readerIndex + 1} of {notes.length}
                </span>
                <button
                  ref={closeReaderRef}
                  type="button"
                  onClick={() => setReaderIndex(null)}
                  aria-label="Close note"
                  className="grid h-9 w-9 place-items-center rounded-full border border-line text-sub transition-colors hover:text-ink"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-4">
                <NotePaper note={notes[readerIndex]} large />
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={prev}
                  disabled={notes.length <= 1}
                  aria-label="Previous note"
                  className="btn btn-secondary px-4 disabled:opacity-40"
                >
                  <ArrowLeft size={14} aria-hidden="true" />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={next}
                  disabled={notes.length <= 1}
                  aria-label="Next note"
                  className="btn btn-secondary px-4 disabled:opacity-40"
                >
                  Next
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Composer modal */}
      <AnimatePresence>
        {composerOpen && (
          <motion.div
            className="note-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setComposerOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Leave a note"
              className="note-modal"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-[17px] font-medium tracking-[-0.02em]">Leave something behind</h3>
                  <p className="mt-0.5 text-[12.5px] text-sub">Short and sweet — it goes straight on the wall.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setComposerOpen(false)}
                  aria-label="Close"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-sub transition-colors hover:text-ink"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-5 grid gap-4">
                <label className="grid gap-1.5">
                  <span className="kicker">What&rsquo;s on your mind?</span>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    maxLength={240}
                    placeholder="Write something…"
                    className="field resize-none"
                  />
                </label>

                <div className="grid gap-2">
                  <span className="kicker">Pick your mood</span>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {COLOR_KEYS.map((k) => {
                      const c = COLORS[k];
                      const active = color === k;
                      return (
                        <button
                          key={k}
                          type="button"
                          onClick={() => setColor(k)}
                          aria-label={`${k} note`}
                          aria-pressed={active}
                          className={`grid h-8 w-8 place-items-center rounded-full border transition-transform hover:scale-110 ${
                            active ? "ring-2 ring-ink ring-offset-2 ring-offset-panel" : ""
                          }`}
                          style={{ background: c.bg, borderColor: c.border }}
                        >
                          {active && (
                            <span className="grid h-3.5 w-3.5 place-items-center rounded-full" style={{ background: c.text }} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="grid gap-1.5">
                  <span className="kicker">Your name</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={40}
                    placeholder="Anonymous"
                    className="field"
                  />
                </label>

                {error && <p className="text-[12.5px] text-red-500">{error}</p>}

                <button
                  type="button"
                  onClick={submit}
                  disabled={posting || !message.trim()}
                  className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {posting ? "Pinning…" : "Pin it →"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}