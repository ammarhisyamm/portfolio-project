export const toolLogos = [
  { name: "Figma", src: "/tool-logos/figma.svg" },
  { name: "Notion", src: "/tool-logos/notion.svg" },
  { name: "Slack", src: "/tool-logos/slack.svg" },
  { name: "Adobe", src: "/tool-logos/adobe.svg" },
  { name: "Photopea", src: "/tool-logos/photopea.svg" },
  { name: "OpenAI", src: "/tool-logos/openai.svg" },
  { name: "Miro", src: "/tool-logos/miro.svg" },
  { name: "GitHub", src: "/tool-logos/github.svg" },
  { name: "Jira", src: "/tool-logos/jira.svg" },
  { name: "Jitter", src: "/about-gallery/jitter-logo.png" },
  { name: "Framer", src: "/tool-logos/framer.svg" },
  { name: "OpenCode", src: "/tool-logos/opencode.svg" },
  { name: "Whimsical", src: "https://whimsical.com/_next_public/brand/logo-color.svg" },
];

/** The logo for a tool label from the CMS (FigJam uses the Figma logo), or undefined. */
export function toolLogoFor(label: string) {
  const text = label.toLowerCase();
  return toolLogos.find(tool => text.includes(tool.name.toLowerCase())) ?? (text.includes("figjam") ? toolLogos.find(tool => tool.name === "Figma") : undefined);
}
