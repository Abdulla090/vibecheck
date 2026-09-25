import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VibeCheck — Prompt Scorer & VibeCraft DAO Portal",
  description: "Real-time AI prompt evaluation, ambiguity/clarity scoring, Base L2 cryptographic attestation, and 30-day squad launch portal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased bg-[#10110f] text-[#f2f3ed] font-sans selection:bg-[#bce83e] selection:text-[#101408]">
        {children}
      </body>
    </html>
  );
}
