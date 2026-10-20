"use client";

import { useEffect, useRef, useState } from "react";
import { useOS, type AppId } from "@/lib/store";
import { profile, skills, experience, education, projects, ui, type Lang } from "@/lib/content";

type Line = { kind: "in" | "out" | "err" | "ok"; text: string };

const files: Record<string, AppId> = {
  "about.md": "about", "hakkimda.md": "about",
  "experience.log": "experience", "deneyim.log": "experience",
  "skills": "skills", "yetenekler": "skills",
  "contact.sh": "contact", "iletisim.sh": "contact",
  "lab": "lab", "snake.exe": "snake",
  "projects": "projects", "projeler": "projects",
  "task-manager": "taskmanager", "task-manager.app": "taskmanager",
  "kanban": "kanban", "kanban-demo": "kanban",
};

const commandNames = ["help", "whoami", "ls", "cat", "open", "projects", "skills", "experience", "education", "contact", "lang", "date", "echo", "clear", "history", "neofetch", "sudo", "exit"];

function run(raw: string, lang: Lang, ctx: { open: (id: AppId) => void; setLang: (l: Lang) => void; history: string[] }): Line[] | "clear" {
  const [cmd, ...args] = raw.trim().split(/\s+/);
  const arg = args.join(" ");
  const tr = lang === "tr";
  const out = (t: string): Line => ({ kind: "out", text: t });
  const err = (t: string): Line => ({ kind: "err", text: t });

  switch (cmd) {
    case "":
      return [];
    case "help":
      return [
        out(tr ? "Kullanılabilir komutlar:" : "Available commands:"),
        out("  whoami        " + (tr ? "ben kimim" : "who am I")),
        out("  ls            " + (tr ? "dosyaları listele" : "list files")),
        out("  cat <dosya>   " + (tr ? "dosyayı oku" : "read a file")),
        out("  open <dosya>  " + (tr ? "pencerede aç" : "open in a window")),
        out("  projects      " + (tr ? "projelerim" : "my projects")),        out("  skills · experience · education · contact"),
        out("  neofetch      " + (tr ? "sistem bilgisi" : "system info")),
        out("  lang tr|en    " + (tr ? "dili değiştir" : "switch language")),
        out("  clear · history · date · echo"),
        out(tr ? "  ...ve birkaç gizli komut 👀" : "  ...and a few hidden ones 👀"),
      ];
    case "whoami":
      return [out(`${profile.name} — ${profile.title[lang]}`), out(profile.about[lang][1])];
    case "ls":
      if (/^(projects|projeler)\/?$/.test(arg)) return projects.map((p) => out(p.app ? "task-manager.app" : p.id + "/"));
      return [out(tr ? "hakkimda.md  deneyim.log  projeler/  yetenekler/  iletisim.sh  lab/  snake.exe" : "about.md  experience.log  projects/  skills/  contact.sh  lab/  snake.exe")];
    case "cat": {
      const f = arg.replace(/\/$/, "");
      if (!f) return [err("cat: " + (tr ? "dosya adı gerekli" : "missing file name"))];
      if (files[f] === "about") return profile.about[lang].map(out);
      if (files[f] === "experience") return run("experience", lang, ctx) as Line[];
      if (files[f] === "contact") return run("contact", lang, ctx) as Line[];
      if (files[f]) return [err(`cat: ${f}: ${tr ? "bu bir klasör/uygulama, 'open' dene" : "is a directory/app, try 'open'"}`)];
      return [err(`cat: ${f}: ${tr ? "böyle bir dosya yok" : "no such file"}`)];
    }
    case "open": {
      const id = files[arg.replace(/\/$/, "")];
      if (!id) return [err(`open: ${arg || "?"}: ${tr ? "bulunamadı" : "not found"}`)];
      ctx.open(id);
      return [{ kind: "ok", text: `→ ${arg}` }];
    }
    case "projects":
      return [
        ...projects.flatMap((p) => [
          { kind: "ok" as const, text: `${p.featured ? "★ " : "  "}${p.name}  [${p.stack.join(", ")}]` },
          out(`    ${p.summary[lang]}`),
        ]),
        out(""),
        out(tr ? "Detay için: open task-manager · Demo için: open kanban" : "Details: open task-manager · Demo: open kanban"),
      ];
    case "skills":
      return Object.entries(skills).map(([k, v]) => out(`${k.padEnd(10)} ${v.join(", ")}`));
    case "experience":
      return experience.flatMap((e) => [
        { kind: "ok" as const, text: `[${e.period[lang]}] ${e.role[lang]}` },
        out(`  @ ${e.company}`),
        ...e.points[lang].map((p) => out("  - " + p)),
      ]);
    case "education":
      return education.map((e) => out(`${e.period}  ${e.school} — ${e.dept[lang]}`));
    case "contact":
      return [out(`email     ${profile.email}`), out(`github    ${profile.github}`), out(`linkedin  ${profile.linkedin}`)];
    case "lang":
      if (arg === "tr" || arg === "en") { ctx.setLang(arg); return [{ kind: "ok", text: arg === "tr" ? "Dil: Türkçe" : "Language: English" }]; }
      return [err("usage: lang tr|en")];
    case "date":
      return [out(new Date().toString())];
    case "echo":
      return [out(arg)];
    case "history":
      return ctx.history.map((h, i) => out(`${String(i + 1).padStart(4)}  ${h}`));
    case "clear":
      return "clear";
    case "neofetch":
      return [
        { kind: "ok", text: `${profile.handle}@os` },
        out("-----------"),
        out(`OS        oguzhan.os (web)`),
        out(`Role      ${profile.title[lang]}`),
        out(`Location  ${profile.location[lang]}`),
        out(`Shell     zsh-ish 0.1`),
        out(`Stack     ${skills.frontend.slice(3).join(", ")}`),
        out(`Uptime    ${tr ? "Temmuz 2025'ten beri mezun" : "graduated since Jul 2025"}`),
      ];
    case "sudo":
      if (arg === "hire-me" || arg === "hire oguzhan")
        return [
          { kind: "ok", text: tr ? "[sudo] yetki verildi ✓" : "[sudo] permission granted ✓" },
          out(tr ? `Harika! Bana ${profile.email} adresinden ulaşabilirsin.` : `Great call. Reach me at ${profile.email}.`),
        ];
      if (arg.startsWith("rm")) return [err(tr ? "Güzel deneme. 🙂" : "Nice try. 🙂")];
      return [err(tr ? `${profile.handle} sudoers dosyasında değil. Bu olay rapor edilecek.` : `${profile.handle} is not in the sudoers file. This incident will be reported.`)];
    case "exit":
      return [out(tr ? "Çıkış yok. Sadece daha derin katmanlar var." : "There is no exit. Only deeper layers.")];
    case "hello": case "merhaba": case "hi":
      return [out(tr ? "Selam! 👋 'help' ile başlayabilirsin." : "Hey! 👋 Start with 'help'.")];
    case "coffee": case "kahve":
      return [out("  ( (\n   ) )\n ........\n |      |]\n \\      /\n  `----'")]
    case "matrix":
      return [{ kind: "ok", text: tr ? "Uyan, Neo... Seni bulduk. Beyaz tavşanı takip et: 'open snake.exe'" : "Wake up, Neo... Follow the white rabbit: 'open snake.exe'" }];
    default:
      return [err(`${cmd}: ${tr ? "komut bulunamadı. 'help' yaz." : "command not found. Type 'help'."}`)];
  }
}

