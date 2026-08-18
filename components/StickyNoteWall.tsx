"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Pin, Plus, X } from "lucide-react";
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

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h / 4294967296;
}

function place(id: string) {
  const h1 = hashStr(id + "::x");
  const h2 = hashStr(id + "::y");
  const h3 = hashStr(id + "::r");
  const h4 = hashStr(id + "::s");
  return {
    left: `${4 + h1 * 60}%`,
    top: `${4 + h2 * 52}%`,
    rot: (h3 - 0.5) * 12,
    scale: 0.88 + h4 * 0.22,
  };
}

function shortDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function NotePaper({ note }: { note: VisitorNote }) {
  const c = COLORS[note.color] ?? COLORS.cream;
  const isDark = note.color === "ink";
  return (
    <div
      className="relative h-full w-full rounded-[14px] border p-4 shadow-soft transition-shadow duration-300 hover:shadow-[0_18px_44px_-14px_rgba(22,22,22,0.25)]"
      style={{ background: c.bg, borderColor: c.border, color: c.text }}
    >
      <span
        aria-hidden="true"
        className="absolute -top-2.5 left-1/2 h-3.5 w-9 -translate-x-1/2 rotate-2 bg-white/55"
        style={{ clipPath: "polygon(4% 0, 96% 8%, 100% 100%, 0 94%)" }}
      />
      <p className="text-[13.5px] leading-relaxed">{note.message}</p>
      <div className="mt-3.5 flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.06em] opacity-70">
          — {note.name}
        </span>
        {note.created_at && (
          <span className="font-mono text-[9px] tracking-[0.04em] opacity-45">
            {shortDate(note.created_at)}
          </span>
        )}
      </div>
      {isDark && (
        <span
          aria-hidden="true"
          className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full border border-white/15 text-white/70"
        >
          <Pin size={11} />
        </span>
      )}
    </div>
  );
}

export default function StickyNoteWall({ notes: initial }: { notes: VisitorNote[] }) {
  const [notes, setNotes] = useState<VisitorNote[]>(initial);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [color, setColor] = useState<string>("yellow");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [pinned, setPinned] = useState(false);

  function clearFeedback() {
    setError("");
    setPinned(false);
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
        setNotes((prev) => [d.note as VisitorNote, ...prev]);
        setPinned(true);
        window.setTimeout(() => setPinned(false), 4000);
      }
      setOpen(false);
      setMessage("");
      setName("");
      setColor("yellow");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setPosting(false);
    }
  }

  return (
    <section className="panel p-5 sm:p-8">
      <span className="kicker">Guestbook</span>
      <h2 className="mt-3 text-[clamp(28px,3.6vw,44px)] font-normal leading-[1.05] tracking-[-0.05em]">
        Leave Something Behind.
      </h2>
      <p className="mt-3 max-w-[560px] text-[15px] leading-relaxed text-sub">
        You made it this far. Leave me a thought, idea, feedback, or just say hi.
      </p>

      <div className="mt-8 overflow-hidden rounded-[14px] border border-line bg-bg shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_0_60px_rgba(22,22,22,0.03)]">
        <div className="note-wall relative hidden h-[560px] md:block">
          {notes.map((n, i) => {
            const pos = place(n.id);
            return (
              <motion.div
                key={n.id}
                className="absolute"
                style={{ left: pos.left, top: pos.top, width: 150, zIndex: n.color === "ink" ? 40 : 10 + (i % 5) }}
                initial={{ opacity: 0, y: -46, rotate: pos.rot * 1.5, scale: 0.6 }}
                animate={{ opacity: 1, y: 0, rotate: pos.rot, scale: pos.scale }}
                transition={{ type: "spring", stiffness: 240, damping: 20, delay: Math.min(i * 0.04, 0.5) }}
                whileHover={{ y: -5, rotate: pos.rot + 2.5, scale: pos.scale + 0.02 }}
              >
                <NotePaper note={n} />
              </motion.div>
            );
          })}
        </div>

        <div className="note-wall flex flex-col items-center gap-5 px-4 py-9 md:hidden">
          {notes.slice(0, 12).map((n, i) => (
            <motion.div
              key={n.id}
              className={`w-[88%] ${i % 2 ? "translate-x-4" : "-translate-x-4"}`}
              style={{ rotate: i % 2 ? 1.4 : -1.4, zIndex: 10 + (i % 5) }}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 240, damping: 22, delay: Math.min(i * 0.04, 0.5) }}
            >
              <NotePaper note={n} />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-7 flex flex-col items-center gap-3.5 text-center">
        <button type="button" onClick={() => setOpen(true)} className="btn btn-primary">
          <Plus size={15} aria-hidden="true" />
          Leave a note
        </button>

        <AnimatePresence>
          {pinned && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-accent-ink"
            >
              <Check size={13} aria-hidden="true" />
              Pinned. Thanks for stopping by.
            </motion.p>
          )}
        </AnimatePresence>

        <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
          {notes.length} people have left something behind.
        </p>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="note-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
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
                  onClick={() => setOpen(false)}
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
                    autoFocus
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
                          onClick={() => {
                            setColor(k);
                            clearFeedback();
                          }}
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
    </section>
  );
}
