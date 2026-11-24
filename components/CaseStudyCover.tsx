"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Pause, Play } from "lucide-react";
import type { CaseStudy } from "@/lib/content";
import { cardCover, caseStudyCover } from "@/lib/case-study-visuals";
import { caseStudyPreview, type CoverScreen } from "@/lib/case-study-previews";
import Media from "./Media";

function Screen({ screen, index }: { screen: CoverScreen; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const viewport = ref.current;
    const content = image.current;
    if (!viewport || !content) return;
    const measure = () => content.style.setProperty("--cover-scroll-end", `${Math.min(0, viewport.clientHeight - content.clientHeight)}px`);
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(content);
    measure();
    return () => observer.disconnect();
  }, []);
  return (
    <div className={`case-cover-device case-cover-device-${index}`}>
      <div className="case-cover-browser" aria-hidden="true"><i /><i /><i /><span /></div>
      <div ref={ref} className="case-cover-viewport">
        {/* Native screen proportions keep the artwork sharp and the scroll distance honest. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={image} src={screen.src} alt={screen.alt} width={screen.width} height={screen.height} loading="lazy" decoding="async" className="case-cover-scroll" />
      </div>
    </div>
  );
}

/** A close-up, scrollable product composition shared by cards and the study opening. */
export default function CaseStudyCover({ study, onOpen, still = false }: { study: CaseStudy; onOpen?: () => void; still?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [motion, setMotion] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const preview = caseStudyPreview(study.slug);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotion(!query.matches);
    const visibility = () => setPageVisible(!document.hidden);
    update(); visibility();
    query.addEventListener("change", update);
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: .15 });
    if (ref.current) observer.observe(ref.current);
    return () => {
      query.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
      observer.disconnect();
    };
  }, []);

  const playing = motion && inView && pageVisible && !paused && !still;
  const artwork = preview ? (
    <div className={`case-cover-art case-cover-${preview.kind}`} style={{ background: preview.background }}>
      {preview.screens.map((screen, index) => <Screen key={screen.src} screen={screen} index={index} />)}
    </div>
  ) : (
    <Media src={study.cover_video || study.thumbnail || cardCover(study.slug)?.src || caseStudyCover(study.slug)} poster={study.thumbnail} alt={study.thumbnail_alt || study.title} label={study.title} />
  );

  return (
    <div ref={ref} className="case-cover" data-playing={playing} style={{ "--cover-scroll-duration": "12s" } as CSSProperties}>
      {onOpen ? (
        <button type="button" onClick={onOpen} className="case-cover-open" aria-label={`Read ${study.title} case study`}>
          {artwork}
          <span className="case-cover-hint" aria-hidden="true">View case study</span>
        </button>
      ) : artwork}
      {preview && motion && !still && (
        <button type="button" onClick={() => setPaused(value => !value)} className="case-cover-play" aria-label={`${paused ? "Play" : "Pause"} ${study.category.split(" · ")[0] || study.title} preview`} aria-pressed={paused}>
          {paused ? <Play size={13} fill="currentColor" aria-hidden="true" /> : <Pause size={13} fill="currentColor" aria-hidden="true" />}
          <span>{paused ? "Play preview" : "Pause preview"}</span>
        </button>
      )}
    </div>
  );
}
