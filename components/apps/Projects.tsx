"use client";

import { useOS } from "@/lib/store";
import { projects } from "@/lib/content";

export default function Projects() {
  const { lang, open } = useOS();
  const tr = lang === "tr";
  return (
    <div className="p-5 text-[13px]">
      <p className="text-dim">$ ls -la ~/{tr ? "projeler" : "projects"}</p>
      <ul className="mt-4 space-y-2">
        {projects.map((p) => (
          <li
            key={p.id}
            className={`rounded border bg-black/30 p-3 ${p.featured ? "border-neon/40 shadow-[0_0_30px_-12px_var(--color-neon)]" : "border-line"}`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className={`font-sans text-[15px] font-semibold ${p.featured ? "text-neon" : ""}`}>{p.name}</span>
              {p.featured && <span className="rounded bg-neon/15 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-neon">{tr ? "öne çıkan" : "featured"}</span>}
            </div>
            <p className="mt-1 text-text/70">{p.summary[lang]}</p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {p.stack.map((s) => <span key={s} className="rounded bg-white/5 px-1.5 py-0.5 text-[11px] text-dim">{s}</span>)}
              <span className="ml-auto flex gap-3">
                {p.app && <button onClick={() => open(p.app!)} className="text-neon hover:underline">{tr ? "incele →" : "explore →"}</button>}
                {p.live && <a href={p.live} target="_blank" rel="noreferrer" className="text-violet hover:underline">{tr ? "canlı ↗" : "live ↗"}</a>}
                <a href={p.repo} target="_blank" rel="noreferrer" className="text-dim hover:text-text">github ↗</a>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
