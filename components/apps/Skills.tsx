"use client";

import { motion } from "motion/react";
import { skills } from "@/lib/content";

export default function Skills() {
  return (
    <div className="grid gap-4 p-5 sm:grid-cols-2">
      {Object.entries(skills).map(([group, items], gi) => (
        <div key={group} className={`rounded border border-line bg-black/30 p-4 ${gi === 0 ? "sm:col-span-2" : ""}`}>
          <p className="text-xs text-dim">📁 {group}/</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {items.map((s, i) => (
              <motion.span
                key={s}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.12 + i * 0.04 }}
                whileHover={{ y: -2 }}
                className="cursor-default rounded border border-line bg-panel px-3 py-1.5 text-sm hover:border-neon/60 hover:text-neon"
              >
                {s}
              </motion.span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
