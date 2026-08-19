import Hero from "@/components/Hero";
import AboutPanel from "@/components/AboutPanel";
import ExperienceAccordion from "@/components/ExperienceAccordion";
import CategoryStacks from "@/components/CategoryStacks";
import RestoreScroll from "@/components/RestoreScroll";
import FeaturedWork from "@/components/FeaturedWork";
import { getContent } from "@/lib/content";

export default async function HomePage() {
  const content = await getContent();
  const featured = content.caseStudies
    .filter((c) => c.featured && c.published)
    .sort((a, b) => a.featured_order - b.featured_order);
  return (
    <div className="grid gap-3 pb-16 pt-3 md:gap-4">
      <RestoreScroll />
      <Hero
        name={content.hero.name}
        title={content.hero.title}
        headline={content.hero.headline}
        intro={content.hero.intro}
        available={content.hero.available}
        email={content.contact.email}
        socials={content.socials.items}
        trust={content.trust}
        profilePhoto={content.branding.profilePhoto}
      />

      <section className="pt-2">
        <span className="kicker">Selected work</span>
        <div className="mt-5">
          <FeaturedWork caseStudies={featured} />
        </div>
      </section>

      <ExperienceAccordion items={content.experience} />

      <AboutPanel about={content.about} contact={content.contact} socials={content.socials.items} />

      <CategoryStacks categories={content.homeCategories} />
    </div>
  );
}