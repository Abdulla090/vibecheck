"use client";

import React, { useState, useEffect } from "react";
import { Language, ClinicConfig } from "@/types/clinic";
import { PatientLead, PipelineStage, VipTier } from "@/types/crm";
import { normalizeIraqiPhone } from "@/utils/phone";
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  PhoneCall, 
  MessageCircle, 
  ChevronRight, 
  ChevronLeft, 
  Calendar, 
  FileText, 
  DollarSign, 
  Crown, 
  ShieldCheck, 
  UserCheck, 
  Sparkles,
  ArrowRight,
  MoreVertical,
  X,
  GripVertical
} from "lucide-react";

interface PatientPipelineKanbanProps {
  lang: Language;
  config: ClinicConfig;
  leads: PatientLead[];
  onUpdateLeadStage: (leadId: string, newStage: PipelineStage) => void;
  onOpenWhatsApp: (lead: PatientLead) => void;
  onOpenInvoice: (lead: PatientLead) => void;
  onAddNewLead: (newLead: Omit<PatientLead, "id" | "dateAdded" | "lastContactDate">) => void;
  triggerAddModal?: boolean;
  onResetTriggerAddModal?: () => void;
}

const STAGES: { id: PipelineStage; titleEn: string; titleCkb: string; color: string; badgeColor: string }[] = [
  {
    id: "lead",
    titleEn: "New Leads & Inquiries",
    titleCkb: "ڕاوێژ و پەیوەندی نوێ",
    color: "border-slate-700 bg-slate-900/40",
    badgeColor: "bg-slate-700/40 text-slate-300 border-slate-600",
  },
  {
    id: "consultation",
    titleEn: "Consultation Booked",
    titleCkb: "نۆرەی حیجزکراو",
    color: "border-champagne-500/30 bg-champagne-950/20",
    badgeColor: "bg-champagne-500/20 text-champagne-400 border-champagne-500/30",
  },
  {
    id: "in-treatment",
    titleEn: "In Treatment & Surgery",
    titleCkb: "لەژێر چارەسەر و نەشتەرگەری",
    color: "border-emerald-500/30 bg-emerald-950/20",
    badgeColor: "bg-emerald-500/20 text-emerald-bright border-emerald-500/30",
  },
  {
    id: "completed",
    titleEn: "Procedure Completed",
    titleCkb: "چارەسەر تەواوکراو",
    color: "border-blue-500/30 bg-blue-950/20",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  {
    id: "follow-up",
    titleEn: "Post-Op Follow-up",
    titleCkb: "بەدواداچوونی چاکبوونەوە",
    color: "border-teal-500/30 bg-teal-950/20",
    badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  },
];

export default function PatientPipelineKanban({
  lang,
  config,
  leads,
  onUpdateLeadStage,
  onOpenWhatsApp,
  onOpenInvoice,
  onAddNewLead,
  triggerAddModal,
  onResetTriggerAddModal,
}: PatientPipelineKanbanProps) {
  const isRtl = lang === "ckb";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVipTier, setSelectedVipTier] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLeadDetails, setSelectedLeadDetails] = useState<PatientLead | null>(null);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<PipelineStage | null>(null);

  useEffect(() => {
    if (triggerAddModal) {
      setIsAddModalOpen(true);
      onResetTriggerAddModal?.();
    }
  }, [triggerAddModal, onResetTriggerAddModal]);

  // New Lead Form State
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formGender, setFormGender] = useState<"male" | "female">("female");
  const [formAge, setFormAge] = useState(30);
  const [formCity, setFormCity] = useState<"Erbil" | "Sulaymaniyah" | "Duhok" | "Baghdad" | "Kirkuk">("Erbil");
  const [formProcedureEn, setFormProcedureEn] = useState("Hollywood Smile Veneers");
  const [formProcedureCkb, setFormProcedureCkb] = useState("هۆلیوود سمایڵ و ڤینێری ئەڵمانی");
  const [formDoctor, setFormDoctor] = useState("Dr. Zana A. Karim, DDS, MSc");
  const [formDoctorSpecialtyEn, setFormDoctorSpecialtyEn] = useState("Cosmetic Dentist & Oral Implantologist");
  const [formDoctorSpecialtyCkb, setFormDoctorSpecialtyCkb] = useState("پسپۆڕی جوانکاری ددان و چاندن");
  const [formPriceUsd, setFormPriceUsd] = useState(1800);
  const [formVipTier, setFormVipTier] = useState<VipTier>("Standard VIP");
  const [formNotes, setFormNotes] = useState("");

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      lead.procedureTitleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.procedureTitleCkb.includes(searchQuery);

    const matchesVip = selectedVipTier === "all" || lead.vipTier === selectedVipTier;

    return matchesSearch && matchesVip;
  });

  const getStageTotalUsd = (stageId: PipelineStage) => {
    return filteredLeads
      .filter((l) => l.stage === stageId)
      .reduce((sum, l) => sum + l.estimatedValueUsd, 0);
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) return;

    onAddNewLead({
      fullName: formName.trim(),
      phone: formPhone.trim(),
      gender: formGender,
      age: Number(formAge),
      city: formCity,
      procedureId: "custom",
      procedureTitleEn: formProcedureEn,
      procedureTitleCkb: formProcedureCkb,
      stage: "lead",
      assignedDoctor: formDoctor,
      doctorSpecialtyEn: formDoctorSpecialtyEn,
      doctorSpecialtyCkb: formDoctorSpecialtyCkb,
      estimatedValueUsd: Number(formPriceUsd),
      notes: formNotes.trim(),
      vipTier: formVipTier,
      leadSource: "WhatsApp Direct",
    });

    // Reset and close
    setFormName("");
    setFormPhone("");
    setFormNotes("");
    setIsAddModalOpen(false);
  };

  const getNextStage = (current: PipelineStage): PipelineStage | null => {
    const order: PipelineStage[] = ["lead", "consultation", "in-treatment", "completed", "follow-up"];
    const idx = order.indexOf(current);
    if (idx >= 0 && idx < order.length - 1) return order[idx + 1];
    return null;
  };

  const getPrevStage = (current: PipelineStage): PipelineStage | null => {
    const order: PipelineStage[] = ["lead", "consultation", "in-treatment", "completed", "follow-up"];
    const idx = order.indexOf(current);
    if (idx > 0) return order[idx - 1];
    return null;
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Filters Bar */}
      <div className="hairline-card p-4 sm:p-5 rounded-2xl border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? "گەڕان بەپێی ناوی نەخۆش، مۆبایل، یان چارەسەر..." : "Search patient name, Iraqi phone, or procedure..."}
              className="w-full bg-obsidian-850 border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 rtl:pl-4 rtl:pr-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-surgical/60 transition-all"
            />
          </div>

          {/* VIP Tier Filter */}
          <div className="hidden sm:flex items-center gap-1.5 bg-obsidian-850 px-3 py-2 rounded-xl border border-white/[0.08] text-xs">
            <Filter className="w-3.5 h-3.5 text-champagne-400" />
            <select
              aria-label={isRtl ? "فلتەری ئاستی VIP" : "Filter VIP Tier"}
              value={selectedVipTier}
              onChange={(e) => setSelectedVipTier(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold text-xs focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-obsidian-900 text-white">
                {isRtl ? "هەموو پلەکانی VIP" : "All VIP Tiers"}
              </option>
              <option value="Royal Ambassador" className="bg-obsidian-900 text-white">Royal Ambassador</option>
              <option value="Black Diamond VIP" className="bg-obsidian-900 text-white">Black Diamond VIP</option>
              <option value="Standard VIP" className="bg-obsidian-900 text-white">Standard VIP</option>
            </select>
          </div>
        </div>

        {/* Add Patient Button */}
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-emerald-surgical hover:bg-emerald-bright text-obsidian-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0"
        >
          <Plus className="w-4 h-4 text-obsidian-950" />
          <span>{isRtl ? "زیادکردنی نەخۆشی نوێ" : "Add Patient Lead"}</span>
        </button>
      </div>

      {/* 2. Horizontal Kanban Pipeline Grid (5 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
        {STAGES.map((col) => {
          const colLeads = filteredLeads.filter((l) => l.stage === col.id);
          const colTotalUsd = getStageTotalUsd(col.id);
          const colTotalIqd = colTotalUsd * config.usdToIqdRate;

          return (
            <div
              key={col.id}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                if (dragOverCol !== col.id) {
                  setDragOverCol(col.id);
                }
              }}
              onDragLeave={() => {
                if (dragOverCol === col.id) {
                  setDragOverCol(null);
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                const droppedId = e.dataTransfer.getData("text/plain") || draggedLeadId;
                if (droppedId) {
                  onUpdateLeadStage(droppedId, col.id);
                }
                setDragOverCol(null);
                setDraggedLeadId(null);
              }}
              className={`rounded-2xl border p-3 sm:p-3.5 flex flex-col space-y-3 min-h-[500px] transition-all duration-200 ${col.color} ${
                dragOverCol === col.id ? "ring-2 ring-emerald-bright/80 bg-emerald-950/40 border-emerald-surgical scale-[1.01]" : ""
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <div>
                  <h3 className="font-extrabold text-xs text-white">
                    {isRtl ? col.titleCkb : col.titleEn}
                  </h3>
                  <div className="text-[10px] font-mono text-champagne-400 mt-0.5">
                    ${colTotalUsd.toLocaleString()} · ~{colTotalIqd.toLocaleString()} IQD
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${col.badgeColor}`}>
                  {colLeads.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-3 flex-1">
                {colLeads.map((lead) => {
                  const phoneInfo = normalizeIraqiPhone(lead.phone);
                  const nextStage = getNextStage(lead.stage);
                  const prevStage = getPrevStage(lead.stage);

                  return (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", lead.id);
                        e.dataTransfer.effectAllowed = "move";
                        setDraggedLeadId(lead.id);
                      }}
                      onDragEnd={() => {
                        setDraggedLeadId(null);
                        setDragOverCol(null);
                      }}
                      className={`hairline-card p-3 rounded-xl bg-obsidian-850/95 border border-white/[0.08] hover:border-emerald-surgical/40 transition-all space-y-2.5 shadow-md cursor-grab active:cursor-grabbing select-none ${
                        draggedLeadId === lead.id ? "opacity-35 scale-95 border-dashed border-emerald-surgical" : ""
                      }`}
                    >
                      {/* Top row: VIP Tier & Value */}
                      <div className="flex items-center justify-between gap-1 text-[10px]">
                        <div className="flex items-center gap-1">
                          <GripVertical className="w-3 h-3 text-slate-500 hover:text-slate-300 shrink-0" />
                          <span
                            className={`px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                              lead.vipTier === "Royal Ambassador"
                                ? "bg-champagne-500/20 text-champagne-400 border border-champagne-500/30"
                                : lead.vipTier === "Black Diamond VIP"
                                ? "bg-emerald-500/20 text-emerald-bright border border-emerald-500/30"
                                : "bg-slate-800 text-slate-300 border border-white/[0.08]"
                            }`}
                          >
                            {lead.vipTier}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-champagne-400 text-xs">
                          ${lead.estimatedValueUsd.toLocaleString()}
                        </span>
                      </div>

                      {/* Patient Name & City */}
                      <div>
                        <button
                          type="button"
                          onClick={() => setSelectedLeadDetails(lead)}
                          className="font-extrabold text-sm text-white hover:text-emerald-bright text-left rtl:text-right transition-colors"
                        >
                          {lead.fullName}
                        </button>
                        <div className="text-[11px] text-slate-400 font-medium">
                          {lead.city} · {lead.gender === "female" ? (isRtl ? "مێ" : "Female") : (isRtl ? "نێر" : "Male")}, {lead.age} {isRtl ? "ساڵ" : "yo"}
                        </div>
                      </div>

                      {/* Procedure of Interest */}
                      <div className="text-xs text-emerald-bright/90 bg-obsidian-900/60 p-2 rounded-lg border border-white/[0.04]">
                        <div className="font-semibold line-clamp-1">
                          {isRtl ? lead.procedureTitleCkb : lead.procedureTitleEn}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                          {lead.assignedDoctor.split(",")[0]}
                        </div>
                      </div>

                      {/* Scheduled Time (if any) */}
                      {lead.appointmentTime && (
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-champagne-400">
                          <Calendar className="w-3 h-3 text-champagne-500" />
                          <span>{lead.appointmentDate} · {lead.appointmentTime}</span>
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between gap-1">
                        {/* Left/Prev stage button */}
                        {prevStage ? (
                          <button
                            type="button"
                            onClick={() => onUpdateLeadStage(lead.id, prevStage)}
                            title={isRtl ? "گەڕانەوە بۆ قۆناغی پێشوو" : "Move to previous stage"}
                            className="p-1.5 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 text-slate-400 hover:text-white border border-white/[0.08]"
                          >
                            {isRtl ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                          </button>
                        ) : <div className="w-6" />}

                        {/* Middle Actions: 1-Click WhatsApp & Call & Invoice */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onOpenWhatsApp(lead)}
                            title="1-Click WhatsApp Direct"
                            className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-bright border border-emerald-500/30 transition-all"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>

                          <a
                            href={`tel:+${phoneInfo.cleanDigits}`}
                            title="Direct Call"
                            className="p-1.5 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 text-slate-300 hover:text-white border border-white/[0.08]"
                          >
                            <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
                          </a>

                          <button
                            type="button"
                            onClick={() => onOpenInvoice(lead)}
                            title="Generate Official Clinical Invoice"
                            className="p-1.5 rounded-lg bg-champagne-500/10 hover:bg-champagne-500/20 text-champagne-400 border border-champagne-500/30"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Right/Next stage button */}
                        {nextStage ? (
                          <button
                            type="button"
                            onClick={() => onUpdateLeadStage(lead.id, nextStage)}
                            title={isRtl ? "پێشخستن بۆ قۆناغی داهاتوو" : "Advance to next stage"}
                            className="p-1.5 rounded-lg bg-emerald-surgical hover:bg-emerald-bright text-obsidian-950 font-bold transition-all shadow-sm"
                          >
                            {isRtl ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          </button>
                        ) : (
                          <span className="p-1.5 text-emerald-bright" title="Finalized">
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {colLeads.length === 0 && (
                  <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-white/[0.06] rounded-xl">
                    {isRtl ? "هیچ نەخۆشێک لەم قۆناغەدا نییە" : "No patients in this stage"}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. New Patient Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-white/[0.12] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-bright" />
                <h3 className="font-extrabold text-base text-white">
                  {isRtl ? "تۆمارکردنی نەخۆشی نوێ لە کلینیک" : "Register New Patient Lead"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isRtl ? "ناوی سیانی نەخۆش" : "Patient Full Name"}
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Daria K. Ahmad"
                  className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-surgical/60"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isRtl ? "ژمارەی مۆبایل (Iraqi Mobile)" : "Iraqi Phone Number"}
                  </label>
                  <input
                    type="text"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="0750 123 4567"
                    className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-emerald-surgical/60"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isRtl ? "شار / شوێنی نیشتەجێبوون" : "City / Location"}
                  </label>
                  <select
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value as any)}
                    className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Erbil">Erbil / هەولێر</option>
                    <option value="Sulaymaniyah">Sulaymaniyah / سلێمانی</option>
                    <option value="Duhok">Duhok / دهۆک</option>
                    <option value="Kirkuk">Kirkuk / کەرکووک</option>
                    <option value="Baghdad">Baghdad / بەغدا</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isRtl ? "تەمەن" : "Age"}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={formAge}
                    onChange={(e) => setFormAge(Number(e.target.value))}
                    className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isRtl ? "ڕەگەز" : "Gender"}
                  </label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as any)}
                    className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white focus:outline-none cursor-pointer"
                  >
                    <option value="female">{isRtl ? "مێ (Female)" : "Female"}</option>
                    <option value="male">{isRtl ? "نێر (Male)" : "Male"}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isRtl ? "چارەسەری خوازراو (English)" : "Procedure (English)"}
                  </label>
                  <input
                    type="text"
                    required
                    value={formProcedureEn}
                    onChange={(e) => setFormProcedureEn(e.target.value)}
                    className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isRtl ? "ناوی چارەسەر بە کوردی" : "Procedure (Kurdish)"}
                  </label>
                  <input
                    type="text"
                    required
                    value={formProcedureCkb}
                    onChange={(e) => setFormProcedureCkb(e.target.value)}
                    className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isRtl ? "بەهای مەزەندەکراو ($ USD)" : "Estimated Value ($ USD)"}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formPriceUsd}
                    onChange={(e) => setFormPriceUsd(Number(e.target.value))}
                    className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isRtl ? "پلەی VIP" : "VIP Tier"}
                  </label>
                  <select
                    value={formVipTier}
                    onChange={(e) => setFormVipTier(e.target.value as any)}
                    className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Standard VIP">Standard VIP</option>
                    <option value="Black Diamond VIP">Black Diamond VIP</option>
                    <option value="Royal Ambassador">Royal Ambassador</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isRtl ? "پزیشکی سەرپەرشتیار" : "Assigned Specialist"}
                </label>
                <select
                  value={formDoctor}
                  onChange={(e) => setFormDoctor(e.target.value)}
                  className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white focus:outline-none cursor-pointer"
                >
                  <option value="Dr. Zana A. Karim, DDS, MSc">Dr. Zana A. Karim (Cosmetic Dentist & Implants)</option>
                  <option value="Dr. Sarah Jalal, MD">Dr. Sarah Jalal (Aesthetic Dermatologist & Laser)</option>
                  <option value="Dr. Aso Rawanduzi, BDS, MOrth">Dr. Aso Rawanduzi (Consultant Orthodontist)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isRtl ? "تێبینییە پزیشکییەکان" : "Clinical Notes / Preferences"}
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder={isRtl ? "تێبینی لەسەر داواکاری نەخۆش، ڕەنگی دڵخواز، نەخۆشی پێشینە..." : "Patient aesthetic goals, allergies, requested shades..."}
                  className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-obsidian-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  {isRtl ? "پاشگەزبوونەوە" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-surgical hover:bg-emerald-bright text-obsidian-950 font-bold text-xs"
                >
                  {isRtl ? "پاشەکەوتکردن" : "Save Patient Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Patient Lead Detailed Profile Modal */}
      {selectedLeadDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-white/[0.12] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-champagne-400" />
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    {selectedLeadDetails.fullName}
                  </h3>
                  <div className="text-[11px] font-mono text-emerald-bright">
                    {selectedLeadDetails.vipTier} · {selectedLeadDetails.city}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLeadDetails(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-obsidian-850 p-3 rounded-xl border border-white/[0.06]">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">{isRtl ? "مۆبایل" : "Phone"}</span>
                  <span className="font-mono text-white text-xs">{selectedLeadDetails.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">{isRtl ? "بەهای مەزەندەکراو" : "Estimated Value"}</span>
                  <span className="font-mono text-champagne-400 font-bold text-xs">
                    ${selectedLeadDetails.estimatedValueUsd.toLocaleString()} (~{(selectedLeadDetails.estimatedValueUsd * config.usdToIqdRate).toLocaleString()} IQD)
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">{isRtl ? "چارەسەری خوازراو" : "Target Procedure"}</span>
                <div className="text-sm font-bold text-emerald-bright">
                  {isRtl ? selectedLeadDetails.procedureTitleCkb : selectedLeadDetails.procedureTitleEn}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">{isRtl ? "پزیشکی بەرپرسیار" : "Assigned Physician"}</span>
                <div className="text-white font-semibold">{selectedLeadDetails.assignedDoctor}</div>
                <div className="text-[11px] text-slate-400">
                  {isRtl ? selectedLeadDetails.doctorSpecialtyCkb : selectedLeadDetails.doctorSpecialtyEn}
                </div>
              </div>

              {selectedLeadDetails.notes && (
                <div className="bg-obsidian-850 p-3 rounded-xl border border-white/[0.06]">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">{isRtl ? "تێبینی کلینیکی" : "Clinical Notes"}</span>
                  <p className="text-slate-300 leading-relaxed">{selectedLeadDetails.notes}</p>
                </div>
              )}

              {selectedLeadDetails.allergies && selectedLeadDetails.allergies.length > 0 && (
                <div className="bg-rose-950/20 border border-rose-500/30 p-2.5 rounded-xl">
                  <span className="text-rose-400 font-bold text-[10px] uppercase block">{isRtl ? "هۆشداری هەستیاری" : "Allergies Alert"}</span>
                  <p className="text-rose-300 text-xs mt-0.5">{selectedLeadDetails.allergies.join(", ")}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  onOpenWhatsApp(selectedLeadDetails);
                  setSelectedLeadDetails(null);
                }}
                className="flex-1 py-2 rounded-xl bg-emerald-surgical hover:bg-emerald-bright text-obsidian-950 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 fill-obsidian-950" />
                <span>{isRtl ? "نامەی واتسئەپ" : "WhatsApp Patient"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenInvoice(selectedLeadDetails);
                  setSelectedLeadDetails(null);
                }}
                className="py-2 px-4 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-champagne-400 border border-champagne-500/30 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>{isRtl ? "پسوولەی پارەدان" : "Dispatch Invoice"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
