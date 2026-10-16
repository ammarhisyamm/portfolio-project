import type { Metadata } from "next";
import Hero from "@/components/Hero";
import AboutPanel from "@/components/AboutPanel";
import ExperienceAccordion from "@/components/ExperienceAccordion";
import CategoryStacks from "@/components/CategoryStacks";
import RestoreScroll from "@/components/RestoreScroll";
import SelectedWork from "@/components/SelectedWork";
import HomeEntrance from "@/components/HomeEntrance";
import MuseumExperience from "@/components/MuseumExperience";
import ProcessPanel from "@/components/ProcessPanel";
import BlogPanel from "@/components/BlogPanel";
import { getBlogSummaries } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";
import { getContent } from "@/lib/content";
import { withShowcase } from "@/lib/showcase-categories";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function HomePage() {
  const [content, posts] = await Promise.all([getContent(), getBlogSummaries()]);
  const featured = content.caseStudies
    .filter((c) => c.featured && c.published)
    .sort((a, b) => a.featured_order - b.featured_order);
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: content.hero.name,
    jobTitle: content.hero.title,
    description: content.hero.intro,
    url: SITE_URL,
    email: content.contact.email ? `mailto:${content.contact.email}` : undefined,
    address: content.contact.location ? { "@type": "PostalAddress", addressLocality: content.contact.location } : undefined,
    sameAs: content.socials.items.map((item) => item.href).filter((href) => /^https?:\/\//.test(href)),
    knowsAbout: content.about.capabilities,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }} />
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

        <ProcessPanel process={content.process} capabilities={content.about.capabilities} />

        <AboutPanel about={content.about} contact={content.contact} socials={content.socials.items} />

        <CategoryStacks categories={withShowcase(content.homeCategories)} />

        <BlogPanel posts={posts} />

        {/* The 3D museum: opens full screen; in the classic view its entry sits at the end of the page. */}
        <MuseumExperience content={content} posts={posts} />
      </div>
    </>
  );
}
