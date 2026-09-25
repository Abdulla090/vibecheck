export type Language = "ckb" | "en";

export interface ClinicConfig {
  nameEn: string;
  nameCkb: string;
  taglineEn: string;
  taglineCkb: string;
  doctorEn: string;
  doctorCkb: string;
  doctorTitleEn: string;
  doctorTitleCkb: string;
  phone: string; // WhatsApp formatted e.g. 9647501234567
  displayPhone: string; // e.g. +964 750 123 4567
  cityEn: string;
  cityCkb: string;
  addressEn: string;
  addressCkb: string;
  usdToIqdRate: number; // e.g. 1500
  workingHoursEn: string;
  workingHoursCkb: string;
}

export interface Procedure {
  id: string;
  titleEn: string;
  titleCkb: string;
  subtitleEn: string;
  subtitleCkb: string;
  category: "dental" | "aesthetic" | "ortho";
  priceUsd: number;
  durationEn: string;
  durationCkb: string;
  warrantyEn: string;
  warrantyCkb: string;
  descriptionEn: string;
  descriptionCkb: string;
  highlightsEn: string[];
  highlightsCkb: string[];
  popular?: boolean;
}

export interface BeforeAfterCase {
  id: string;
  titleEn: string;
  titleCkb: string;
  categoryEn: string;
  categoryCkb: string;
  shadeEn: string;
  shadeCkb: string;
  durationEn: string;
  durationCkb: string;
  descriptionEn: string;
  descriptionCkb: string;
  beforeType: "smile-stained" | "crooked-teeth" | "dermal-fatigue" | "missing-molar";
  afterType: "smile-hollywood" | "aligned-teeth" | "dermal-radiant" | "ceramic-implant";
}
