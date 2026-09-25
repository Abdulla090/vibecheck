/**
 * Robust Iraqi & International Phone Number Sanitizer
 * Handles local Kurdistan mobile formats (0750, 0770, 0780), international prefix (+964),
 * and formats properly for WhatsApp wa.me URLs and display.
 */
export function normalizeIraqiPhone(rawPhone: string): { cleanDigits: string; displayPhone: string } {
  if (!rawPhone) {
    return { cleanDigits: "9647501234567", displayPhone: "+964 750 123 4567" };
  }

  // Strip all non-digits
  let digits = rawPhone.replace(/\D/g, "");

  // Handle 00964 prefix
  if (digits.startsWith("00964")) {
    digits = digits.slice(2);
  }

  // Handle local Iraqi mobile numbers starting with 07 (e.g. 0750, 0770, 0780)
  if (digits.startsWith("07") && digits.length === 11) {
    digits = "964" + digits.slice(1);
  } else if (digits.startsWith("7") && digits.length === 10) {
    // Missing leading zero (e.g. 7501234567)
    digits = "964" + digits;
  } else if (!digits.startsWith("964") && digits.startsWith("0")) {
    digits = "964" + digits.replace(/^0+/, "");
  }

  // If no country code and length is 10 digits
  if (!digits.startsWith("964") && digits.length === 10) {
    digits = "964" + digits;
  }

  // Fallback if empty
  if (!digits) {
    digits = "9647501234567";
  }

  // Build clean human-readable display string
  let displayPhone = "+" + digits;
  if (digits.startsWith("964") && digits.length >= 12) {
    const code = digits.slice(0, 3);
    const op = digits.slice(3, 6);
    const mid = digits.slice(6, 9);
    const rest = digits.slice(9);
    displayPhone = `+${code} ${op} ${mid} ${rest}`;
  }

  return { cleanDigits: digits, displayPhone };
}
