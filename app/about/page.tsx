import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import Btn from "@/components/Btn";
import ProcessAccordion from "@/components/ProcessAccordion";
import { getContent } from "@/lib/content";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const content = await getContent();
  const { about, contact, socials } = content;
  const linkedin = socials.items.find((s) => s.type === "linkedin")?.href ?? "#";

  return (
    <div className="grid gap-3 pb-16 pt-3 md:gap-4">
      <Reveal className="panel grid gap-6 p-5 sm:p-8 lg:p-10">
        <span className="kicker">About</span>
        <h1 className="max-w-[900px] text-[clamp(30px,4vw,48px)] font-normal leading-[1.03] tracking-[-0.06em]">
          Designing systems that help people make sense of complex things.
        </h1>
      </Reveal>

      <Reveal className="panel p-5 sm:p-8">
        <span className="kicker">Introduction</span>
        <p className="mb-4 mt-4 text-[clamp(22px,2.4vw,32px)] leading-tight tracking-[-0.05em]">
          {about.introTitle}
        </p>
        <p className="max-w-[620px] leading-relaxed text-sub">{about.introBody}</p>
      </Reveal>

      <Reveal className="panel flex flex-col items-start gap-1 p-5 sm:p-8" y={18}>
        <span className="kicker">Get in touch</span>
        <a href={`mailto:${contact.email}`} className="py-1.5 text-[13px] text-sub underline underline-offset-3 hover:text-ink">
          {contact.email}
        </a>
        <a href={linkedin} className="py-1.5 text-[13px] text-sub underline underline-offset-3 hover:text-ink">
          LinkedIn
        </a>
        <Btn href={`mailto:${contact.email}`} className="mt-4 w-full">
          Let&rsquo;s talk
        </Btn>
        <Btn href="#" variant="secondary" className="mt-2.5 w-full">
          Download CV
        </Btn>
      </Reveal>

      <Reveal className="panel p-5 sm:p-8">
        <span className="kicker">Design philosophy</span>
        <h3 className="mb-3.5 mt-4 text-[clamp(20px,2vw,26px)] font-medium leading-snug tracking-[-0.045em]">
          {about.philosophyTitle}
        </h3>
        <p className="leading-relaxed text-sub">{about.philosophyBody}</p>
      </Reveal>

      <Reveal className="panel p-5 sm:p-8">
        <span className="kicker">Professional background</span>
        {about.background.map((para) => (
          <p key={para} className="mt-4 leading-relaxed text-sub">
            {para}
          </p>
        ))}
      </Reveal>

      <Reveal className="panel p-5 sm:p-8">
        <span className="kicker">Core capabilities</span>
        <ul className="mt-4 list-none" style={{ padding: 0 }}>
          {about.capabilities.map((c) => (
            <li key={c} className="border-t border-line py-4 text-[14px] text-sub">
              {c}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="panel p-5 sm:p-8">
        <span className="kicker">Design process</span>
        <div className="mt-2">
          <ProcessAccordion />
        </div>
      </Reveal>

      <Reveal className="panel p-5 sm:p-8">
        <span className="kicker">Tools &amp; workflow</span>
        <p className="mt-4 max-w-[600px] leading-relaxed text-sub">{about.tools}</p>
      </Reveal>

      <Reveal className="panel p-5 sm:p-8">
        <span className="kicker">Selected industries</span>
        <ul className="mt-4 flex list-none flex-wrap gap-2.5" style={{ padding: 0 }}>
          {about.industries.map((i) => (
            <li key={i} className="rounded-full border border-line px-4 py-2 text-[13px] text-sub">
              {i}
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}