"use client";

import React, { useState, useEffect } from "react";
import { Language, ClinicConfig } from "@/types/clinic";
import { PrescriptionRecord, PatientLead, MedicationItem } from "@/types/crm";
import { buildPrescriptionDispatchMessage, buildInvoiceDispatchMessage } from "@/utils/crmDispatch";
import { normalizeIraqiPhone } from "@/utils/phone";
import { 
  FileText, 
  Printer, 
  MessageCircle, 
  ShieldCheck, 
  Search, 
  Plus, 
  DollarSign, 
  Pill, 
  Crown, 
  QrCode, 
  CheckCircle2, 
  Clock, 
  X,
  Stethoscope
} from "lucide-react";

interface DigitalPrescriptionAndInvoiceViewProps {
  lang: Language;
  config: ClinicConfig;
  prescriptions: PrescriptionRecord[];
  leads: PatientLead[];
  medications: MedicationItem[];
  onAddNewPrescription: (newRx: Omit<PrescriptionRecord, "id" | "rxNumber" | "securityHash">) => void;
  onUpdateRxStatus: (rxId: string, status: "dispensed" | "pending") => void;
  triggerAddModal?: boolean;
  onResetTriggerAddModal?: () => void;
}

export default function DigitalPrescriptionAndInvoiceView({
  lang,
  config,
  prescriptions,
  leads,
  medications,
  onAddNewPrescription,
  onUpdateRxStatus,
  triggerAddModal,
  onResetTriggerAddModal,
}: DigitalPrescriptionAndInvoiceViewProps) {
  const isRtl = lang === "ckb";
  const [activeSubTab, setActiveSubTab] = useState<"prescriptions" | "invoices">("prescriptions");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRxToPrint, setSelectedRxToPrint] = useState<PrescriptionRecord | null>(null);
  const [selectedLeadForInvoice, setSelectedLeadForInvoice] = useState<PatientLead | null>(null);
  const [isAddRxModalOpen, setIsAddRxModalOpen] = useState(false);

  useEffect(() => {
    if (triggerAddModal) {
      setActiveSubTab("prescriptions");
      setIsAddRxModalOpen(true);
      onResetTriggerAddModal?.();
    }
  }, [triggerAddModal, onResetTriggerAddModal]);

  // New Rx Form
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientAge, setPatientAge] = useState(30);
  const [doctorName, setDoctorName] = useState(config.doctorEn);
  const [diagnosisEn, setDiagnosisEn] = useState("Post-Procedure Surgical Prophylaxis & Pain Management");
  const [diagnosisCkb, setDiagnosisCkb] = useState("پاراستنی برین لە هەوکردن و کۆنتڕۆڵی ئازار پاش چارەسەر");
  const [selectedMedId, setSelectedMedId] = useState(medications[0]?.id || "");
  const [dosage, setDosage] = useState("1000mg tablet");
  const [freqEn, setFreqEn] = useState("Every 12 hours after meals");
  const [freqCkb, setFreqCkb] = useState("هەموو ١٢ کاتژمێرێک دوای نانخواردن");
  const [durationEn, setDurationEn] = useState("5 Days");
  const [durationCkb, setDurationCkb] = useState("٥ ڕۆژ");
  const [instructionsEn, setInstructionsEn] = useState("Take with a full glass of water. Avoid direct sun exposure and tobacco.");
  const [instructionsCkb, setInstructionsCkb] = useState("بە یەک پەرداخ ئاوی تەواو بیخۆ. دووربکەوەرەوە لە تیشکی خۆر و جگەرەکێشان.");

  const filteredPrescriptions = prescriptions.filter(
    (rx) =>
      rx.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.patientPhone.includes(searchQuery) ||
      rx.rxNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.doctorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completedOrInTreatmentLeads = leads.filter(
    (lead) =>
      (lead.stage === "completed" || lead.stage === "in-treatment") &&
      (lead.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery) ||
        lead.procedureTitleEn.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateRx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim()) return;

    const chosenMed = medications.find((m) => m.id === selectedMedId) || medications[0];

    onAddNewPrescription({
      patientId: "patient-" + Math.floor(Math.random() * 9000 + 1000),
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      patientAge: Number(patientAge),
      doctorName,
      doctorTitleEn: config.doctorTitleEn,
      doctorTitleCkb: config.doctorTitleCkb,
      date: "2026-09-26",
      diagnosisEn,
      diagnosisCkb,
      medications: [
        {
          medicationId: chosenMed.id,
          medicationName: chosenMed.brandName,
          dosage,
          frequencyEn: freqEn,
          frequencyCkb: freqCkb,
          durationEn,
          durationCkb,
          quantity: 1,
          unitPriceUsd: chosenMed.unitPriceUsd,
        },
      ],
      totalAmountUsd: chosenMed.unitPriceUsd,
      dispensedStatus: "pending",
      instructionsEn,
      instructionsCkb,
    });

    setPatientName("");
    setPatientPhone("");
    setIsAddRxModalOpen(false);
  };

  const handleDispatchRxWhatsApp = (rx: PrescriptionRecord) => {
    const msg = buildPrescriptionDispatchMessage(rx, config.nameEn, config.usdToIqdRate, lang);
    window.open(msg.waUrl, "_blank");
  };

  const handleDispatchInvoiceWhatsApp = (lead: PatientLead) => {
    const msg = buildInvoiceDispatchMessage(lead, config.nameEn, config.usdToIqdRate, lang);
    window.open(msg.waUrl, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Tab Toggle & Search */}
      <div className="hairline-card p-4 sm:p-5 rounded-2xl border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Toggle Pills */}
        <div className="flex items-center gap-2 bg-obsidian-850 p-1 rounded-xl border border-white/[0.08]">
          <button
            type="button"
            onClick={() => setActiveSubTab("prescriptions")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === "prescriptions"
                ? "bg-emerald-surgical text-obsidian-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>{isRtl ? "ڕەچەتە دیجیتاڵییەکان (Rx)" : "Digital Prescriptions"}</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-obsidian-900/60 text-slate-200">
              {prescriptions.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("invoices")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === "invoices"
                ? "bg-champagne-500 text-obsidian-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isRtl ? "پسوولەی کلینیک (Invoices)" : "Clinical Invoices"}</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-obsidian-900/60 text-slate-200">
              {completedOrInTreatmentLeads.length}
            </span>
          </button>
        </div>

        {/* Search & Actions */}
        <div className="flex flex-1 max-w-md items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? "گەڕان بەپێی نەخۆش، ژمارەی ڕەچەتە، مۆبایل..." : "Search patient, Rx#, or Iraqi mobile..."}
              className="w-full bg-obsidian-850 border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 rtl:pl-4 rtl:pr-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-surgical/60 transition-all"
            />
          </div>

          {activeSubTab === "prescriptions" && (
            <button
              type="button"
              onClick={() => setIsAddRxModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-surgical hover:bg-emerald-bright text-obsidian-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0"
            >
              <Plus className="w-4 h-4 text-obsidian-950" />
              <span>{isRtl ? "ڕەچەتەی نوێ" : "New Rx"}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Sub-tab Content: Prescriptions */}
      {activeSubTab === "prescriptions" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPrescriptions.map((rx) => {
            const phoneInfo = normalizeIraqiPhone(rx.patientPhone);
            const iqdTotal = rx.totalAmountUsd * config.usdToIqdRate;

            return (
              <div
                key={rx.id}
                className="hairline-card p-5 rounded-2xl border border-white/[0.08] hover:border-emerald-surgical/40 transition-all space-y-3.5 shadow-lg"
              >
                {/* Header: Rx #, Date & Status */}
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-bright font-black text-xs font-mono">
                      Rx
                    </div>
                    <div>
                      <div className="font-mono font-bold text-white text-xs">{rx.rxNumber}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{rx.date}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onUpdateRxStatus(rx.id, rx.dispensedStatus === "dispensed" ? "pending" : "dispensed")}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 transition-all ${
                      rx.dispensedStatus === "dispensed"
                        ? "bg-emerald-500/20 text-emerald-bright border-emerald-500/40"
                        : "bg-amber-500/20 text-amber-400 border-amber-500/40"
                    }`}
                  >
                    {rx.dispensedStatus === "dispensed" ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{isRtl ? "دەرمان دراوە" : "Dispensed"}</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" />
                        <span>{isRtl ? "چاوەڕوانی دەرمانخانە" : "Pending Pharmacy"}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Patient & Doctor */}
                <div>
                  <div className="font-extrabold text-sm text-white">{rx.patientName}</div>
                  <div className="text-[11px] text-slate-400">
                    {phoneInfo.displayPhone} · {isRtl ? "تەمەن" : "Age"}: {rx.patientAge} {isRtl ? "ساڵ" : "yo"}
                  </div>
                  <div className="text-[11px] text-emerald-bright/80 font-semibold mt-0.5">
                    {rx.doctorName}
                  </div>
                </div>

                {/* Diagnosis */}
                <div className="bg-obsidian-850 p-2.5 rounded-xl border border-white/[0.04] text-xs">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">{isRtl ? "دەستنیشانکردن" : "Clinical Indication"}</span>
                  <div className="text-slate-200 mt-0.5 font-medium">
                    {isRtl ? rx.diagnosisCkb : rx.diagnosisEn}
                  </div>
                </div>

                {/* Medications List */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">{isRtl ? "دەرمانەکان" : "Prescribed Regimen"}</span>
                  {rx.medications.map((m, idx) => (
                    <div key={idx} className="flex items-start justify-between text-xs bg-obsidian-900/60 p-2 rounded-lg border border-white/[0.04]">
                      <div>
                        <div className="font-bold text-white">{m.medicationName}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {isRtl ? m.frequencyCkb : m.frequencyEn} · {isRtl ? m.durationCkb : m.durationEn}
                        </div>
                      </div>
                      <div className="font-mono text-champagne-400 font-bold text-right shrink-0">
                        ${m.unitPriceUsd}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Actions: WhatsApp Dispatch & Print/View */}
                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                  <div className="text-xs font-mono font-bold text-champagne-400">
                    ${rx.totalAmountUsd} (~{iqdTotal.toLocaleString()} IQD)
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDispatchRxWhatsApp(rx)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-surgical hover:bg-emerald-bright text-obsidian-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{isRtl ? "ناردن بە واتسئەپ" : "WhatsApp Rx"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRxToPrint(rx)}
                      className="p-1.5 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-slate-300 hover:text-white border border-white/[0.08]"
                      title="View & Print Digital Slip"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredPrescriptions.length === 0 && (
            <div className="col-span-2 hairline-card p-12 text-center rounded-2xl text-slate-500 text-xs">
              {isRtl ? "هیچ ڕەچەتەیەکی پزیشکی نەدۆزرایەوە" : "No prescription records found"}
            </div>
          )}
        </div>
      )}

      {/* 3. Sub-tab Content: Invoices */}
      {activeSubTab === "invoices" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {completedOrInTreatmentLeads.map((lead) => {
            const phoneInfo = normalizeIraqiPhone(lead.phone);
            const iqdTotal = lead.estimatedValueUsd * config.usdToIqdRate;

            return (
              <div
                key={lead.id}
                className="hairline-card p-5 rounded-2xl border border-white/[0.08] hover:border-champagne-500/40 transition-all space-y-3.5 shadow-lg"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-champagne-500/10 border border-champagne-500/30 flex items-center justify-center text-champagne-400 font-bold text-xs font-mono">
                      INV
                    </div>
                    <div>
                      <div className="font-mono font-bold text-white text-xs">INV-2026-{lead.id.replace(/\D/g, "")}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{lead.dateAdded}</div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-bright border border-emerald-500/30">
                    {lead.stage === "completed" ? (isRtl ? "تەواوکراو" : "Completed") : (isRtl ? "لە چارەسەردا" : "In Progress")}
                  </span>
                </div>

                {/* Patient details */}
                <div>
                  <div className="font-extrabold text-sm text-white">{lead.fullName}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{phoneInfo.displayPhone}</div>
                  <div className="text-xs text-champagne-400 font-bold mt-1">
                    {isRtl ? lead.procedureTitleCkb : lead.procedureTitleEn}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{lead.assignedDoctor}</div>
                </div>

                {/* Financial Summary */}
                <div className="bg-obsidian-850 p-3 rounded-xl border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">{isRtl ? "کۆی گشتی بە دۆلار" : "Total USD"}</span>
                    <span className="text-base font-black text-champagne-400 font-mono">${lead.estimatedValueUsd.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">{isRtl ? "بە دیناری عێراقی" : "Iraqi Dinars (IQD)"}</span>
                    <span className="text-xs font-mono text-slate-200 font-bold">{iqdTotal.toLocaleString()} IQD</span>
                  </div>
                </div>

                {/* Payment Methods Badges */}
                <div className="text-[10px] text-slate-400 flex flex-wrap items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-white/[0.06]">FIB Direct</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-white/[0.06]">FastPay</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-white/[0.06]">Cash USD / IQD</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-white/[0.06]">Visa / Mastercard</span>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleDispatchInvoiceWhatsApp(lead)}
                    className="px-3.5 py-1.5 rounded-xl bg-champagne-500 hover:bg-champagne-400 text-obsidian-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(212,175,55,0.2)]"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{isRtl ? "ناردنی پسوولە بە واتسئەپ" : "WhatsApp Invoice"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedLeadForInvoice(lead)}
                    className="p-1.5 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-slate-300 hover:text-white border border-white/[0.08]"
                    title="View & Print Clinical Invoice"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {completedOrInTreatmentLeads.length === 0 && (
            <div className="col-span-2 hairline-card p-12 text-center rounded-2xl text-slate-500 text-xs">
              {isRtl ? "هیچ نەخۆشێکی تەواوکراو نەدۆزرایەوە بۆ دەرکردنی پسوولە" : "No completed treatments available for invoice dispatch"}
            </div>
          )}
        </div>
      )}

      {/* 4. Official Printable Prescription Modal */}
      {selectedRxToPrint && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 print-modal-overlay">
          <div className="bg-obsidian-900 border border-white/[0.15] rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh] printable-document">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 no-print">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-champagne-400" />
                <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
                  {isRtl ? "ڕەچەتەی پزیشکی فەرمی" : "Official Digital Prescription Slip"}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-white/[0.08]"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isRtl ? "چاپکردن" : "Print"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRxToPrint(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Prescription Slip Design (Dark Medical Luxury) */}
            <div className="bg-obsidian-850 p-6 rounded-2xl border border-white/[0.1] space-y-5 text-xs text-slate-300">
              {/* Slip Top Header */}
              <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <h4 className="font-extrabold text-base text-white tracking-tight">
                    {isRtl ? config.nameCkb : config.nameEn}
                  </h4>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {isRtl ? config.addressCkb : config.addressEn}
                  </div>
                  <div className="text-[10px] text-emerald-bright font-mono mt-0.5">
                    Kurdistan Medical & Syndicate License #KRG-MED-99120
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs font-bold text-champagne-400">{selectedRxToPrint.rxNumber}</div>
                  <div className="text-[10px] text-slate-400">{selectedRxToPrint.date}</div>
                </div>
              </div>

              {/* Patient / Doctor Metadata */}
              <div className="grid grid-cols-2 gap-4 bg-obsidian-900/60 p-3.5 rounded-xl border border-white/[0.04]">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">{isRtl ? "ناوی نەخۆش" : "Patient Name"}</span>
                  <div className="font-extrabold text-white text-sm">{selectedRxToPrint.patientName}</div>
                  <div className="text-[11px] text-slate-400">{selectedRxToPrint.patientPhone} · Age: {selectedRxToPrint.patientAge}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">{isRtl ? "پزیشکی بەرپرسیار" : "Attending Doctor"}</span>
                  <div className="font-bold text-emerald-bright text-xs">{selectedRxToPrint.doctorName}</div>
                  <div className="text-[10px] text-slate-400">{isRtl ? selectedRxToPrint.doctorTitleCkb : selectedRxToPrint.doctorTitleEn}</div>
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">{isRtl ? "دەستنیشانکردنی نەخۆشی" : "Clinical Diagnosis"}</span>
                <p className="text-xs text-white font-medium bg-obsidian-900/40 p-2.5 rounded-lg border border-white/[0.04]">
                  {isRtl ? selectedRxToPrint.diagnosisCkb : selectedRxToPrint.diagnosisEn}
                </p>
              </div>

              {/* Meds */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">{isRtl ? "دەرمان و ڕێنمایی بەکارهێنان" : "Prescribed Medication & Dosage"}</span>
                {selectedRxToPrint.medications.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-obsidian-900/80 border border-white/[0.06] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{idx + 1}. {m.medicationName}</span>
                      <span className="font-mono text-champagne-400 font-bold">${m.unitPriceUsd}</span>
                    </div>
                    <div className="text-[11px] text-emerald-bright/90">
                      {isRtl ? m.frequencyCkb : m.frequencyEn}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {isRtl ? "ماوە:" : "Duration:"} {isRtl ? m.durationCkb : m.durationEn} · Qty: {m.quantity}
                    </div>
                  </div>
                ))}
              </div>

              {/* General Instructions */}
              <div className="bg-obsidian-900/40 p-3 rounded-xl border border-white/[0.04]">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">{isRtl ? "ڕێنمایی پزیشکی گشتی" : "Special Instructions"}</span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {isRtl ? selectedRxToPrint.instructionsCkb : selectedRxToPrint.instructionsEn}
                </p>
              </div>

              {/* Slip Bottom: Security Hash & Seal */}
              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[10px] text-slate-400">
                <div>
                  <div className="font-mono text-emerald-bright flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Digital Verification: {selectedRxToPrint.securityHash}</span>
                  </div>
                  <div>Official System Generated Slip · Valid for 14 Days</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white uppercase">{selectedRxToPrint.doctorName}</div>
                  <div className="italic text-slate-500">Electronically Signed</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 no-print">
              <button
                type="button"
                onClick={() => {
                  handleDispatchRxWhatsApp(selectedRxToPrint);
                  setSelectedRxToPrint(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-surgical hover:bg-emerald-bright text-obsidian-950 font-bold text-xs flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 fill-obsidian-950" />
                <span>{isRtl ? "ناردن بۆ نەخۆش بە واتسئەپ" : "Dispatch via WhatsApp"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Official Printable Invoice Modal */}
      {selectedLeadForInvoice && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 print-modal-overlay">
          <div className="bg-obsidian-900 border border-white/[0.15] rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh] printable-document">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 no-print">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-champagne-400" />
                <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
                  {isRtl ? "پسوولەی پارەدانی فەرمی کلینیک" : "Official Clinical Billing Invoice"}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-white/[0.08]"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isRtl ? "چاپکردن" : "Print"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLeadForInvoice(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Invoice Document Box */}
            <div className="bg-obsidian-850 p-6 rounded-2xl border border-white/[0.1] space-y-5 text-xs text-slate-300">
              {/* Invoice Header */}
              <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <h4 className="font-extrabold text-base text-white tracking-tight">
                    {isRtl ? config.nameCkb : config.nameEn}
                  </h4>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {isRtl ? config.addressCkb : config.addressEn}
                  </div>
                  <div className="text-[10px] text-emerald-bright font-mono mt-0.5">
                    VAT/Tax Exempt Medical Service · Kurdistan Region
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs font-bold text-champagne-400">INV-2026-{selectedLeadForInvoice.id.replace(/\D/g, "")}</div>
                  <div className="text-[10px] text-slate-400">{selectedLeadForInvoice.dateAdded}</div>
                </div>
              </div>

              {/* Billed To */}
              <div className="grid grid-cols-2 gap-4 bg-obsidian-900/60 p-3.5 rounded-xl border border-white/[0.04]">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">{isRtl ? "نەخۆش" : "Billed Patient"}</span>
                  <div className="font-extrabold text-white text-sm">{selectedLeadForInvoice.fullName}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{selectedLeadForInvoice.phone}</div>
                  <div className="text-[10px] text-champagne-400 font-bold mt-0.5">{selectedLeadForInvoice.vipTier}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">{isRtl ? "پزیشکی پسپۆڕ" : "Physician"}</span>
                  <div className="font-bold text-white text-xs">{selectedLeadForInvoice.assignedDoctor}</div>
                  <div className="text-[10px] text-slate-400">{isRtl ? selectedLeadForInvoice.doctorSpecialtyCkb : selectedLeadForInvoice.doctorSpecialtyEn}</div>
                </div>
              </div>

              {/* Line items */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">{isRtl ? "وردەکاری خزمەتگوزارییەکان" : "Procedure & Itemized Charges"}</span>
                <div className="p-3.5 rounded-xl bg-obsidian-900/80 border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-sm">
                      {isRtl ? selectedLeadForInvoice.procedureTitleCkb : selectedLeadForInvoice.procedureTitleEn}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      VIP Comprehensive Surgical Protocol, Anesthesia & Warranty
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-sm font-black text-champagne-400">
                      ${selectedLeadForInvoice.estimatedValueUsd.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      ~{(selectedLeadForInvoice.estimatedValueUsd * config.usdToIqdRate).toLocaleString()} IQD
                    </div>
                  </div>
                </div>
              </div>

              {/* Total calculations */}
              <div className="bg-obsidian-900/60 p-4 rounded-xl border border-white/[0.06] space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">{isRtl ? "کۆی سەرەتایی (Subtotal):" : "Subtotal:"}</span>
                  <span className="font-mono text-white">${selectedLeadForInvoice.estimatedValueUsd.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">{isRtl ? "داشکاندنی ئەندامی VIP:" : "VIP Privilege Concession:"}</span>
                  <span className="font-mono text-emerald-bright">$0.00 (Inclusive VIP)</span>
                </div>
                <div className="pt-2 border-t border-white/[0.08] flex justify-between text-sm font-black">
                  <span className="text-white">{isRtl ? "کۆی گشتی بۆ پارەدان:" : "Total Amount Payable:"}</span>
                  <div className="text-right font-mono">
                    <span className="text-champagne-400">${selectedLeadForInvoice.estimatedValueUsd.toLocaleString()} USD</span>
                    <div className="text-xs text-slate-400 font-normal">
                      (~{(selectedLeadForInvoice.estimatedValueUsd * config.usdToIqdRate).toLocaleString()} IQD)
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment instructions */}
              <div className="bg-obsidian-900/40 p-3 rounded-xl border border-white/[0.04] text-[11px] space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">{isRtl ? "ڕێگاکانی پارەدان" : "Payment Instructions"}</span>
                <div>- Cash (USD or IQD at official clinic rate 1 USD = {config.usdToIqdRate} IQD)</div>
                <div>- FIB (First Iraqi Bank): Account ID #07501234567</div>
                <div>- FastPay / ZainCash Mobile Payments Accepted</div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <div>Digital Receipt · Royal VIP Aesthetic Dentistry</div>
                <div className="text-emerald-bright">Paid &amp; Approved</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  handleDispatchInvoiceWhatsApp(selectedLeadForInvoice);
                  setSelectedLeadForInvoice(null);
                }}
                className="px-4 py-2 rounded-xl bg-champagne-500 hover:bg-champagne-400 text-obsidian-950 font-bold text-xs flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 fill-obsidian-950" />
                <span>{isRtl ? "ناردنی پسوولە بە واتسئەپ" : "WhatsApp Invoice"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. New Prescription Modal */}
      {isAddRxModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-white/[0.12] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-emerald-bright" />
                <h3 className="font-extrabold text-base text-white">
                  {isRtl ? "دەستنیشانکردنی ڕەچەتەی پزیشکی نوێ" : "Issue New Digital Prescription"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddRxModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRx} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isRtl ? "ناوی تەواوی نەخۆش" : "Patient Full Name"}
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Alan Hawleri"
                  className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isRtl ? "ژمارەی مۆبایل" : "Iraqi Phone"}
                  </label>
                  <input
                    type="text"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="0750 123 4567"
                    className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isRtl ? "تەمەن" : "Age"}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={patientAge}
                    onChange={(e) => setPatientAge(Number(e.target.value))}
                    className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isRtl ? "پزیشکی نووسەر" : "Prescribing Doctor"}
                </label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isRtl ? "دەستنیشانکردنی کلینیکی (کوردی)" : "Diagnosis (Kurdish)"}
                </label>
                <input
                  type="text"
                  value={diagnosisCkb}
                  onChange={(e) => setDiagnosisCkb(e.target.value)}
                  className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isRtl ? "هەڵبژاردنی دەرمان لە کۆگا" : "Select Medication SKU"}
                </label>
                <select
                  value={selectedMedId}
                  onChange={(e) => setSelectedMedId(e.target.value)}
                  className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white focus:outline-none cursor-pointer"
                >
                  {medications.map((m) => (
                    <option key={m.id} value={m.id} className="bg-obsidian-900 text-white">
                      {m.brandName} (${m.unitPriceUsd}) — Stock: {m.currentStock}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isRtl ? "شێوازی بەکارهێنان (کوردی)" : "Instructions (Kurdish)"}
                  </label>
                  <input
                    type="text"
                    value={freqCkb}
                    onChange={(e) => setFreqCkb(e.target.value)}
                    className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isRtl ? "ماوەی بەکارهێنان (کوردی)" : "Duration (Kurdish)"}
                  </label>
                  <input
                    type="text"
                    value={durationCkb}
                    onChange={(e) => setDurationCkb(e.target.value)}
                    className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsAddRxModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-obsidian-800 text-slate-300 hover:text-white font-semibold"
                >
                  {isRtl ? "پاشگەزبوونەوە" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-surgical hover:bg-emerald-bright text-obsidian-950 font-bold"
                >
                  {isRtl ? "دەرکردنی ڕەچەتە" : "Issue Prescription"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
