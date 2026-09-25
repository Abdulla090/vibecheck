"use client";

import React from "react";
import { ClinicConfig, Language } from "@/types/clinic";
import { MessageCircle, Phone, Globe, Sliders } from "lucide-react";

interface FloatingMobileBarProps {
  lang: Language;
  config: ClinicConfig;
  onToggleLang: () => void;
  onOpenDemo: () => void;
}

export default function FloatingMobileBar({
  lang,
  config,
  onToggleLang,
  onOpenDemo,
}: FloatingMobileBarProps) {
  const isRtl = lang === "ckb";

  return (
    <div className="md:hidden fixed bottom-3 inset-x-3 z-30">
      <div className="glass-nav rounded-2xl p-2 border border-white/[0.12] shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex items-center justify-between gap-2 bg-obsidian-950/90 backdrop-blur-xl">
        {/* Book Consultation primary button */}
        <a
          href="#book"
          className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-surgical to-emerald-600 text-obsidian-950 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95 transition-transform"
        >
          <MessageCircle className="w-4 h-4 fill-obsidian-950" />
          <span className="truncate">{isRtl ? "نۆرەگرتنی VIP" : "Book VIP"}</span>
        </a>

        {/* Quick Call */}
        <a
          href={`tel:${config.phone}`}
          className="p-3 rounded-xl bg-obsidian-850 border border-white/[0.08] text-emerald-bright flex items-center justify-center active:scale-95 transition-transform"
          title="Call Clinic"
        >
          <Phone className="w-4 h-4" />
        </a>

        {/* Toggle Language */}
        <button
          type="button"
          onClick={onToggleLang}
          className="p-3 rounded-xl bg-obsidian-850 border border-white/[0.08] text-slate-200 font-bold text-xs flex items-center justify-center active:scale-95 transition-transform"
          title="Toggle Language"
        >
          <Globe className="w-4 h-4 text-emerald-bright" />
        </button>

        {/* Demo Drawer */}
        <button
          type="button"
          onClick={onOpenDemo}
          className="p-3 rounded-xl bg-obsidian-850 border border-champagne-500/30 text-champagne-400 flex items-center justify-center active:scale-95 transition-transform"
          title="Pitch Mode Settings"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
