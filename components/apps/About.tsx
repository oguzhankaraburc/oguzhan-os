"use client";

import { useOS } from "@/lib/store";
import { profile, education, languages } from "@/lib/content";

export default function About() {
  const lang = useOS((s) => s.lang);
  return (
    <article className="p-6 font-sans">
      <p className="font-mono text-xs text-dim"># {lang === "tr" ? "hakkımda" : "about"}</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight">{profile.name}</h2>
      <p className="mt-1 font-mono text-sm text-neon">{profile.title[lang]} · {profile.location[lang]}</p>
      <div className="mt-5 space-y-3 text-[15px] leading-relaxed text-text/85">
        {profile.about[lang].map((p, i) => <p key={i}>{p}</p>)}
      </div>

      <h3 className="mt-8 font-mono text-xs text-dim">## {lang === "tr" ? "eğitim" : "education"}</h3>
      <ul className="mt-3 space-y-2">
        {education.map((e) => (
          <li key={e.school} className="flex flex-wrap items-baseline justify-between gap-x-4 border-l-2 border-violet/60 pl-3">
            <span><b>{e.school}</b> <span className="text-text/70">— {e.dept[lang]}</span></span>
            <span className="font-mono text-xs text-dim">{e.period}</span>
          </li>
        ))}
      </ul>

      <h3 className="mt-8 font-mono text-xs text-dim">## {lang === "tr" ? "diller" : "languages"}</h3>
      <p className="mt-2 text-sm">{languages.map((l) => `${l.name[lang]} (${l.level[lang]})`).join(" · ")}</p>
    </article>
  );
}
