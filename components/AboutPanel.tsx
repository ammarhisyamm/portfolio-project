import Btn from "./Btn";
import Reveal from "./Reveal";
import type { AboutContent, ContactContent, SocialLink } from "@/lib/content";
import GitHubActivity from "./GitHubActivity";

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
  const githubProfile = socials.find((s) => s.type === "github")?.href;
  const githubUsername = githubProfile?.match(/github\.com\/([^/?#]+)/i)?.[1] ?? "ammarhisyamm";
  return (
    <Reveal className="panel p-5 sm:p-8">
      <span className="kicker">About myself</span>
      <p className="mb-4 mt-4 text-[clamp(22px,2.2vw,30px)] leading-snug tracking-[-0.05em]">
        {about.introTitle}
      </p>
      <p className="leading-relaxed text-sub">{about.introBody}</p>
      <div className="mt-8 grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
        <div>
          <span className="kicker">Design philosophy</span>
          <p className="mt-3 text-sm leading-relaxed text-sub">{about.philosophyTitle}</p>
          <p className="mt-2 text-sm leading-relaxed text-sub">{about.philosophyBody}</p>
        </div>
        <div>
          <span className="kicker">Background</span>
          <div className="mt-3 space-y-2 text-sm leading-relaxed text-sub">
            {about.background.map((item) => <p key={item}>{item}</p>)}
          </div>
        </div>
      </div>
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
        {about.cvUrl ? (
          <Btn
            href={`${about.cvUrl}${about.cvUrl.includes("?") ? "&" : "?"}download=${encodeURIComponent((about.cvLabel || "CV").replace(/\s+/g, "_") + ".pdf")}`}
            download={`${(about.cvLabel || "CV").replace(/\s+/g, "_")}.pdf`}
            variant="secondary"
            className="mt-5 w-full"
          >
            {about.cvLabel || "Download CV"}
          </Btn>
        ) : (
          <Btn href="#" variant="secondary" className="mt-5 w-full">
            {about.cvLabel || "Download CV"}
          </Btn>
        )}
      </div>
      <div className="mt-8 border-t border-line pt-6">
        <span className="kicker">Capabilities</span>
        <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 text-sm text-sub sm:grid-cols-2">
          {about.capabilities.map((capability) => <span key={capability}>{capability}</span>)}
        </div>
      </div>
      <GitHubActivity username={githubUsername} />
    </Reveal>
  );
}
