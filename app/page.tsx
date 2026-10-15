import Hero from "@/components/Hero";
import AboutPanel from "@/components/AboutPanel";
import ExperienceAccordion from "@/components/ExperienceAccordion";
import CategoryStacks from "@/components/CategoryStacks";
import RestoreScroll from "@/components/RestoreScroll";
import SelectedWork from "@/components/SelectedWork";
import HomeEntrance from "@/components/HomeEntrance";
import MuseumExperience from "@/components/MuseumExperience";
import { getContent } from "@/lib/content";
import { withShowcase } from "@/lib/showcase-categories";

export default async function HomePage() {
  const content = await getContent();
  const featured = content.caseStudies
    .filter((c) => c.featured && c.published)
    .sort((a, b) => a.featured_order - b.featured_order);
  return (
    <>
      <HomeEntrance />
      <div className="page-stack grid pb-16 pt-3">
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

        <section className="panel p-5 sm:p-8">
          <span className="kicker">Selected work</span>
          <div className="mt-8">
            <SelectedWork caseStudies={featured} />
          </div>
        </section>

        <ExperienceAccordion items={content.experience} />

        <AboutPanel about={content.about} contact={content.contact} socials={content.socials.items} />

        <CategoryStacks categories={withShowcase(content.homeCategories)} />

        {/* The 3D museum: opens full screen; in the classic view its entry sits at the end of the page. */}
        <MuseumExperience content={content} />
      </div>
    </>
  );
}
