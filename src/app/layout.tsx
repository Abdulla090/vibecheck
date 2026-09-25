import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VibeCheck — Automated Deployment & Health Hub",
  description: "Automated continuous deployment and verification pipeline powered by GitHub and Vercel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased bg-[#090a0f] text-[#f3f4f6]">
        {children}
      </body>
    </html>
  );
}
