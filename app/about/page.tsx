import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import Btn from "@/components/Btn";
import ProcessAccordion from "@/components/ProcessAccordion";
import { capabilities, industries } from "@/lib/projects";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="grid gap-3 pb-16 pt-3 md:gap-4">
      <Reveal className="panel grid gap-6 p-5 sm:p-8 lg:p-10">
        <span className="kicker">About</span>
        <h1 className="max-w-[900px] text-[clamp(32px,4.4vw,58px)] font-normal leading-[1.03] tracking-[-0.06em]">
          Designing systems that help people make sense of complex things.
        </h1>
      </Reveal>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
        <Reveal className="panel p-5 sm:p-8 md:col-span-8">
          <span className="kicker">Introduction</span>
          <p className="mb-4 text-[clamp(22px,2.4vw,34px)] leading-tight tracking-[-0.05em]">
            Hey, I&rsquo;m Hisyam — a strategy-driven product designer with more than 15 years of
            experience creating scalable digital experiences.
          </p>
          <p className="max-w-[620px] leading-relaxed text-sub">
            I enjoy shaping a product from the early question through to a considered interface and
            a practical handoff. My work is grounded in attention to people, business context, and
            the small details that make a product feel trustworthy.
          </p>
        </Reveal>

        <Reveal className="panel flex flex-col items-start gap-1 p-5 sm:p-8 md:col-span-4" y={18}>
          <span className="kicker">Get in touch</span>
          <a href="mailto:hello@hisyam.design" className="py-1.5 text-[13px] text-sub underline underline-offset-3 hover:text-ink">
            hello@hisyam.design
          </a>
          <a href="#" className="py-1.5 text-[13px] text-sub underline underline-offset-3 hover:text-ink">
            LinkedIn
          </a>
          <Btn href="mailto:hello@hisyam.design" className="mt-4 w-full">
            Let&rsquo;s talk
          </Btn>
          <Btn href="#" variant="secondary" className="mt-2.5 w-full">
            Download CV
          </Btn>
        </Reveal>

        <Reveal className="panel p-5 sm:p-8 md:col-span-6">
          <span className="kicker">Design philosophy</span>
          <h3 className="mb-3.5 mt-4 text-[clamp(20px,2vw,26px)] font-medium leading-snug tracking-[-0.045em]">
            Complexity should be resolved long before it reaches the interface.
          </h3>
          <p className="leading-relaxed text-sub">
            I design with structure and restraint. Every layout, flow, and pattern should earn its
            place and make the next decision easier for both users and the team building it.
          </p>
        </Reveal>

        <Reveal className="panel p-5 sm:p-8 md:col-span-6">
          <span className="kicker">Professional background</span>
          <p className="mt-4 leading-relaxed text-sub">
            More than 15 years across product teams, agencies, and client work — spanning fintech,
            SaaS, marketplaces, education, security, communication, and AI-powered platforms.
          </p>
          <p className="leading-relaxed text-sub">
            From strategy and research to interaction, visual systems, and developer handoff, I stay
            involved across the full arc of a product.
          </p>
        </Reveal>

        <Reveal className="panel p-5 sm:p-8 md:col-span-12">
          <span className="kicker">Core capabilities</span>
          <ul className="mt-4 grid list-none grid-cols-2 gap-x-8 md:grid-cols-3" style={{ padding: 0 }}>
            {capabilities.map((c) => (
              <li key={c} className="border-t border-line py-4 text-[14px] text-sub">
                {c}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="panel p-5 sm:p-8 md:col-span-6">
          <span className="kicker">Design process</span>
          <div className="mt-2">
            <ProcessAccordion />
          </div>
        </Reveal>

        <Reveal className="panel p-5 sm:p-8 md:col-span-6">
          <span className="kicker">Tools &amp; workflow</span>
          <p className="mt-4 max-w-[600px] leading-relaxed text-sub">
            Figma, FigJam, Adobe tools, Photopea, Notion, and AI-assisted design and research tools.
            I work openly with product, engineering, and stakeholders to turn decisions into
            momentum.
          </p>
        </Reveal>

        <Reveal className="panel p-5 sm:p-8 md:col-span-12">
          <span className="kicker">Selected industries</span>
          <ul className="mt-4 flex list-none flex-wrap gap-2.5" style={{ padding: 0 }}>
            {industries.map((i) => (
              <li key={i} className="rounded-full border border-line px-4 py-2 text-[13px] text-sub">
                {i}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  );
}