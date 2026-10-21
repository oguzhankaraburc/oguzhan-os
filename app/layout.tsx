import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const mono = JetBrains_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-jetbrains" });
const sans = Space_Grotesk({ subsets: ["latin", "latin-ext"], variable: "--font-space" });

// Share cards need absolute image URLs. Netlify sets URL (and Vercel its own variable) on deploy;
// replace the fallback with your own domain if you add one.
const siteUrl =
  process.env.URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

const title = "Oğuzhan Karaburç — oguzhan.os";
const description = "Yazılım Mühendisi Oğuzhan Karaburç'un portfolyosu. Software Engineer portfolio.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: { title, description, type: "website", locale: "tr_TR", alternateLocale: "en_US", siteName: "oguzhan.os" },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = { themeColor: "#05060a", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${mono.variable} ${sans.variable}`}>
      <body className="font-mono antialiased scanlines">{children}</body>
    </html>
  );
}
