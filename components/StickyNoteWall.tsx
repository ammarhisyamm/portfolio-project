"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Plus, X } from "lucide-react";
import type { VisitorNote } from "@/lib/notes";

const COLORS: Record<string, { bg: string; ink: string; line: string; accent: string }> = {
  cream: { bg: "#f2e8d5", ink: "#4a4033", line: "#dfd0b3", accent: "#c9b188" },
  yellow: { bg: "#f1e4bb", ink: "#4d4326", line: "#ddca8c", accent: "#cbb472" },
  coral: { bg: "#eabaa8", ink: "#4a2f26", line: "#d69b84", accent: "#c07f64" },
  blue: { bg: "#dae0e9", ink: "#2b3542", line: "#b8c3d3", accent: "#93a3b8" },
  sage: { bg: "#e0e7d6", ink: "#333d2c", line: "#c0ccb3", accent: "#9db08a" },
  lavender: { bg: "#ddd6e7", ink: "#3a3346", line: "#c0b4d2", accent: "#9c8db8" },
  charcoal: { bg: "#3b3b39", ink: "#f2ede2", line: "#2d2d2b", accent: "#c8b88e" },
};

const PICKER_KEYS = ["cream", "yellow", "coral", "lavender", "charcoal"] as const;

function shortDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function postDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function pcColor(color: string) {
  return COLORS[color] ?? COLORS.cream;
}

function FrontArt({ color }: { color: string }) {
  const c = pcColor(color);
  return (
    <svg viewBox="0 0 200 120" className="h-full w-full" aria-hidden="true">
      <circle cx="150" cy="30" r="46" fill={c.accent} opacity="0.5" />
      <path d="M150 10 a20 20 0 0 1 20 20" fill="none" stroke={c.ink} strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" />
      <circle cx="150" cy="30" r="7" fill={c.ink} opacity="0.7" />
      <circle cx="40" cy="92" r="16" fill="none" stroke={c.ink} strokeOpacity="0.5" strokeWidth="1.5" />
      <path d="M20 22 Q 60 62 110 32 T 185 48" fill="none" stroke={c.ink} strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function Stamp({ color }: { color: string }) {
  const c = pcColor(color);
  return (
    <svg viewBox="0 0 52 64" className="h-14 w-11 shrink-0" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <circle key={i} cx={7 + i * 8.5} cy="4" r="1.6" fill={c.ink} opacity="0.7" />
      ))}
      <rect x="1" y="8" width="50" height="55" rx="2" fill={c.bg} stroke={c.ink} strokeWidth="1.5" />
      <circle cx="26" cy="30" r="11" fill="none" stroke={c.ink} strokeWidth="1.5" opacity="0.8" />
      <path d="M20 34 l6 -9 l6 9 z" fill={c.ink} opacity="0.85" />
      <text x="26" y="53" textAnchor="middle" fontSize="6.5" letterSpacing="1" fill={c.ink} opacity="0.85" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
        HISYAM
      </text>
    </svg>
  );
}

function Postmark({ color }: { color: string }) {
  const c = pcColor(color);
  return (
    <svg viewBox="0 0 110 110" className="h-16 w-16" aria-hidden="true">
      <circle cx="55" cy="55" r="42" fill="none" stroke={c.ink} strokeWidth="1.2" opacity="0.5" />
      <circle cx="55" cy="55" r="36" fill="none" stroke={c.ink} strokeWidth="1" opacity="0.4" />
      <path d="M30 42 Q 55 36 80 42" fill="none" stroke={c.ink} strokeWidth="1" opacity="0.45" />
      <path d="M30 68 Q 55 74 80 68" fill="none" stroke={c.ink} strokeWidth="1" opacity="0.45" />
      <text x="55" y="59" textAnchor="middle" fontSize="9" letterSpacing="1" fill={c.ink} opacity="0.6" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
        H·D
      </text>
    </svg>
  );
}

