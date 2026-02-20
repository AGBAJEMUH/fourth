/* ============================================================
   Meridian — Root Layout
   Provides global font loading, metadata, and theme wrapper.
   ============================================================ */
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Meridian — AI Body Intelligence Journal",
  description:
    "Decode your body's signals. Meridian uses AI-powered correlation to reveal the hidden connections between your lifestyle and how you feel.",
  keywords: [
    "health tracker",
    "AI health journal",
    "symptom correlation",
    "body intelligence",
    "wellness",
    "chronic pain tracker",
  ],
  openGraph: {
    title: "Meridian — AI Body Intelligence Journal",
    description:
      "Decode your body's signals with AI-powered health correlation.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#14b8a6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Inter font from Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-dvh antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
