"use client";

import React from "react";
import { ClinicConfig, Language } from "@/types/clinic";
import { 
  Sparkles, 
  MessageCircle, 
  ShieldCheck, 
  Award, 
  ArrowRight, 
  ArrowLeft,
  Star,
  CheckCircle2
} from "lucide-react";

interface HeroProps {
  lang: Language;
  config: ClinicConfig;
}

export default function Hero({ lang, config }: HeroProps) {
  const isRtl = lang === "ckb";

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Ambient Radial Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-emerald-surgical/12 via-emerald-surgical/5 to-transparent rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-champagne-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        {/* European Quality Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-obsidian-850 border border-white/[0.1] text-xs font-semibold text-slate-300 shadow-lg mb-6 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-bright animate-pulse" />
          <span className="text-emerald-bright font-mono uppercase tracking-wider">
            {isRtl ? "پێشەنگی ئەوروپی" : "European Certified"}
          </span>
          <span className="text-slate-500">|</span>
          <span>{isRtl ? config.cityCkb : config.cityEn}</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15] mb-6">
          {isRtl ? (
            <>
              دیزاینی پێشکەوتووی{" "}
              <span className="bg-gradient-to-r from-emerald-bright via-teal-300 to-emerald-surgical bg-clip-text text-transparent">
                هۆلیوود سمایڵ
              </span>{" "}
              و جوانکاری بە کەرەستەی ئەڵمانی
            </>
          ) : (
            <>
              Couture Hollywood Smiles &amp;{" "}
              <span className="bg-gradient-to-r from-emerald-bright via-teal-300 to-emerald-surgical bg-clip-text text-transparent">
                Swiss Implantology
              </span>
            </>
          )}
        </h1>

        {/* Tagline / Subtitle */}
        <p className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          {isRtl ? (
            <>
              سەرلەنوێ بڕوا بەخۆبوونت بدۆزەرەوە بە بەکارهێنانی ڤینێری ئەسڵی ئی-ماکس و لێزەری سەردەمیانە.
              ڕاستەوخۆ لە ڕێگەی واتسئەپەوە پەیوەندی بە پزیشکی پسپۆڕەوە بکە.
            </>
          ) : (
            <>
              {config.taglineEn}. Personalized porcelain veneers, computer-guided implants, and
              medical-grade laser aesthetics designed for natural perfection.
            </>
          )}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <a
            href="#book"
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-surgical to-emerald-600 hover:from-emerald-bright hover:to-emerald-surgical text-obsidian-950 font-extrabold text-sm uppercase tracking-wider transition-all duration-200 shadow-[0_0_30px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2.5 active:scale-[0.98]"
          >
            <MessageCircle className="w-5 h-5 fill-obsidian-950" />
            <span>{isRtl ? "نۆرەگرتنی VIP لە واتسئەپ" : "Book VIP Consultation"}</span>
          </a>

          <a
            href="#results"
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-obsidian-850 hover:bg-obsidian-800 text-slate-200 hover:text-white border border-white/[0.1] hover:border-emerald-surgical/40 font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>{isRtl ? "سەیرکردنی پێش و پاشان" : "Inspect Before & After"}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </a>
        </div>

        {/* 4 Pillars Trust Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-6 border-t border-white/[0.08]">
          <div className="hairline-card rounded-2xl p-4 sm:p-5 bg-obsidian-850/80 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mb-1">
              4,800+
            </div>
            <div className="text-xs text-slate-400 font-medium">
              {isRtl ? "سمایڵی دروستکراو" : "VIP Smiles Transformed"}
            </div>
          </div>

          <div className="hairline-card rounded-2xl p-4 sm:p-5 bg-obsidian-850/80 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-bright font-mono mb-1">
              100%
            </div>
            <div className="text-xs text-slate-400 font-medium">
              {isRtl ? "کەرەستەی ئەڵمانی و سویسری" : "German & Swiss Certified"}
            </div>
          </div>

          <div className="hairline-card rounded-2xl p-4 sm:p-5 bg-obsidian-850/80 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-champagne-400 font-mono mb-1">
              10–15 Yrs
            </div>
            <div className="text-xs text-slate-400 font-medium">
              {isRtl ? "گەرەنتی فەرمی نووسراو" : "Written Official Warranty"}
            </div>
          </div>

          <div className="hairline-card rounded-2xl p-4 sm:p-5 bg-obsidian-850/80 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mb-1">
              0% FIB
            </div>
            <div className="text-xs text-slate-400 font-medium">
              {isRtl ? "قیست بە بانکی یەکەمی عێراقی" : "0% Installment Option"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
