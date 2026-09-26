"use client";

import React, { useState, useEffect } from "react";
import { Language, ClinicConfig } from "@/types/clinic";
import { PatientLead } from "@/types/crm";
import { 
  buildPostOpFollowUpMessage, 
  buildInvoiceDispatchMessage 
} from "@/utils/crmDispatch";
import { normalizeIraqiPhone } from "@/utils/phone";
import { 
  MessageCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  X, 
  Send, 
  Sparkles, 
  Clock, 
  HeartHandshake 
} from "lucide-react";

interface WhatsAppMessageModalProps {
  lang: Language;
  config: ClinicConfig;
  lead: PatientLead | null;
  onClose: () => void;
}

type TemplateType = "appointment" | "post-op" | "invoice" | "custom";

export default function WhatsAppMessageModal({
  lang,
  config,
  lead,
  onClose,
}: WhatsAppMessageModalProps) {
  const isRtl = lang === "ckb";
  const [template, setTemplate] = useState<TemplateType>("appointment");
  const [messageText, setMessageText] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!lead) return;

    if (template === "post-op") {
      const res = buildPostOpFollowUpMessage(lead, config.nameEn, lang);
      setMessageText(res.rawMessage);
    } else if (template === "invoice") {
      const res = buildInvoiceDispatchMessage(lead, config.nameEn, config.usdToIqdRate, lang);
      setMessageText(res.rawMessage);
    } else if (template === "appointment") {
      if (isRtl) {
        setMessageText(
          [
            `*ئاگاداری نۆرەی پزیشکی لە ${config.nameCkb}*`,
            `بەڕێز: *${lead.fullName}*`,
            `سڵاو، پەیوەندیتان لەسەر چارەسەری *${lead.procedureTitleCkb}* بە سەرکەوتوویی لە سیستم تۆمارکراوە.`,
            `پزیشکی بەرپرسیار: *${lead.assignedDoctor}*`,
            `بەهای دیاریکراو: *$${lead.estimatedValueUsd} USD* (~${(lead.estimatedValueUsd * config.usdToIqdRate).toLocaleString()} دیناری عێراقی)`,
            ``,
            `تکایە ئاگادارمان بکەنەوە کەی گونجاوترین کاتە بۆ بەڕێزتان تا نۆرەی سەردانەکەتان لە بەشی VIP جێگیر بکەین.`,
            `ناونیشان: ${config.addressCkb}`,
          ].join("\n")
        );
      } else {
        setMessageText(
          [
            `*VIP CLINIC CONSULTATION INQUIRY | ${config.nameEn}*`,
            `Dear *${lead.fullName}*,`,
            `We have received your consultation request for *${lead.procedureTitleEn}*.`,
            `Assigned Specialist: *${lead.assignedDoctor}*`,
            `Estimated Treatment Fee: *$${lead.estimatedValueUsd} USD* (~${(lead.estimatedValueUsd * config.usdToIqdRate).toLocaleString()} IQD)`,
            ``,
            `Please let us know your preferred day and time to finalize your exclusive VIP appointment slot.`,
            `Location: ${config.addressEn}`,
          ].join("\n")
        );
      }
    }
  }, [lead, template, lang, config, isRtl]);

  if (!lead) return null;

  const phoneInfo = normalizeIraqiPhone(lead.phone);
  const waUrl = `https://wa.me/${phoneInfo.cleanDigits}?text=${encodeURIComponent(messageText)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleSend = () => {
    window.open(waUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-obsidian-900 border border-white/[0.12] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-bright flex items-center justify-center">
              <MessageCircle className="w-4 h-4 fill-emerald-bright" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">
                {isRtl ? "ناردنی نامەی ڕاستەوخۆی واتسئەپ" : "WhatsApp Patient Direct Dispatch"}
              </h3>
              <div className="text-[11px] text-slate-400 font-mono">
                {lead.fullName} · {phoneInfo.displayPhone}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Template Selectors */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            type="button"
            onClick={() => setTemplate("appointment")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              template === "appointment"
                ? "bg-emerald-surgical text-obsidian-950 font-bold"
                : "bg-obsidian-850 text-slate-400 hover:text-white"
            }`}
          >
            {isRtl ? "نۆرە و ڕاوێژ" : "Consultation"}
          </button>

          <button
            type="button"
            onClick={() => setTemplate("invoice")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              template === "invoice"
                ? "bg-champagne-500 text-obsidian-950 font-bold"
                : "bg-obsidian-850 text-slate-400 hover:text-white"
            }`}
          >
            {isRtl ? "پسوولەی پارەدان" : "Invoice Slip"}
          </button>

          <button
            type="button"
            onClick={() => setTemplate("post-op")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              template === "post-op"
                ? "bg-teal-500 text-obsidian-950 font-bold"
                : "bg-obsidian-850 text-slate-400 hover:text-white"
            }`}
          >
            {isRtl ? "بەدواداچوونی پاش چارەسەر" : "Post-Op Follow-up"}
          </button>

          <button
            type="button"
            onClick={() => setTemplate("custom")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              template === "custom"
                ? "bg-blue-500 text-white font-bold"
                : "bg-obsidian-850 text-slate-400 hover:text-white"
            }`}
          >
            {isRtl ? "تێکستی تایبەت" : "Custom Message"}
          </button>
        </div>

        {/* Text Area */}
        <div>
          <label className="block text-[11px] text-slate-400 font-bold uppercase mb-1">
            {isRtl ? "دەقی نامەی واتسئەپ (دەتوانیت دەستکاری بکەیت):" : "Message Preview & Live Edit:"}
          </label>
          <textarea
            rows={8}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="w-full bg-obsidian-850 border border-white/[0.08] rounded-xl p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-emerald-surgical/60 font-mono resize-none"
          />
        </div>

        {/* Modal Actions */}
        <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-slate-300 hover:text-white border border-white/[0.08] text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-bright" />
                <span>{isRtl ? "کۆپیکرا" : "Copied!"}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{isRtl ? "کۆپیکردنی دەق" : "Copy Text"}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleSend}
            className="px-5 py-2 rounded-xl bg-emerald-surgical hover:bg-emerald-bright text-obsidian-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            <Send className="w-4 h-4 fill-obsidian-950" />
            <span>{isRtl ? "ناردن لە واتسئەپ" : "Open WhatsApp Direct"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
