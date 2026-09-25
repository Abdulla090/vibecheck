"use client";

import React, { useState } from "react";
import { ClinicConfig, Language, Procedure } from "@/types/clinic";
import { PROCEDURES } from "@/data/clinicData";
import { 
  Sparkles, 
  Check, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  Crown,
  HeartPulse
} from "lucide-react";

interface ProcedureCatalogProps {
  lang: Language;
  config: ClinicConfig;
  onSelectProcedure: (procedureId: string) => void;
}

export default function ProcedureCatalog({
  lang,
  config,
  onSelectProcedure,
}: ProcedureCatalogProps) {
  const [filter, setFilter] = useState<"all" | "dental" | "ortho" | "aesthetic">("all");
  const isRtl = lang === "ckb";

  const filteredProcedures = PROCEDURES.filter((p) => {
    if (filter === "all") return true;
    return p.category === filter;
  });

  const formatIqd = (usd: number) => {
    const total = usd * config.usdToIqdRate;
    return new Intl.NumberFormat(isRtl ? "ar-IQ" : "en-US").format(total);
  };

  return (
    <section id="procedures" className="py-16 md:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne-500/10 border border-champagne-500/30 text-champagne-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Crown className="w-3.5 h-3.5" />
              <span>{isRtl ? "لیستی خزمەتگوزارییە سەرەکییەکان" : "VIP Procedure Portfolio"}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-3">
              {isRtl ? (
                <>
                  نرخی ڕوون، <span className="text-champagne-400">کوالیتی ئەوروپی</span>
                </>
              ) : (
                <>
                  Transparent Pricing, <span className="text-champagne-400">European Excellence</span>
                </>
              )}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              {isRtl
                ? "هەموو چارەسەرەکان بە کەرەستەی ئەسڵی ئەڵمانی و سویسری و بە ئامێری پەسەندکراوی FDA ئەنجام دەدرێن."
                : "Zero hidden costs. Every procedure uses certified German and Swiss materials with official warranty documentation."}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-obsidian-850 border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === "all"
                  ? "bg-emerald-surgical text-obsidian-950 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {isRtl ? "هەمووی" : "All"}
            </button>
            <button
              type="button"
              onClick={() => setFilter("dental")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === "dental"
                  ? "bg-emerald-surgical text-obsidian-950 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {isRtl ? "ددان و ڤینێر" : "Dentistry & Veneers"}
            </button>
            <button
              type="button"
              onClick={() => setFilter("ortho")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === "ortho"
                  ? "bg-emerald-surgical text-obsidian-950 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {isRtl ? "تەلی شەفاف" : "Clear Aligners"}
            </button>
            <button
              type="button"
              onClick={() => setFilter("aesthetic")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === "aesthetic"
                  ? "bg-emerald-surgical text-obsidian-950 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {isRtl ? "لێزەر و جوانکاری" : "Laser & Aesthetics"}
            </button>
          </div>
        </div>

        {/* Procedure Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProcedures.map((proc) => {
            return (
              <div
                key={proc.id}
                className={`group hairline-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 relative bg-obsidian-850 ${
                  proc.popular
                    ? "border-emerald-surgical/40 shadow-[0_0_30px_rgba(16,185,129,0.12)]"
                    : "border-white/[0.08]"
                }`}
              >
                {/* Popular Pill */}
                {proc.popular && (
                  <div
                    className={`absolute -top-3 ${
                      isRtl ? "left-6" : "right-6"
                    } px-3 py-1 rounded-full bg-emerald-surgical text-obsidian-950 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{isRtl ? "خزمەتگوزاری پێشەنگ" : "Most Requested"}</span>
                  </div>
                )}

                <div>
                  {/* Category & Warranty badges */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1 text-emerald-bright font-medium">
                      <HeartPulse className="w-3.5 h-3.5" />
                      <span>
                        {proc.category === "dental"
                          ? isRtl
                            ? "پزیشکی ددان"
                            : "Cosmetic Dentistry"
                          : proc.category === "ortho"
                          ? isRtl
                            ? "ڕێککردنەوەی ددان"
                            : "Orthodontics"
                          : isRtl
                          ? "لێزەر و جوانکاری"
                          : "Laser Aesthetic"}
                      </span>
                    </span>
                    <span className="text-[11px] text-champagne-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{isRtl ? proc.warrantyCkb : proc.warrantyEn}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-bright transition-colors mb-1">
                    {isRtl ? proc.titleCkb : proc.titleEn}
                  </h3>
                  <p className="text-xs font-medium text-slate-400 mb-4">
                    {isRtl ? proc.subtitleCkb : proc.subtitleEn}
                  </p>

                  {/* Description */}
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                    {isRtl ? proc.descriptionCkb : proc.descriptionEn}
                  </p>

                  {/* Highlights Bullet List */}
                  <div className="space-y-2 mb-6">
                    {(isRtl ? proc.highlightsCkb : proc.highlightsEn).map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-bright shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Duration meta */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 pb-4 mb-4 border-b border-white/[0.06]">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{isRtl ? "ماوەی چارەسەر:" : "Treatment Time:"}</span>
                    <span className="text-white font-medium">
                      {isRtl ? proc.durationCkb : proc.durationEn}
                    </span>
                  </div>
                </div>

                {/* Pricing & CTA footer */}
                <div>
                  <div className="mb-4">
                    <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                      {isRtl ? "دەستپێکی نرخ لە" : "Starting Investment"}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-extrabold text-white">
                        ${proc.priceUsd}
                      </span>
                      <span className="text-xs font-mono text-emerald-bright">
                        ≈ {formatIqd(proc.priceUsd)} {isRtl ? "د.ع" : "IQD"}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    type="button"
                    onClick={() => onSelectProcedure(proc.id)}
                    className="w-full py-3 px-4 rounded-xl bg-obsidian-800 hover:bg-emerald-surgical text-white hover:text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all duration-200 border border-white/[0.1] hover:border-emerald-surgical flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                  >
                    <span>{isRtl ? "دیاریکردن و نۆرەگرتنی VIP" : "Select & Reserve Consultation"}</span>
                    {isRtl ? (
                      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    ) : (
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
