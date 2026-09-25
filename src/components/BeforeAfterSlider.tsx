"use client";

import React, { useState, useRef, useCallback } from "react";
import { Language } from "@/types/clinic";
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

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 2) percentage = 2;
    if (percentage > 98) percentage = 98;
    setSliderPosition(percentage);
  }, []);

  // Unified Pointer Events for desktop mouse and mobile touch
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture already released
    }
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
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border ${
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
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden cursor-ew-resize select-none touch-none border border-white/[0.08] shadow-2xl bg-[#080B10]"
              >
                {/* Layer 1: AFTER Visual (Full width underneath) */}
                <div className="absolute inset-0 w-full h-full pointer-events-none">
                  <ClinicalVisual caseType={activeCase.afterType} isAfter={true} />
                  {/* After Label Badge: Right side where AFTER is displayed */}
                  <div className="absolute bottom-4 right-4 px-3 py-1 rounded-md bg-emerald-surgical/90 backdrop-blur-md text-obsidian-950 text-xs font-extrabold uppercase tracking-wider shadow-lg flex items-center gap-1.5 z-10">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isRtl ? "پاشان (Royal VIP)" : "AFTER (Royal VIP)"}</span>
                  </div>
                </div>

                {/* Layer 2: BEFORE Visual (Clipped on top using clip-path for exact 1:1 pixel coordinate matching) */}
                <div
                  className="absolute inset-0 w-full h-full pointer-events-none transition-[clip-path] duration-75 ease-out"
                  style={{
                    clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                    WebkitClipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                  }}
                >
                  <ClinicalVisual caseType={activeCase.beforeType} isAfter={false} />
                  {/* Before Label Badge: Left side where BEFORE is displayed */}
                  <div className="absolute bottom-4 left-4 px-3 py-1 rounded-md bg-obsidian-950/85 backdrop-blur-md border border-white/20 text-slate-300 text-xs font-semibold uppercase tracking-wider shadow-lg z-10">
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
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-obsidian-900 border-2 border-emerald-bright shadow-[0_0_20px_rgba(16,185,129,0.7)] flex items-center justify-center cursor-grab active:cursor-grabbing pointer-events-auto transition-transform active:scale-110">
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
  // Case 1: Hollywood Smile Veneers
  if (caseType === "smile-stained" || caseType === "smile-hollywood") {
    const isHollywood = isAfter;
    return (
      <svg
        viewBox="0 0 1000 600"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id={`bgGrad-${isAfter}`} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#121826" />
            <stop offset="100%" stopColor="#070A0F" />
          </radialGradient>

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

          <linearGradient id="gumGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C56A78" />
            <stop offset="60%" stopColor="#D97A8B" />
            <stop offset="100%" stopColor="#B35261" />
          </linearGradient>

          <linearGradient id={`lustreGrad-${isAfter}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="50%" stopColor="white" stopOpacity={isHollywood ? "0.45" : "0.08"} />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width="1000" height="600" fill={`url(#bgGrad-${isAfter})`} />
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

        {/* Teeth */}
        <path
          d="M 260 270 Q 285 272 295 320 Q 285 345 260 340 Q 245 315 260 270 Z"
          fill={`url(#enamelGrad-${isAfter})`}
          stroke="#101827"
          strokeWidth="1.5"
        />
        <path
          d="M 298 266 Q 330 268 338 335 Q 322 365 298 355 Q 285 320 298 266 Z"
          fill={`url(#enamelGrad-${isAfter})`}
          stroke="#101827"
          strokeWidth="1.5"
        />
        <path
          d="M 342 260 Q 395 262 400 350 Q 380 375 345 370 Q 332 325 342 260 Z"
          fill={`url(#enamelGrad-${isAfter})`}
          stroke="#101827"
          strokeWidth="1.5"
        />
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
        <path
          d="M 602 260 Q 655 262 658 350 Q 625 372 605 370 Q 595 325 602 260 Z"
          fill={`url(#enamelGrad-${isAfter})`}
          stroke="#101827"
          strokeWidth="1.5"
        />
        <path
          d="M 662 266 Q 700 268 702 335 Q 678 365 662 355 Q 652 320 662 266 Z"
          fill={`url(#enamelGrad-${isAfter})`}
          stroke="#101827"
          strokeWidth="1.5"
        />
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

        {/* Specular Lustre Overlay */}
        <rect x="350" y="270" width="300" height="110" fill={`url(#lustreGrad-${isAfter})`} />

        {/* Realistic Hollywood BL1 Glow Sparkles */}
        {isHollywood && (
          <g>
            <circle cx="435" cy="305" r="3" fill="#FFFFFF" />
            <circle cx="560" cy="315" r="3.5" fill="#FFFFFF" />
            <circle cx="480" cy="360" r="2.5" fill="#FFFFFF" />
            <line x1="435" y1="297" x2="435" y2="313" stroke="#FFFFFF" strokeWidth="1" opacity="0.7" />
            <line x1="427" y1="305" x2="443" y2="305" stroke="#FFFFFF" strokeWidth="1" opacity="0.7" />
          </g>
        )}

        {/* Reticle */}
        <line x1="500" y1="180" x2="500" y2="480" stroke="rgba(255,255,255,0.12)" strokeDasharray="3 3" />
        <line x1="250" y1="330" x2="750" y2="330" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />

        <text x="40" y="550" fill="rgba(255,255,255,0.35)" fontSize="13" fontFamily="monospace">
          {isHollywood
            ? "IVOCLAR VIVADENT BL1 · 0.3mm LITHIUM DISILICATE · GULAN VIP"
            : "INITIAL SCAN · A3 DENTIN CHROMATIC DULLNESS · IRREGULAR INCISAL"}
        </text>
      </svg>
    );
  }

  // Case 2: Clear Invisible Aligners (Severe Crowding vs Perfect Arch)
  if (caseType === "crooked-teeth" || caseType === "aligned-teeth") {
    const isAligned = isAfter;
    return (
      <svg viewBox="0 0 1000 600" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`alignBg-${isAfter}`} cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor={isAligned ? "#0A251C" : "#1F1A12"} />
            <stop offset="100%" stopColor="#070A0F" />
          </radialGradient>
          <linearGradient id="alignedEnamel" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
          <linearGradient id="crookedEnamel" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F0E5CF" />
            <stop offset="50%" stopColor="#DFD0B1" />
            <stop offset="100%" stopColor="#BFAF93" />
          </linearGradient>
          <linearGradient id="gumPink" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C56A78" />
            <stop offset="100%" stopColor="#A84858" />
          </linearGradient>
        </defs>
        <rect width="1000" height="600" fill={`url(#alignBg-${isAfter})`} />

        {/* Mouth cavity */}
        <path d="M 180 270 Q 500 190 820 270 Q 850 390 500 460 Q 150 390 180 270 Z" fill="#1C0E14" />
        <path d="M 220 260 Q 500 235 780 260 Q 680 245 500 248 Q 320 245 220 260 Z" fill="url(#gumPink)" />

        {isAligned ? (
          /* Symmetrical Harmonic Dental Arch */
          <g>
            <path d="M 280 275 Q 310 276 315 330 Q 300 350 280 345 Z" fill="url(#alignedEnamel)" stroke="#0F172A" strokeWidth="1.5" />
            <path d="M 320 270 Q 355 272 360 340 Q 340 365 320 355 Z" fill="url(#alignedEnamel)" stroke="#0F172A" strokeWidth="1.5" />
            <path d="M 365 264 Q 415 265 418 360 Q 395 380 365 375 Z" fill="url(#alignedEnamel)" stroke="#0F172A" strokeWidth="1.5" />
            {/* Center Left */}
            <path d="M 425 255 Q 495 255 496 392 Q 460 398 425 392 Z" fill="url(#alignedEnamel)" stroke="#0F172A" strokeWidth="1.5" />
            {/* Center Right */}
            <path d="M 504 255 Q 575 255 575 392 Q 540 398 504 392 Z" fill="url(#alignedEnamel)" stroke="#0F172A" strokeWidth="1.5" />
            <path d="M 582 264 Q 635 265 635 360 Q 605 380 582 375 Z" fill="url(#alignedEnamel)" stroke="#0F172A" strokeWidth="1.5" />
            <path d="M 640 270 Q 680 272 680 340 Q 660 365 640 355 Z" fill="url(#alignedEnamel)" stroke="#0F172A" strokeWidth="1.5" />
            <path d="M 685 275 Q 720 276 720 330 Q 700 350 685 345 Z" fill="url(#alignedEnamel)" stroke="#0F172A" strokeWidth="1.5" />

            {/* Clear Aligner Sheen Line across arch */}
            <path
              d="M 270 310 Q 500 325 730 310"
              fill="none"
              stroke="#34D399"
              strokeWidth="2.5"
              strokeDasharray="6 3"
              opacity="0.8"
            />
            <path
              d="M 270 355 Q 500 380 730 355"
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
            />
          </g>
        ) : (
          /* Crooked, Overcrowded & Rotated Teeth */
          <g>
            <path d="M 280 278 Q 305 285 310 330 Q 295 348 280 342 Z" fill="url(#crookedEnamel)" stroke="#0F172A" strokeWidth="1.5" />
            {/* Twisted Premolar */}
            <path d="M 315 265 Q 345 280 348 335 Q 325 355 315 345 Z" fill="url(#crookedEnamel)" stroke="#0F172A" strokeWidth="1.5" />
            {/* High Canine */}
            <path d="M 350 250 Q 395 255 398 335 Q 375 365 350 350 Z" fill="url(#crookedEnamel)" stroke="#0F172A" strokeWidth="1.5" />
            {/* Overlapping Incisor Front */}
            <path d="M 395 262 Q 475 255 480 395 Q 440 398 400 388 Z" fill="url(#crookedEnamel)" stroke="#0F172A" strokeWidth="2" />
            {/* Recessed Lingual Incisor */}
            <path d="M 470 268 Q 535 268 535 375 Q 505 382 475 378 Z" fill="url(#crookedEnamel)" stroke="#0F172A" strokeWidth="1.5" opacity="0.9" />
            {/* Rotated Right Incisor */}
            <path d="M 525 258 Q 590 265 585 390 Q 550 395 520 388 Z" fill="url(#crookedEnamel)" stroke="#0F172A" strokeWidth="1.5" />
            <path d="M 588 272 Q 635 270 635 345 Q 610 365 588 355 Z" fill="url(#crookedEnamel)" stroke="#0F172A" strokeWidth="1.5" />
            <path d="M 640 278 Q 675 280 675 330 Q 655 348 640 342 Z" fill="url(#crookedEnamel)" stroke="#0F172A" strokeWidth="1.5" />
          </g>
        )}

        <text x="40" y="550" fill="rgba(255,255,255,0.35)" fontSize="13" fontFamily="monospace">
          {isAligned
            ? "3D THERMOPLASTIC ALIGNER ARCH · 100% MIDLINE ALIGNMENT · 0mm CROWDING"
            : "INITIAL SCAN · CLASS II MALOCCLUSION · SEVERE ANTERIOR ROTATION"}
        </text>
      </svg>
    );
  }

  // Case 3: VIP Laser Rejuvenation (Sun Pigmentation & Scars vs Glass Skin)
  if (caseType === "dermal-fatigue" || caseType === "dermal-radiant") {
    const isRadiant = isAfter;
    return (
      <svg viewBox="0 0 1000 600" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`dermalBg-${isAfter}`} cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor={isRadiant ? "#0A281E" : "#201A12"} />
            <stop offset="100%" stopColor="#070A0F" />
          </radialGradient>
          <radialGradient id="skinTone" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor={isRadiant ? "#F9E4D4" : "#E2C0A5"} />
            <stop offset="60%" stopColor={isRadiant ? "#EFC9B3" : "#CCA385"} />
            <stop offset="100%" stopColor={isRadiant ? "#DEB097" : "#A67B5B"} />
          </radialGradient>
        </defs>
        <rect width="1000" height="600" fill={`url(#dermalBg-${isAfter})`} />

        {/* Anatomical Cheek & Jaw Profile Curve */}
        <path
          d="M 280 120 Q 420 180 480 300 Q 520 400 680 480 Q 560 520 400 480 Q 260 400 240 260 Z"
          fill="url(#skinTone)"
        />

        {isRadiant ? (
          /* Glass Skin Radiance & Collagen Plumpness */
          <g>
            {/* Luminous Specular Glow */}
            <ellipse cx="450" cy="270" rx="90" ry="70" fill="#FFFFFF" opacity="0.35" filter="blur(15px)" />
            <ellipse cx="440" cy="260" rx="40" ry="25" fill="#FFFFFF" opacity="0.6" filter="blur(6px)" />
            <circle cx="430" cy="250" r="4" fill="#FFFFFF" />

            {/* Emerald Collagen Active Lattice Overlay */}
            <circle cx="480" cy="300" r="140" fill="none" stroke="#10B981" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
            <line x1="480" y1="160" x2="480" y2="440" stroke="#10B981" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
            <line x1="340" y1="300" x2="620" y2="300" stroke="#10B981" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />

            {/* Micro Radiance sparkles */}
            <circle cx="390" cy="220" r="2.5" fill="#34D399" />
            <circle cx="510" cy="340" r="3" fill="#34D399" />
            <circle cx="470" cy="210" r="2" fill="#FFFFFF" />
          </g>
        ) : (
          /* Hyperpigmentation, Dull Texture, Enlarged Pores */
          <g opacity="0.75">
            {/* Sun spots & Melasma clusters */}
            <circle cx="420" cy="260" r="14" fill="#6B4423" opacity="0.45" />
            <circle cx="450" cy="290" r="18" fill="#5C3818" opacity="0.5" />
            <circle cx="480" cy="270" r="10" fill="#6B4423" opacity="0.4" />
            <circle cx="390" cy="310" r="8" fill="#5C3818" opacity="0.4" />
            <circle cx="440" cy="340" r="12" fill="#5C3818" opacity="0.45" />

            {/* Uneven texture dots */}
            {[
              [410, 220], [435, 240], [460, 230], [400, 280], [470, 310],
              [430, 320], [490, 330], [380, 250], [415, 360], [460, 360]
            ].map(([cx, cy], idx) => (
              <circle key={idx} cx={cx} cy={cy} r="3" fill="#784C28" opacity="0.5" />
            ))}
          </g>
        )}

        <text x="40" y="550" fill="rgba(255,255,255,0.35)" fontSize="13" fontFamily="monospace">
          {isRadiant
            ? "CANDELA GENTLEMAX PRO · FRACTIONAL CO2 · COLLAGEN DENSITY +38%"
            : "INITIAL DERMATOSCOPY · EPIDERMAL HYPERPIGMENTATION · SUN DAMAGE"}
        </text>
      </svg>
    );
  }

  // Case 4: Swiss Straumann Implants (Missing tooth gap vs Roxolid Titanium Implant)
  const isImplant = isAfter;
  return (
    <svg viewBox="0 0 1000 600" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id={`impBg-${isAfter}`} cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor={isImplant ? "#0B261D" : "#1C1710"} />
          <stop offset="100%" stopColor="#070A0F" />
        </radialGradient>
        <linearGradient id="boneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7E6854" />
          <stop offset="100%" stopColor="#3F3227" />
        </linearGradient>
        <linearGradient id="titaniumGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#64748B" />
          <stop offset="50%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>
      <rect width="1000" height="600" fill={`url(#impBg-${isAfter})`} />

      {/* Alveolar Bone Cross Section */}
      <path d="M 200 320 Q 500 300 800 320 L 800 520 L 200 520 Z" fill="url(#boneGrad)" opacity="0.85" />
      {/* Gingiva / Gum Tissue */}
      <path d="M 200 290 Q 500 270 800 290 L 800 330 L 200 330 Z" fill="#B35261" />

      {/* Neighboring Teeth */}
      {/* Left Premolar */}
      <path d="M 320 180 Q 370 180 375 285 Q 350 310 320 300 Z" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2" />
      <path d="M 335 300 L 335 420 Q 345 440 355 420 L 360 300 Z" fill="#E2E8F0" opacity="0.5" />

      {/* Right Second Molar */}
      <path d="M 625 180 Q 685 180 690 285 Q 660 310 625 300 Z" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2" />
      <path d="M 640 300 L 640 430 Q 665 445 675 425 L 675 300 Z" fill="#E2E8F0" opacity="0.5" />

      {isImplant ? (
        /* Straumann Roxolid Implant Fixture + Abutment + Crown */
        <g>
          {/* Threaded Titanium Fixture in Bone */}
          <rect x="475" y="320" width="50" height="150" rx="4" fill="url(#titaniumGrad)" stroke="#10B981" strokeWidth="1.5" />
          {/* Screw Threads */}
          {[340, 360, 380, 400, 420, 440].map((y, i) => (
            <line key={i} x1="470" y1={y} x2="530" y2={y} stroke="#10B981" strokeWidth="2.5" />
          ))}

          {/* Golden Titanium Abutment */}
          <polygon points="480,320 520,320 530,280 470,280" fill="#D4AF37" stroke="#B89327" strokeWidth="1" />

          {/* Pure Zirconia Crown */}
          <path
            d="M 440 170 Q 560 170 565 280 Q 500 295 435 280 Z"
            fill="#FFFFFF"
            stroke="#10B981"
            strokeWidth="2"
          />
          {/* Crown Specular */}
          <ellipse cx="485" cy="210" rx="20" ry="12" fill="rgba(255,255,255,0.8)" />

          {/* Osseointegration Active Growth Rays */}
          <circle cx="500" cy="400" r="75" fill="none" stroke="#34D399" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
        </g>
      ) : (
        /* Missing Molar Gap with Bone Resorption Defect */
        <g>
          {/* Depressed Bone Defect Contour */}
          <path d="M 430 320 Q 500 370 570 320 Z" fill="#1C1710" />
          <path d="M 430 290 Q 500 340 570 290" fill="none" stroke="#D4AF37" strokeWidth="2" strokeDasharray="5 4" />
          {/* Empty Space Marker */}
          <text x="500" y="240" fill="#D4AF37" textAnchor="middle" fontSize="16" fontFamily="sans-serif" fontWeight="bold">
            EDENTULOUS SPACE (MISSING MOLAR)
          </text>
          <text x="500" y="270" fill="#94A3B8" textAnchor="middle" fontSize="12" fontFamily="sans-serif">
            Requires Guided Implant Placement
          </text>
        </g>
      )}

      <text x="40" y="550" fill="rgba(255,255,255,0.35)" fontSize="13" fontFamily="monospace">
        {isImplant
          ? "STRAUMANN ROXOLID SLA · BASEL SWITZERLAND · 3D COMPUTER GUIDED"
          : "3D CBCT RADIOGRAPH · FIRST MOLAR EDENTULOUS GAP · VERTICAL BONE LOSS"}
      </text>
    </svg>
  );
}
