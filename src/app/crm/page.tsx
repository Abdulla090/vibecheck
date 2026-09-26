"use client";

import React, { useState, useEffect } from "react";
import { Language, ClinicConfig } from "@/types/clinic";
import { DEFAULT_CLINIC_CONFIG } from "@/data/clinicData";
import { 
  PatientLead, 
  MedicationItem, 
  ClinicalAppointment, 
  PrescriptionRecord, 
  PipelineStage, 
  AppointmentStatus,
  CrmStats 
} from "@/types/crm";
import { 
  INITIAL_PATIENT_LEADS, 
  INITIAL_MEDICATIONS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_PRESCRIPTIONS 
} from "@/data/crmData";
import CrmNavbar, { CrmTab } from "@/components/crm/CrmNavbar";
import CrmStatsOverview from "@/components/crm/CrmStatsOverview";
import PatientPipelineKanban from "@/components/crm/PatientPipelineKanban";
import PharmacyInventoryTracker from "@/components/crm/PharmacyInventoryTracker";
import AppointmentSchedulerQueue from "@/components/crm/AppointmentSchedulerQueue";
import DigitalPrescriptionAndInvoiceView from "@/components/crm/DigitalPrescriptionAndInvoiceView";
import WhatsAppMessageModal from "@/components/crm/WhatsAppMessageModal";

