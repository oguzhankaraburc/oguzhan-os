import type { AppId } from "@/lib/store";
import type { Lang } from "@/lib/content";
import About from "./apps/About";
import Experience from "./apps/Experience";
import Skills from "./apps/Skills";
import Terminal from "./apps/Terminal";
import Lab from "./apps/Lab";
import Snake from "./apps/Snake";
import Contact from "./apps/Contact";
import Projects from "./apps/Projects";
import TaskManager from "./apps/TaskManager";
import Kanban from "./apps/Kanban";

type AppDef = { file: Record<Lang, string>; glyph: React.ReactNode; color: string; Component: React.FC; desktop: boolean };

// SVG icons instead of text glyphs: fonts give each character different metrics,
// so text glyphs never sit dead-center in their tiles. Sized in em to follow the parent's font size.
function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className="block size-[1.1em]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

export const apps: Record<AppId, AppDef> = {
  about: {
    file: { tr: "hakkimda.md", en: "about.md" }, color: "text-neon", Component: About, desktop: true,
    glyph: <Icon><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" /></Icon>,
  },
  experience: {
    file: { tr: "deneyim.log", en: "experience.log" }, color: "text-violet", Component: Experience, desktop: true,
    glyph: <Icon><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" /></Icon>,
  },
  projects: {
    file: { tr: "projeler/", en: "projects/" }, color: "text-orange-300", Component: Projects, desktop: true,
    glyph: <Icon><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" /></Icon>,
  },
  taskmanager: {
    file: { tr: "task-manager.app", en: "task-manager.app" }, color: "text-neon", Component: TaskManager, desktop: false,
    glyph: <Icon><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M8 9l2 2 3-3M8 15h8" /></Icon>,
  },
  kanban: {
    file: { tr: "kanban-demo", en: "kanban-demo" }, color: "text-neon", Component: Kanban, desktop: false,
    glyph: <Icon><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16M15 4v16" /></Icon>,
  },
  skills: {
    file: { tr: "yetenekler/", en: "skills/" }, color: "text-sky-300", Component: Skills, desktop: true,
    glyph: <Icon><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 13l9 5 9-5" /></Icon>,
  },
  terminal: {
    file: { tr: "terminal", en: "terminal" }, color: "text-neon", Component: Terminal, desktop: true,
    glyph: <Icon><path d="M5 7l5 5-5 5M12 18h7" /></Icon>,
  },
  lab: {
    file: { tr: "lab/", en: "lab/" }, color: "text-yellow-300", Component: Lab, desktop: true,
    glyph: <Icon><path d="M9 3h6M10 3v6l-5.5 9.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3M7.5 15h9" /></Icon>,
  },
  contact: {
    file: { tr: "iletisim.sh", en: "contact.sh" }, color: "text-blood", Component: Contact, desktop: true,
    glyph: <Icon><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></Icon>,
  },
  snake: {
    file: { tr: "snake.exe", en: "snake.exe" }, color: "text-neon", Component: Snake, desktop: false,
    glyph: <Icon><rect x="2" y="7" width="20" height="10" rx="4" /><path d="M7 10v4M5 12h4M15 11h.01M18 13h.01" /></Icon>,
  },
};
