"use client";

import React, { useState, useEffect } from "react";
import { ClinicConfig, Language } from "@/types/clinic";
import { DEFAULT_CLINIC_CONFIG } from "@/data/clinicData";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import ProcedureCatalog from "@/components/ProcedureCatalog";
import TrustAndPaymentBadges from "@/components/TrustAndPaymentBadges";
import WhatsAppBookingEngine from "@/components/WhatsAppBookingEngine";
import DoctorCredentials from "@/components/DoctorCredentials";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import FloatingMobileBar from "@/components/FloatingMobileBar";
import DemoSettingsDrawer from "@/components/DemoSettingsDrawer";

export default function Home() {
  const [lang, setLang] = useState<Language>("ckb");
  const [config, setConfig] = useState<ClinicConfig>(DEFAULT_CLINIC_CONFIG);
  const [selectedProcedureId, setSelectedProcedureId] = useState<string>("hollywood-smile");
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load persisted demo configuration and language if available
  useEffect(() => {
    setMounted(true);
    try {
      const savedLang = localStorage.getItem("vip_clinic_lang") as Language | null;
      if (savedLang === "en" || savedLang === "ckb") {
        setLang(savedLang);
      }

      const savedConfig = localStorage.getItem("vip_clinic_config");
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Update HTML direction and language
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dir = lang === "ckb" ? "rtl" : "ltr";
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const handleToggleLang = () => {
    const nextLang: Language = lang === "ckb" ? "en" : "ckb";
    setLang(nextLang);
    try {
      localStorage.setItem("vip_clinic_lang", nextLang);
    } catch {
      // Ignore
    }
  };

  const handleUpdateConfig = (newConfig: ClinicConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem("vip_clinic_config", JSON.stringify(newConfig));
    } catch {
      // Ignore
    }
  };

  const handleSelectProcedure = (procedureId: string) => {
    setSelectedProcedureId(procedureId);
    const bookEl = document.getElementById("book");
    if (bookEl) {
      bookEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={`min-h-screen bg-[#0B0F17] text-[#F8FAFC] selection:bg-[#10B981] selection:text-[#0B0F17]`}>
      {/* 1. Header with branding & switchers */}
      <Header
        lang={lang}
        onToggleLang={handleToggleLang}
        config={config}
        onOpenDemo={() => setIsDemoOpen(true)}
      />

      {/* 2. Hero with stats & primary CTAs */}
      <Hero lang={lang} config={config} />

      {/* 3. Interactive Before & After Image Comparison Slider */}
      <BeforeAfterSlider lang={lang} />

      {/* 4. VIP Procedure Catalog with transparent tiers & Iraqi pricing */}
      <ProcedureCatalog
        lang={lang}
        config={config}
        onSelectProcedure={handleSelectProcedure}
      />

      {/* 5. Trust & Local Iraqi Payment Badges (FIB, FastPay, Cash, German/Swiss) */}
      <TrustAndPaymentBadges lang={lang} />

      {/* 6. 1-Click WhatsApp VIP Booking Engine */}
      <WhatsAppBookingEngine
        lang={lang}
        config={config}
        selectedProcedureId={selectedProcedureId}
        onProcedureChange={setSelectedProcedureId}
      />

      {/* 7. Doctor credentials, facility amenities & patient testimonials */}
      <DoctorCredentials lang={lang} config={config} />

      {/* 8. Frequently Asked Questions (FIB installments, pain-free anesthesia) */}
      <FaqSection lang={lang} />

      {/* 9. Comprehensive Footer */}
      <Footer lang={lang} config={config} />

      {/* 10. Sticky Mobile Floating Quick Action Bar */}
      <FloatingMobileBar
        lang={lang}
        config={config}
        onToggleLang={handleToggleLang}
        onOpenDemo={() => setIsDemoOpen(true)}
      />

      {/* 11. Agency Pitch Mode & Personalization Drawer */}
      <DemoSettingsDrawer
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        config={config}
        onUpdateConfig={handleUpdateConfig}
        lang={lang}
      />
    </div>
  );
}
