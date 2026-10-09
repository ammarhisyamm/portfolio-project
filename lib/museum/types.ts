export type MuseumRoom = "work" | "process" | "playground" | "about" | "contact";

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

export const MUSEUM_ROOMS: { id: MuseumRoom; label: string; description: string; number: string }[] = [
  { id: "work", label: "Selected work", description: "Product design, presented up close. Walk toward a display to explore the work behind it.", number: "01" },
  { id: "process", label: "Process", description: "Research, decisions, and collaboration. A look at the teams and work that shaped my practice.", number: "02" },
  { id: "playground", label: "Playground", description: "Interface studies and ideas in motion. A space to try, learn, and play with design.", number: "03" },
  { id: "about", label: "About", description: "The person behind the projects. My approach, the things I notice, and the tools I work with.", number: "04" },
  { id: "contact", label: "Contact", description: "Have a project in mind? Step into the studio and start a conversation.", number: "05" },
];
