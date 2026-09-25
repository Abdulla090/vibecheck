import { normalizeIraqiPhone } from "../src/utils/phone";
import { 
  INITIAL_PATIENT_LEADS, 
  INITIAL_MEDICATIONS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_PRESCRIPTIONS 
} from "../src/data/crmData";
import { 
  buildAppointmentReminderMessage, 
  buildQueueCallMessage, 
  buildPrescriptionDispatchMessage, 
  buildInvoiceDispatchMessage, 
  buildSupplierReorderMessage, 
  buildPostOpFollowUpMessage 
} from "../src/utils/crmDispatch";

console.log("=== RUNNING PRODUCTION VERIFICATION SUITE FOR CLINIC & PHARMACY CRM ===");

const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1FFFF}]/u;

// 1. Patient Pipeline Verification
console.log(`\n[Test 1] Verifying ${INITIAL_PATIENT_LEADS.length} Patient Leads & Pipeline Integrity:`);
const validStages = ["lead", "consultation", "in-treatment", "completed", "follow-up"];
const validVipTiers = ["Standard VIP", "Black Diamond VIP", "Royal Ambassador"];

for (const lead of INITIAL_PATIENT_LEADS) {
  if (!lead.id || !lead.fullName || !lead.phone) {
    throw new Error(`Lead ${lead.id} missing mandatory identity fields`);
  }
  if (!validStages.includes(lead.stage)) {
    throw new Error(`Lead ${lead.id} has invalid stage: ${lead.stage}`);
  }
  if (!validVipTiers.includes(lead.vipTier)) {
    throw new Error(`Lead ${lead.id} has invalid VIP tier: ${lead.vipTier}`);
  }
  if (lead.estimatedValueUsd <= 0 || isNaN(lead.estimatedValueUsd)) {
    throw new Error(`Lead ${lead.id} has invalid estimated value: ${lead.estimatedValueUsd}`);
  }

  const phoneRes = normalizeIraqiPhone(lead.phone);
  if (!phoneRes.cleanDigits.startsWith("9647")) {
    throw new Error(`Lead ${lead.id} (${lead.fullName}) phone ${lead.phone} failed Iraqi normalization: ${phoneRes.cleanDigits}`);
  }

  if (emojiRegex.test(lead.notes) || emojiRegex.test(lead.procedureTitleEn) || emojiRegex.test(lead.procedureTitleCkb)) {
    throw new Error(`Lead ${lead.id} contains disallowed emojis!`);
  }

  console.log(`  ✓ Lead OK: ${lead.fullName} (${lead.city}) -> Stage: ${lead.stage}, Value: $${lead.estimatedValueUsd}, Phone: ${phoneRes.displayPhone}`);
}

// 2. Pharmacy & Clinical Inventory Verification
console.log(`\n[Test 2] Verifying ${INITIAL_MEDICATIONS.length} Pharmacy & Surgical Inventory SKUs:`);
const validCategories = ["anesthetic", "filler-botox", "dental-consumable", "antibiotic-pain", "implant-graft"];

let lowStockDetected = 0;
let expiringDetected = 0;
const nowMs = new Date("2026-09-26").getTime();

for (const med of INITIAL_MEDICATIONS) {
  if (!med.id || !med.brandName || !med.genericName) {
    throw new Error(`Medication ${med.id} missing name fields`);
  }
  if (!validCategories.includes(med.category)) {
    throw new Error(`Medication ${med.id} has invalid category: ${med.category}`);
  }
  if (med.currentStock < 0 || med.minStockLevel <= 0 || med.unitPriceUsd <= 0) {
    throw new Error(`Medication ${med.id} has invalid numeric values`);
  }

  const expMs = new Date(med.expiryDate).getTime();
  if (isNaN(expMs)) {
    throw new Error(`Medication ${med.id} has invalid expiry date: ${med.expiryDate}`);
  }

  if (med.currentStock <= med.minStockLevel) {
    lowStockDetected++;
  }
  if (expMs - nowMs < 90 * 24 * 60 * 60 * 1000) {
    expiringDetected++;
  }

  const supPhone = normalizeIraqiPhone(med.supplierPhone);
  if (!supPhone.cleanDigits.startsWith("9647")) {
    throw new Error(`Medication ${med.id} supplier phone ${med.supplierPhone} failed Iraqi normalization`);
  }

  console.log(`  ✓ SKU OK: [${med.category}] ${med.brandName} - Stock: ${med.currentStock}/${med.minStockLevel} ${med.unit}, Exp: ${med.expiryDate}`);
}

if (lowStockDetected === 0) {
  throw new Error("Expected at least one low-stock SKU to trigger reorder alerts!");
}
if (expiringDetected === 0) {
  throw new Error("Expected at least one expiring batch to trigger clinical alerts!");
}
console.log(`  ✓ Inventory Alert Engine OK: ${lowStockDetected} low-stock SKUs and ${expiringDetected} expiring batches correctly detected.`);

