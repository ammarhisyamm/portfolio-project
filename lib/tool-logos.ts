export const toolLogos = [
  { name: "Figma", src: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/figma.svg" },
  { name: "Notion", src: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/notion.svg" },
  { name: "Slack", src: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/slack.svg" },
  { name: "Adobe", src: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/adobe.svg" },
  { name: "Photopea", src: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/photopea.svg" },
  { name: "OpenAI", src: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/openai.svg" },
  { name: "Miro", src: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/miro.svg" },
  { name: "GitHub", src: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/github.svg" },
  { name: "Jira", src: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/jira.svg" },
  { name: "Jitter", src: "/about-gallery/jitter-logo.png" },
  { name: "Framer", src: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/framer.svg" },
  { name: "OpenCode", src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/opencode.svg" },
  { name: "Whimsical", src: "https://whimsical.com/_next_public/brand/logo-color.svg" },
];

/** The logo for a tool label from the CMS (FigJam uses the Figma logo), or undefined. */
export function toolLogoFor(label: string) {
  const text = label.toLowerCase();
  return toolLogos.find(tool => text.includes(tool.name.toLowerCase())) ?? (text.includes("figjam") ? toolLogos.find(tool => tool.name === "Figma") : undefined);
}
