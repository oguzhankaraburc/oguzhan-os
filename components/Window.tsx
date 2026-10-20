"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { useOS, type Win } from "@/lib/store";
import { useIsMobile } from "@/lib/useIsMobile";

type Props = { win: Win; title: string; children: React.ReactNode };

// Upper bound for maximized and hand-resized windows: content stays readable on wide screens
const MAX_W = 1100;
const MAX_H = 820;

function Light({ label, color, onClick, children }: { label: string; color: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`grid size-3.5 place-items-center rounded-full ${color} shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.3)] active:brightness-75`}
    >
      <svg
        viewBox="0 0 12 12"
        className="size-2.5"
        fill="none"
        stroke="rgba(0,0,0,0.6)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </button>
  );
}

export default function Window({ win, title, children }: Props) {
  const { focus, close, toggleMin, toggleMax, move, resize } = useOS();
  const mobile = useIsMobile();
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const full = mobile || win.maximized;

  const onTitleDown = (e: React.PointerEvent) => {
    if (full || (e.target as HTMLElement).closest("button")) return;
    focus(win.id);
    drag.current = { dx: e.clientX - win.x, dy: e.clientY - win.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onTitleMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const x = Math.min(Math.max(e.clientX - drag.current.dx, -win.w + 120), window.innerWidth - 120);
    const y = Math.min(Math.max(e.clientY - drag.current.dy, 32), window.innerHeight - 60);
    move(win.id, x, y);
  };
  const onTitleUp = () => (drag.current = null);

  const onResizeDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    const sx = e.clientX, sy = e.clientY, sw = win.w, sh = win.h;
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    const mv = (ev: PointerEvent) =>
      resize(
        win.id,
        Math.min(MAX_W, Math.max(320, sw + ev.clientX - sx)),
        Math.min(MAX_H, Math.max(220, sh + ev.clientY - sy)),
      );
    const up = () => { el.removeEventListener("pointermove", mv); el.removeEventListener("pointerup", up); };
    el.addEventListener("pointermove", mv);
    el.addEventListener("pointerup", up);
  };

  // Maximized on desktop: centered and capped instead of edge to edge; dock keeps its 64px at the bottom
  const maxStyle = {
    width: `min(calc(100vw - 32px), ${MAX_W}px)`,
    height: `min(calc(100dvh - var(--bar) - 88px), ${MAX_H}px)`,
    left: `max(16px, calc((100vw - ${MAX_W}px) / 2))`,
    top: "calc(var(--bar) + 12px)",
  };
  const style = mobile
    ? { left: 0, top: "var(--bar)", width: "100vw", height: "calc(100dvh - var(--bar))", zIndex: win.z }
    : win.maximized
      ? { ...maxStyle, zIndex: win.z }
      : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z };

  return (
    <motion.section
      role="dialog"
      aria-label={title}
      onPointerDown={() => focus(win.id)}
      initial={{ opacity: 0, scale: 0.94, filter: "blur(6px)" }}
      animate={win.minimized ? { opacity: 0, scale: 0.8, y: 200, pointerEvents: "none" } : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", pointerEvents: "auto" }}
      exit={{ opacity: 0, scale: 0.94, filter: "blur(6px)" }}
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
      style={style}
      className={`fixed flex flex-col overflow-hidden border border-line bg-panel/85 backdrop-blur-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9),0_0_0_1px_rgba(124,255,178,0.04)] ${mobile ? "" : "rounded-lg"}`}
    >
      <header
        onPointerDown={onTitleDown}
        onPointerMove={onTitleMove}
        onPointerUp={onTitleUp}
        onDoubleClick={() => !mobile && toggleMax(win.id)}
        className={`flex shrink-0 select-none items-center gap-3 border-b border-line bg-black/40 text-xs text-dim ${mobile ? "h-11 pl-4" : "h-9 px-3"} ${full ? "" : "cursor-grab active:cursor-grabbing"}`}
      >
        {/* Traffic lights are too small for fingers; phones get a full-size close button on the right */}
        <div className={`gap-2 ${mobile ? "hidden" : "flex"}`}>
          <Light label="Close" color="bg-[#ff5f57]" onClick={() => close(win.id)}>
            <path d="M3 3l6 6M9 3l-6 6" />
          </Light>
          {!mobile && (
            <Light label="Minimize" color="bg-[#febc2e]" onClick={() => toggleMin(win.id)}>
              <path d="M2.5 6h7" />
            </Light>
          )}
          {!mobile && (
            <Light label="Maximize" color="bg-[#28c840]" onClick={() => toggleMax(win.id)}>
              {win.maximized ? <path d="M6 2v4H2M6 10V6h4" /> : <path d="M3 7.5V9h1.5M9 4.5V3H7.5M3 9l2.5-2.5M9 3L6.5 5.5" />}
            </Light>
          )}
        </div>
        <span className="truncate">~/{title}</span>
        {mobile && (
          <button onClick={() => close(win.id)} aria-label="Close" className="ml-auto grid size-11 place-items-center text-base text-text active:bg-white/10">
            ✕
          </button>
        )}
      </header>
      <div className="scroll-thin min-h-0 flex-1 overflow-auto">{children}</div>
      {!full && (
        <div onPointerDown={onResizeDown} className="absolute bottom-0 right-0 size-4 cursor-nwse-resize" style={{ background: "linear-gradient(135deg, transparent 50%, var(--color-line) 50%)" }} />
      )}
    </motion.section>
  );
}
