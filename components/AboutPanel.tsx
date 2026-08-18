import Btn from "./Btn";
import Reveal from "./Reveal";

export default function AboutPanel() {
  return (
    <Reveal className="panel grid gap-8 lg:grid-cols-[1.6fr_0.8fr] lg:gap-14">
      <div>
        <span className="kicker">About myself</span>
        <p className="mb-4 text-[clamp(22px,2.2vw,32px)] leading-snug tracking-[-0.05em]">
          Hey, I&rsquo;m Hisyam — a strategy-driven product designer with more than 15 years of
          experience creating scalable digital experiences.
        </p>
        <p className="leading-relaxed text-sub">
          I work across UX/UI design, product strategy, user research, interaction design, design
          systems, prototyping, and design-to-development handoff. I collaborate closely with teams
          and clients to turn decisions into momentum.
        </p>
      </div>
      <div className="flex flex-col self-start border-t border-line pt-5">
        <a
          href="mailto:hello@hisyam.design"
          className="flex items-center justify-between gap-4 border-b border-line py-3 text-[13px] no-underline hover:text-sub"
        >
          <span className="font-mono text-[11px] uppercase text-muted">Email</span>
          hello@hisyam.design
        </a>
        <a href="#" className="flex items-center justify-between gap-4 border-b border-line py-3 text-[13px] no-underline">
          <span className="font-mono text-[11px] uppercase text-muted">Location</span>
          Jakarta, Indonesia
        </a>
        <a href="#" className="flex items-center justify-between gap-4 border-b border-line py-3 text-[13px] no-underline">
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