export default function Terminal() {
  const { lang, open, setLang } = useOS();
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLines([{ kind: "ok", text: ui.welcome[lang] }]);
    // Focus only with a mouse; on touch screens it would pop the keyboard over the window
    if (matchMedia("(pointer: fine)").matches) inputRef.current?.focus();
    // Only greet once; later language switches keep the scrollback
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  const exec = (cmd: string) => {
    const h = cmd.trim() ? [...history, cmd.trim()] : history;
    const res = run(cmd, lang, { open, setLang, history: h });
    setHistory(h);
    setHi(-1);
    setInput("");
    if (res === "clear") setLines([]);
    else setLines((l) => [...l, { kind: "in", text: cmd }, ...res]);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    exec(input);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      const n = hi < 0 ? history.length - 1 : Math.max(0, hi - 1);
      setHi(n); setInput(history[n]);
    } else if (e.key === "ArrowDown" && hi >= 0) {
      e.preventDefault();
      const n = hi + 1;
      if (n >= history.length) { setHi(-1); setInput(""); } else { setHi(n); setInput(history[n]); }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const parts = input.split(" ");
      const pool = parts.length > 1 ? Object.keys(files) : commandNames;
      const last = parts[parts.length - 1];
      const match = pool.filter((c) => c.startsWith(last));
      if (match.length === 1) { parts[parts.length - 1] = match[0]; setInput(parts.join(" ") + " "); }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault(); setLines([]);
    }
  };

  const color = { in: "text-text", out: "text-text/75", err: "text-blood", ok: "text-neon" };

  return (
    <div className="min-h-full cursor-text bg-black/50 p-4 text-[13px] leading-relaxed" onClick={() => inputRef.current?.focus()}>
      {lines.map((l, i) => (
        <div key={i} className={`whitespace-pre-wrap break-words ${color[l.kind]}`}>
          {l.kind === "in" ? (<><span className="text-violet">{profile.handle}@os</span><span className="text-dim">:~$ </span>{l.text}</>) : l.text}
        </div>
      ))}
      <form onSubmit={submit} className="flex">
        <span className="text-violet">{profile.handle}@os</span>
        <span className="text-dim">:~$&nbsp;</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          aria-label="terminal input"
          enterKeyHint="go"
          // 16px on phones: iOS zooms the page into any smaller input
          className="min-w-0 flex-1 bg-transparent text-base text-text caret-neon outline-none sm:text-[13px]"
        />
      </form>
      {/* Phones have no Tab or arrow keys, so offer the common commands as taps */}
      <div className="mt-4 flex flex-wrap gap-2 sm:hidden">
        {["help", "whoami", "projects", "neofetch", "sudo hire-me", "clear"].map((c) => (
          <button
            key={c}
            onClick={(e) => { e.stopPropagation(); exec(c); }}
            className="rounded border border-line bg-panel px-3 py-2 text-xs text-text/80 active:border-neon/60 active:text-neon"
          >
            {c}
          </button>
        ))}
      </div>
      <div ref={endRef} />
    </div>
  );
}
