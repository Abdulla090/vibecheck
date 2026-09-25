"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { BeforeAfterCase, Language } from "@/types/clinic";
import { BEFORE_AFTER_CASES } from "@/data/clinicData";
import { Sparkles, Eye, CheckCircle2, ChevronLeft, ChevronRight, Sliders } from "lucide-react";

interface BeforeAfterSliderProps {
  lang: Language;
}

export default function BeforeAfterSlider({ lang }: BeforeAfterSliderProps) {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(BEFORE_AFTER_CASES[0].id);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeCase =
    BEFORE_AFTER_CASES.find((c) => c.id === selectedCaseId) || BEFORE_AFTER_CASES[0];

  const isRtl = lang === "ckb";

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 3) percentage = 3;
    if (percentage > 97) percentage = 97;
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handleEnd]);

  // Click on track to reposition
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    handleMove(e.clientX);
  };

  return (
    <section id="results" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-surgical/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-surgical/10 border border-emerald-surgical/30 text-emerald-bright text-xs font-medium tracking-wide mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isRtl
                ? "دەرەنجامی ڕاستەقینە بە تەکنەلۆژیای ئەوروپی"
                : "Real Clinical Transformations · European Precision"}
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            {isRtl ? (
              <>
                جیاوازی ببینە لەگەڵ <span className="text-emerald-bright">دەستلێدانی شاهانە</span>
              </>
            ) : (
              <>
                Witness The VIP <span className="text-emerald-bright">Smile Transformation</span>
              </>
            )}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {isRtl
              ? "پەنجە ڕابکێشە لەسەر هێڵەکە بۆ بینینی جیاوازی ددان و پێست پێش و پاش وەرگرتنی چارەسەر."
              : "Drag the slider to inspect the microscopic precision of our German porcelain veneers, invisible orthodontics, and Swiss implant restorations."}
          </p>
        </div>

        {/* Case Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {BEFORE_AFTER_CASES.map((c) => {
            const isSelected = c.id === selectedCaseId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSelectedCaseId(c.id);
                  setSliderPosition(50);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border ${
                  isSelected
                    ? "bg-emerald-surgical text-obsidian-950 font-bold border-emerald-bright shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    : "bg-obsidian-800 text-slate-300 border-white/[0.08] hover:border-emerald-surgical/40 hover:text-white"
                }`}
              >
                {isRtl ? c.titleCkb : c.titleEn}
              </button>
            );
          })}
        </div>

        {/* Slider Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Visual Comparison Frame */}
          <div className="lg:col-span-8">
            <div className="hairline-card rounded-2xl p-2 sm:p-3 relative bg-obsidian-850">
              {/* Clinical Header Bar inside Card */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06] mb-2 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-bright animate-ping" />
                  <span className="text-slate-300 font-sans font-semibold">
                    {isRtl ? activeCase.categoryCkb : activeCase.categoryEn}
                  </span>
                </span>
                <span className="text-champagne-400 flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5" />
                  {Math.round(sliderPosition)}% {isRtl ? "پێشاندان" : "Revealed"}
                </span>
              </div>

              {/* Touch & Drag Slider Container */}
              <div
                ref={containerRef}
                onClick={handleContainerClick}
                className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden cursor-ew-resize no-select border border-white/[0.08] shadow-2xl bg-[#080B10]"
              >
                {/* Layer 1: AFTER Visual (Full width underneath) */}
                <div className="absolute inset-0 w-full h-full pointer-events-none">
                  <ClinicalVisual caseType={activeCase.afterType} isAfter={true} />
                  {/* After Label Badge */}
                  <div
                    className={`absolute bottom-4 ${
                      isRtl ? "left-4" : "right-4"
                    } px-3 py-1 rounded-md bg-emerald-surgical/90 backdrop-blur-md text-obsidian-950 text-xs font-extrabold uppercase tracking-wider shadow-lg flex items-center gap-1.5`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isRtl ? "پاشان (Royal VIP)" : "AFTER (Royal VIP)"}</span>
                  </div>
                </div>

                {/* Layer 2: BEFORE Visual (Clipped on top) */}
                <div
                  className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none transition-[width] duration-75 ease-out"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <div className="absolute inset-y-0 left-0 w-[1000px] sm:w-[1200px] h-full">
                    <ClinicalVisual caseType={activeCase.beforeType} isAfter={false} />
                  </div>
                  {/* Before Label Badge */}
                  <div
                    className={`absolute bottom-4 ${
                      isRtl ? "right-4" : "left-4"
                    } px-3 py-1 rounded-md bg-obsidian-950/85 backdrop-blur-md border border-white/20 text-slate-300 text-xs font-semibold uppercase tracking-wider shadow-lg`}
                  >
                    <span>{isRtl ? "پێشتر" : "BEFORE"}</span>
                  </div>
                </div>

                {/* Divider Line & Interactive Handle */}
                <div
                  className="absolute top-0 bottom-0 z-20 pointer-events-none"
                  style={{ left: `${sliderPosition}%` }}
                >
                  {/* Vertical hairline line */}
                  <div className="absolute inset-y-0 -left-[1px] w-[2px] bg-gradient-to-b from-transparent via-emerald-bright to-transparent shadow-[0_0_12px_#10B981]" />

                  {/* Circular Draggable Handle */}
                  <div
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setIsDragging(true);
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      setIsDragging(true);
                    }}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-obsidian-900 border-2 border-emerald-bright shadow-[0_0_20px_rgba(16,185,129,0.7)] flex items-center justify-center cursor-grab active:cursor-grabbing pointer-events-auto transition-transform active:scale-110"
                  >
                    <div className="flex items-center text-emerald-bright">
                      <ChevronLeft className="w-4 h-4 -mr-1" />
                      <ChevronRight className="w-4 h-4 -ml-1" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions Prompt */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 px-2">
                <span>{isRtl ? "ڕاکێشان بە پەنجە یان ماوس" : "Drag left or right to inspect"}</span>
                <span className="text-emerald-bright font-medium">
                  {isRtl ? activeCase.shadeCkb : activeCase.shadeEn}
                </span>
              </div>
            </div>
          </div>

          {/* Side Details & Clinical Notes */}
          <div className="lg:col-span-4 space-y-4">
            <div className="hairline-card rounded-2xl p-6 bg-obsidian-850 space-y-4 border-l-2 border-l-emerald-surgical">
              <div className="flex items-center gap-2 text-xs font-semibold text-champagne-400 uppercase tracking-wider">
                <Eye className="w-4 h-4" />
                <span>{isRtl ? "وردەکاری دۆسیەی پزیشکی" : "Clinical Case Overview"}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                {isRtl ? activeCase.titleCkb : activeCase.titleEn}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {isRtl ? activeCase.descriptionCkb : activeCase.descriptionEn}
              </p>

              <div className="pt-2 border-t border-white/[0.08] space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{isRtl ? "پلەی ڕەنگ:" : "Shade Result:"}</span>
                  <span className="text-emerald-bright font-semibold">
                    {isRtl ? activeCase.shadeCkb : activeCase.shadeEn}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{isRtl ? "ماوەی گەیشتن بە ئەنجام:" : "Duration:"}</span>
                  <span className="text-white font-medium">
                    {isRtl ? activeCase.durationCkb : activeCase.durationEn}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{isRtl ? "کەرەستەی بەکارهاتوو:" : "Certified Material:"}</span>
                  <span className="text-champagne-400 font-medium">German Ivoclar / Swiss</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="#book"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-surgical to-emerald-600 text-obsidian-950 font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isRtl ? "داواکاری ئەم دەرەنجامە بۆ خۆت" : "Claim This Transformation"}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Crisp, high-end SVG clinical anatomical illustration rendered with realistic lighting
