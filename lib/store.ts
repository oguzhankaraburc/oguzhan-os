import { create } from "zustand";
import type { Lang } from "./content";

export type AppId = "about" | "experience" | "skills" | "terminal" | "lab" | "snake" | "contact" | "projects" | "taskmanager" | "kanban";

export type Win = {
  id: AppId;
  z: number;
  minimized: boolean;
  maximized: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
};

type OS = {
  lang: Lang;
  booted: boolean;
  windows: Win[];
  topZ: number;
  setLang: (l: Lang) => void;
  setBooted: () => void;
  open: (id: AppId) => void;
  close: (id: AppId) => void;
  focus: (id: AppId) => void;
  toggleMin: (id: AppId) => void;
  toggleMax: (id: AppId) => void;
  move: (id: AppId, x: number, y: number) => void;
  resize: (id: AppId, w: number, h: number) => void;
};

const defaults: Record<AppId, { w: number; h: number }> = {
  about: { w: 560, h: 460 },
  experience: { w: 620, h: 480 },
  skills: { w: 540, h: 440 },
  terminal: { w: 640, h: 400 },
  lab: { w: 480, h: 340 },
  snake: { w: 420, h: 480 },
  contact: { w: 460, h: 340 },
  projects: { w: 560, h: 420 },
  taskmanager: { w: 720, h: 560 },
  kanban: { w: 820, h: 520 },
};

export const useOS = create<OS>((set, get) => ({
  lang: "tr",
  booted: false,
  windows: [],
  topZ: 10,
  setLang: (lang) => {
    try { localStorage.setItem("lang", lang); } catch {}
    set({ lang });
  },
  setBooted: () => set({ booted: true }),
  open: (id) => {
    const { windows, topZ } = get();
    const existing = windows.find((w) => w.id === id);
    const z = topZ + 1;
    if (existing) {
      set({ topZ: z, windows: windows.map((w) => (w.id === id ? { ...w, z, minimized: false } : w)) });
      return;
    }
    const d = defaults[id];
    const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    const w = Math.min(d.w, vw - 24);
    const h = Math.min(d.h, vh - 90);
    const offset = (windows.length % 6) * 28;
    const x = Math.max(12, (vw - w) / 2 - 80 + offset);
    const y = Math.max(40, (vh - h) / 2 - 60 + offset);
    set({ topZ: z, windows: [...windows, { id, z, minimized: false, maximized: false, x, y, w, h }] });
  },
  close: (id) => set({ windows: get().windows.filter((w) => w.id !== id) }),
  focus: (id) => {
    const z = get().topZ + 1;
    set({ topZ: z, windows: get().windows.map((w) => (w.id === id ? { ...w, z } : w)) });
  },
  toggleMin: (id) =>
    set({ windows: get().windows.map((w) => (w.id === id ? { ...w, minimized: !w.minimized } : w)) }),
  toggleMax: (id) =>
    set({ windows: get().windows.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)) }),
  move: (id, x, y) => set({ windows: get().windows.map((w) => (w.id === id ? { ...w, x, y } : w)) }),
  resize: (id, w, h) =>
    set({ windows: get().windows.map((win) => (win.id === id ? { ...win, w, h } : win)) }),
}));
