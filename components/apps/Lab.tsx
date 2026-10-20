"use client";

import { useOS } from "@/lib/store";
import { profile, ui } from "@/lib/content";

export default function Lab() {
  const { lang, open } = useOS();
  const items = [
    { name: "snake.exe", desc: lang === "tr" ? "Klasik yılan oyunu. Ok tuşları / kaydırma." : "Classic snake. Arrow keys / swipe.", action: () => open("snake") },
    { name: "kanban-demo", desc: lang === "tr" ? "Task Management projesinin sürükle-bırak mini versiyonu." : "Drag-and-drop mini version of the Task Management project.", action: () => open("kanban") },
    { name: "terminal", desc: lang === "tr" ? "Gerçek komutlar çalışan bir shell." : "A shell that actually runs commands.", action: () => open("terminal") },
    { name: "oguzhan.os", desc: ui.this_site[lang], action: () => window.open(profile.github, "_blank") },
  ];
  return (
    <div className="p-5 text-[13px]">
      <p className="text-dim">{ui.lab_intro[lang]}</p>
      <ul className="mt-4 space-y-2">
        {items.map((it) => (
          <li key={it.name}>
            <button onClick={it.action} className="w-full rounded border border-line bg-black/30 p-3 text-left hover:border-yellow-300/60">
              <span className="text-yellow-300">▸ {it.name}</span>
              <p className="mt-1 text-text/70">{it.desc}</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
