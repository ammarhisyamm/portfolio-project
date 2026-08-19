"use client";

import { useState } from "react";
import type { CaseStudy } from "@/lib/content";
import FeaturedWork from "./FeaturedWork";
import CaseStudyOverlay from "./CaseStudyOverlay";

export default function SelectedWork({ caseStudies }: { caseStudies: CaseStudy[] }) {
  const [open, setOpen] = useState<CaseStudy | null>(null);
  return (
    <>
      <FeaturedWork caseStudies={caseStudies} onOpen={setOpen} />
      <CaseStudyOverlay cs={open} onClose={() => setOpen(null)} />
    </>
  );
}