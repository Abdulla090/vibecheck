"use client";

import React from "react";
import { ClinicConfig, Language } from "@/types/clinic";
import { 
  Award, 
  GraduationCap, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  Building,
  Car
} from "lucide-react";

interface DoctorCredentialsProps {
  lang: Language;
  config: ClinicConfig;
}

export default function DoctorCredentials({ lang, config }: DoctorCredentialsProps) {
  const isRtl = lang === "ckb";

  const reviews = [
    {
      authorEn: "Bayan N. (Erbil)",
      authorCkb: "بەیان ن. (هەولێر)",
      treatmentEn: "16 E-max Veneers Makeover",
      treatmentCkb: "١٦ دانە ڤینێری ئی-ماکس",
      rating: 5,
      commentEn:
        "The most natural Hollywood smile in Kurdistan! No sensitivity at all, and the digital preview was identical to the final result.",
      commentCkb:
        "سروشتیترین هۆلیوود سمایڵ لە کوردستان! هیچ هەستیارییەکم نەبوو، و نەخشە دیجیتاڵییەکە تەواو وەک دەرەنجامە کۆتاییەکە دەرچوو.",
    },
    {
      authorEn: "Rebwar K. (Sulaymaniyah)",
      authorCkb: "ڕێبوار ک. (سلێمانی)",
      treatmentEn: "Swiss Straumann Dental Implants",
      treatmentCkb: "چاندنی ددانی سویسری",
      rating: 5,
      commentEn:
        "Painless surgery from start to finish. Valet parking on Salim St was effortless and the clinic felt like a 5-star Swiss hospital.",
      commentCkb:
        "نەشتەرگەرییەکی بێ ئازار لە سەرەتاوە تا کۆتایی. خزمەتگوزاری و خاوێنی کلینیکەکە لە بەرزترین ئاستی سویسری بوو.",
    },
    {
      authorEn: "Darya H. (Diaspora / London)",
      authorCkb: "دەریا ه. (بەریتانیا / لەندەن)",
      treatmentEn: "Clear Aligners + Laser Whitening",
      treatmentCkb: "تەلی شەفاف + سپیکردنەوە بە لێزەر",
      rating: 5,
      commentEn:
        "Traveled from the UK specifically to finish my treatment here. Saved over £4,000 with even higher craftsmanship than Central London.",
      commentCkb:
        "لە بەریتانیاوە هاتمەوە بۆ وەرگرتنی چارەسەر. کەمتر لە نیوەی نرخی لەندەنم تێچوو بە کوالیتییەک کە هێندەی ئەوێ بەرز و جوان بوو.",
    },
  ];

  return (
    <section id="doctor" className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Doctor & Facility Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          {/* Doctor Bio Card */}
          <div className="lg:col-span-7 hairline-card rounded-3xl p-6 sm:p-10 bg-obsidian-850 relative overflow-hidden border border-white/[0.08]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-champagne-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne-500/10 border border-champagne-500/30 text-champagne-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Award className="w-3.5 h-3.5" />
              <span>{isRtl ? "پزیشکی بەرپرسی کلینیک" : "Clinical Medical Director"}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              {isRtl ? config.doctorCkb : config.doctorEn}
            </h3>
            <p className="text-emerald-bright text-xs sm:text-sm font-semibold mb-6">
              {isRtl ? config.doctorTitleCkb : config.doctorTitleEn}
            </p>

            {/* Qualifications */}
            <div className="space-y-3 mb-8 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <GraduationCap className="w-4 h-4 text-champagne-400 shrink-0 mt-0.5" />
                <span>
                  {isRtl
                    ? "بڕوانامەی ماستەر لە چاندنی ددان و جوانکاری — زانکۆی فرانکفۆرت، ئەڵمانیا"
                    : "MSc in Oral Implantology & Aesthetics — Goethe University Frankfurt, Germany"}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Award className="w-4 h-4 text-champagne-400 shrink-0 mt-0.5" />
                <span>
                  {isRtl
                    ? "ئەندامی باوەڕپێکراوی کۆمەڵەی پزیشکانی جوانکاری ددانی ئەوروپی (EAED)"
                    : "Accredited Member of European Academy of Esthetic Dentistry (EAED)"}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-champagne-400 shrink-0 mt-0.5" />
                <span>
                  {isRtl
                    ? "زیاتر لە ١٢ ساڵ ئەزموونی پسپۆڕی و ٤،٨٠٠+ کەیسی سەرکەوتووی هۆلیوود سمایڵ"
                    : "Over 12+ years clinical mastery and 4,800+ documented smile transformations"}
                </span>
              </div>
            </div>

            {/* Address & Hours */}
            <div className="p-4 rounded-2xl bg-obsidian-900 border border-white/[0.06] space-y-2 text-xs">
              <div className="flex items-start gap-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-bright shrink-0 mt-0.5" />
                <span>{isRtl ? config.addressCkb : config.addressEn}</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-400">
                <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{isRtl ? config.workingHoursCkb : config.workingHoursEn}</span>
              </div>
            </div>
          </div>

          {/* Facility VIP Amenities */}
          <div className="lg:col-span-5 space-y-4">
            <div className="hairline-card rounded-2xl p-6 bg-obsidian-850 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-bright" />
                <span>{isRtl ? "ئاسانکارییە شاهانەییەکان" : "VIP Suite Amenities"}</span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-obsidian-900 border border-white/[0.04]">
                  <Car className="w-4 h-4 text-champagne-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-white">
                      {isRtl ? "ڤالێت پارکینی بێبەرامبەر" : "Complimentary Valet Parking"}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {isRtl ? "ڕاستەوخۆ لە بەردەم دەرگای کلینیک" : "Dedicated VIP parking attendants on arrival"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-obsidian-900 border border-white/[0.04]">
                  <Sparkles className="w-4 h-4 text-emerald-bright shrink-0" />
                  <div>
                    <div className="font-semibold text-white">
                      {isRtl ? "ژووری چاوەڕوانی VIP تایبەت" : "Private VIP Consultation Lounge"}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {isRtl ? "قاوەی ئیتاڵی و ئارامبەخش بەبێ قەرەباڵغی" : "Total privacy, espresso bar & relaxing ambiance"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-obsidian-900 border border-white/[0.04]">
                  <ShieldCheck className="w-4 h-4 text-emerald-bright shrink-0" />
                  <div>
                    <div className="font-semibold text-white">
                      {isRtl ? "سڕکردنی کۆمپیوتەری بێ ئازار" : "Computerized Painless Anesthesia"}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {isRtl ? "تەکنەلۆژیای ئەمریکی بەبێ دەرزی ترسناک" : "The Wand STA single-tooth anesthesia technology"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Testimonials */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-8">
            <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {isRtl ? "بۆچوونی نەخۆشە دڵخۆشەکانمان" : "Trusted by Discerning Patients"}
            </h4>
            <p className="text-slate-400 text-xs sm:text-sm">
              {isRtl
                ? "کەیسە سەرکەوتووەکانمان لە هەولێر، سلێمانی و ڕەوەندی کوردی لە دەرەوەی وڵات"
                : "Real experiences from Erbil, Sulaymaniyah, and returning diaspora patients."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev, idx) => (
              <div
                key={idx}
                className="hairline-card rounded-2xl p-5 sm:p-6 bg-obsidian-850 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-champagne-400 mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-champagne-400 text-champagne-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                    "{isRtl ? rev.commentCkb : rev.commentEn}"
                  </p>
                </div>
                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <span className="font-bold text-white">
                    {isRtl ? rev.authorCkb : rev.authorEn}
                  </span>
                  <span className="text-[11px] text-emerald-bright">
                    {isRtl ? rev.treatmentCkb : rev.treatmentEn}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
