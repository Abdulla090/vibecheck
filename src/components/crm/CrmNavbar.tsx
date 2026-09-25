"use client";

import React from "react";
import Link from "next/link";
import { Language, ClinicConfig } from "@/types/clinic";
import { CLINIC_PRESETS } from "@/data/clinicData";
import { 
  Crown, 
  Globe, 
  LayoutDashboard, 
  Users, 
  Pill, 
  CalendarClock, 
  FileText, 
  ExternalLink,
  DollarSign,
  AlertTriangle
} from "lucide-react";

export type CrmTab = "overview" | "pipeline" | "pharmacy" | "appointments" | "prescriptions";

interface CrmNavbarProps {
  lang: Language;
  onToggleLang: () => void;
  activeTab: CrmTab;
  onSelectTab: (tab: CrmTab) => void;
  config: ClinicConfig;
  onSelectPreset: (presetConfig: Partial<ClinicConfig>) => void;
  leadCount: number;
  lowStockCount: number;
  todayAptCount: number;
}

export default function CrmNavbar({
  lang,
  onToggleLang,
  activeTab,
  onSelectTab,
  config,
  onSelectPreset,
  leadCount,
  lowStockCount,
  todayAptCount,
}: CrmNavbarProps) {
  const isRtl = lang === "ckb";

  const tabs: { id: CrmTab; labelEn: string; labelCkb: string; icon: React.ReactNode; badge?: number; badgeAlert?: boolean }[] = [
    {
      id: "overview",
      labelEn: "Dashboard",
      labelCkb: "داشبۆرد",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: "pipeline",
      labelEn: "Patient Pipeline",
      labelCkb: "هێڵی نەخۆشەکان",
      icon: <Users className="w-4 h-4" />,
      badge: leadCount,
    },
    {
      id: "pharmacy",
      labelEn: "Pharmacy & Stock",
      labelCkb: "کۆگا و دەرمانسازی",
      icon: <Pill className="w-4 h-4" />,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeAlert: lowStockCount > 0,
    },
    {
      id: "appointments",
      labelEn: "Clinical Queue",
      labelCkb: "نۆرە و چاوەڕوانی",
      icon: <CalendarClock className="w-4 h-4" />,
      badge: todayAptCount,
    },
    {
      id: "prescriptions",
      labelEn: "Digital Rx & Invoices",
      labelCkb: "ڕەچەتە و پسوولە",
      icon: <FileText className="w-4 h-4" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 glass-nav border-b border-white/[0.08] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Tier: Clinic Branding & Controls */}
        <div className="h-16 flex items-center justify-between gap-4 border-b border-white/[0.05]">
          {/* Logo & CRM Title */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-surgical to-emerald-700 border border-emerald-bright/50 flex items-center justify-center text-obsidian-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-transform">
                <Crown className="w-4 h-4 text-obsidian-950 fill-obsidian-950" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-white tracking-tight flex items-center gap-1.5 leading-none">
                  <span>{isRtl ? config.nameCkb : config.nameEn}</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-bright border border-emerald-500/30">
                    CRM v2.4
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                  {isRtl ? "سیستەمی بەڕێوەبردنی کلینیک و دەرمانخانە" : "Clinic & Pharmacy Management Suite"}
                </div>
              </div>
            </Link>
          </div>

          {/* Controls: Branch Switcher, Exchange Rate, Lang Switcher, Public Portal */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Branch Switcher Dropdown */}
            <div className="hidden md:flex items-center gap-1.5 bg-obsidian-850 px-2.5 py-1.5 rounded-xl border border-white/[0.08] text-xs">
              <span className="text-slate-400 font-medium">
                {isRtl ? "لقی چالاک:" : "Branch:"}
              </span>
              <select
                aria-label={isRtl ? "لقی چالاک" : "Active Branch"}
                value={config.nameEn}
                onChange={(e) => {
                  const preset = CLINIC_PRESETS.find((p) => p.config.nameEn === e.target.value);
                  if (preset) onSelectPreset(preset.config);
                }}
                className="bg-transparent text-emerald-bright font-bold text-xs focus:outline-none cursor-pointer"
              >
                {CLINIC_PRESETS.map((p) => (
                  <option key={p.label} value={p.config.nameEn} className="bg-obsidian-900 text-white">
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Exchange Rate Indicator */}
            <div className="hidden lg:flex items-center gap-1 bg-obsidian-850 px-2.5 py-1.5 rounded-xl border border-champagne-500/30 text-champagne-400 text-xs font-mono">
              <DollarSign className="w-3.5 h-3.5 text-champagne-500" />
              <span>1 USD = {config.usdToIqdRate.toLocaleString()} IQD</span>
            </div>

            {/* Bilingual Switcher */}
            <button
              type="button"
              onClick={onToggleLang}
              className="px-3 py-1.5 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-slate-200 border border-white/[0.08] hover:border-emerald-surgical/40 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-bright" />
              <span>{isRtl ? "English" : "کوردی"}</span>
            </button>

            {/* Back to Public Portal Link */}
            <Link
              href="/"
              className="px-3 py-1.5 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-slate-300 hover:text-white border border-white/[0.08] text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <span>{isRtl ? "پەڕەی سەرەکی" : "Public Portal"}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Lower Tier: CRM Tabs Navigation Bar */}
        <nav className="flex items-center gap-1 sm:gap-2 py-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? "bg-emerald-surgical text-obsidian-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    : "text-slate-300 hover:text-white hover:bg-obsidian-850 border border-transparent hover:border-white/[0.08]"
                }`}
              >
                <span className={isActive ? "text-obsidian-950" : "text-emerald-bright"}>
                  {tab.icon}
                </span>
                <span>{isRtl ? tab.labelCkb : tab.labelEn}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      isActive
                        ? "bg-obsidian-950 text-emerald-bright"
                        : tab.badgeAlert
                        ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse"
                        : "bg-white/[0.08] text-slate-300"
                    }`}
                  >
                    {tab.badgeAlert && <AlertTriangle className="w-2.5 h-2.5 inline mr-0.5 text-rose-400" />}
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
