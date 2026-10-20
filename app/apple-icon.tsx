import { ImageResponse } from "next/og";

// Home-screen icon for iOS; iOS rounds the corners itself
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 70% 25%, #10331f 0%, #05060a 65%)",
          color: "#7cffb2",
          fontSize: 92,
          fontWeight: 700,
          letterSpacing: -6,
        }}
      >
        {">_"}
      </div>
    ),
    size,
  );
}
