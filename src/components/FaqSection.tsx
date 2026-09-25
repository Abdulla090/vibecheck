"use client";

import React, { useState } from "react";
import { Language } from "@/types/clinic";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

interface FaqSectionProps {
  lang: Language;
}

export default function FaqSection({ lang }: FaqSectionProps) {
  const isRtl = lang === "ckb";
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      qEn: "How long does a full Hollywood Smile makeover take?",
      qCkb: "دروستکردنی تەواوی هۆلیوود سمایڵ چەند کات دەخایەنێت؟",
      aEn: "Our German E-max veneers typically require only 2 appointments spaced 5 days apart. In Visit 1, we conduct 3D digital scans, smile simulation, and tooth preparation. In Visit 2, the custom veneers are permanently bonded.",
      aCkb: "بە شێوەیەکی گشتی تەنها ٢ سەردان پێویستە لە ماوەی ٥ ڕۆژدا. لە سەردانی یەکەمدا پشکنینی دیجیتاڵی ٣D و وێنەگرتن دەکرێت، لە سەردانی دووەمدا ڤینێرەکان بە شێوەیەکی نەگۆڕ دادەنرێن.",
    },
    {
      qEn: "Is the dental implant procedure painful?",
      qCkb: "ئایا چاندنی ددان ئازاری هەیە؟",
      aEn: "No. We utilize computerized 3D CBCT navigation and painless local anesthesia (The Wand STA). Most patients report zero intra-operative pain and return to regular activities the following morning.",
      aCkb: "نەخێر. ئێمە سیستەمی سڕکردنی کۆمپیوتەری بێ ئازار و نەشتەرگەری ڕێنماییکراوی ٣D بەکاردەهێنین. نەخۆش هیچ ئازارێک لە کاتی کارکردندا هەست پێ ناکات و بەیانی ڕۆژی دواتر دەتوانێت دەست بکاتەوە بە ژیانی ئاسایی خۆی.",
    },
    {
      qEn: "Can I pay in installments with First Iraqi Bank (FIB)?",
      qCkb: "ئایا دەتوانم بە شێوازی قیست بە بانکی یەکەمی عێراقی (FIB) پارە بدەم؟",
      aEn: "Yes! We proudly partner with First Iraqi Bank (FIB) to offer zero-percent interest installment plans up to 12 months for eligible procedures.",
      aCkb: "بەڵێ! کلینیکەکەمان ڕاستەوخۆ بەستراوەتەوە بە بانکی یەکەمی عێراقی (FIB) کە دەتوانیت بە قیستی مانگانەی بێ سوود (0%) تا ١٢ مانگ پارەی چارەسەرەکان بدەیت.",
    },
    {
      qEn: "What warranty do I receive with my treatment?",
      qCkb: "چ جۆرە گەرەنتییەک دەدرێتە نەخۆش لەگەڵ چارەسەرەکەدا؟",
      aEn: "Every patient receives an official printed warranty certificate with serial numbers. Our German E-max veneers carry a 10-year warranty, and Swiss Straumann implants include a lifetime international guarantee.",
      aCkb: "هەموو نەخۆشێک بڕوانامەی فەرمی گەرەنتی بە ژمارەی زنجیرەیی وەردەگرێت. ڤینێری ئی-ماکس ١٠ ساڵ گەرەنتی هەیە و چاندنی ستراومانی سویسری خاوەنی گەرەنتی هەتاهەتایی نێودەوڵەتییە.",
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-obsidian-900/40 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-surgical/10 border border-emerald-surgical/30 text-emerald-bright text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{isRtl ? "پرسیارە باوەکان" : "Frequently Asked Questions"}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {isRtl ? "هەموو ئەو شتانەی پێویستە بیزانیت" : "Clear Answers For Peace of Mind"}
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm">
            {isRtl
              ? "ئەگەر پرسیارێکی ترت هەیە، تیمی ڕیسێپشن لە واتسئەپ ئامادەیە."
              : "Have more specific questions? Our receptionist is ready to answer on WhatsApp."}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="hairline-card rounded-2xl bg-obsidian-850 overflow-hidden border border-white/[0.06] transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-start flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-white hover:text-emerald-bright transition-colors"
                >
                  <span>{isRtl ? faq.qCkb : faq.qEn}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-emerald-bright shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-white/[0.04]">
                    {isRtl ? faq.aCkb : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
