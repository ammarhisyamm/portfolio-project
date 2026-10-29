import Btn from "./Btn";
import Link from "next/link";
import Reveal from "./Reveal";
import type { AboutContent, ContactContent, SocialLink } from "@/lib/content";

export default function AboutPanel({
  about,
  contact,
  socials,
}: {
  about: AboutContent;
  contact: ContactContent;
  socials: SocialLink[];
}) {
  const linkedin = socials.find((s) => s.type === "linkedin")?.href ?? "#";
  return (
    <Reveal className="panel p-5 sm:p-8">
      <span className="kicker">About Hisyam</span>
      <p className="mb-4 mt-4 text-[clamp(22px,2.2vw,30px)] leading-snug tracking-[-0.05em]">
        A product designer for B2B, AI, and operational tools.
      </p>
      <p className="leading-relaxed text-sub">{about.introBody}</p>
      <p className="mt-3 leading-relaxed text-sub">Alongside my in-house work, I build independent products to explore onboarding and interaction details.</p>
      <Link href="/about-us" className="mt-4 inline-flex w-fit text-[13px] font-medium text-ink underline decoration-line underline-offset-4 hover:decoration-ink">More about Hisyam</Link>
      <div className="mt-6 border-t border-line">
        <a
          href={`mailto:${contact.email}`}
          className="flex items-center justify-between gap-4 border-b border-line py-3 text-[13px] no-underline hover:text-sub"
        >
          <span className=" text-[11px] uppercase text-muted">Email</span>
          {contact.email}
        </a>
        <div className="flex items-center justify-between gap-4 border-b border-line py-3 text-[13px]">
          <span className=" text-[11px] uppercase text-muted">Location</span>
          {contact.location}
        </div>
        <a href={linkedin} className="flex items-center justify-between gap-4 border-b border-line py-3 text-[13px] no-underline">
          <span className=" text-[11px] uppercase text-muted">LinkedIn</span>
          View profile
        </a>
        {about.cvUrl ? (
          <Btn
            href={`${about.cvUrl}${about.cvUrl.includes("?") ? "&" : "?"}download=${encodeURIComponent((about.cvLabel || "CV").replace(/\s+/g, "_") + ".pdf")}`}
            download={`${(about.cvLabel || "CV").replace(/\s+/g, "_")}.pdf`}
            variant="primary"
            className="btn-cv-primary mt-5 w-full"
          >
            {about.cvLabel || "Download CV"}
          </Btn>
        ) : (
          <Btn href="#" variant="primary" className="btn-cv-primary mt-5 w-full">
            {about.cvLabel || "Download CV"}
          </Btn>
        )}
      </div>
    </Reveal>
  );
}
