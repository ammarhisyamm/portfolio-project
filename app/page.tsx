import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import AboutPanel from "@/components/AboutPanel";
import ExperienceAccordion from "@/components/ExperienceAccordion";
import DesignExploration from "@/components/DesignExploration";
import ProjectGrid from "@/components/ProjectGrid";
import { projects } from "@/lib/projects";

export default function HomePage() {
  return (
    <div className="grid gap-5 pb-16 pt-4 md:gap-[22px]">
      <Hero />
      <TrustStrip />
      <AboutPanel />

      <section className="grid gap-5">
        <div className="px-0.5">
          <span className="kicker">Working experience</span>
        </div>
        <ExperienceAccordion />
      </section>

      <DesignExploration />

      <section className="grid gap-5">
        <div className="flex items-end justify-between gap-4 px-0.5">
          <span className="kicker">Selected work</span>
          <Link
            href="/work"
            className="border-b border-line-strong pb-1 text-[13px] text-sub no-underline transition-colors hover:border-ink hover:text-ink"
          >
            View all projects
            <ArrowRight size={13} className="ml-1 inline" aria-hidden="true" />
          </Link>
        </div>
        <ProjectGrid projects={projects.slice(0, 4)} />
      </section>
    </div>
  );
}