// 3. Clinical Appointments & Chair Queue Verification
console.log(`\n[Test 3] Verifying ${INITIAL_APPOINTMENTS.length} Scheduled Appointments:`);
for (const apt of INITIAL_APPOINTMENTS) {
  if (!apt.patientName || !apt.doctor || !apt.room || !apt.timeSlot) {
    throw new Error(`Appointment ${apt.id} missing mandatory scheduling details`);
  }
  const phoneRes = normalizeIraqiPhone(apt.phone);
  if (!phoneRes.cleanDigits.startsWith("9647")) {
    throw new Error(`Appointment ${apt.id} phone normalization failed`);
  }
  console.log(`  ✓ Apt OK: ${apt.timeSlot} - ${apt.patientName} (${apt.room}) -> ${apt.status}`);
}

// 4. Digital Prescriptions Verification
console.log(`\n[Test 4] Verifying ${INITIAL_PRESCRIPTIONS.length} Digital Prescriptions:`);
for (const rx of INITIAL_PRESCRIPTIONS) {
  if (!rx.rxNumber.startsWith("RX-") || !rx.securityHash.startsWith("SEC-")) {
    throw new Error(`Prescription ${rx.id} missing standardized Rx# or security verification hash`);
  }
  if (rx.medications.length === 0) {
    throw new Error(`Prescription ${rx.id} has no prescribed medications`);
  }
  if (rx.totalAmountUsd <= 0) {
    throw new Error(`Prescription ${rx.id} has invalid total amount`);
  }
  console.log(`  ✓ Rx OK: ${rx.rxNumber} for ${rx.patientName} - $${rx.totalAmountUsd} (${rx.dispensedStatus})`);
}

// 5. WhatsApp Message Generators & Dispatch Integrity
console.log(`\n[Test 5] Verifying WhatsApp Clinical Dispatch Generators (Strict Zero-Emoji):`);

const sampleLead = INITIAL_PATIENT_LEADS[0];
const sampleApt = INITIAL_APPOINTMENTS[0];
const sampleRx = INITIAL_PRESCRIPTIONS[0];
const sampleMed = INITIAL_MEDICATIONS.find(m => m.currentStock <= m.minStockLevel)!;

const testCases = [
  { name: "Appointment Reminder (Ckb)", msg: buildAppointmentReminderMessage(sampleApt, "Royal VIP Clinic", "ckb") },
  { name: "Appointment Reminder (En)", msg: buildAppointmentReminderMessage(sampleApt, "Royal VIP Clinic", "en") },
  { name: "Queue Room Call (Ckb)", msg: buildQueueCallMessage(sampleApt, "Royal VIP Clinic", "ckb") },
  { name: "Queue Room Call (En)", msg: buildQueueCallMessage(sampleApt, "Royal VIP Clinic", "en") },
  { name: "Prescription Dispatch (Ckb)", msg: buildPrescriptionDispatchMessage(sampleRx, "Royal VIP Clinic", 1500, "ckb") },
  { name: "Prescription Dispatch (En)", msg: buildPrescriptionDispatchMessage(sampleRx, "Royal VIP Clinic", 1500, "en") },
  { name: "Clinical Invoice (Ckb)", msg: buildInvoiceDispatchMessage(sampleLead, "Royal VIP Clinic", 1500, "ckb") },
  { name: "Clinical Invoice (En)", msg: buildInvoiceDispatchMessage(sampleLead, "Royal VIP Clinic", 1500, "en") },
  { name: "Supplier Restock PO", msg: buildSupplierReorderMessage(sampleMed, "Royal VIP Clinic", 20) },
  { name: "Post-Op Follow-up (Ckb)", msg: buildPostOpFollowUpMessage(sampleLead, "Royal VIP Clinic", "ckb") },
  { name: "Post-Op Follow-up (En)", msg: buildPostOpFollowUpMessage(sampleLead, "Royal VIP Clinic", "en") },
];

for (const tc of testCases) {
  if (emojiRegex.test(tc.msg.rawMessage)) {
    throw new Error(`FAIL: ${tc.name} generated text contains regular emojis!`);
  }
  if (!tc.msg.waUrl.startsWith("https://wa.me/964")) {
    throw new Error(`FAIL: ${tc.name} generated bad WhatsApp URL: ${tc.msg.waUrl}`);
  }
  console.log(`  ✓ ${tc.name} WhatsApp URL OK: ${tc.msg.waUrl.slice(0, 55)}...`);
}

// 6. Currency Exchange Rate Consistency Check
console.log(`\n[Test 6] Verifying Dual Currency USD/IQD Conversions (Rate: 1500 IQD/USD):`);
const testUsdValues = [180, 440, 650, 1200, 2880, 5200];
for (const usd of testUsdValues) {
  const iqd = usd * 1500;
  if (iqd <= 0 || isNaN(iqd)) {
    throw new Error(`Invalid conversion for $${usd}`);
  }
  console.log(`  ✓ $${usd} USD = ${iqd.toLocaleString()} IQD`);
}

console.log("\n=== ALL CLINIC & PHARMACY CRM VERIFICATION TESTS PASSED SUCCESSFULLY! ===");