function ClinicalVisual({ caseType, isAfter }: { caseType: string; isAfter: boolean }) {
  if (caseType === "smile-stained" || caseType === "smile-hollywood") {
    const isHollywood = isAfter;
    return (
      <svg
        viewBox="0 0 1000 600"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Obsidian Studio Backdrop */}
          <radialGradient id={`bgGrad-${isAfter}`} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#121826" />
            <stop offset="100%" stopColor="#070A0F" />
          </radialGradient>

          {/* Enamel Gradient: Yellowed A3 vs Luminescent BL1 */}
          <linearGradient id={`enamelGrad-${isAfter}`} x1="0%" y1="0%" x2="0%" y2="100%">
            {isHollywood ? (
              <>
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="35%" stopColor="#F8FAFC" />
                <stop offset="80%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#CBD5E1" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#E2CE93" />
                <stop offset="40%" stopColor="#D4BC7B" />
                <stop offset="75%" stopColor="#C4A860" />
                <stop offset="100%" stopColor="#9C823D" />
              </>
            )}
          </linearGradient>

          {/* Healthy Gingiva / Gum Gradient */}
          <linearGradient id="gumGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C56A78" />
            <stop offset="60%" stopColor="#D97A8B" />
            <stop offset="100%" stopColor="#B35261" />
          </linearGradient>

          {/* Veneer Lustre / Specular Reflection */}
          <linearGradient id="lustreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="50%" stopColor="white" stopOpacity={isHollywood ? "0.4" : "0.08"} />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Clinical darkroom backdrop */}
        <rect width="1000" height="600" fill={`url(#bgGrad-${isAfter})`} />

        {/* Ambient Dental Clinical Lighting */}
        <ellipse cx="500" cy="300" rx="380" ry="240" fill={isHollywood ? "#10B981" : "#D4AF37"} opacity="0.04" />

        {/* Lip Contours & Dark Mouth Cavity */}
        <path
          d="M 180 280 Q 500 200 820 280 Q 860 380 500 460 Q 140 380 180 280 Z"
          fill="#1C0E14"
        />

        {/* Upper Gum Arch */}
        <path
          d="M 220 265 Q 320 230 420 240 Q 500 242 580 240 Q 680 230 780 265 Q 680 250 500 252 Q 320 250 220 265 Z"
          fill="url(#gumGrad)"
        />

        {/* Upper Dental Arch — Central Incisors, Lateral Incisors, Canines, Premolars */}
        {/* Right Premolar */}
        <path
          d="M 260 270 Q 285 272 295 320 Q 285 345 260 340 Q 245 315 260 270 Z"
          fill={`url(#enamelGrad-${isAfter})`}
          stroke="#101827"
          strokeWidth="1.5"
        />
        {/* Right Canine */}
        <path
          d="M 298 266 Q 330 268 338 335 Q 322 365 298 355 Q 285 320 298 266 Z"
          fill={`url(#enamelGrad-${isAfter})`}
          stroke="#101827"
          strokeWidth="1.5"
        />
        {/* Right Lateral Incisor */}
        <path
          d="M 342 260 Q 395 262 400 350 Q 380 375 345 370 Q 332 325 342 260 Z"
          fill={`url(#enamelGrad-${isAfter})`}
          stroke="#101827"
          strokeWidth="1.5"
        />
        {/* Central Incisor Left (Patient Right) */}
        <path
          d={
            isHollywood
              ? "M 405 252 Q 490 252 494 395 Q 455 400 410 395 Q 395 330 405 252 Z"
              : "M 408 252 Q 488 252 492 385 Q 460 380 412 390 Q 397 330 408 252 Z"
          }
          fill={`url(#enamelGrad-${isAfter})`}
          stroke="#101827"
          strokeWidth="1.5"
        />
        {/* Central Incisor Right (Patient Left) */}
        <path
          d={
            isHollywood
              ? "M 506 252 Q 590 252 595 395 Q 545 400 506 395 Q 498 330 506 252 Z"
              : "M 508 252 Q 588 252 585 380 Q 540 392 506 388 Q 500 330 508 252 Z"
          }
          fill={`url(#enamelGrad-${isAfter})`}
          stroke="#101827"
          strokeWidth="1.5"
        />
        {/* Left Lateral Incisor */}
        <path
          d="M 602 260 Q 655 262 658 350 Q 625 372 605 370 Q 595 325 602 260 Z"
          fill={`url(#enamelGrad-${isAfter})`}
          stroke="#101827"
          strokeWidth="1.5"
        />
        {/* Left Canine */}
        <path
          d="M 662 266 Q 700 268 702 335 Q 678 365 662 355 Q 652 320 662 266 Z"
          fill={`url(#enamelGrad-${isAfter})`}
          stroke="#101827"
          strokeWidth="1.5"
        />
        {/* Left Premolar */}
        <path
          d="M 705 270 Q 735 272 740 320 Q 720 345 705 340 Q 695 315 705 270 Z"
          fill={`url(#enamelGrad-${isAfter})`}
          stroke="#101827"
          strokeWidth="1.5"
        />

        {/* Lower Teeth Horizon */}
        <path
          d="M 330 405 Q 500 425 670 405 Q 660 445 500 455 Q 340 445 330 405 Z"
          fill={isHollywood ? "#E2E8F0" : "#B8A060"}
          opacity="0.85"
        />

        {/* Specular Lustre Overlay across central teeth */}
        <rect x="350" y="270" width="300" height="110" fill="url(#lustreGrad)" />

        {/* Realistic Hollywood BL1 Glow Sparkles */}
        {isHollywood && (
          <>
            <circle cx="435" cy="305" r="3" fill="#FFFFFF" filter="blur(0.5px)" />
            <circle cx="560" cy="315" r="3.5" fill="#FFFFFF" filter="blur(0.5px)" />
            <circle cx="480" cy="360" r="2.5" fill="#FFFFFF" filter="blur(0.5px)" />
          </>
        )}

        {/* Clinical Grid Reticle overlay */}
        <line x1="500" y1="180" x2="500" y2="480" stroke="rgba(255,255,255,0.12)" strokeDasharray="3 3" />
        <line x1="250" y1="330" x2="750" y2="330" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />

        {/* Watermark / Clinical Metadata */}
        <text x="40" y="550" fill="rgba(255,255,255,0.3)" fontSize="13" fontFamily="monospace">
          {isHollywood
            ? "IVOCLAR VIVADENT BL1 · 0.3mm LITHIUM DISILICATE · GULAN VIP"
            : "INITIAL SCAN · A3 DENTIN CHROMATIC DULLNESS · IRREGULAR INCISAL"}
        </text>
      </svg>
    );
  }

  // Fallback for aligners, dermatology, and implants
  return (
    <svg
      viewBox="0 0 1000 600"
      className="w-full h-full object-cover"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id={`genericBg-${isAfter}`} cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor={isAfter ? "#0B2E24" : "#1A1612"} />
          <stop offset="100%" stopColor="#070A0F" />
        </radialGradient>
      </defs>
      <rect width="1000" height="600" fill={`url(#genericBg-${isAfter})`} />

      {/* Grid Pattern */}
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      </pattern>
      <rect width="1000" height="600" fill="url(#grid)" />

      {/* Center Medical Contour */}
      <circle
        cx="500"
        cy="300"
        r="180"
        fill="none"
        stroke={isAfter ? "#10B981" : "#D4AF37"}
        strokeWidth="2"
        strokeDasharray={isAfter ? "none" : "6 4"}
        opacity="0.6"
      />
      <circle
        cx="500"
        cy="300"
        r="120"
        fill={isAfter ? "rgba(16,185,129,0.08)" : "rgba(212,175,55,0.05)"}
      />

      {/* Graphic representation based on type */}
      {caseType.includes("crooked") && (
        <g stroke="#D4AF37" strokeWidth="3" fill="none">
          <path d="M 420 320 Q 450 250 480 340 Q 520 260 550 330 Q 580 270 610 320" />
          <text x="500" y="380" fill="#D4AF37" textAnchor="middle" fontSize="16" fontFamily="sans-serif">
            Overcrowded Incisors · Malocclusion Class II
          </text>
        </g>
      )}
      {caseType.includes("aligned") && (
        <g stroke="#10B981" strokeWidth="4" fill="none">
          <path d="M 380 310 Q 500 300 620 310" />
          <circle cx="440" cy="308" r="6" fill="#10B981" />
          <circle cx="500" cy="305" r="6" fill="#10B981" />
          <circle cx="560" cy="308" r="6" fill="#10B981" />
          <text x="500" y="380" fill="#34D399" textAnchor="middle" fontSize="16" fontFamily="sans-serif" fontWeight="bold">
            100% Symmetrical Arch · 3D Aligner Correction
          </text>
        </g>
      )}
      {caseType.includes("dermal-fatigue") && (
        <g fill="#D4AF37" opacity="0.6">
          <circle cx="440" cy="270" r="8" />
          <circle cx="530" cy="290" r="12" />
          <circle cx="470" cy="330" r="10" />
          <text x="500" y="400" fill="#D4AF37" textAnchor="middle" fontSize="16" fontFamily="sans-serif">
            Hyperpigmentation &amp; Uneven Texture
          </text>
        </g>
      )}
      {caseType.includes("dermal-radiant") && (
        <g fill="#10B981">
          <circle cx="500" cy="300" r="80" fill="rgba(16,185,129,0.15)" filter="blur(8px)" />
          <path d="M 500 240 L 515 285 L 560 300 L 515 315 L 500 360 L 485 315 L 440 300 L 485 285 Z" fill="#34D399" />
          <text x="500" y="400" fill="#34D399" textAnchor="middle" fontSize="16" fontFamily="sans-serif" fontWeight="bold">
            Glass Skin Radiance · Active Collagen Regeneration
          </text>
        </g>
      )}
      {caseType.includes("missing-molar") && (
        <g stroke="#D4AF37" strokeWidth="2" fill="none">
          <rect x="450" y="260" width="100" height="90" strokeDasharray="4 4" />
          <line x1="450" y1="260" x2="550" y2="350" />
          <text x="500" y="390" fill="#D4AF37" textAnchor="middle" fontSize="16" fontFamily="sans-serif">
            Missing First Molar · Bone Resorption Risk
          </text>
        </g>
      )}
      {caseType.includes("ceramic-implant") && (
        <g fill="#10B981">
          <rect x="475" y="290" width="50" height="70" rx="6" fill="#34D399" />
          <polygon points="460,290 540,290 530,240 470,240" fill="#FFFFFF" />
          <text x="500" y="400" fill="#34D399" textAnchor="middle" fontSize="16" fontFamily="sans-serif" fontWeight="bold">
            Straumann Titanium Implant + Pure Zirconia Crown
          </text>
        </g>
      )}
    </svg>
  );
}