export default function CrmDashboardPage() {
  const [lang, setLang] = useState<Language>("ckb");
  const [config, setConfig] = useState<ClinicConfig>(DEFAULT_CLINIC_CONFIG);
  const [activeTab, setActiveTab] = useState<CrmTab>("overview");
  const [mounted, setMounted] = useState(false);

  // Core CRM Datasets with LocalStorage Persistence
  const [leads, setLeads] = useState<PatientLead[]>(INITIAL_PATIENT_LEADS);
  const [medications, setMedications] = useState<MedicationItem[]>(INITIAL_MEDICATIONS);
  const [appointments, setAppointments] = useState<ClinicalAppointment[]>(INITIAL_APPOINTMENTS);
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>(INITIAL_PRESCRIPTIONS);

  // Active Modals & Selected items
  const [whatsAppModalLead, setWhatsAppModalLead] = useState<PatientLead | null>(null);
  const [invoiceModalLead, setInvoiceModalLead] = useState<PatientLead | null>(null);

  // Sub-modal triggers for Overview Quick Action buttons
  const [triggerNewLeadModal, setTriggerNewLeadModal] = useState(false);
  const [triggerNewAppointmentModal, setTriggerNewAppointmentModal] = useState(false);
  const [triggerNewMedicationModal, setTriggerNewMedicationModal] = useState(false);
  const [triggerNewRxModal, setTriggerNewRxModal] = useState(false);

  // 1. Initial Load & Synchronization from LocalStorage
  useEffect(() => {
    setMounted(true);
    try {
      const savedLang = localStorage.getItem("vip_clinic_lang") as Language | null;
      if (savedLang === "en" || savedLang === "ckb") {
        setLang(savedLang);
      }

      const savedConfig = localStorage.getItem("vip_clinic_config");
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      }

      const savedLeads = localStorage.getItem("vip_crm_leads");
      if (savedLeads) {
        setLeads(JSON.parse(savedLeads));
      }

      const savedMeds = localStorage.getItem("vip_crm_medications");
      if (savedMeds) {
        setMedications(JSON.parse(savedMeds));
      }

      const savedApts = localStorage.getItem("vip_crm_appointments");
      if (savedApts) {
        setAppointments(JSON.parse(savedApts));
      }

      const savedRx = localStorage.getItem("vip_crm_prescriptions");
      if (savedRx) {
        setPrescriptions(JSON.parse(savedRx));
      }
    } catch {
      // Fallback to initial seeds
    }
  }, []);

  // 2. Set document direction and lang
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dir = lang === "ckb" ? "rtl" : "ltr";
      document.documentElement.lang = lang;
    }
  }, [lang]);

  // Language toggle handler
  const handleToggleLang = () => {
    const nextLang: Language = lang === "ckb" ? "en" : "ckb";
    setLang(nextLang);
    try {
      localStorage.setItem("vip_clinic_lang", nextLang);
    } catch {}
  };

  // Branch preset switcher
  const handleSelectPreset = (presetConfig: Partial<ClinicConfig>) => {
    const updated = { ...config, ...presetConfig };
    setConfig(updated);
    try {
      localStorage.setItem("vip_clinic_config", JSON.stringify(updated));
    } catch {}
  };

  // 3. Dataset Handlers & State Persistence
  const handleUpdateLeadStage = (leadId: string, newStage: PipelineStage) => {
    const updated = leads.map((l) => (l.id === leadId ? { ...l, stage: newStage } : l));
    setLeads(updated);
    try {
      localStorage.setItem("vip_crm_leads", JSON.stringify(updated));
    } catch {}
  };

  const handleAddNewLead = (newLeadData: Omit<PatientLead, "id" | "dateAdded" | "lastContactDate">) => {
    const newLead: PatientLead = {
      ...newLeadData,
      id: "lead-" + Date.now().toString().slice(-4),
      dateAdded: "2026-09-26",
      lastContactDate: "2026-09-26",
    };
    const updated = [newLead, ...leads];
    setLeads(updated);
    try {
      localStorage.setItem("vip_crm_leads", JSON.stringify(updated));
    } catch {}
  };

  const handleUpdateStock = (itemId: string, newStock: number) => {
    const updated = medications.map((m) => (m.id === itemId ? { ...m, currentStock: newStock } : m));
    setMedications(updated);
    try {
      localStorage.setItem("vip_crm_medications", JSON.stringify(updated));
    } catch {}
  };

  const handleAddNewMedication = (newItemData: Omit<MedicationItem, "id" | "lastRestocked">) => {
    const newItem: MedicationItem = {
      ...newItemData,
      id: "med-" + Date.now().toString().slice(-4),
      lastRestocked: "2026-09-26",
    };
    const updated = [newItem, ...medications];
    setMedications(updated);
    try {
      localStorage.setItem("vip_crm_medications", JSON.stringify(updated));
    } catch {}
  };

  const handleDispenseItem = (itemId: string, quantity: number, patientName: string) => {
    const updatedMeds = medications.map((m) =>
      m.id === itemId ? { ...m, currentStock: Math.max(0, m.currentStock - quantity) } : m
    );
    setMedications(updatedMeds);
    try {
      localStorage.setItem("vip_crm_medications", JSON.stringify(updatedMeds));
    } catch {}
  };

  const handleUpdateAppointmentStatus = (aptId: string, newStatus: AppointmentStatus) => {
    const updated = appointments.map((a) => (a.id === aptId ? { ...a, status: newStatus } : a));
    setAppointments(updated);
    try {
      localStorage.setItem("vip_crm_appointments", JSON.stringify(updated));
    } catch {}
  };

  const handleAddNewAppointment = (newAptData: Omit<ClinicalAppointment, "id">) => {
    const newApt: ClinicalAppointment = {
      ...newAptData,
      id: "apt-" + Date.now().toString().slice(-4),
    };
    const updated = [...appointments, newApt];
    setAppointments(updated);
    try {
      localStorage.setItem("vip_crm_appointments", JSON.stringify(updated));
    } catch {}
  };

  const handleAddNewPrescription = (newRxData: Omit<PrescriptionRecord, "id" | "rxNumber" | "securityHash">) => {
    const count = prescriptions.length + 86;
    const newRx: PrescriptionRecord = {
      ...newRxData,
      id: "rx-" + Date.now().toString().slice(-4),
      rxNumber: `RX-2026-${count.toString().padStart(3, "0")}`,
      securityHash: `SEC-KR-${Math.floor(Math.random() * 9000 + 1000)}-VIBE-${count}`,
    };
    const updated = [newRx, ...prescriptions];
    setPrescriptions(updated);
    try {
      localStorage.setItem("vip_crm_prescriptions", JSON.stringify(updated));
    } catch {}
  };

  const handleUpdateRxStatus = (rxId: string, status: "dispensed" | "pending") => {
    const updated = prescriptions.map((r) =>
      r.id === rxId ? { ...r, dispensedStatus: status, dispensedBy: status === "dispensed" ? "Pharm. Alan M." : undefined } : r
    );
    setPrescriptions(updated);
    try {
      localStorage.setItem("vip_crm_prescriptions", JSON.stringify(updated));
    } catch {}
  };

  // 4. Computed Dynamic Stats
  const lowStockCount = medications.filter((m) => m.currentStock <= m.minStockLevel).length;
  const expiringCount = medications.filter((m) => {
    const expMs = new Date(m.expiryDate).getTime();
    const nowMs = new Date("2026-09-26").getTime();
    return expMs - nowMs < 90 * 24 * 60 * 60 * 1000;
  }).length;

  const totalRevenueUsd = leads.reduce((sum, l) => sum + l.estimatedValueUsd, 0);

  const crmStats: CrmStats = {
    totalPatients: leads.length,
    activeLeads: leads.filter((l) => l.stage === "lead").length,
    consultationsBooked: leads.filter((l) => l.stage === "consultation").length,
    inTreatmentCount: leads.filter((l) => l.stage === "in-treatment").length,
    completedProcedures: leads.filter((l) => l.stage === "completed").length,
    todayAppointmentsCount: appointments.length,
    totalInventoryItems: medications.length,
    lowStockAlertsCount: lowStockCount,
    expiringMedicationsCount: expiringCount,
    todayEstimatedRevenueUsd: totalRevenueUsd,
    todayEstimatedRevenueIqd: totalRevenueUsd * config.usdToIqdRate,
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-[#F8FAFC] selection:bg-[#10B981] selection:text-[#0B0F17]">
      {/* 1. CRM Top Navigation */}
      <CrmNavbar
        lang={lang}
        onToggleLang={handleToggleLang}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        config={config}
        onSelectPreset={handleSelectPreset}
        leadCount={leads.length}
        lowStockCount={lowStockCount}
        todayAptCount={appointments.length}
      />

      {/* 2. Main Tab Body Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Tab 1: Dashboard / Overview */}
        {activeTab === "overview" && (
          <CrmStatsOverview
            lang={lang}
            config={config}
            stats={crmStats}
            leads={leads}
            medications={medications}
            appointments={appointments}
            onOpenNewLead={() => {
              setActiveTab("pipeline");
              setTriggerNewLeadModal(true);
            }}
            onOpenNewAppointment={() => {
              setActiveTab("appointments");
              setTriggerNewAppointmentModal(true);
            }}
            onOpenNewMedication={() => {
              setActiveTab("pharmacy");
              setTriggerNewMedicationModal(true);
            }}
            onOpenNewPrescription={() => {
              setActiveTab("prescriptions");
              setTriggerNewRxModal(true);
            }}
            onSelectTab={setActiveTab}
          />
        )}

        {/* Tab 2: Patient Pipeline Kanban */}
        {activeTab === "pipeline" && (
          <PatientPipelineKanban
            lang={lang}
            config={config}
            leads={leads}
            onUpdateLeadStage={handleUpdateLeadStage}
            onOpenWhatsApp={(lead) => setWhatsAppModalLead(lead)}
            onOpenInvoice={(lead) => {
              setActiveTab("prescriptions");
            }}
            onAddNewLead={handleAddNewLead}
            triggerAddModal={triggerNewLeadModal}
            onResetTriggerAddModal={() => setTriggerNewLeadModal(false)}
          />
        )}

        {/* Tab 3: Pharmacy & Medication Inventory */}
        {activeTab === "pharmacy" && (
          <PharmacyInventoryTracker
            lang={lang}
            config={config}
            medications={medications}
            onUpdateStock={handleUpdateStock}
            onAddNewMedication={handleAddNewMedication}
            onDispenseItem={handleDispenseItem}
            triggerAddModal={triggerNewMedicationModal}
            onResetTriggerAddModal={() => setTriggerNewMedicationModal(false)}
          />
        )}

        {/* Tab 4: Clinical Queue & Appointment Scheduler */}
        {activeTab === "appointments" && (
          <AppointmentSchedulerQueue
            lang={lang}
            config={config}
            appointments={appointments}
            onUpdateStatus={handleUpdateAppointmentStatus}
            onAddNewAppointment={handleAddNewAppointment}
            triggerAddModal={triggerNewAppointmentModal}
            onResetTriggerAddModal={() => setTriggerNewAppointmentModal(false)}
          />
        )}

        {/* Tab 5: Digital Prescriptions & Invoices */}
        {activeTab === "prescriptions" && (
          <DigitalPrescriptionAndInvoiceView
            lang={lang}
            config={config}
            prescriptions={prescriptions}
            leads={leads}
            medications={medications}
            onAddNewPrescription={handleAddNewPrescription}
            onUpdateRxStatus={handleUpdateRxStatus}
            triggerAddModal={triggerNewRxModal}
            onResetTriggerAddModal={() => setTriggerNewRxModal(false)}
          />
        )}
      </main>

      {/* 3. Global 1-Click WhatsApp Direct Dispatch Modal */}
      {whatsAppModalLead && (
        <WhatsAppMessageModal
          lang={lang}
          config={config}
          lead={whatsAppModalLead}
          onClose={() => setWhatsAppModalLead(null)}
        />
      )}
    </div>
  );
}
