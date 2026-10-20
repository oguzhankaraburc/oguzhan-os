"use client";

import { useState } from "react";
import { useOS } from "@/lib/store";
import { profile } from "@/lib/content";

export default function Contact() {
  const lang = useOS((s) => s.lang);
  const [copied, setCopied] = useState(false);
  const links = [
    { k: "github", v: profile.github.replace("https://", ""), href: profile.github },
    { k: "linkedin", v: "in/oğuzhankaraburç", href: profile.linkedin },
  ];
  return (
    <div className="p-5 text-[13px]">
      <p className="text-dim">$ ./{lang === "tr" ? "iletisim" : "contact"}.sh</p>
      <p className="mt-3 text-text/80">{lang === "tr" ? "Bir fikrin, teklifin ya da sadece merhaban mı var? Yaz bana." : "Got an idea, an offer, or just want to say hi? Drop me a line."}</p>
      <div className="mt-4 space-y-2">
        <button
          onClick={() => { navigator.clipboard?.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          className="flex w-full items-center justify-between rounded border border-line bg-black/30 px-3 py-2.5 text-left hover:border-neon/60"
        >
          <span><span className="text-blood">email</span> {profile.email}</span>
          <span className="text-xs text-dim">{copied ? (lang === "tr" ? "kopyalandı ✓" : "copied ✓") : (lang === "tr" ? "kopyala" : "copy")}</span>
        </button>
        {links.map((l) => (
          <a key={l.k} href={l.href} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded border border-line bg-black/30 px-3 py-2.5 hover:border-neon/60">
            <span><span className="text-violet">{l.k}</span> {l.v}</span>
            <span className="text-dim">↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}
