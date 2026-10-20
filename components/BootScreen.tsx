"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useOS } from "@/lib/store";
import { ui } from "@/lib/content";

const lines = [
  "KARABURÇ BIOS v2.0.25  (c) 2025",
  "CPU: Human Brain @ caffeine-boosted   OK",
  "Memory test ............ unlimited curiosity OK",
  "Detecting drives ....... /dev/frontend /dev/backend",
  "",
  "[  OK  ] Mounted /home/oguzhan",
  "[  OK  ] Started react.service",
  "[  OK  ] Started vue.service",
  "[  OK  ] Started tailwind.service",
  "[  OK  ] Reached target Software Engineer",
  "[  OK  ] Loaded projects/task-manager.app",
  "[ WARN ] coffee level low — refilling",
  "",
  "Starting oguzhan.os ...",
];

export default function BootScreen() {
  const { setBooted, lang } = useOS();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (n >= lines.length) {
      const t = setTimeout(setBooted, 650);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setN(n + 1), n < 4 ? 180 : 110);
    return () => clearTimeout(t);
  }, [n, setBooted]);

  useEffect(() => {
    const skip = () => setBooted();
    addEventListener("keydown", skip);
    addEventListener("pointerdown", skip);
    return () => { removeEventListener("keydown", skip); removeEventListener("pointerdown", skip); };
  }, [setBooted]);

  return (
    <motion.div
      className="fixed inset-0 z-[10000] flex flex-col bg-void px-4 py-[max(1.5rem,env(safe-area-inset-top))] text-[11px] leading-relaxed text-text/80 sm:p-6 sm:text-[13px] md:p-10"
      exit={{ opacity: 0, scaleY: 0.005, filter: "brightness(3)" }}
      transition={{ duration: 0.45, ease: [0.7, 0, 0.84, 0] }}
    >
      {lines.slice(0, n).map((l, i) => (
        <div key={i} className="whitespace-pre-wrap break-words">
          {l.startsWith("[  OK  ]") ? (<><span className="text-neon">[  OK  ]</span>{l.slice(8)}</>)
            : l.startsWith("[ WARN ]") ? (<><span className="text-yellow-300">[ WARN ]</span>{l.slice(8)}</>)
            : l || " "}
        </div>
      ))}
      <span className="caret" />
      <div className="mt-auto text-xs text-dim">
        <span className="hidden [@media(pointer:fine)]:inline">{ui.boot_skip[lang]}</span>
        <span className="[@media(pointer:fine)]:hidden">{ui.boot_skip_touch[lang]}</span>
      </div>
    </motion.div>
  );
}
