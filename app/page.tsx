import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import AboutPanel from "@/components/AboutPanel";
import ExperienceAccordion from "@/components/ExperienceAccordion";
import DesignExploration from "@/components/DesignExploration";
import ProjectGrid from "@/components/ProjectGrid";
import { getContent } from "@/lib/content";

export default async function HomePage() {
  const content = await getContent();
  return (
    <div className="grid gap-3 pb-16 pt-3 md:gap-4">
      <Hero
        name={content.hero.name}
        title={content.hero.title}
        headline={content.hero.headline}
        intro={content.hero.intro}
        available={content.hero.available}
        email={content.contact.email}
        socials={content.socials.items}
      />
      <TrustStrip items={content.trust} />
      <AboutPanel about={content.about} contact={content.contact} socials={content.socials.items} />

      <section className="grid gap-3">
        <div className="px-0.5">
          <span className="kicker">Working experience</span>
        </div>
        <ExperienceAccordion items={content.experience} />
      </section>

      <DesignExploration items={content.exploration} />

      <section className="grid gap-3">
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
        <ProjectGrid projects={content.projects.slice(0, 4)} />
      </section>
    </div>
  );
}