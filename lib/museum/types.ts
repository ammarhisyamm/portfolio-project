export type MuseumRoom = "work" | "process" | "playground" | "about" | "contact" | "blog" | "studio";

/** Interaction id for Nailong, the doorkeeper who offers directions. */
export const MUSEUM_GUIDE = "guide-nailong";

export type ShowcaseItem = { title: string; subtitle: string; src: string; thumb: string };

export type MuseumExhibit = {
  id: string;
  room: MuseumRoom;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  action: string;
  studySlug?: string;
  href?: string;
  /** Hidden finds: small objects discovered by wandering, not listed on plinths. */
  secret?: boolean;
  list?: string[];
  images?: string[];
  external?: boolean;
  /** Portfolio shots shown as a browsable wall in the exhibit dialog. */
  showcase?: ShowcaseItem[];
  chips?: string[];
  tools?: string[];
  steps?: { title: string; description: string }[];
  timeline?: { title: string; meta: string; points: string[] }[];
  album?: { image: string; title: string; note: string; alt: string }[];
  /** The contact kiosk opens the message form instead of a description. */
  form?: boolean;
  /** Reading Room: an article by slug, or the index of every article. */
  post?: string;
  postIndex?: boolean;
};

export type MuseumData = {
  name: string;
  available: boolean;
  exhibits: MuseumExhibit[];
};

export type MuseumController = {
  visit: (room: MuseumRoom) => void;
  select: (id: string) => void;
  move: (x: number, y: number) => void;
  running: (running: boolean) => void;
  setLights: (enabled: boolean) => void;
  setPaused: (paused: boolean) => void;
  setPerspective: (firstPerson: boolean) => void;
  dispose: () => void;
};

export const MUSEUM_ROOMS: { id: MuseumRoom; label: string; description: string; number: string; hidden?: boolean }[] = [
  { id: "work", label: "Selected work", description: "Product design, presented up close. Walk toward a display to explore the work behind it.", number: "01" },
  { id: "process", label: "Process", description: "Capabilities, skills and tools, and the design process that takes a product from question to handoff.", number: "02" },
  { id: "playground", label: "Showcase", description: "Websites, dashboards and mobile apps. Step up to a case to browse the work.", number: "03" },
  { id: "about", label: "About", description: "The person behind the projects. My journey, where I have worked, and a few photos from the album.", number: "04" },
  { id: "contact", label: "Contact", description: "Have a project in mind? Write a message on the touch screen at the end of the hall.", number: "05" },
  { id: "blog", label: "Reading Room", description: "A library off the first gallery. Pull up a chair and read the latest articles.", number: "06" },
  // Not in the top navigation: the side door off the hall is there to be found.
  { id: "studio", label: "The Studio", description: "A quieter room off the main hall. Books, sketches and a resident cat. Look closely.", number: "07", hidden: true },
];
