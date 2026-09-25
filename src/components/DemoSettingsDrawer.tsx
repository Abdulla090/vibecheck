"use client";

import React, { useState } from "react";
import { ClinicConfig, Language } from "@/types/clinic";
import { CLINIC_PRESETS } from "@/data/clinicData";
import { 
  Sliders, 
  X, 
  RotateCcw, 
  Save, 
  Building, 
  Phone, 
  User, 
  MapPin, 
  DollarSign, 
  Sparkles,
  Briefcase,
  CheckCircle,
  HelpCircle,
  TrendingUp
} from "lucide-react";

interface DemoSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: ClinicConfig;
  onUpdateConfig: (newConfig: ClinicConfig) => void;
  lang: Language;
}

export default function DemoSettingsDrawer({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  lang,
}: DemoSettingsDrawerProps) {
  const isRtl = lang === "ckb";
  const [activeTab, setActiveTab] = useState<"customize" | "pitch">("customize");

  const [formData, setFormData] = useState<ClinicConfig>(config);
  const [saveToast, setSaveToast] = useState(false);

  // Sync if config changes from outside
  React.useEffect(() => {
    setFormData(config);
  }, [config]);

  if (!isOpen) return null;

  const handleApplyPreset = (presetConfig: Partial<ClinicConfig>) => {
    const updated = { ...formData, ...presetConfig };
    setFormData(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(formData);
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm transition-all duration-300">
      <div
        className="w-full max-w-xl h-full bg-obsidian-900 border-l border-white/[0.1] shadow-2xl flex flex-col overflow-hidden text-slate-200"
        dir="ltr" // Kept LTR for technical settings clarity or adaptive
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-obsidian-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-surgical/20 border border-emerald-surgical/40 flex items-center justify-center text-emerald-bright">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                Agency Pitch &amp; Live Personalizer
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-surgical text-obsidian-950 font-extrabold uppercase">
                  Sales Demo
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Personalize for any clinic on Gulan St / Salim St in 10 seconds
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-obsidian-850 hover:bg-obsidian-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/[0.08] bg-obsidian-850 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("customize")}
            className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-2 ${
              activeTab === "customize"
                ? "text-emerald-bright border-b-2 border-emerald-bright bg-obsidian-900"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Customize Clinic</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pitch")}
            className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-2 ${
              activeTab === "pitch"
                ? "text-champagne-400 border-b-2 border-champagne-400 bg-obsidian-900"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>$700 Deal Closing Script</span>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "customize" ? (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Presets */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Quick 1-Tap Presets (Walk-in Ready):
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {CLINIC_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(preset.config)}
                      className="text-left px-3.5 py-2.5 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 border border-white/[0.06] hover:border-emerald-surgical/40 transition-all text-xs flex items-center justify-between group"
                    >
                      <span className="font-medium text-white group-hover:text-emerald-bright">
                        {preset.label}
                      </span>
                      <Sparkles className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-bright" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Clinic Names */}
              <div className="space-y-3 pt-2 border-t border-white/[0.08]">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-emerald-bright" />
                    Clinic Name (English):
                  </label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-800 border border-white/[0.08] text-white text-xs focus:outline-none focus:border-emerald-surgical"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-emerald-bright" />
                    Clinic Name (Sorani Kurdish):
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={formData.nameCkb}
                    onChange={(e) => setFormData({ ...formData, nameCkb: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-800 border border-white/[0.08] text-white text-xs focus:outline-none focus:border-emerald-surgical"
                  />
                </div>
              </div>

              {/* WhatsApp Phone */}
              <div className="space-y-3 pt-2 border-t border-white/[0.08]">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-bright" />
                    Receptionist WhatsApp (No spaces or plus, e.g. 9647501234567):
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value,
                        displayPhone: e.target.value.startsWith("964")
                          ? `+964 ${e.target.value.slice(3, 6)} ${e.target.value.slice(6, 9)} ${e.target.value.slice(9)}`
                          : e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-800 border border-white/[0.08] text-white font-mono text-xs focus:outline-none focus:border-emerald-surgical"
                  />
                  <p className="text-[10px] text-emerald-bright mt-1">
                    Tip: Ask the doctor or receptionist for their WhatsApp number right now, type it here, and tap "Book VIP Consultation" to see their phone ring live!
                  </p>
                </div>
              </div>

              {/* Doctor Name & Address */}
              <div className="space-y-3 pt-2 border-t border-white/[0.08]">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-champagne-400" />
                    Doctor Name:
                  </label>
                  <input
                    type="text"
                    value={formData.doctorEn}
                    onChange={(e) => setFormData({ ...formData, doctorEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-800 border border-white/[0.08] text-white text-xs focus:outline-none focus:border-emerald-surgical"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-bright" />
                    Address &amp; Location:
                  </label>
                  <input
                    type="text"
                    value={formData.addressEn}
                    onChange={(e) => setFormData({ ...formData, addressEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-800 border border-white/[0.08] text-white text-xs focus:outline-none focus:border-emerald-surgical"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-champagne-400" />
                    USD to IQD Exchange Rate (e.g. 1500 = $1):
                  </label>
                  <input
                    type="number"
                    value={formData.usdToIqdRate}
                    onChange={(e) =>
                      setFormData({ ...formData, usdToIqdRate: Number(e.target.value) || 1500 })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-800 border border-white/[0.08] text-white font-mono text-xs focus:outline-none focus:border-emerald-surgical"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-surgical hover:bg-emerald-bright text-obsidian-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save &amp; Personalize Live Demo</span>
                </button>
              </div>

              {saveToast && (
                <div className="p-3 rounded-xl bg-emerald-surgical/20 border border-emerald-surgical text-emerald-bright text-xs text-center font-bold flex items-center justify-center gap-2 animate-bounce">
                  <CheckCircle className="w-4 h-4" />
                  <span>Personalized! Updated website live.</span>
                </div>
              )}
            </form>
          ) : (
            /* Pitch Script & Tactics */
            <div className="space-y-6 text-xs text-slate-300">
              <div className="p-4 rounded-2xl bg-champagne-500/10 border border-champagne-500/30 text-champagne-400">
                <h4 className="font-bold text-sm mb-1 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  How to Walk Away with $350 Upfront Cash Today
                </h4>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  You are not selling "code". You are giving the doctor an automated high-net-worth patient booking machine that converts Instagram followers into VIP cash procedures.
                </p>
              </div>

              {/* Step by step */}
              <div className="space-y-4">
                <div className="hairline-card p-4 rounded-xl bg-obsidian-850 space-y-2">
                  <span className="font-bold text-white text-xs">
                    Step 1: The Reception Hook (1 Minute)
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    Walk into the clinic on Gulan St (Erbil) or Salim St (Sulaymaniyah). Ask for the clinic manager or head doctor:
                  </p>
                  <div className="p-3 bg-obsidian-900 rounded-lg text-emerald-bright font-mono text-[11px]" dir="rtl">
                    "سڵاو، هاتووم دەرەنجامی ئەو سیستەمە نوێیە پێشکەشی دکتۆر بکەم کە نەخۆشە VIP-یەکان لە ئینستاگرامی کلینیکەوە ڕاستەوخۆ دەگوازێتەوە بۆ واتسئەپ بە نۆرەی حجزکراو."
                  </div>
                </div>

                <div className="hairline-card p-4 rounded-xl bg-obsidian-850 space-y-2">
                  <span className="font-bold text-white text-xs">
                    Step 2: The Live iPhone Demo (2 Minutes)
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    Hand them your phone with this exact website loaded.
                    <br />
                    1. Show them the Before &amp; After interactive slider (let them drag it!).
                    <br />
                    2. Switch between Sorani Kurdish and English in 1 tap.
                    <br />
                    3. Ask: "What is your reception WhatsApp number?" — Type it in Demo Settings, select Hollywood Smile, and hit <b>Book VIP Consultation</b>. Their front-desk phone will instantly chime with a pre-filled booking!
                  </p>
                </div>

                <div className="hairline-card p-4 rounded-xl bg-obsidian-850 space-y-2">
                  <span className="font-bold text-white text-xs">
                    Step 3: The No-Brainer Closing Offer
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    "Doctor, one single Hollywood Smile patient pays $1,800 to $2,500. This complete custom gateway is only <b>$700 total</b>.
                    <br /><br />
                    $350 cash deposit today, and my team connects your clinic photos, your domain, and your WhatsApp within 24 hours. The remaining $350 only when you approve it live."
                  </p>
                </div>

                <div className="hairline-card p-4 rounded-xl bg-obsidian-850 space-y-2">
                  <span className="font-bold text-white text-xs">
                    Handling Objections:
                  </span>
                  <ul className="space-y-1.5 text-slate-400">
                    <li>• <b>"We already have Instagram":</b> Instagram DMs are messy, lost, and slow. This website gives prices, trust badges, before/after, and sends structured patient leads into WhatsApp.</li>
                    <li>• <b>"Websites take months":</b> Not this one. It's built, optimized, and ready on Vercel Edge. We deploy your exact photos tomorrow morning.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-obsidian-950 flex items-center justify-between text-xs text-slate-500">
          <span>VIP Clinic Gateway · Built for Erbil &amp; Sulaymaniyah</span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white underline text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
