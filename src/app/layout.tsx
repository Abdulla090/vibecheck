import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Royal VIP Dental & Aesthetic Clinic | کلینیکی شاهانەی ددان و جوانکاری",
  description:
    "Premier VIP Cosmetic Dentistry, Hollywood Smile Veneers, Straumann Implants & Laser Dermatology in Erbil (Gulan St) and Sulaymaniyah (Salim St).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ckb" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#0B0F17] text-[#F8FAFC] antialiased selection:bg-[#10B981] selection:text-[#0B0F17]">
        {children}
      </body>
    </html>
  );
}
