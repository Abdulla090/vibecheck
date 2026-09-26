import { normalizeIraqiPhone } from "./phone";
import { PatientLead, ClinicalAppointment, PrescriptionRecord, MedicationItem } from "@/types/crm";
import { Language } from "@/types/clinic";

export interface WhatsAppMessageResult {
  rawMessage: string;
  waUrl: string;
  displayPhone: string;
}

/**
 * 1. Appointment Confirmation / Reminder Message
 */
export function buildAppointmentReminderMessage(
  apt: ClinicalAppointment,
  clinicName: string,
  lang: Language
): WhatsAppMessageResult {
  const phoneInfo = normalizeIraqiPhone(apt.phone);
  const isRtl = lang === "ckb";

  let lines: string[];
  if (isRtl) {
    lines = [
      `*ئاگاداری نۆرەی پزیشکی | ${clinicName}*`,
      `بەڕێز: *${apt.patientName}*`,
      `نۆرەکەت لە کلینیک دیاریکراوە:`,
      `- بەروار: *${apt.date}*`,
      `- کاتژمێر: *${apt.timeSlot}*`,
      `- پزیشک: *${apt.doctor}*`,
      `- بەش: *${apt.department}*`,
      `- ژوور: *${apt.room}*`,
      `- چارەسەر: *${apt.procedureTitleCkb}*`,
      ``,
      `تکایە ١٠ خولەک پێش کاتی دیاریکراو لە ڕیسێپشن ئامادەبە.`,
      `پێویستت بە گۆڕینی کاتەکەیە؟ وەڵامی ئەم نامەیە بدەرەوە.`,
    ];
  } else {
    lines = [
      `*VIP CLINICAL APPOINTMENT REMINDER | ${clinicName}*`,
      `Patient Name: *${apt.patientName}*`,
      `Your VIP appointment is confirmed:`,
      `- Date: *${apt.date}*`,
      `- Time: *${apt.timeSlot}*`,
      `- Specialist: *${apt.doctor}*`,
      `- Department: *${apt.department}*`,
      `- Suite / Room: *${apt.room}*`,
      `- Scheduled: *${apt.procedureTitleEn}*`,
      ``,
      `Please arrive 10 minutes prior to your designated slot.`,
      `Need to reschedule? Reply directly to this WhatsApp concierge.`,
    ];
  }

  const rawMessage = lines.join("\n");
  const waUrl = `https://wa.me/${phoneInfo.cleanDigits}?text=${encodeURIComponent(rawMessage)}`;

  return { rawMessage, waUrl, displayPhone: phoneInfo.displayPhone };
}

/**
 * 2. Room Call & Clinical Queue Ready Alert
 */
export function buildQueueCallMessage(
  apt: ClinicalAppointment,
  clinicName: string,
  lang: Language
): WhatsAppMessageResult {
  const phoneInfo = normalizeIraqiPhone(apt.phone);
  const isRtl = lang === "ckb";

  let lines: string[];
  if (isRtl) {
    lines = [
      `*نۆرەی تۆ ئامادەیە | ${clinicName}*`,
      `بەڕێز: *${apt.patientName}*`,
      `پزیشک *${apt.doctor}* لە *${apt.room}* چاوەڕوانی بەڕێزتانە.`,
      `تکایە ڕاستەوخۆ بەرەو ژووری پزیشک تەشریف بهێنن.`,
      `سوپاس بۆ چاوەڕوانیتان.`,
    ];
  } else {
    lines = [
      `*YOUR VIP SUITE IS READY | ${clinicName}*`,
      `Dear: *${apt.patientName}*`,
      `*${apt.doctor}* is ready to receive you in *${apt.room}*.`,
      `Please proceed directly to the designated clinical suite.`,
      `Thank you for your visit today.`,
    ];
  }

  const rawMessage = lines.join("\n");
  const waUrl = `https://wa.me/${phoneInfo.cleanDigits}?text=${encodeURIComponent(rawMessage)}`;

  return { rawMessage, waUrl, displayPhone: phoneInfo.displayPhone };
}

/**
 * 3. Digital Prescription Dispatch
 */
