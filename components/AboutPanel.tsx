import Btn from "./Btn";
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
    <Reveal className="panel grid gap-8 p-5 sm:p-8 lg:grid-cols-[1.6fr_0.8fr] lg:gap-12 lg:p-10">
      <div>
        <span className="kicker">About myself</span>
        <p className="mb-4 text-[clamp(22px,2.2vw,32px)] leading-snug tracking-[-0.05em]">
          {about.introTitle}
        </p>
        <p className="leading-relaxed text-sub">{about.introBody}</p>
      </div>
      <div className="flex flex-col self-start border-t border-line pt-5">
        <a
          href={`mailto:${contact.email}`}
          className="flex items-center justify-between gap-4 border-b border-line py-3 text-[13px] no-underline hover:text-sub"
        >
          <span className="font-mono text-[11px] uppercase text-muted">Email</span>
          {contact.email}
        </a>
        <a
          href={linkedin}
          className="flex items-center justify-between gap-4 border-b border-line py-3 text-[13px] no-underline"
        >
          <span className="font-mono text-[11px] uppercase text-muted">Location</span>
          {contact.location}
        </a>
        <a href={linkedin} className="flex items-center justify-between gap-4 border-b border-line py-3 text-[13px] no-underline">
          <span className="font-mono text-[11px] uppercase text-muted">LinkedIn</span>
          View profile
        </a>
        <Btn href="#" variant="secondary" className="mt-5 w-full">
          Download CV
        </Btn>
      </div>
    </Reveal>
  );
}