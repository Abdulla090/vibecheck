"use client";

import React from "react";
import { Language, ClinicConfig } from "@/types/clinic";
import { CrmStats, PatientLead, MedicationItem, ClinicalAppointment } from "@/types/crm";
import { 
  Users, 
  UserCheck, 
  Clock, 
  Pill, 
  DollarSign, 
  AlertTriangle, 
  Calendar, 
  PlusCircle, 
  ArrowUpRight, 
  FileText, 
  ShieldCheck, 
  Sparkles,
  Layers
} from "lucide-react";

interface CrmStatsOverviewProps {
  lang: Language;
  config: ClinicConfig;
  stats: CrmStats;
  leads: PatientLead[];
  medications: MedicationItem[];
  appointments: ClinicalAppointment[];
  onOpenNewLead: () => void;
  onOpenNewAppointment: () => void;
  onOpenNewMedication: () => void;
  onOpenNewPrescription: () => void;
  onSelectTab: (tab: any) => void;
}

export default function CrmStatsOverview({
  lang,
  config,
  stats,
  leads,
  medications,
  appointments,
  onOpenNewLead,
  onOpenNewAppointment,
  onOpenNewMedication,
  onOpenNewPrescription,
  onSelectTab,
}: CrmStatsOverviewProps) {
  const isRtl = lang === "ckb";
  const lowStockItems = medications.filter((m) => m.currentStock <= m.minStockLevel);
  const expiringItems = medications.filter((m) => {
    const expDate = new Date(m.expiryDate).getTime();
    const now = new Date("2026-09-26").getTime();
    return expDate - now < 90 * 24 * 60 * 60 * 1000; // < 90 days
  });

  return (
    <div className="space-y-6">
      {/* 1. Executive Welcome & Quick Action Bar */}
      <div className="hairline-card p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-white/[0.08] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-bright">
            <span className="w-2 h-2 rounded-full bg-emerald-bright animate-ping" />
            <span>{isRtl ? "سیستەمی چالاکی پزیشکی و دەرمانسازی" : "Active Medical & Clinical Operations"}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight">
            {isRtl ? `بەخێربێن، ${config.doctorCkb}` : `Welcome, ${config.doctorEn}`}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {isRtl
              ? `چاودێری نەخۆشەکان، کۆگای کەرەستە و دەرمان، و نۆرەی پزیشکی لە ${config.nameCkb}.`
              : `Real-time patient pipeline, VIP appointment queue, and pharmacy stock control for ${config.nameEn}.`}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={onOpenNewLead}
            className="px-3 py-2 rounded-xl bg-emerald-surgical hover:bg-emerald-bright text-obsidian-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)]"
          >
            <PlusCircle className="w-4 h-4 fill-obsidian-950 text-emerald-bright" />
            <span>{isRtl ? "نەخۆشی نوێ" : "New Patient Lead"}</span>
          </button>

          <button
            type="button"
            onClick={onOpenNewAppointment}
            className="px-3 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-white border border-white/[0.08] hover:border-emerald-surgical/40 font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <Calendar className="w-4 h-4 text-emerald-bright" />
            <span>{isRtl ? "حیجزی نۆرە" : "Book Appointment"}</span>
          </button>

          <button
            type="button"
            onClick={onOpenNewMedication}
            className="px-3 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-white border border-white/[0.08] hover:border-champagne-500/40 font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <Pill className="w-4 h-4 text-champagne-400" />
            <span>{isRtl ? "زیادکردنی دەرمان" : "Add Inventory Item"}</span>
          </button>

          <button
            type="button"
            onClick={onOpenNewPrescription}
            className="px-3 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-white border border-white/[0.08] hover:border-blue-500/40 font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <FileText className="w-4 h-4 text-blue-400" />
            <span>{isRtl ? "ڕەچەتەی نوێ" : "Issue Digital Rx"}</span>
          </button>
        </div>
      </div>

      {/* 2. Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Patient Leads & In Treatment */}
        <div 
          onClick={() => onSelectTab("pipeline")}
          className="hairline-card p-4 sm:p-5 rounded-2xl hover:border-emerald-surgical/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">
              {isRtl ? "هێڵی نەخۆشەکان" : "Patient Pipeline"}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-surgical/10 border border-emerald-surgical/20 flex items-center justify-center text-emerald-bright group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {stats.totalPatients}
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
            <span className="text-emerald-bright font-bold">
              {stats.inTreatmentCount} {isRtl ? "لە چارەسەردا" : "In Treatment"}
            </span>
            <span>·</span>
            <span>{stats.consultationsBooked} {isRtl ? "حیجزکراو" : "Booked"}</span>
          </div>
        </div>

        {/* Card 2: Today's Clinical Queue */}
        <div 
          onClick={() => onSelectTab("appointments")}
          className="hairline-card p-4 sm:p-5 rounded-2xl hover:border-emerald-surgical/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">
              {isRtl ? "نۆرەی ئەمڕۆ" : "Today's Clinic Queue"}
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white flex items-center gap-2">
            <span>{appointments.length}</span>
            <span className="text-xs font-mono font-normal text-emerald-bright px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              {appointments.filter(a => a.status === "in-chair").length} {isRtl ? "لە ژوورەوەیە" : "In Chair"}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {appointments.filter(a => a.status === "waiting").length} {isRtl ? "نەخۆش لە هۆڵی چاوەڕوانین" : "Patients waiting at reception"}
          </div>
        </div>

        {/* Card 3: Pharmacy Stock Alerts */}
        <div 
          onClick={() => onSelectTab("pharmacy")}
          className={`hairline-card p-4 sm:p-5 rounded-2xl transition-all cursor-pointer group ${
            stats.lowStockAlertsCount > 0 ? "hover:border-rose-500/40 border-rose-500/20" : "hover:border-emerald-surgical/40"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">
              {isRtl ? "ئاگاداری کۆگای دەرمان" : "Pharmacy Stock Alerts"}
            </span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform ${
              stats.lowStockAlertsCount > 0 ? "bg-rose-500/10 border border-rose-500/30 text-rose-400" : "bg-emerald-surgical/10 border border-emerald-surgical/20 text-emerald-bright"
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white flex items-center gap-2">
            <span className={stats.lowStockAlertsCount > 0 ? "text-rose-400" : "text-white"}>
              {stats.lowStockAlertsCount}
            </span>
            <span className="text-xs font-normal text-slate-400">
              {isRtl ? "پێویست بە داواکردنەوە" : "Low Stock Items"}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-amber-400/90 flex items-center gap-1 font-mono">
            <span>{expiringItems.length} {isRtl ? "دەرمان بەسەردەچێت لە ٩٠ ڕۆژدا" : "Batches Expiring in <90d"}</span>
          </div>
        </div>

        {/* Card 4: Estimated Pipeline Value */}
        <div 
          onClick={() => onSelectTab("pipeline")}
          className="hairline-card p-4 sm:p-5 rounded-2xl hover:border-champagne-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">
              {isRtl ? "کۆی بەهای چارەسەرەکان" : "Active Pipeline Value"}
            </span>
            <div className="w-8 h-8 rounded-lg bg-champagne-500/10 border border-champagne-500/30 flex items-center justify-center text-champagne-400 group-hover:scale-105 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-champagne-400 font-mono">
            ${stats.todayEstimatedRevenueUsd.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 font-mono">
            ~{stats.todayEstimatedRevenueIqd.toLocaleString()} IQD
          </div>
        </div>
      </div>

      {/* 3. Operational Split: Today's Clinical Queue & Pharmacy Critical Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Queue (7 cols) */}
        <div className="lg:col-span-7 hairline-card p-5 sm:p-6 rounded-2xl border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-bright" />
              <h2 className="font-extrabold text-sm text-white uppercase tracking-wider">
                {isRtl ? "نۆرەی ڕاستەوخۆی پزیشکانی ئەمڕۆ" : "Today's Clinical Floor & Chair Queue"}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onSelectTab("appointments")}
              className="text-xs text-emerald-bright hover:underline font-semibold flex items-center gap-1"
            >
              <span>{isRtl ? "هەموو نۆرەکان" : "View Full Queue"}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {appointments.slice(0, 4).map((apt) => (
              <div
                key={apt.id}
                className="p-3 sm:p-3.5 rounded-xl bg-obsidian-850 border border-white/[0.06] hover:border-white/[0.12] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 text-center py-1 rounded-lg bg-obsidian-800 border border-white/[0.08] shrink-0 font-mono text-xs font-bold text-champagne-400">
                    {apt.timeSlot}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white flex items-center gap-2">
                      <span>{apt.patientName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({apt.phone})</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {isRtl ? apt.procedureTitleCkb : apt.procedureTitleEn}
                    </div>
                    <div className="text-[11px] text-emerald-bright/80 mt-0.5">
                      {apt.doctor} · <span className="text-slate-400">{apt.room}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      apt.status === "in-chair"
                        ? "bg-emerald-500/20 text-emerald-bright border border-emerald-500/40 animate-pulse"
                        : apt.status === "waiting"
                        ? "bg-champagne-500/20 text-champagne-400 border border-champagne-500/40"
                        : apt.status === "completed"
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                        : "bg-slate-800 text-slate-300 border border-white/[0.08]"
                    }`}
                  >
                    {apt.status === "in-chair"
                      ? isRtl ? "لە ژوورەوەیە" : "In Chair"
                      : apt.status === "waiting"
                      ? isRtl ? "لە چاوەڕوانی" : "Waiting"
                      : apt.status === "completed"
                      ? isRtl ? "تەواوبوو" : "Completed"
                      : isRtl ? "حیجزکراو" : "Scheduled"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Pharmacy Inventory Health (5 cols) */}
        <div className="lg:col-span-5 hairline-card p-5 sm:p-6 rounded-2xl border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-rose-400" />
              <h2 className="font-extrabold text-sm text-white uppercase tracking-wider">
                {isRtl ? "کەرەستە کەمبووەکان و بەسەرچوون" : "Critical Stock & Expiry Alerts"}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onSelectTab("pharmacy")}
              className="text-xs text-emerald-bright hover:underline font-semibold flex items-center gap-1"
            >
              <span>{isRtl ? "کۆگای دەرمان" : "Manage Stock"}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {lowStockItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-obsidian-850 border border-rose-500/20 hover:border-rose-500/40 flex items-center justify-between gap-3 transition-all"
              >
                <div>
                  <div className="font-bold text-xs text-white">
                    {item.brandName}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {item.genericName}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {item.storageLocation} · Supplier: {item.supplierName}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-bold text-rose-400">
                    {item.currentStock} / {item.minStockLevel} {item.unit}
                  </div>
                  <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    {isRtl ? "کەمە" : "Low Stock"}
                  </span>
                </div>
              </div>
            ))}

            {expiringItems.slice(0, 2).map((item) => (
              <div
                key={`exp-${item.id}`}
                className="p-3 rounded-xl bg-obsidian-850 border border-amber-500/20 hover:border-amber-500/40 flex items-center justify-between gap-3 transition-all"
              >
                <div>
                  <div className="font-bold text-xs text-white">
                    {item.brandName}
                  </div>
                  <div className="text-[10px] font-mono text-amber-400 mt-0.5">
                    Batch: {item.batchNumber} · Exp: {item.expiryDate}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {isRtl ? "نزیک بەسەرچوون" : "Expiring"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