export function buildPrescriptionDispatchMessage(
  rx: PrescriptionRecord,
  clinicName: string,
  usdToIqdRate: number,
  lang: Language
): WhatsAppMessageResult {
  const phoneInfo = normalizeIraqiPhone(rx.patientPhone);
  const isRtl = lang === "ckb";
  const iqdTotal = rx.totalAmountUsd * usdToIqdRate;

  let lines: string[];
  if (isRtl) {
    lines = [
      `*ڕەچەتەی پزیشکی ئەلیکترۆنی فەرمی | ${clinicName}*`,
      `ژمارەی ڕەچەتە: *${rx.rxNumber}*`,
      `نەخۆش: *${rx.patientName}* (تەمەن: ${rx.patientAge})`,
      `پزیشک: *${rx.doctorName}*`,
      `دەستنیشانکردن: *${rx.diagnosisCkb}*`,
      `ڕێکەوت: *${rx.date}*`,
      ``,
      `*دەرمانە دیاریکراوەکان:*`,
      ...rx.medications.map(
        (m, idx) =>
          `${idx + 1}. *${m.medicationName}* (${m.dosage})\n   - بەکارهێنان: ${m.frequencyCkb}\n   - ماوە: ${m.durationCkb}`
      ),
      ``,
      `ڕێنمایی گشتی: ${rx.instructionsCkb}`,
      `بڕی کۆی دەرمانەکان: $${rx.totalAmountUsd} (~${iqdTotal.toLocaleString()} دیناری عێراقی)`,
      `کۆدی دڵنیایی دیجیتاڵی: ${rx.securityHash}`,
      `سیستەمی فەرمی دەرمانسازی ${clinicName}`,
    ];
  } else {
    lines = [
      `*OFFICIAL DIGITAL PRESCRIPTION | ${clinicName}*`,
      `Rx Identifier: *${rx.rxNumber}*`,
      `Patient: *${rx.patientName}* (Age: ${rx.patientAge})`,
      `Physician: *${rx.doctorName}*`,
      `Clinical Indication: *${rx.diagnosisEn}*`,
      `Date: *${rx.date}*`,
      ``,
      `*Prescribed Medications:*`,
      ...rx.medications.map(
        (m, idx) =>
          `${idx + 1}. *${m.medicationName}* (${m.dosage})\n   - Instructions: ${m.frequencyEn}\n   - Duration: ${m.durationEn}`
      ),
      ``,
      `Special Instructions: ${rx.instructionsEn}`,
      `Total Pharmacy Cost: $${rx.totalAmountUsd} (~${iqdTotal.toLocaleString()} IQD)`,
      `Security Hash: ${rx.securityHash}`,
      `Verified via ${clinicName} Digital Clinical System`,
    ];
  }

  const rawMessage = lines.join("\n");
  const waUrl = `https://wa.me/${phoneInfo.cleanDigits}?text=${encodeURIComponent(rawMessage)}`;

  return { rawMessage, waUrl, displayPhone: phoneInfo.displayPhone };
}

/**
 * 4. Digital Clinical Invoice Dispatch
 */
export function buildInvoiceDispatchMessage(
  lead: PatientLead,
  clinicName: string,
  usdToIqdRate: number,
  lang: Language
): WhatsAppMessageResult {
  const phoneInfo = normalizeIraqiPhone(lead.phone);
  const isRtl = lang === "ckb";
  const iqdTotal = lead.estimatedValueUsd * usdToIqdRate;

  let lines: string[];
  if (isRtl) {
    lines = [
      `*پسوولەی فەرمی کلینیک | ${clinicName}*`,
      `نەخۆش: *${lead.fullName}*`,
      `پزیشکی سەرپەرشتیار: *${lead.assignedDoctor}*`,
      `چارەسەری ئەنجامدراو: *${lead.procedureTitleCkb}*`,
      `پلەی VIP: *${lead.vipTier}*`,
      ``,
      `*وردەکاری پارەدان:*`,
      `- نرخی کلینیکی: *$${lead.estimatedValueUsd.toLocaleString()} USD*`,
      `- بە دیناری عێراقی: *${iqdTotal.toLocaleString()} IQD* (نرخی ڕۆژ: ١$ = ${usdToIqdRate} دینار)`,
      ``,
      `*ڕێگاکانی پارەدان:*`,
      `- نەختینە (USD / IQD)`,
      `- FIB (First Iraqi Bank) ژمارەی باڵانس: 07501234567`,
      `- FastPay / ZainCash`,
      `- کارتی بانکی نێودەوڵەتی (Visa / Mastercard)`,
      ``,
      `سوپاس بۆ متمانەتان بە ${clinicName}`,
    ];
  } else {
    lines = [
      `*OFFICIAL CLINICAL INVOICE & RECEIPT | ${clinicName}*`,
      `Patient Name: *${lead.fullName}*`,
      `Attending Specialist: *${lead.assignedDoctor}*`,
      `Procedure Performed: *${lead.procedureTitleEn}*`,
      `VIP Tier: *${lead.vipTier}*`,
      ``,
      `*Billing Details:*`,
      `- Clinical Fee: *$${lead.estimatedValueUsd.toLocaleString()} USD*`,
      `- Iraqi Dinar Equivalent: *${iqdTotal.toLocaleString()} IQD* (Rate: $1 = ${usdToIqdRate} IQD)`,
      ``,
      `*Accepted Payment Channels:*`,
      `- Cash (USD / IQD)`,
      `- FIB (First Iraqi Bank) Account: 07501234567`,
      `- FastPay / ZainCash Mobile Wallet`,
      `- Visa / MasterCard International Terminal`,
      ``,
      `Thank you for entrusting your smile & health to ${clinicName}`,
    ];
  }

  const rawMessage = lines.join("\n");
  const waUrl = `https://wa.me/${phoneInfo.cleanDigits}?text=${encodeURIComponent(rawMessage)}`;

  return { rawMessage, waUrl, displayPhone: phoneInfo.displayPhone };
}

