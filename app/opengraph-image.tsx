import { ImageResponse } from "next/og";
import { profile } from "@/lib/content";

// Preview card shown when the link is shared (LinkedIn, WhatsApp, X, Slack...)
export const alt = `${profile.name} — ${profile.title.en}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const lines: [string, string][] = [
  ["$ ", "whoami"],
  ["", `${profile.name} — ${profile.title.tr} / ${profile.title.en}`],
  ["$ ", "ls ~/stack"],
  ["", "React  Vue.js  Tailwind  Node.js  Express  PostgreSQL"],
  ["$ ", "open projects/task-manager.app"],
];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#05060a",
          backgroundImage: "radial-gradient(ellipse at 80% 10%, #1a1240 0%, transparent 55%), radial-gradient(ellipse at 10% 100%, #0c2a1b 0%, transparent 50%)",
          padding: "52px 64px 56px",
          color: "#d6dbf0",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, color: "#7cffb2", fontWeight: 700 }}>
          {/* Drawn instead of the ◢ glyph: the OG renderer's fonts don't include it */}
          <svg width="22" height="22" viewBox="0 0 22 22"><path d="M22 0V22H0Z" fill="#7cffb2" /></svg>
          oguzhan.os
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: 36 }}>
          <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: -3, lineHeight: 1, color: "#ffffff" }}>{profile.name}</div>
          <div style={{ fontSize: 32, marginTop: 14, color: "#a78bfa" }}>
            {`${profile.title.tr} · ${profile.title.en}`}
          </div>
        </div>

        {/* Terminal window */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "auto",
            border: "2px solid #1c2030",
            borderRadius: 14,
            background: "rgba(11,13,20,0.85)",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", gap: 10, padding: "14px 18px", borderBottom: "2px solid #1c2030", background: "rgba(0,0,0,0.4)" }}>
            <div style={{ width: 16, height: 16, borderRadius: 8, background: "#ff5f57" }} />
            <div style={{ width: 16, height: 16, borderRadius: 8, background: "#febc2e" }} />
            <div style={{ width: 16, height: 16, borderRadius: 8, background: "#28c840" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", padding: "18px 24px", fontSize: 24, gap: 6 }}>
            {lines.map(([p, t], i) => (
              <div key={i} style={{ display: "flex", color: p ? "#d6dbf0" : "#7cffb2" }}>
                {p && <span style={{ color: "#a78bfa", marginRight: 8 }}>oguzhan@os:~{p}</span>}
                {t}
                {i === lines.length - 1 && <span style={{ marginLeft: 6, width: 14, height: 28, background: "#7cffb2" }} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
