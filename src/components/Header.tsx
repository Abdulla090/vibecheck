"use client";

import React, { useState } from "react";
import { ClinicConfig, Language } from "@/types/clinic";
import { normalizeIraqiPhone } from "@/utils/phone";
import { 
  Sparkles, 
  Crown, 
  Globe, 
  PhoneCall, 
  Sliders, 
  Menu, 
  X, 
  MessageCircle,
  LayoutDashboard
} from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  config: ClinicConfig;
  onOpenDemo: () => void;
}

export default function Header({
  lang,
  onToggleLang,
  config,
  onOpenDemo,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isRtl = lang === "ckb";

  return (
    <header className="sticky top-0 z-40 glass-nav border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 py-3.5 flex items-center justify-between gap-4">
        {/* Logo & Clinic Branding */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-surgical to-emerald-700 border border-emerald-bright/50 flex items-center justify-center text-obsidian-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] group-hover:scale-105 transition-transform">
            <Crown className="w-5 h-5 text-obsidian-950 fill-obsidian-950" />
          </div>
          <div>
            <div className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-1.5 leading-none">
              <span>{isRtl ? config.nameCkb : config.nameEn}</span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-champagne-500/10 text-champagne-400 border border-champagne-500/30">
                VIP
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">
              {isRtl ? config.cityCkb : config.cityEn}
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-300">
          <a
            href="#results"
            className="hover:text-emerald-bright transition-colors"
          >
            {isRtl ? "دەرەنجامی چارەسەرەکان" : "Before & After"}
          </a>
          <a
            href="#procedures"
            className="hover:text-emerald-bright transition-colors"
          >
            {isRtl ? "خزمەتگوزاری و نرخەکان" : "Procedures & Pricing"}
          </a>
          <a
            href="#doctor"
            className="hover:text-emerald-bright transition-colors"
          >
            {isRtl ? "دەستەی پزیشکی" : "Specialists"}
          </a>
          <a
            href="#book"
            className="hover:text-emerald-bright transition-colors"
          >
            {isRtl ? "نۆرەگرتن" : "VIP Booking"}
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* CRM Portal Button */}
          <Link
            href="/crm"
            title="Clinic CRM & Pharmacy Dashboard"
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-emerald-bright border border-emerald-500/30 hover:border-emerald-surgical text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)]"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-emerald-bright" />
            <span className="font-mono">
              {isRtl ? "CRM داشبۆرد" : "CRM Portal"}
            </span>
          </Link>

          {/* Pitch Demo Settings Button */}
          <button
            type="button"
            onClick={onOpenDemo}
            title="Pitch Mode / Settings"
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-champagne-400 border border-champagne-500/30 hover:border-champagne-400 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(212,175,55,0.15)]"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden md:inline font-mono">
              {isRtl ? "ڕێکخستنی نموونە" : "Pitch Mode"}
            </span>
          </button>

          {/* Bilingual Switcher Pill */}
          <button
            type="button"
            onClick={onToggleLang}
            className="px-3 py-1.5 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-slate-200 border border-white/[0.08] hover:border-emerald-surgical/40 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-bright" />
            <span>{isRtl ? "English" : "کوردی"}</span>
          </button>

          {/* Fast Call Button */}
          <a
            href={`tel:+${normalizeIraqiPhone(config.phone).cleanDigits}`}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-obsidian-850 text-slate-200 border border-white/[0.08] hover:border-white/20 text-xs font-semibold transition-all"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-bright" />
            <span className="font-mono text-[11px]">{config.displayPhone}</span>
          </a>

          {/* Direct CTA */}
          <a
            href="#book"
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-emerald-surgical hover:bg-emerald-bright text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-obsidian-950" />
            <span>{isRtl ? "نۆرەگرتن" : "Book VIP"}</span>
          </a>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-obsidian-850 text-slate-300 border border-white/[0.08]"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/[0.08] bg-obsidian-950 px-4 py-6 space-y-4">
          <nav className="flex flex-col space-y-3 text-sm font-semibold">
            <a
              href="#results"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-emerald-bright py-1"
            >
              {isRtl ? "دەرەنجامی چارەسەرەکان" : "Before & After Transformations"}
            </a>
            <a
              href="#procedures"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-emerald-bright py-1"
            >
              {isRtl ? "خزمەتگوزاری و نرخەکان" : "Procedures & Pricing"}
            </a>
            <a
              href="#doctor"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-emerald-bright py-1"
            >
              {isRtl ? "دەستەی پزیشکی" : "Specialists"}
            </a>
            <a
              href="#book"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-emerald-bright py-1"
            >
              {isRtl ? "نۆرەگرتنی VIP لە واتسئەپ" : "WhatsApp VIP Booking"}
            </a>
            <Link
              href="/crm"
              onClick={() => setMobileMenuOpen(false)}
              className="text-emerald-bright hover:text-white py-1.5 flex items-center gap-2 font-bold"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{isRtl ? "سیستەمی بەڕێوەبردنی کلینیک و دەرمانخانە (CRM)" : "Clinic & Pharmacy CRM Dashboard"}</span>
            </Link>
          </nav>

          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs">
            <span className="text-slate-400">{config.displayPhone}</span>
            <button
              type="button"
              onClick={() => {
                onToggleLang();
                setMobileMenuOpen(false);
              }}
              className="text-emerald-bright font-bold"
            >
              {isRtl ? "Switch to English" : "گۆڕین بۆ کوردی"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