function FrontFace({ note, mini }: { note: VisitorNote; mini?: boolean }) {
  const c = pcColor(note.color);
  return (
    <div className="pc-face rounded-[14px]" style={{ background: c.bg, color: c.ink }}>
      <div className="pc-grain" />
      <div className="relative flex h-full flex-col justify-between p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="h-20 w-28 sm:h-24 sm:w-32">
            <FrontArt color={note.color} />
          </div>
          {!mini && <Stamp color={note.color} />}
        </div>
        {!mini && (
          <div className="flex items-end justify-between gap-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] opacity-70">HISYAM · DESIGN</span>
            <span className="font-mono text-[8.5px] uppercase tracking-[0.1em] opacity-55">Jakarta, Indonesia</span>
          </div>
        )}
      </div>
      {!mini && (
        <div className="pointer-events-none absolute right-6 top-5 -rotate-[10deg] opacity-70">
          <Postmark color={note.color} />
        </div>
      )}
      <div className="pc-perf" style={{ color: c.ink }} />
    </div>
  );
}

function BackFace({ note }: { note: VisitorNote }) {
  const c = pcColor(note.color);
  const site = note.website ? note.website.replace(/^https?:\/\//, "").replace(/\/$/, "") : "";
  return (
    <div className="pc-face pc-back rounded-[14px]" style={{ background: c.bg, color: c.ink }}>
      <div className="pc-grain" />
      <div className="relative flex h-full flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] opacity-60">HISYAM · DESIGN</span>
          {note.created_at && (
            <span className="font-mono text-[8.5px] uppercase tracking-[0.08em] opacity-55">{postDate(note.created_at)}</span>
          )}
        </div>
        <p className="mt-3 flex-1 text-[15px] leading-[1.6] sm:text-[16px]">{note.message}</p>
        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-[13px] font-medium tracking-[-0.01em]">— {note.name}</div>
            {site && <div className="mt-0.5 truncate font-mono text-[8.5px] uppercase tracking-[0.08em] opacity-55">via {site}</div>}
          </div>
          <div className="text-right font-mono text-[8.5px] uppercase leading-[1.6] tracking-[0.08em] opacity-55">
            To: H · Jakarta
            <br />
            ID · 10110
          </div>
        </div>
      </div>
      <div className="pc-perf" style={{ color: c.ink }} />
    </div>
  );
}

function FeaturedPostcard({
  note,
  index,
  total,
  flipped,
  onFlip,
  onPrev,
  onNext,
}: {
  note: VisitorNote;
  index: number;
  total: number;
  flipped: boolean;
  onFlip: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
          Postcard {index + 1} / {total}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            disabled={total <= 1}
            aria-label="Previous postcard"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-line text-sub transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft size={15} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={total <= 1}
            aria-label="Next postcard"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-line text-sub transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="pc-scene relative mt-4">
        <button
          type="button"
          onClick={onFlip}
          aria-pressed={flipped}
          aria-label={`Postcard from ${note.name}, ${flipped ? "back" : "front"} — tap to flip`}
          className="pc-btn group block w-full cursor-pointer rotate-[0.6deg] rounded-[18px] outline-none transition-transform duration-300 hover:-translate-y-1 hover:rotate-[0.15deg] focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-4"
        >
          <div className={`pc-inner ${flipped ? "pc-flipped" : ""}`} style={{ aspectRatio: "1.45 / 1" }}>
            <FrontFace note={note} />
            <BackFace note={note} />
          </div>
        </button>
        <span className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-ink/85 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.08em] text-white opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100">
          {flipped ? "See front" : "Flip postcard"}
        </span>
      </div>
    </div>
  );
}

