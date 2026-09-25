"use client";

import React from "react";
import { Language } from "@/types/clinic";
import { 
  CreditCard, 
  Banknote, 
  ShieldCheck, 
  Award, 
  CheckCircle,
  Building2,
  Sparkles
} from "lucide-react";

interface TrustAndPaymentBadgesProps {
  lang: Language;
}

export default function TrustAndPaymentBadges({ lang }: TrustAndPaymentBadgesProps) {
  const isRtl = lang === "ckb";

  const paymentMethods = [
    {
      name: "First Iraqi Bank (FIB)",
      nameCkb: "بانکی یەکەمی عێراقی (FIB)",
      descEn: "0% Installment & Instant QR",
      descCkb: "قیستی بێ قازانج و پارەدان بە QR",
      badge: "FIB",
      color: "border-blue-500/30 text-blue-400 bg-blue-500/10",
    },
    {
      name: "FastPay Wallet",
      nameCkb: "جزدانی فاست پەی",
      descEn: "1-Tap Digital Kurdistan Transfer",
      descCkb: "پارەدانی خێرای ئەلیکترۆنی",
      badge: "FastPay",
      color: "border-amber-500/30 text-amber-400 bg-amber-500/10",
    },
    {
      name: "ZainCash",
      nameCkb: "زەین کاش",
      descEn: "Mobile Wallet Accepted",
      descCkb: "پەسەندکراوە لە هەموو کاتێکدا",
      badge: "ZainCash",
      color: "border-red-500/30 text-red-400 bg-red-500/10",
    },
    {
      name: "Cash at Reception Desk",
      nameCkb: "کاش لە ڕیسێپشن (USD / IQD)",
      descEn: "US Dollar & Iraqi Dinar",
      descCkb: "بە دۆلاری ئەمریکی و دیناری عێراقی",
      badge: "USD / IQD",
      color: "border-emerald-500/30 text-emerald-bright bg-emerald-500/10",
    },
  ];

  const medicalTrust = [
    {
      name: "Ivoclar Vivadent (Germany)",
      nameCkb: "ئیڤۆکلار ڤیڤادێنت (ئەڵمانیا)",
      descEn: "Official E-max Lithium Disilicate Porcelain",
      descCkb: "ڤینێری ئی-ماکسی ڕەسەن بە گەرەنتی فەرمی",
    },
    {
      name: "Straumann Dental (Switzerland)",
      nameCkb: "ستراومانی سویسری",
      descEn: "World Gold-Standard Roxolid Implants",
      descCkb: "پێشەنگی یەکەمی چاندنی ددان لە سویسرا",
    },
    {
      name: "Candela GentleMax Pro (USA)",
      nameCkb: "کاندێلا جێنتڵ ماکس (ئەمریکا)",
      descEn: "FDA-Cleared Aesthetic Dermatological Laser",
      descCkb: "ئامێری لێزەری پەسەندکراوی FDA",
    },
    {
      name: "Class-B Autoclave Sterilization",
      nameCkb: "تەقیقی پلە-B ئەوروپی",
      descEn: "100% Sterile Hospital-Grade Environment",
      descCkb: "پاکژکردنەوەی پزیشکی بە بەرزترین ئاستی سەلامەتی",
    },
  ];

  return (
    <section className="py-14 border-y border-white/[0.06] bg-obsidian-900/60 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section 1: Payment Methods */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <CreditCard className="w-4 h-4 text-emerald-bright" />
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300">
              {isRtl
                ? "شێوازەکانی پارەدان لە هەولێر و سلێمانی"
                : "Flexible Local & VIP Payment Methods Accepted"}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {paymentMethods.map((pm, idx) => (
              <div
                key={idx}
                className="hairline-card rounded-2xl p-4 bg-obsidian-850 flex items-center gap-3.5"
              >
                <div
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center font-mono font-extrabold text-xs shrink-0 ${pm.color}`}
                >
                  {pm.badge}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    {isRtl ? pm.nameCkb : pm.name}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {isRtl ? pm.descCkb : pm.descEn}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Clinical Certifications & Materials */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-4 h-4 text-champagne-400" />
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300">
              {isRtl
                ? "کەرەستە و پێوەرە نێودەوڵەتییە باوەڕپێکراوەکان"
                : "Certified Medical Partners & Materials Guarantee"}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {medicalTrust.map((mt, idx) => (
              <div
                key={idx}
                className="hairline-card rounded-2xl p-4 bg-obsidian-850 flex items-start gap-3"
              >
                <CheckCircle className="w-4 h-4 text-champagne-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white mb-0.5">
                    {isRtl ? mt.nameCkb : mt.name}
                  </div>
                  <div className="text-[11px] text-slate-400 leading-snug">
                    {isRtl ? mt.descCkb : mt.descEn}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
