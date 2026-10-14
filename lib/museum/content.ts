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
  exhibits.push(...museumSecrets(content));
  return { name: content.hero.name, available: content.hero.available, exhibits };
}

/** Hidden finds use the same CMS fields as the rest of the site. A find is
 * left out when its source field is empty, so nothing is invented. */
function museumSecrets(content: SiteContent): MuseumExhibit[] {
  const secret = (item: Omit<MuseumExhibit, "secret" | "image"> & { image?: string }): MuseumExhibit => ({ image: "", secret: true, ...item });
  const found: MuseumExhibit[] = [];
  const background = content.about.background.filter(Boolean);
  if (background.length) found.push(secret({ id: "secret-journal", room: "studio", title: "The journal on the side table", subtitle: "Before the portfolio", description: "A few pages about where the practice started.", list: background, action: "Read more about me", href: "/about-us" }));
  const industries = content.about.industries.filter(Boolean);
  if (industries.length) found.push(secret({ id: "secret-shelf", room: "studio", title: "A book that sticks out", subtitle: "Industries on the shelf", description: "Each spine on this shelf is an industry I have designed for.", list: industries, action: "See the work", href: "/about-us" }));
  const studies = content.exploration.filter(item => item.label);
  if (studies.length) found.push(secret({ id: "secret-sketchbook", room: "studio", title: "An open sketchbook", subtitle: `${studies.length} studies inside`, description: "Loose ideas that became interface studies in the Playground.", list: studies.slice(0, 6).map(item => item.label), images: studies.filter(item => item.image).slice(0, 4).map(item => item.image), action: "Open the Playground", href: "/playground" }));
  if (content.about.cvUrl) found.push(secret({ id: "secret-cv", room: "studio", title: "Papers on the desk", subtitle: content.about.cvLabel || "Curriculum vitae", description: "The whole story on one page, left on the desk for whoever wanders in.", action: content.about.cvLabel || "Open the CV", href: content.about.cvUrl, external: true }));
  const photos = content.about.gallery.filter(item => item.image && !item.placeholder);
  if (photos.length) found.push(secret({ id: "secret-pinboard", room: "studio", title: "The pinboard", subtitle: "Moments from the studio", description: photos.map(item => item.title).filter(Boolean).slice(0, 3).join(" / ") || "Photos pinned above the bookshelf.", images: photos.slice(0, 6).map(item => item.image), action: "See the full album", href: "/about-us" }));
  const trust = content.trust.map(item => item.label).filter(Boolean);
  if (trust.length) found.push(secret({ id: "secret-olive", room: "about", title: "A note tucked in the olive planter", subtitle: "Teams I have worked with", description: "Written small, as a thank-you.", list: trust, action: "Start a conversation", href: "/contact" }));
  if (content.hero.headline || content.hero.intro) found.push(secret({ id: "secret-plinth", room: "work", title: "A folded note under the bust", subtitle: content.hero.title, description: [content.hero.headline, content.hero.intro].filter(Boolean).join(" "), action: "Meet Hisyam", href: "/about-us" }));
  found.push(secret({ id: "secret-cat", room: "studio", title: "The studio cat", subtitle: "Quality inspector", description: "Every studio needs someone to sit on the keyboard at exactly the right moment. You have been approved for a closer look around.", action: "Back to the collection", href: "" }));
  return found;
}
