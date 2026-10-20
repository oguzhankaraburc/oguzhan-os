import { ImageResponse } from "next/og";

// Browser tab icon: a neon prompt on the site's void background
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#05060a",
          borderRadius: 14,
          border: "3px solid #1c2030",
          color: "#7cffb2",
          fontSize: 34,
          fontWeight: 700,
          letterSpacing: -2,
        }}
      >
        {">_"}
      </div>
    ),
    size,
  );
}