/**
 * 5. Low-Stock Supplier Reorder Message
 */
export function buildSupplierReorderMessage(
  item: MedicationItem,
  clinicName: string,
  quantityToOrder: number = 20,
  lang: Language = "en"
): WhatsAppMessageResult {
  const phoneInfo = normalizeIraqiPhone(item.supplierPhone);
  const isRtl = lang === "ckb";

  let lines: string[];
  if (isRtl) {
    lines = [
      `*داواکاری فەرمی کڕین و پڕکردنەوەی کۆگا (PO) | ${clinicName}*`,
      `بۆ دابینکەر: *${item.supplierName}*`,
      `بەڕێوەبەرایەتی بەشی دەرمان و دابەشکردنی پزیشکی`,
      ``,
      `تکایە بەپەلە ئەم کەرەستانە بنێرن بۆ کلینیک:`,
      `- کاڵا: *${item.brandName}*`,
      `- ناوی زانستی/تایبەتمەندی: *${item.genericName}*`,
      `- باچ: *${item.batchNumber}*`,
      `- بڕی ماوە لە کۆگا: *${item.currentStock} ${item.unit}*`,
      `- کەمترین ئاستی ڕێگەپێدراو: *${item.minStockLevel} ${item.unit}*`,
      `- بڕی داواکراو بۆ کڕین: *${quantityToOrder} ${item.unit}*`,
      `- ناونیشانی وەرگرتن: کۆگای دەرمانی ${clinicName}`,
      ``,
      `تکایە وادەی گەیشتن و پسوولەی پارەدان بە وەڵامی ئەم نامەیە ئاگادارمان بکەنەوە.`,
    ];
  } else {
    lines = [
      `*OFFICIAL RESTOCK PURCHASE ORDER | ${clinicName}*`,
      `Supplier: *${item.supplierName}*`,
      `Attn: Medical & Pharmacy Dispatch`,
      ``,
      `Please dispatch urgent stock replenishments for:`,
      `- Product: *${item.brandName}*`,
      `- Generic / Spec: *${item.genericName}*`,
      `- Batch: *${item.batchNumber}*`,
      `- Current Remaining Stock: *${item.currentStock} ${item.unit}*`,
      `- Minimum Threshold: *${item.minStockLevel} ${item.unit}*`,
      `- Requested Order Quantity: *${quantityToOrder} ${item.unit}*`,
      `- Preferred Delivery Address: ${clinicName} Pharmacy Depot`,
      ``,
      `Please confirm delivery timeline and invoice via return WhatsApp.`,
    ];
  }

  const rawMessage = lines.join("\n");
  const waUrl = `https://wa.me/${phoneInfo.cleanDigits}?text=${encodeURIComponent(rawMessage)}`;

  return { rawMessage, waUrl, displayPhone: phoneInfo.displayPhone };
}

/**
 * 6. Post-Op Follow-up Message
 */
export function buildPostOpFollowUpMessage(
  lead: PatientLead,
  clinicName: string,
  lang: Language
): WhatsAppMessageResult {
  const phoneInfo = normalizeIraqiPhone(lead.phone);
  const isRtl = lang === "ckb";

  let lines: string[];
  if (isRtl) {
    lines = [
      `*بەدواداچوونی تەندروستی پاش چارەسەر | ${clinicName}*`,
      `سڵاو بەڕێز *${lead.fullName}*، هیواخوازی تەندروستیەکی باشتین.`,
      `دەستەی پزیشکی *${lead.assignedDoctor}* بەدواداچوون دەکات بۆ دۆخی بەڕێزتان پاش ئەنجامدانی *${lead.procedureTitleCkb}*.`,
      ``,
      `ئایا هەست بە هیچ ئازار، هەڵئاوسان یان ناڕەحەتی دەکەیت؟`,
      `ئەگەر هەر پرسیارێکت هەیە لەسەر خواردنی دەرمانەکانت یان چۆنیەتی خاوێنکردنەوە، ڕاستەوخۆ دەتوانیت پەیوەندیمان پێوە بکەیت.`,
      `بەهیوای چاکبوونەوەی خێرا.`,
    ];
  } else {
    lines = [
      `*POST-OP RECOVERY CHECK-IN | ${clinicName}*`,
      `Dear *${lead.fullName}*, warm regards from ${clinicName}.`,
      `The medical team of *${lead.assignedDoctor}* is following up on your recovery after your *${lead.procedureTitleEn}*.`,
      ``,
      `How are you feeling today? Any unexpected tenderness, swelling, or sensitivity?`,
      `Please remember to take your prescribed regimen on schedule. If you have any clinical questions or concerns, reply directly here.`,
      `Wishing you a swift and radiant recovery.`,
    ];
  }

  const rawMessage = lines.join("\n");
  const waUrl = `https://wa.me/${phoneInfo.cleanDigits}?text=${encodeURIComponent(rawMessage)}`;

  return { rawMessage, waUrl, displayPhone: phoneInfo.displayPhone };
}
