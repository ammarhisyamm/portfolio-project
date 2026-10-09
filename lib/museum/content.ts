import type { SiteContent } from "@/lib/content";
import { caseStudyCover } from "@/lib/case-study-visuals";
import type { MuseumData, MuseumExhibit } from "./types";

/** An exhibition view of existing CMS content, with no second content store. */
export function museumContent(content: SiteContent): MuseumData {
  const work = content.caseStudies.filter(study => study.published).sort((a, b) => Number(b.featured) - Number(a.featured) || a.featured_order - b.featured_order);
  const exhibits: MuseumExhibit[] = work.slice(0, 3).map(study => ({
    id: `work-${study.slug}`, room: "work", title: study.title,
    subtitle: [study.platform || study.category, study.industry].filter(Boolean).join(" / "),
    description: study.short_description || study.hero_description,
    image: study.thumbnail || study.hero_image || caseStudyCover(study.slug),
    action: "View case study", studySlug: study.slug,
  }));
  exhibits.push({ id: "work-collection", room: "work", title: "The collection", subtitle: "Product design", description: `Explore all ${work.length} published projects, from the first question to the final interface.`, image: "", action: "Browse all work" });
  content.experience.slice(0, 3).forEach((item, index) => exhibits.push({
    id: `process-${index}`, room: "process", title: item.company, subtitle: item.role,
    description: item.points[0] || item.period, image: item.images[0] || "", action: "Read the story",
  }));
  const explorations = content.exploration.filter(item => item.image);
  explorations.slice(0, 3).forEach((item, index) => exhibits.push({
    id: `playground-${index}`, room: "playground", title: item.label, subtitle: "Interface study",
    description: item.description || "A design exploration from the Playground collection.", image: item.image, action: "Explore the gallery", href: "/playground",
  }));
  if (!explorations.length) exhibits.push({ id: "playground-gallery", room: "playground", title: "Design explorations", subtitle: "Ideas in progress", description: "Visit the Playground to explore interface studies as the collection grows.", image: "", action: "Visit Playground", href: "/playground" });
  exhibits.push(
    { id: "about-journey", room: "about", title: "My journey", subtitle: content.hero.title, description: content.about.introBody, image: content.branding.profilePhoto || content.about.gallery[0]?.image || "", action: "Meet Hisyam", href: "/about-us" },
    { id: "about-practice", room: "about", title: "My approach", subtitle: content.about.philosophyTitle, description: content.about.philosophyBody, image: content.about.gallery[1]?.image || "", action: "Explore my approach", href: "/about-us" },
    { id: "about-tools", room: "about", title: "Skills & tools", subtitle: "From research to handoff", description: content.about.tools, image: "", action: "View skills & tools", href: "/about-us" },
    { id: "contact-studio", room: "contact", title: "Let's talk", subtitle: content.contact.email, description: content.contact.note || "Have a project, a question, or an idea to share? I'd love to hear from you.", image: content.about.gallery[2]?.image || "", action: "Send a message", href: "/contact" },
  );
  return { name: content.hero.name, available: content.hero.available, exhibits };
}
