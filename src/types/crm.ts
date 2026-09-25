import { Language } from "./clinic";

export type PipelineStage = 
  | "lead"           // New Lead / ڕاوێژی نوێ
  | "consultation"   // Consultation Booked / نۆرەی حیجزکراو
  | "in-treatment"   // In Treatment / لەژێر چارەسەر
  | "completed"      // Procedure Completed / چارەسەر تەواوکراو
  | "follow-up";     // Post-Op Follow-up / بەدواداچوونی پاش چارەسەر

export type VipTier = "Standard VIP" | "Black Diamond VIP" | "Royal Ambassador";

export interface PatientLead {
  id: string;
  fullName: string;
  phone: string; // Iraqi phone format (e.g. 0750 123 4567)
  gender: "male" | "female";
  age: number;
  city: "Erbil" | "Sulaymaniyah" | "Duhok" | "Baghdad" | "Kirkuk";
  procedureId: string;
  procedureTitleEn: string;
  procedureTitleCkb: string;
  stage: PipelineStage;
  assignedDoctor: string;
  doctorSpecialtyEn: string;
  doctorSpecialtyCkb: string;
  estimatedValueUsd: number;
  dateAdded: string; // YYYY-MM-DD
  appointmentDate?: string;
  appointmentTime?: string;
  lastContactDate: string;
  notes: string;
  vipTier: VipTier;
  leadSource: "WhatsApp Direct" | "Instagram VIP" | "Referral" | "Walk-in" | "Web Portal" | "VIP Concierge Referral";
  allergies?: string[];
  medicalHistoryNotes?: string;
}

export type MedicationCategory = 
  | "anesthetic"          // سڕکردن و بەنج
  | "filler-botox"        // فیلەر و بۆتۆکس
  | "dental-consumable"   // کەرەستەی ددان و تاقیگە
  | "antibiotic-pain"     // دژەهەوکردن و ئازارشکێن
  | "implant-graft";      // چاندن و ئێسکی دەستکرد

export interface MedicationItem {
  id: string;
  brandName: string;
  genericName: string;
  category: MedicationCategory;
  batchNumber: string;
  expiryDate: string; // YYYY-MM-DD
  currentStock: number;
  minStockLevel: number;
  unit: string; // vials, boxes, ampoules, syringes, units
  unitPriceUsd: number;
  supplierName: string;
  supplierPhone: string;
  storageLocation: string; // e.g. "Pharmacy Shelf A-1", "Cold Chain Refrigerator #2"
  lastRestocked: string;
  requiresPrescription: boolean;
  notes?: string;
}

export type AppointmentStatus = "waiting" | "in-chair" | "completed" | "cancelled" | "scheduled";

export interface ClinicalAppointment {
  id: string;
  patientId: string;
  patientName: string;
  phone: string;
  doctor: string;
  department: "Cosmetic Dentistry" | "Implantology" | "Laser & Dermatology" | "Orthodontics";
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:30 AM"
  room: string; // e.g. "VIP Dental Suite 1", "Laser Suite B", "Sterile Op-1"
  status: AppointmentStatus;
  procedureTitleEn: string;
  procedureTitleCkb: string;
  notes: string;
}

export interface PrescriptionMedicationItem {
  medicationId: string;
  medicationName: string;
  dosage: string; // e.g. "1000mg" or "1 Syringe (1ml)"
  frequencyEn: string; // e.g. "Every 12 hours after meals"
  frequencyCkb: string; // e.g. "هەموو ١٢ کاتژمێرێک دوای نان"
  durationEn: string; // e.g. "5 Days"
  durationCkb: string; // e.g. "٥ ڕۆژ"
  quantity: number;
  unitPriceUsd: number;
}

export interface PrescriptionRecord {
  id: string;
  rxNumber: string; // e.g. "RX-2026-084"
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  doctorName: string;
  doctorTitleEn: string;
  doctorTitleCkb: string;
  date: string;
  diagnosisEn: string;
  diagnosisCkb: string;
  medications: PrescriptionMedicationItem[];
  totalAmountUsd: number;
  dispensedStatus: "dispensed" | "pending";
  dispensedBy?: string;
  instructionsEn: string;
  instructionsCkb: string;
  securityHash: string; // digital cryptographic verification
}

export interface CrmStats {
  totalPatients: number;
  activeLeads: number;
  consultationsBooked: number;
  inTreatmentCount: number;
  completedProcedures: number;
  todayAppointmentsCount: number;
  totalInventoryItems: number;
  lowStockAlertsCount: number;
  expiringMedicationsCount: number;
  todayEstimatedRevenueUsd: number;
  todayEstimatedRevenueIqd: number;
}
