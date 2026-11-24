import type { CaseStudy } from "@/lib/content";
import { cardCover, caseStudyCover } from "@/lib/case-study-visuals";
import { caseStudyPreview } from "@/lib/case-study-previews";
import Media from "./Media";

export default function CaseStudyCover({ study, onOpen }: { study: CaseStudy; onOpen?: () => void }) {
  const preview = caseStudyPreview(study.slug);
  const fallback = cardCover(study.slug);
  const artwork = preview ? (
    <div className={`case-cover-art case-cover-${preview.kind}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="case-cover-scene" src={preview.scene} alt="" loading="lazy" decoding="async" />
      <div className="case-cover-device">
        {preview.kind === "desktop" && (
          <div className="case-cover-browser" aria-hidden="true"><i /><i /><i /></div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="case-cover-screen" src={preview.screen} alt={preview.alt} loading="lazy" decoding="async" />
      </div>
    </div>
  ) : (
    <Media src={fallback?.src || study.thumbnail || caseStudyCover(study.slug)} alt={fallback?.alt || study.thumbnail_alt || study.title} label={study.title} />
  );

  return (
    <div className="case-cover">
      {onOpen ? (
        <button type="button" onClick={onOpen} className="case-cover-open" aria-label={`Read ${study.title} case study`}>
          {artwork}
          <span className="case-cover-hint" aria-hidden="true">View case study</span>
        </button>
      ) : artwork}
    </div>
  );
}
