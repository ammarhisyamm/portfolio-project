"use client";

import { useId, useState, type KeyboardEvent } from "react";
import type { CaseStudyNoteGroup } from "@/lib/content";

const ASSUMPTION = /^assumption:\s*/i;

/**
 * A framing board read one theme at a time: tabs for the themes, then what was
 * known, what was only assumed, and the rule the theme turned into.
 */
export default function ThemeTabs({ groups }: { groups: CaseStudyNoteGroup[] }) {
  const [active, setActive] = useState(0);
  const id = useId();
  const group = groups[active];
  const known = group.notes.filter((n) => !ASSUMPTION.test(n));
  const assumed = group.notes.filter((n) => ASSUMPTION.test(n)).map((n) => n.replace(ASSUMPTION, "")).map((n) => n.charAt(0).toUpperCase() + n.slice(1));

  const onKey = (e: KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (i + (e.key === "ArrowRight" ? 1 : -1) + groups.length) % groups.length;
    setActive(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  };

  return (
    <div className="grid gap-6">
      <div role="tablist" aria-label="Themes" className="flex flex-wrap gap-2">
        {groups.map((g, i) => (
          <button
            key={g.theme}
            id={`${id}-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls={`${id}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
            className={`rounded-full border px-4 py-2 text-[13px] transition-colors ${i === active ? "border-ink bg-panel text-ink" : "border-[#dedede] text-sub hover:border-[#bdbdbd] hover:text-ink"}`}
          >
            {g.theme}
          </button>
        ))}
      </div>
      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} className="grid gap-6 rounded-[18px] bg-panel p-5 sm:p-7">
        <div className={`grid gap-6 ${assumed.length ? "sm:grid-cols-[1.4fr_1fr]" : ""}`}>
          <div className="grid content-start gap-3">
            <span className="text-[11px] uppercase tracking-[0.08em] text-muted">What I knew</span>
            <ul className="grid gap-2.5">
              {known.map((n) => (
                <li key={n} className="grid grid-cols-[14px_1fr] text-[14.5px] leading-[1.55] text-ink">
                  <span aria-hidden="true" className="text-muted">–</span>
                  {n}
                </li>
              ))}
            </ul>
          </div>
          {assumed.length > 0 && (
            <div className="grid content-start gap-3">
              <span className="text-[11px] uppercase tracking-[0.08em] text-muted">What I only assumed</span>
              <ul className="grid gap-2.5">
                {assumed.map((n) => (
                  <li key={n} className="rounded-[10px] border border-dashed border-[#c9c9c9] px-3.5 py-2.5 text-[14px] leading-[1.5] text-ink">
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {group.insight && (
          <p className="border-t border-[#ececec] pt-5 text-[clamp(18px,2.2vw,21px)] leading-[1.35] tracking-[-0.02em] text-ink">
            {group.insight}
          </p>
        )}
      </div>
    </div>
  );
}
