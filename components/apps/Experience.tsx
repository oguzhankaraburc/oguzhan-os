"use client";

import { useOS } from "@/lib/store";
import { experience, certificates } from "@/lib/content";

export default function Experience() {
  const lang = useOS((s) => s.lang);
  return (
    <div className="p-5 text-[13px] leading-relaxed">
      <p className="text-dim">$ tail -f /var/log/{lang === "tr" ? "deneyim" : "experience"}.log</p>
      {experience.map((e) => (
        <div key={e.company} className="mt-4 rounded border border-line bg-black/30 p-4">
          <p><span className="text-violet">[{e.period[lang]}]</span> <span className="text-neon">INFO</span> {e.role[lang]}</p>
          <p className="mt-1 font-sans text-base font-semibold">{e.company}</p>
          <ul className="mt-2 space-y-1 text-text/80">
            {e.points[lang].map((p) => <li key={p}>→ {p}</li>)}
          </ul>
          <div className="mt-3 flex gap-2">
            {e.stack.map((s) => <span key={s} className="rounded bg-neon/10 px-2 py-0.5 text-xs text-neon">{s}</span>)}
          </div>
        </div>
      ))}

      <p className="mt-6 text-dim">$ ls ~/{lang === "tr" ? "sertifikalar" : "certificates"}</p>
      <ul className="mt-2 space-y-1.5">
        {certificates.map((c) => (
          <li key={c.name} className="flex flex-wrap justify-between gap-x-4">
            <span><span className="text-yellow-300">✦</span> {c.name} <span className="text-dim">— {c.org}</span></span>
            <span className="text-dim">{c.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
