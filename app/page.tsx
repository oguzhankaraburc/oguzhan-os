"use client";

import { useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { useOS } from "@/lib/store";
import BootScreen from "@/components/BootScreen";
import Desktop from "@/components/Desktop";

export default function Home() {
  const booted = useOS((s) => s.booted);
  const setLang = useOS((s) => s.setLang);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang");
      if (saved === "tr" || saved === "en") setLang(saved);
      else if (!navigator.language.startsWith("tr")) setLang("en");
    } catch {}
  }, [setLang]);

  return (
    <main className="h-dvh w-screen overflow-hidden">
      <Desktop />
      <AnimatePresence>{!booted && <BootScreen key="boot" />}</AnimatePresence>
    </main>
  );
}