export default function StickyNoteWall({ notes: initial }: { notes: VisitorNote[] }) {
  const [notes, setNotes] = useState<VisitorNote[]>(initial);
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [color, setColor] = useState<string>("coral");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const composerRef = useRef<HTMLDivElement>(null);

  const count = notes.length;
  const featured = notes[Math.min(featuredIdx, Math.max(count - 1, 0))];
  const thumbnails = notes.slice(0, 3);

  const goTo = useCallback((i: number) => {
    setFeaturedIdx(i);
    setFlipped(false);
  }, []);

  const next = useCallback(() => {
    if (count === 0) return;
    goTo((featuredIdx + 1) % count);
  }, [count, featuredIdx, goTo]);
  const prev = useCallback(() => {
    if (count === 0) return;
    goTo((featuredIdx - 1 + count) % count);
  }, [count, featuredIdx, goTo]);

  useEffect(() => {
    if (!composerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setComposerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [composerOpen]);

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
        body: JSON.stringify({
          message: message.trim(),
          name: name.trim(),
          color,
          website: website.trim(),
          company: "",
        }),
      });
      const d = await res.json();
      if (!res.ok || d.error) throw new Error(d.error ?? "Something went wrong");
      if (d.note) {
        setNotes((p) => [d.note as VisitorNote, ...p]);
        setFeaturedIdx(0);
        setFlipped(false);
        setSent(true);
        window.setTimeout(() => setSent(false), 5000);
      }
      setComposerOpen(false);
      setMessage("");
      setName("");
      setWebsite("");
      setColor("coral");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setPosting(false);
    }
  }

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
              <h2 className="mt-4 text-[clamp(40px,4.5vw,56px)] font-[720] leading-[1.05] tracking-[-0.05em]">
                Postcards from visitors.
              </h2>
              <p className="mt-5 max-w-[380px] text-[15px] leading-[1.7] text-sub">
                A few kind words from people who stopped by.
              </p>

              <div className="mt-8 flex flex-col items-start gap-4">
                <button type="button" onClick={openComposer} className="btn btn-primary">
                  <Plus size={15} aria-hidden="true" />
                  Send a postcard
                </button>
                <AnimatePresence>
                  {sent && (
                    <motion.span
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-accent-ink"
                    >
                      <Check size={13} aria-hidden="true" />
                      Postcard sent — thank you.
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
                {count} postcards have arrived.
              </p>
            </div>

            <div className="min-w-0">
              {featured && (
                <FeaturedPostcard
                  note={featured}
                  index={featuredIdx}
                  total={count}
                  flipped={flipped}
                  onFlip={() => setFlipped((f) => !f)}
                  onPrev={prev}
                  onNext={next}
                />
              )}

              {thumbnails.length > 0 && (
                <div className="mt-5 flex items-center gap-2.5">
                  {thumbnails.map((n) => {
                    const c = pcColor(n.color);
                    const active = n.id === featured?.id;
                    return (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => goTo(notes.indexOf(n))}
                        aria-label={`Show postcard from ${n.name}`}
                        aria-pressed={active}
                        className={`relative block w-[76px] cursor-pointer overflow-hidden rounded-[8px] border transition-all duration-300 hover:-translate-y-0.5 sm:w-[84px] ${
                          active ? "border-ink" : "border-line opacity-55 hover:opacity-100"
                        }`}
                        style={{ aspectRatio: "1.45 / 1" }}
                      >
                        <FrontFace note={n} mini />
                      </button>
                    );
                  })}
                </div>
              )}

              {count === 0 && (
                <p className="mt-4 text-sm text-sub">No postcards yet — be the first to send one.</p>
              )}
            </div>
          </div>
        </motion.div>
      </section>

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
              ref={composerRef}
              role="dialog"
              aria-modal="true"
              aria-label="Send a postcard"
              className="note-modal"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-[17px] font-medium tracking-[-0.02em]">Send a postcard</h3>
                  <p className="mt-0.5 text-[12.5px] text-sub">Short and sweet — it goes on the wall.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setComposerOpen(false)}
                  aria-label="Close"
                  className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border border-line text-sub transition-colors hover:text-ink"
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
                  <span className="kicker">Pick your paper</span>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {PICKER_KEYS.map((k) => {
                      const c = COLORS[k];
                      const active = color === k;
                      return (
                        <button
                          key={k}
                          type="button"
                          onClick={() => setColor(k)}
                          aria-label={`${k} postcard`}
                          aria-pressed={active}
                          className={`grid h-8 w-8 cursor-pointer place-items-center rounded-full border transition-transform hover:scale-110 ${
                            active ? "ring-2 ring-ink ring-offset-2 ring-offset-panel" : ""
                          }`}
                          style={{ background: c.bg, borderColor: c.line }}
                        >
                          {active && (
                            <span className="grid h-3.5 w-3.5 place-items-center rounded-full" style={{ background: c.ink }} />
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

                <label className="grid gap-1.5">
                  <span className="kicker">Website or social (optional)</span>
                  <input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    maxLength={120}
                    placeholder="https://…"
                    className="field"
                  />
                </label>

                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value=""
                  onChange={() => {}}
                  className="hidden"
                />

                {error && <p className="text-[12.5px] text-red-500">{error}</p>}

                <button
                  type="button"
                  onClick={submit}
                  disabled={posting || !message.trim()}
                  className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {posting ? "Sending…" : "Send it →"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}