"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useOS } from "@/lib/store";

const N = 20;
type P = { x: number; y: number };

export default function Snake() {
  const lang = useOS((s) => s.lang);
  const cv = useRef<HTMLCanvasElement>(null);
  const st = useRef({ snake: [{ x: 10, y: 10 }] as P[], dir: { x: 1, y: 0 }, next: { x: 1, y: 0 }, food: { x: 15, y: 10 }, alive: true });
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [dead, setDead] = useState(false);

  const reset = useCallback(() => {
    st.current = { snake: [{ x: 10, y: 10 }], dir: { x: 1, y: 0 }, next: { x: 1, y: 0 }, food: { x: 15, y: 10 }, alive: true };
    setScore(0); setDead(false);
  }, []);

  useEffect(() => {
    try { setBest(Number(localStorage.getItem("snake-best")) || 0); } catch {}
  }, []);

  const turn = (x: number, y: number) => {
    const d = st.current.dir;
    if (d.x === -x && d.y === -y) return;
    st.current.next = { x, y };
  };

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const m: Record<string, [number, number]> = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] };
      if (m[e.key] && document.activeElement?.tagName !== "INPUT") { e.preventDefault(); turn(...m[e.key]); }
      if (e.key === " " && !st.current.alive) reset();
    };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [reset]);

  useEffect(() => {
    const ctx = cv.current!.getContext("2d")!;
    const id = setInterval(() => {
      const s = st.current;
      if (s.alive) {
        s.dir = s.next;
        const h = { x: (s.snake[0].x + s.dir.x + N) % N, y: (s.snake[0].y + s.dir.y + N) % N };
        if (s.snake.some((p) => p.x === h.x && p.y === h.y)) {
          s.alive = false; setDead(true);
          setBest((b) => { const nb = Math.max(b, s.snake.length - 1); try { localStorage.setItem("snake-best", String(nb)); } catch {} return nb; });
        } else {
          s.snake.unshift(h);
          if (h.x === s.food.x && h.y === s.food.y) {
            setScore(s.snake.length - 1);
            do { s.food = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) }; }
            while (s.snake.some((p) => p.x === s.food.x && p.y === s.food.y));
          } else s.snake.pop();
        }
      }
      const c = ctx.canvas.width / N;
      ctx.fillStyle = "#05060a"; ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = "#ff5c7a"; ctx.shadowColor = "#ff5c7a"; ctx.shadowBlur = 12;
      ctx.fillRect(s.food.x * c + 3, s.food.y * c + 3, c - 6, c - 6);
      ctx.shadowColor = "#7cffb2";
      s.snake.forEach((p, i) => {
        ctx.fillStyle = i === 0 ? "#7cffb2" : `rgba(124,255,178,${Math.max(0.25, 1 - i / s.snake.length)})`;
        ctx.fillRect(p.x * c + 1, p.y * c + 1, c - 2, c - 2);
      });
      ctx.shadowBlur = 0;
    }, 110);
    return () => clearInterval(id);
  }, []);

  // swipe controls for touch screens
  const touch = useRef<P | null>(null);

  return (
    <div className="flex h-full flex-col items-center gap-3 p-4 text-xs">
      <div className="flex w-full max-w-[360px] justify-between text-dim">
        <span>score <b className="text-neon">{score}</b></span>
        <span>best <b className="text-violet">{best}</b></span>
      </div>
      <div className="relative w-full max-w-[360px]">
        <canvas
          ref={cv}
          width={400}
          height={400}
          className="aspect-square w-full touch-none rounded border border-line"
          onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
          onTouchEnd={(e) => {
            if (!touch.current) return;
            const dx = e.changedTouches[0].clientX - touch.current.x, dy = e.changedTouches[0].clientY - touch.current.y;
            if (Math.abs(dx) < 10 && Math.abs(dy) < 10) { if (dead) reset(); return; }
            if (Math.abs(dx) > Math.abs(dy)) turn(Math.sign(dx), 0); else turn(0, Math.sign(dy));
          }}
        />
        {dead && (
          <button onClick={reset} className="absolute inset-0 grid place-items-center bg-void/70 text-sm text-blood">
            GAME OVER — {lang === "tr" ? "tekrar için tıkla / boşluk" : "click / space to retry"}
          </button>
        )}
      </div>
      <p className="text-dim">{lang === "tr" ? "ok tuşları / WASD / kaydır" : "arrow keys / WASD / swipe"}</p>
    </div>
  );
}
