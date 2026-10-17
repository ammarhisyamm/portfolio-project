"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LayoutGroup, MotionConfig, motion } from "motion/react";
import { Shuffle, Sparkles } from "lucide-react";
import type { CaseStudyNoteGroup } from "@/lib/content";
import { reducedMotion } from "@/lib/utils";

const COLORS: Record<string, { bg: string; ink: string }> = {
  yellow: { bg: "#f1e4bb", ink: "#4d4326" },
  coral: { bg: "#eabaa8", ink: "#4a2f26" },
  blue: { bg: "#dae0e9", ink: "#2b3542" },
  sage: { bg: "#e0e7d6", ink: "#333d2c" },
  lavender: { bg: "#ddd6e7", ink: "#3a3346" },
  cream: { bg: "#f2e8d5", ink: "#4a4033" },
};

type Note = { id: string; text: string; color: string; group: number; tilt: number };

/**
 * A research wall: the notes arrive as a loose pile, then cluster into themes
 * (an affinity map). The board sorts itself the first time it scrolls into
 * view, and the toggle lets people replay it.
 */
export default function AffinityBoard({ groups }: { groups: CaseStudyNoteGroup[] }) {
  const [clustered, setClustered] = useState(false);
  const played = useRef(false);
  const root = useRef<HTMLDivElement>(null);

  const notes = useMemo(() => {
    const all: Note[] = groups.flatMap((g, gi) =>
      g.notes.map((text, ni) => ({ id: `${gi}-${ni}`, text, color: g.color, group: gi, tilt: (((gi * 7 + ni * 13) % 9) - 4) * 0.9 }))
    );
    // A stable interleave so the raw pile mixes themes the same way on server and client.
    return all.map((n, i) => ({ n, k: (i * 37) % all.length })).sort((a, b) => a.k - b.k).map(({ n }) => n);
  }, [groups]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (reducedMotion()) {
      setClustered(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !played.current) {
        played.current = true;
        window.setTimeout(() => setClustered(true), 1100);
      }
    }, { threshold: 0.45 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const sticky = (note: Note) => {
    const c = COLORS[note.color] ?? COLORS.cream;
    return (
      <motion.div
        layoutId={`note-${note.id}`}
        layout="position"
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="font-hand rounded-[3px] px-3 py-2.5 text-[17px] leading-[1.15] shadow-[0_6px_12px_-8px_rgba(0,0,0,.45)]"
        style={{ background: c.bg, color: c.ink, rotate: clustered ? note.tilt * 0.35 : note.tilt }}
      >
        {note.text}
      </motion.div>
    );
  };

  return (
    <MotionConfig reducedMotion="user">
      <div ref={root} className="grid gap-4 rounded-[14px] border border-line bg-[#f7f5f1] p-3 sm:rounded-[18px] sm:p-5" style={{ backgroundImage: "radial-gradient(#e4dfd6 1px, transparent 1px)", backgroundSize: "16px 16px" }}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] uppercase tracking-[0.06em] text-muted">{clustered ? `${groups.length} themes` : `${notes.length} raw notes`}</span>
          <button
            type="button"
            onClick={() => setClustered((c) => !c)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#e3ded5] bg-panel px-3.5 py-1.5 text-[12px] text-ink transition-colors hover:bg-bg"
          >
            {clustered ? <Shuffle size={13} aria-hidden="true" /> : <Sparkles size={13} aria-hidden="true" />}
            {clustered ? "Show the raw notes" : "Cluster into themes"}
          </button>
        </div>
        <LayoutGroup>
          {clustered ? (
            <div className={`grid gap-3 ${groups.length > 3 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
              {groups.map((g, gi) => (
                <section key={g.theme} className="grid content-start gap-2.5 rounded-[12px] bg-white/60 p-3">
                  <h4 className="text-[12.5px] font-semibold leading-snug text-ink">{g.theme}</h4>
                  <ul className="grid gap-2">{notes.filter((n) => n.group === gi).map((n) => <li key={n.id}>{sticky(n)}</li>)}</ul>
                  {g.insight && <p className="border-t border-dashed border-[#d8d2c7] pt-2 text-[12px] leading-relaxed text-sub">{g.insight}</p>}
                </section>
              ))}
            </div>
          ) : (
            <ul className="flex flex-wrap justify-center gap-2.5 py-2">
              {notes.map((n) => (
                <li key={n.id} className="w-[calc(50%-6px)] sm:w-[calc(33.3%-8px)] md:w-[calc(25%-8px)]">{sticky(n)}</li>
              ))}
            </ul>
          )}
        </LayoutGroup>
      </div>
    </MotionConfig>
  );
}
