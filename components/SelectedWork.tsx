"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { CaseStudy } from "@/lib/content";
import FeaturedWork from "./FeaturedWork";
import CaseStudyOverlay from "./CaseStudyOverlay";

/** The open study lives in `?work=<slug>`, so every case study has a link a recruiter can share. */
const PARAM = "work";

function studyFromUrl(caseStudies: CaseStudy[]) {
  const slug = new URLSearchParams(window.location.search).get(PARAM);
  return caseStudies.find((study) => study.slug === slug) ?? null;
}

export default function SelectedWork({ caseStudies }: { caseStudies: CaseStudy[] }) {
  const [open, setOpen] = useState<CaseStudy | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setOpen(studyFromUrl(caseStudies));
    const onPop = () => setOpen(studyFromUrl(caseStudies));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [caseStudies]);

  const show = useCallback((study: CaseStudy) => {
    const url = new URL(window.location.href);
    const opening = !url.searchParams.has(PARAM);
    url.searchParams.set(PARAM, study.slug);
    // Opening from the list adds a history entry so the browser back button closes the study.
    if (opening) window.history.pushState({ ...window.history.state, [PARAM]: true }, "", url);
    else window.history.replaceState(window.history.state, "", url);
    setOpen(study);
  }, []);

  const close = useCallback(() => {
    // Step back over the entry we pushed; a study opened from a shared link has none to step over.
    if (window.history.state?.[PARAM]) {
      window.history.back();
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.delete(PARAM);
    window.history.replaceState(window.history.state, "", url);
    setOpen(null);
  }, []);

  const index = open ? caseStudies.findIndex((study) => study.slug === open.slug) : -1;
  const next = index >= 0 && caseStudies.length > 1 ? caseStudies[(index + 1) % caseStudies.length] : null;

  return (
    <>
      <FeaturedWork caseStudies={caseStudies} onOpen={show} />
      {/* Portalled: the page wrapper's reveal filter would otherwise trap the fixed overlay inside the column. */}
      {mounted &&
        createPortal(
          <CaseStudyOverlay cs={open} onClose={close} next={next} onNext={show} />,
          document.body
        )}
    </>
  );
}
