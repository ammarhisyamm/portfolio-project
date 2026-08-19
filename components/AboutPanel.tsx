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
    <Reveal className="panel p-5 sm:p-8">
      <span className="kicker">About myself</span>
      <p className="mb-4 mt-4 text-[clamp(22px,2.2vw,30px)] leading-snug tracking-[-0.05em]">
        {about.introTitle}
      </p>
      <p className="leading-relaxed text-sub">{about.introBody}</p>
      <div className="mt-6 border-t border-line">
        <a
          href={`mailto:${contact.email}`}
          className="flex items-center justify-between gap-4 border-b border-line py-3 text-[13px] no-underline hover:text-sub"
        >
          <span className=" text-[11px] uppercase text-muted">Email</span>
          {contact.email}
        </a>
        <a
          href={linkedin}
          className="flex items-center justify-between gap-4 border-b border-line py-3 text-[13px] no-underline"
        >
          <span className=" text-[11px] uppercase text-muted">Location</span>
          {contact.location}
        </a>
        <a href={linkedin} className="flex items-center justify-between gap-4 border-b border-line py-3 text-[13px] no-underline">
          <span className=" text-[11px] uppercase text-muted">LinkedIn</span>
          View profile
        </a>
        <Btn href="#" variant="secondary" className="mt-5 w-full">
          Download CV
        </Btn>
      </div>
    </Reveal>
  );
}