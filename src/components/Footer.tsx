"use client";

import React from "react";
import { ClinicConfig, Language } from "@/types/clinic";
import { normalizeIraqiPhone } from "@/utils/phone";
import { Crown, MessageCircle, Phone, MapPin, Clock, ShieldCheck, Heart } from "lucide-react";

interface FooterProps {
  lang: Language;
  config: ClinicConfig;
}

export default function Footer({ lang, config }: FooterProps) {
  const isRtl = lang === "ckb";

  return (
    <footer className="border-t border-white/[0.08] bg-obsidian-950 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-surgical/20 border border-emerald-surgical/40 flex items-center justify-center text-emerald-bright">
                <Crown className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm text-white tracking-tight">
                {isRtl ? config.nameCkb : config.nameEn}
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {isRtl ? config.taglineCkb : config.taglineEn}
            </p>
            <div className="pt-2 text-[11px] text-emerald-bright font-mono">
              Kurdistan Syndicate of Dentists · Approved
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">
              {isRtl ? "بەشە سەرەکییەکان" : "Navigation"}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#results" className="hover:text-emerald-bright transition-colors">
                  {isRtl ? "دەرەنجامەکانی پێش و پاشان" : "Before & After Transformations"}
                </a>
              </li>
              <li>
                <a href="#procedures" className="hover:text-emerald-bright transition-colors">
                  {isRtl ? "خزمەتگوزاری و نرخەکان" : "Procedures & Iraqi Dinar Pricing"}
                </a>
              </li>
              <li>
                <a href="#doctor" className="hover:text-emerald-bright transition-colors">
                  {isRtl ? "پزیشکی بەرپرسیار" : "Specialist Profile & Credentials"}
                </a>
              </li>
              <li>
                <a href="#book" className="hover:text-emerald-bright transition-colors">
                  {isRtl ? "نۆرەگرتنی VIP لە واتسئەپ" : "WhatsApp VIP Concierge"}
                </a>
              </li>
            </ul>
          </div>

          {/* Location & Hours */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">
              {isRtl ? "ناونیشان و سەردان" : "Location & Visits"}
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-bright shrink-0 mt-0.5" />
                <span>{isRtl ? config.addressCkb : config.addressEn}</span>
              </div>
              <div className="flex items-start gap-2 text-slate-400">
                <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>{isRtl ? config.workingHoursCkb : config.workingHoursEn}</span>
              </div>
            </div>
          </div>

          {/* VIP Concierge Desk */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">
              {isRtl ? "ڕیسێپشنی خێرا" : "Immediate Reception"}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isRtl
                ? "بۆ هەر حاڵەتێکی کتوپڕ یان پرسیارێک، ڕاستەوخۆ نامە بنێرە."
                : "For inquiries, quote approvals, or immediate bookings."}
            </p>
            <div className="pt-1">
              <a
                href={`https://wa.me/${normalizeIraqiPhone(config.phone).cleanDigits}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-surgical text-obsidian-950 font-bold text-xs uppercase tracking-wider hover:bg-emerald-bright transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-obsidian-950" />
                <span>{isRtl ? "واتسئەپی کلینیک" : "WhatsApp Reception"}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} {config.nameEn}. {isRtl ? "هەموو مافەکان پارێزراون." : "All rights reserved."}
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>VIP Medical Gateway · Erbil &amp; Sulaymaniyah</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
