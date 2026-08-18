"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { Project } from "@/lib/projects";
import CaseStudyModal from "./CaseStudyModal";

type ProjectContextValue = {
  projects: Project[];
  active: Project | null;
  open: (slug: string) => void;
  close: () => void;
};

const ProjectContext = createContext<ProjectContextValue>({
  projects: [],
  active: null,
  open: () => {},
  close: () => {},
});

export function useProject() {
  return useContext(ProjectContext);
}

export function ProjectProvider({
  projects,
  children,
}: {
  projects: Project[];
  children: React.ReactNode;
}) {
  const [active, setActive] = useState<Project | null>(null);
  const open = useCallback(
    (slug: string) => {
      const project = projects.find((p) => p.slug === slug);
      if (project) setActive(project);
    },
    [projects]
  );
  const close = useCallback(() => setActive(null), []);

  return (
    <ProjectContext.Provider value={{ projects, active, open, close }}>
      {children}
      <CaseStudyModal />
    </ProjectContext.Provider>
  );
}