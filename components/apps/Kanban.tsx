"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOS } from "@/lib/store";

// A small client-only version of the Task Management board: same statuses and
// priorities, optimistic by nature since there is no server. State persists per visitor.

type Status = "todo" | "progress" | "done";
type Priority = "low" | "medium" | "high";
type Task = { id: string; title: string; priority: Priority; status: Status };

const KEY = "kanban-demo-v1";

const seed = (tr: boolean): Task[] => [
  { id: "1", title: tr ? "Login sayfası tasarımı" : "Design the login page", priority: "medium", status: "done" },
  { id: "2", title: tr ? "JWT middleware yaz" : "Write JWT middleware", priority: "high", status: "done" },
  { id: "3", title: tr ? "Socket.io bildirimleri" : "Socket.io notifications", priority: "high", status: "progress" },
  { id: "4", title: tr ? "Analiz grafikleri" : "Analytics charts", priority: "medium", status: "progress" },
  { id: "5", title: tr ? "Takvim görünümü" : "Calendar view", priority: "low", status: "todo" },
  { id: "6", title: tr ? "Dark mode desteği" : "Dark mode support", priority: "low", status: "todo" },
  { id: "7", title: tr ? "Bu kartı sürükle →" : "Drag this card →", priority: "medium", status: "todo" },
];

const columns: { id: Status; tr: string; en: string; dot: string }[] = [
  { id: "todo", tr: "Yapılacak", en: "Todo", dot: "bg-dim" },
  { id: "progress", tr: "Devam ediyor", en: "In Progress", dot: "bg-yellow-300" },
  { id: "done", tr: "Tamamlandı", en: "Done", dot: "bg-neon" },
];

const prio: Record<Priority, { tr: string; en: string; cls: string }> = {
  low: { tr: "Düşük", en: "Low", cls: "bg-sky-400/15 text-sky-300" },
  medium: { tr: "Orta", en: "Medium", cls: "bg-yellow-300/15 text-yellow-300" },
  high: { tr: "Yüksek", en: "High", cls: "bg-blood/15 text-blood" },
};
const nextPrio: Record<Priority, Priority> = { low: "medium", medium: "high", high: "low" };
const order: Status[] = ["todo", "progress", "done"];

