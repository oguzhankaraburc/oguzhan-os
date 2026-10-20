"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOS, type AppId } from "@/lib/store";
import { profile } from "@/lib/content";
import { apps } from "./apps";
import Window from "./Window";
import ShaderBg from "./ShaderBg";

export default function Desktop() {
  const { windows, lang, setLang, open, booted, focus, toggleMin } = useOS();
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString(lang === "tr" ? "tr-TR" : "en-GB", { hour: "2-digit", minute: "2-digit" }));
    tick();
    const t = setInterval(tick, 10_000);
    return () => clearInterval(t);
  }, [lang]);

  // Open the terminal right after boot so visitors meet the interactive part first.
  // Phones skip this: a full-screen terminal hides the home screen and invites the keyboard.
  useEffect(() => {
    if (booted && !matchMedia("(max-width: 767px)").matches) open("terminal");
  }, [booted, open]);

  const topId = windows.filter((w) => !w.minimized).sort((a, b) => b.z - a.z)[0]?.id;

  return (
    <div className="relative h-full w-full">
      <ShaderBg />

      {/* top bar */}
      <div
        className="fixed inset-x-0 top-0 z-[5000] flex items-center gap-4 border-b border-line/60 bg-void/60 px-4 text-xs backdrop-blur-md"
        style={{ height: "var(--bar)", paddingTop: "env(safe-area-inset-top)" }}
      >
        <span className="font-bold text-neon">◢ oguzhan.os</span>
        <span className="hidden text-dim sm:inline">{profile.title[lang]}</span>
        <div className="ml-auto flex items-center gap-3">
          <div className="flex overflow-hidden rounded border border-line">
            {(["tr", "en"] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)} className={`px-2.5 py-1 uppercase sm:px-2 sm:py-0.5 ${lang === l ? "bg-neon text-void" : "text-dim hover:text-text"}`}>
                {l}
              </button>
            ))}
          </div>
          <span className="tabular-nums text-dim">{time}</span>
        </div>
      </div>

      {/* hero name, sits behind everything */}
      <div className="pointer-events-none fixed inset-0 flex select-none flex-col items-center justify-center text-center">
        <h1 className="glitch font-sans text-[13vw] font-bold leading-none tracking-tighter text-white/[0.06] md:text-[9vw]" data-text={profile.name}>
          {profile.name}
        </h1>
        <p className="mt-2 text-xs tracking-[0.5em] text-white/15 uppercase">{profile.title[lang]}</p>
      </div>

      {/* desktop icons */}
      <div className="fixed left-0 top-[calc(var(--bar)+1rem)] z-[1] grid grid-cols-3 gap-2 p-4 md:grid-cols-1">
        {(Object.keys(apps) as AppId[]).filter((id) => apps[id].desktop).map((id, i) => {
          const a = apps[id];
          return (
            <motion.button
              key={id}
              initial={{ opacity: 0, x: -12 }}
              animate={booted ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.06 }}
              onClick={() => open(id)}
              className="group flex w-24 flex-col items-center gap-1.5 rounded-md p-2 outline-none hover:bg-white/5 focus-visible:bg-neon/10"
            >
              <span className={`grid size-12 place-items-center rounded-lg border border-line bg-panel/70 text-xl backdrop-blur ${a.color} transition group-hover:border-neon/50 group-hover:shadow-[0_0_24px_-4px_var(--color-neon)]`}>
                {a.glyph}
              </span>
              <span className="text-[11px] text-text/80">{a.file[lang]}</span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {windows.map((w) => {
          const A = apps[w.id];
          return (
            <Window key={w.id} win={w} title={A.file[lang]}>
              <A.Component />
            </Window>
          );
        })}
      </AnimatePresence>

      {/* dock */}
      <div className="fixed bottom-3 left-1/2 z-[5000] hidden -translate-x-1/2 items-center gap-1 rounded-xl border border-line bg-void/70 p-1.5 backdrop-blur-xl md:flex">
        {(Object.keys(apps) as AppId[]).filter((id) => apps[id].desktop).map((id) => {
          const w = windows.find((x) => x.id === id);
          return (
            <button
              key={id}
              title={apps[id].file[lang]}
              onClick={() => (!w ? open(id) : topId === id ? toggleMin(id) : (w.minimized && toggleMin(id), focus(id)))}
              className={`relative grid size-10 place-items-center rounded-lg text-sm transition hover:-translate-y-1 hover:bg-white/5 ${apps[id].color}`}
            >
              {apps[id].glyph}
              {w && <span className="absolute -bottom-0.5 size-1 rounded-full bg-neon" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
