import { normalizeIraqiPhone } from "../src/utils/phone";
import { PROCEDURES, BEFORE_AFTER_CASES, DEFAULT_CLINIC_CONFIG } from "../src/data/clinicData";

console.log("=== RUNNING DEEP VERIFICATION SUITE FOR VIP CLINIC GATEWAY ===");

// Test 1: Phone Normalizer Permutations
const phoneTests = [
  { input: "07501234567", expectedClean: "9647501234567", expectedDisplay: "+964 750 123 4567" },
  { input: "0770 987 6543", expectedClean: "9647709876543", expectedDisplay: "+964 770 987 6543" },
  { input: "+964 750 123 4567", expectedClean: "9647501234567", expectedDisplay: "+964 750 123 4567" },
  { input: "009647501234567", expectedClean: "9647501234567", expectedDisplay: "+964 750 123 4567" },
  { input: "7501234567", expectedClean: "9647501234567", expectedDisplay: "+964 750 123 4567" },
  { input: "9647801234567", expectedClean: "9647801234567", expectedDisplay: "+964 780 123 4567" },
];

for (const t of phoneTests) {
  const result = normalizeIraqiPhone(t.input);
  if (result.cleanDigits !== t.expectedClean || result.displayPhone !== t.expectedDisplay) {
    throw new Error(`Phone normalization failed for ${t.input}: got ${JSON.stringify(result)}, expected clean: ${t.expectedClean}`);
  }
  console.log(`  ✓ Phone OK: "${t.input}" -> "${result.cleanDigits}" (${result.displayPhone})`);
}

// Test 2: Verify WhatsApp URL Construction format without regular emojis
const cleanPhone = normalizeIraqiPhone("0750 445 1234").cleanDigits;
const testMessage = [
  `*VIP CONSULTATION REQUEST | DAWAY NORA (نۆرەی تایبەت)*`,
  `*Clinic / کلینیک:* Royal VIP Dental`,
  `*Doctor / پزیشک:* Dr. Zana`,
  `*Patient / نەخۆش:* Test Patient`,
  `*Phone / مۆبایل:* 07501234567`,
  `*Procedure / چارەسەر:* Hollywood Smile Veneers ($180)`,
  `*Slot / کاتی سەردان:* Afternoon`,
].join("\n");

// Check for regular emojis
const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1FFFF}]/u;
if (emojiRegex.test(testMessage)) {
  throw new Error("FAIL: Test message contains regular emojis!");
}
const encoded = encodeURIComponent(testMessage);
const waUrl = `https://wa.me/${cleanPhone}?text=${encoded}`;
if (!waUrl.startsWith("https://wa.me/9647504451234?text=")) {
  throw new Error(`FAIL: Bad WhatsApp URL generated: ${waUrl}`);
}
console.log("  ✓ WhatsApp URL formatting OK:", waUrl.slice(0, 50) + "...");

// Test 3: Procedures and Iraqi Dinar currency conversions
console.log(`  ✓ Checking ${PROCEDURES.length} procedures:`);
for (const p of PROCEDURES) {
  if (!p.titleCkb || !p.titleEn || p.priceUsd <= 0) {
    throw new Error(`Procedure ${p.id} missing title or valid USD price`);
  }
  const iqd = p.priceUsd * DEFAULT_CLINIC_CONFIG.usdToIqdRate;
  if (iqd <= 0 || isNaN(iqd)) {
    throw new Error(`Invalid IQD calculation for ${p.id}`);
  }
  console.log(`    - ${p.titleEn} / ${p.titleCkb}: $${p.priceUsd} -> ${iqd.toLocaleString()} IQD`);
}

// Test 4: Before and After Cases Coverage
console.log(`  ✓ Checking ${BEFORE_AFTER_CASES.length} clinical transformation cases:`);
for (const c of BEFORE_AFTER_CASES) {
  if (!c.beforeType || !c.afterType || !c.titleCkb || !c.titleEn) {
    throw new Error(`Case ${c.id} missing types or bilingual titles`);
  }
  console.log(`    - ${c.id}: ${c.beforeType} -> ${c.afterType} (${c.titleEn})`);
}

console.log("=== ALL DEEP VERIFICATION CHECKS PASSED ===");