export default function Kanban() {
  const lang = useOS((s) => s.lang);
  const tr = lang === "tr";
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dragId, setDragId] = useState<string | null>(null);
  const [over, setOver] = useState<Status | null>(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    let saved: Task[] | null = null;
    try { saved = JSON.parse(localStorage.getItem(KEY) || "null"); } catch {}
    setTasks(saved ?? seed(tr));
    // Load once; seed language is picked at first visit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = (next: Task[]) => {
    setTasks(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  };

  const moveTo = (id: string, status: Status) => {
    const t = tasks.find((x) => x.id === id);
    if (!t || t.status === status) return;
    // Moved cards go to the end of their new column
    save([...tasks.filter((x) => x.id !== id), { ...t, status }]);
  };
  const step = (t: Task, dir: 1 | -1) => moveTo(t.id, order[order.indexOf(t.status) + dir]);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const title = draft.trim();
    if (!title) return;
    save([...tasks, { id: crypto.randomUUID(), title, priority: "medium", status: "todo" }]);
    setDraft("");
  };

  const done = tasks.filter((t) => t.status === "done").length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <div className="flex h-full flex-col gap-3 bg-black/30 p-4 text-[13px]">
      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={add} className="flex min-w-0 flex-1 gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={tr ? "Yeni görev ekle..." : "Add a new task..."}
            maxLength={60}
            enterKeyHint="done"
            // 16px on phones: iOS zooms the page into any smaller input
            className="min-w-0 flex-1 rounded border border-line bg-panel px-3 py-2 text-base outline-none placeholder:text-dim focus:border-neon/60 sm:py-1.5 sm:text-[13px]"
          />
          <button aria-label={tr ? "Görev ekle" : "Add task"} className="min-w-11 rounded bg-neon px-3 font-semibold text-void hover:brightness-110 sm:min-w-0">+</button>
        </form>
        <div className="flex items-center gap-2 text-xs text-dim">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-line">
            <motion.div className="h-full bg-neon" animate={{ width: `${pct}%` }} />
          </div>
          <span className="tabular-nums">{pct}%</span>
          <button onClick={() => save(seed(tr))} className="ml-1 hover:text-text" title={tr ? "Sıfırla" : "Reset"}>↺</button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-3 overflow-auto sm:grid-cols-3">
        {columns.map((col) => {
          const list = tasks.filter((t) => t.status === col.id);
          return (
            <section
              key={col.id}
              onDragOver={(e) => { e.preventDefault(); setOver(col.id); }}
              onDragLeave={() => setOver((o) => (o === col.id ? null : o))}
              onDrop={() => { if (dragId) moveTo(dragId, col.id); setDragId(null); setOver(null); }}
              className={`flex min-h-32 flex-col rounded-lg border p-2 transition-colors ${over === col.id ? "border-neon/60 bg-neon/5" : "border-line bg-panel/60"}`}
            >
              <header className="mb-2 flex items-center gap-2 px-1 text-xs">
                <span className={`size-2 rounded-full ${col.dot}`} />
                <span className="text-text/90">{tr ? col.tr : col.en}</span>
                <span className="ml-auto rounded bg-white/5 px-1.5 text-dim">{list.length}</span>
              </header>
              <div className="flex flex-col gap-2">
                <AnimatePresence initial={false}>
                  {list.map((t) => (
                    <motion.div
                      key={t.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: dragId === t.id ? 0.4 : 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 500, damping: 38 }}
                    >
                      <div
                        draggable
                        onDragStart={(e) => { setDragId(t.id); e.dataTransfer.effectAllowed = "move"; }}
                        onDragEnd={() => { setDragId(null); setOver(null); }}
                        className="group cursor-grab rounded border border-line bg-void/80 p-2.5 hover:border-white/20 active:cursor-grabbing"
                      >
                        <p className={`font-sans text-sm leading-snug ${t.status === "done" ? "text-dim line-through" : ""}`}>{t.title}</p>
                        <div className="mt-2 flex items-center gap-1">
                          <button
                            onClick={() => save(tasks.map((x) => (x.id === t.id ? { ...x, priority: nextPrio[x.priority] } : x)))}
                            title={tr ? "Önceliği değiştir" : "Change priority"}
                            className={`rounded px-2 py-1 text-[11px] sm:px-1.5 sm:py-0.5 sm:text-[10px] ${prio[t.priority].cls}`}
                          >
                            {tr ? prio[t.priority].tr : prio[t.priority].en}
                          </button>
                          {/* Arrow buttons cover touch screens and keyboards, where drag and drop doesn't work */}
                          <span className="ml-auto flex gap-0.5 text-dim">
                            {t.status !== "todo" && <button onClick={() => step(t, -1)} aria-label={tr ? "Geri taşı" : "Move back"} className="rounded px-2.5 py-1.5 hover:bg-white/5 hover:text-text sm:px-1 sm:py-0">←</button>}
                            {t.status !== "done" && <button onClick={() => step(t, 1)} aria-label={tr ? "İleri taşı" : "Move forward"} className="rounded px-2.5 py-1.5 hover:bg-white/5 hover:text-text sm:px-1 sm:py-0">→</button>}
                            <button onClick={() => save(tasks.filter((x) => x.id !== t.id))} aria-label={tr ? "Sil" : "Delete"} className="rounded px-2.5 py-1.5 hover:bg-blood/10 hover:text-blood sm:px-1 sm:py-0">✕</button>
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          );
        })}
      </div>
      <p className="text-center text-[11px] text-dim">
        {tr ? "Bu, Task Management projesinin tarayıcıda çalışan mini bir versiyonu. Veriler sadece senin tarayıcında saklanır." : "A mini in-browser version of the Task Management project. Data stays in your browser only."}
      </p>
    </div>
  );
}
