"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useOS } from "@/lib/store";
import { projects, taskManager as tm } from "@/lib/content";

const repo = projects.find((p) => p.id === "task-manager")!.repo;

// Request path through the system, drawn as boxes so it reflows on narrow windows
const arch = [
  { name: "React (Vite)", note: "Context API · Axios" },
  { name: "Express API", note: "JWT middleware · RBAC" },
  { name: "PostgreSQL", note: "users · projects · tasks" },
];

export default function TaskManager() {
  const { lang, open } = useOS();
  const tr = lang === "tr";
  const [zoom, setZoom] = useState<number | null>(null);
  const n = tm.screenshots.length;

  // Lightbox keys: arrows to flip through, Escape to close
  useEffect(() => {
    if (zoom === null) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(null);
      if (e.key === "ArrowRight") setZoom((z) => (z! + 1) % n);
      if (e.key === "ArrowLeft") setZoom((z) => (z! + n - 1) % n);
    };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [zoom, n]);

  return (
    <article className="font-sans">
      <header className="relative overflow-hidden border-b border-line px-6 pb-6 pt-7">
        <div className="pointer-events-none absolute -right-10 -top-16 size-64 rounded-full bg-neon/10 blur-3xl" />
        <p className="font-mono text-xs text-dim">case-study / full-stack</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">Task Management</h2>
        <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-text/80">{tm.intro[lang]}</p>
        <div className="mt-5 flex flex-wrap gap-2 font-mono text-[13px]">
          <button onClick={() => open("kanban")} className="rounded bg-neon px-3 py-1.5 font-semibold text-void hover:brightness-110">
            ▶ {tr ? "Mini demoyu dene" : "Try the mini demo"}
          </button>
          <a href={repo} target="_blank" rel="noreferrer" className="rounded border border-line px-3 py-1.5 hover:border-neon/60">
            {tr ? "Kaynak kod" : "Source code"} ↗
          </a>
        </div>
      </header>

      {/* Screenshots right under the intro: visitors look before they read */}
      {tm.screenshots.length > 0 && (
        <section className="px-6 pt-6">
          <h3 className="font-mono text-xs text-dim">## {tr ? "ekran görüntüleri" : "screenshots"}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {tm.screenshots.map((s, i) => (
              <button
                key={s.src}
                onClick={() => setZoom(i)}
                className={`group overflow-hidden rounded border border-line text-left hover:border-neon/50 ${i === 0 ? "sm:col-span-2" : ""}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt={s.caption[lang]} loading="lazy" className="w-full transition duration-300 group-hover:scale-[1.02]" />
                <span className="block bg-black/40 px-3 py-1.5 font-mono text-[11px] text-dim">{s.caption[lang]}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Portal: the window is transformed, which would trap a fixed overlay inside it */}
      {createPortal(<AnimatePresence>
        {zoom !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoom(null)}
            className="fixed inset-0 z-[9000] flex cursor-zoom-out flex-col items-center justify-center gap-3 bg-black/85 p-4 backdrop-blur-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              key={zoom}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={tm.screenshots[zoom].src}
              alt={tm.screenshots[zoom].caption[lang]}
              className="max-h-[80dvh] max-w-full rounded border border-line"
            />
            <div className="flex items-center gap-4 font-mono text-xs text-dim">
              <button onClick={(e) => { e.stopPropagation(); setZoom((zoom + n - 1) % n); }} className="px-3 py-2 text-text hover:text-neon">←</button>
              <span>{tm.screenshots[zoom].caption[lang]} · {zoom + 1}/{n}</span>
              <button onClick={(e) => { e.stopPropagation(); setZoom((zoom + 1) % n); }} className="px-3 py-2 text-text hover:text-neon">→</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}

      <section className="px-6 py-6">
        <h3 className="font-mono text-xs text-dim">## {tr ? "özellikler" : "features"}</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {tm.features.map((f) => (
            <div key={f.title.en} className="rounded border border-line bg-black/30 p-3">
              <p className="font-semibold">
                <span className="mr-2">{f.icon}</span>
                {f.title[lang]}
              </p>
              <p className="mt-1 text-sm text-text/70">{f.body[lang]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-6">
        <h3 className="font-mono text-xs text-dim">## {tr ? "mimari" : "architecture"}</h3>
        <div className="mt-3 flex flex-col items-stretch gap-2 font-mono text-xs sm:flex-row sm:items-center">
          {arch.map((a, i) => (
            <div key={a.name} className="contents">
              {i > 0 && (
                <span className="self-center text-center text-neon">
                  <span className="hidden sm:inline">{i === 1 ? "⇄" : "→"}</span>
                  <span className="sm:hidden">↓</span>
                  <span className="block text-[10px] text-dim">{i === 1 ? "REST + Socket.io" : "Sequelize"}</span>
                </span>
              )}
              <div className="flex-1 rounded border border-line bg-panel p-3 text-center">
                <p className="text-sm text-text">{a.name}</p>
                <p className="mt-0.5 text-[11px] text-dim">{a.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-6">
        <h3 className="font-mono text-xs text-dim">## stack</h3>
        <div className="mt-3 grid gap-3 font-mono text-xs sm:grid-cols-2">
          {Object.entries(tm.stack).map(([k, v]) => (
            <div key={k}>
              <p className="text-dim">{k}/</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {v.map((s) => <span key={s} className="rounded border border-line bg-panel px-2 py-1">{s}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

    </article>
  );
}
