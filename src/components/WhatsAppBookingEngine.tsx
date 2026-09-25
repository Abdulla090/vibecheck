"use client";

import React, { useState } from "react";
import { ClinicConfig, Language } from "@/types/clinic";
import { PROCEDURES } from "@/data/clinicData";
import { 
  MessageCircle, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Send, 
  Copy, 
  Check, 
  ShieldCheck,
  Sparkles,
  PhoneCall
} from "lucide-react";

interface WhatsAppBookingEngineProps {
  lang: Language;
  config: ClinicConfig;
  selectedProcedureId: string;
  onProcedureChange: (id: string) => void;
}

export default function WhatsAppBookingEngine({
  lang,
  config,
  selectedProcedureId,
  onProcedureChange,
}: WhatsAppBookingEngineProps) {
  const isRtl = lang === "ckb";

  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("Tomorrow / سبەی");
  const [timeSlot, setTimeSlot] = useState<"morning" | "afternoon" | "evening">("afternoon");
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);

  const selectedProcedure =
    PROCEDURES.find((p) => p.id === selectedProcedureId) || PROCEDURES[0];

  const slotLabels = {
    morning: {
      en: "Morning (10:00 AM – 2:00 PM)",
      ckb: "بەیانیان (١٠:٠٠ بەیانی – ٢:٠٠ پاشنیوەڕۆ)",
    },
    afternoon: {
      en: "Afternoon (2:00 PM – 6:00 PM)",
      ckb: "دواینیوەڕۆ (٢:٠٠ پاشنیوەڕۆ – ٦:٠٠ ئێوارە)",
    },
    evening: {
      en: "Evening (6:00 PM – 9:00 PM)",
      ckb: "ئێواران (٦:٠٠ ئێوارە – ٩:٠٠ شەو)",
    },
  };

  const constructMessage = () => {
    const procTitle = isRtl
      ? `${selectedProcedure.titleCkb} (${selectedProcedure.priceUsd}$)`
      : `${selectedProcedure.titleEn} ($${selectedProcedure.priceUsd})`;

    const slotText = isRtl ? slotLabels[timeSlot].ckb : slotLabels[timeSlot].en;

    const lines = [
      `🌟 *VIP Consultation Request | داواکاری نۆرەی تایبەت*`,
      `📍 *Clinic:* ${config.nameEn} / ${config.nameCkb}`,
      `👨‍⚕️ *Doctor:* ${config.doctorEn}`,
      `----------------------------------------`,
      `👤 *Patient Name / ناوی نەخۆش:* ${patientName || (isRtl ? "[نەنوسراوە]" : "[Not provided]")}`,
      `📞 *Phone / مۆبایل:* ${patientPhone || (isRtl ? "[نەنوسراوە]" : "[Not provided]")}`,
      `🩺 *Procedure / چارەسەر:* ${procTitle}`,
      `🗓 *Preferred Slot / کاتی گونجاو:* ${slotText}`,
      notes ? `💬 *Notes / تێبینی:* ${notes}` : null,
      `----------------------------------------`,
      `✨ *Sent via VIP Concierge Portal (Erbil/Suly)*`,
    ].filter(Boolean);

    return lines.join("\n");
  };

  const handleBookViaWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const message = constructMessage();
    const encoded = encodeURIComponent(message);
    const cleanPhone = config.phone.replace(/[^0-9]/g, "");
    const waUrl = `https://wa.me/${cleanPhone}?text=${encoded}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyMessage = () => {
    const message = constructMessage();
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="book" className="py-16 md:py-24 relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-emerald-surgical/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-surgical/10 border border-emerald-surgical/30 text-emerald-bright text-xs font-semibold uppercase tracking-wider mb-3">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{isRtl ? "نۆرەگرتنی ڕاستەوخۆی VIP لە واتسئەپ" : "Instant 1-Click WhatsApp Concierge"}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            {isRtl ? (
              <>
                کات دیاری بکە، <span className="text-emerald-bright">ڕاستەوخۆ پەیوەندی ببەستە</span>
              </>
            ) : (
              <>
                Schedule VIP Visit, <span className="text-emerald-bright">Direct in 1 Tap</span>
              </>
            )}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            {isRtl
              ? "داواکارییەکەت ڕاستەوخۆ دەگاتە ڕیسێپشنی کلینیک و لە ماوەی کەمتر لە ١٥ خولەک وەڵام وەردەگریتەوە."
              : "Pre-populates your treatment request and routes directly to the clinic reception WhatsApp desk in seconds."}
          </p>
        </div>

        {/* Booking Card Grid */}
        <div className="hairline-card rounded-3xl p-6 sm:p-10 bg-obsidian-850 border border-white/[0.08] shadow-2xl">
          <form onSubmit={handleBookViaWhatsApp} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form Fields */}
            <div className="lg:col-span-7 space-y-6">
              {/* Procedure Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  {isRtl ? "١. جۆری چارەسەری داواکراو:" : "1. Selected Procedure:"}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PROCEDURES.map((p) => {
                    const isSelected = p.id === selectedProcedureId;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => onProcedureChange(p.id)}
                        className={`text-start p-3 rounded-xl border text-xs transition-all ${
                          isSelected
                            ? "bg-emerald-surgical/15 border-emerald-surgical text-white font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                            : "bg-obsidian-900 border-white/[0.06] text-slate-300 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold truncate">
                            {isRtl ? p.titleCkb : p.titleEn}
                          </span>
                          <span className="text-champagne-400 font-mono text-[11px] shrink-0">
                            ${p.priceUsd}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Consultation Time Slot */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  {isRtl ? "٢. کاتی گونجاوی سەردان:" : "2. Preferred Consultation Window:"}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["morning", "afternoon", "evening"] as const).map((slot) => {
                    const isSelected = timeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTimeSlot(slot)}
                        className={`p-3 rounded-xl border text-center text-xs transition-all ${
                          isSelected
                            ? "bg-emerald-surgical text-obsidian-950 font-bold border-emerald-bright shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                            : "bg-obsidian-900 border-white/[0.06] text-slate-300 hover:border-white/20"
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5 mx-auto mb-1 text-slate-400" />
                        <span className="block truncate">
                          {slot === "morning"
                            ? isRtl
                              ? "بەیانیان"
                              : "Morning"
                            : slot === "afternoon"
                            ? isRtl
                              ? "دواینیوەڕۆ"
                              : "Afternoon"
                            : isRtl
                            ? "ئێواران"
                            : "Evening"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Patient Name & Phone Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    {isRtl ? "٣. ناوی چواری نەخۆش:" : "3. Patient Full Name:"}
                  </label>
                  <div className="relative">
                    <User className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isRtl ? "right-3.5" : "left-3.5"}`} />
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder={isRtl ? "نموونە: ئاراس کامەران محەمەد" : "e.g. Karwan M. Salih"}
                      className={`w-full py-3 ${isRtl ? "pr-10 pl-3" : "pl-10 pr-3"} rounded-xl bg-obsidian-900 border border-white/[0.08] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-surgical focus:ring-1 focus:ring-emerald-surgical transition-all`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    {isRtl ? "٤. ژمارەی مۆبایل (واتسئەپ):" : "4. WhatsApp Phone Number:"}
                  </label>
                  <div className="relative">
                    <Phone className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isRtl ? "right-3.5" : "left-3.5"}`} />
                    <input
                      type="tel"
                      required
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="+964 750 000 0000"
                      className={`w-full py-3 ${isRtl ? "pr-10 pl-3" : "pl-10 pr-3"} rounded-xl bg-obsidian-900 border border-white/[0.08] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-surgical focus:ring-1 focus:ring-emerald-surgical transition-all`}
                    />
                  </div>
                </div>
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  {isRtl ? "٥. تێبینی یان داواکاری تایبەت (ئارەزوومەندانە):" : "5. Special Request / Notes (Optional):"}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    isRtl
                      ? "نموونە: دەمەوێت ڤینێری تەنها ٨ ددانی سەرەوە بکەم بەبێ تاشین..."
                      : "e.g., Interested in upper arch veneers or smile consultation..."
                  }
                  className="w-full p-3 rounded-xl bg-obsidian-900 border border-white/[0.08] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-surgical focus:ring-1 focus:ring-emerald-surgical transition-all resize-none"
                />
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-surgical to-emerald-500 hover:from-emerald-bright hover:to-emerald-surgical text-obsidian-950 font-extrabold text-sm uppercase tracking-wider transition-all duration-200 shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center justify-center gap-3 active:scale-[0.99]"
              >
                <MessageCircle className="w-5 h-5 fill-obsidian-950" />
                <span>{isRtl ? "ناردنی داواکاری لە واتسئەپ (١ کلیک)" : "Send Booking to WhatsApp (1-Tap)"}</span>
                <Send className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1.5 text-emerald-bright">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isRtl ? "پاراستنی تەواوی نهێنی نەخۆش" : "Strict Patient Confidentiality"}</span>
                </span>
                <a
                  href={`tel:${config.phone}`}
                  className="text-champagne-400 hover:underline flex items-center gap-1"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{config.displayPhone}</span>
                </a>
              </div>
            </div>

            {/* Right Column: Live WhatsApp Message Simulator */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-[#091017] border border-white/[0.08] flex-1 flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-surgical/20 border border-emerald-surgical/40 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-emerald-bright" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white leading-tight">
                        {isRtl ? config.nameCkb : config.nameEn}
                      </div>
                      <div className="text-[10px] text-emerald-bright flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-bright" />
                        <span>Online Reception Desk</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="p-1.5 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 text-slate-400 hover:text-white border border-white/[0.06] text-[11px] flex items-center gap-1 transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-bright" />
                        <span className="text-emerald-bright">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Simulated WhatsApp Bubble */}
                <div className="flex-1 bg-[#13221C] border border-emerald-surgical/20 rounded-2xl p-4 text-xs font-mono leading-relaxed text-slate-200 overflow-y-auto max-h-80 whitespace-pre-line shadow-inner">
                  {constructMessage()}
                </div>

                <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-champagne-400" />
                  <span>
                    {isRtl
                      ? "پەیامەکە بە فۆرماتی جوان و ڕێکخراو لە واتسئەپی کلینیک دەکرێتەوە."
                      : "Formatted instantly for the receptionist to confirm in 1 tap."}
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
