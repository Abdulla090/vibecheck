"use client";

import React, { useState, useEffect } from "react";
import { Language, ClinicConfig } from "@/types/clinic";
import { MedicationItem, MedicationCategory } from "@/types/crm";
import { buildSupplierReorderMessage } from "@/utils/crmDispatch";
import { normalizeIraqiPhone } from "@/utils/phone";
import { 
  Pill, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Minus, 
  MessageCircle, 
  PhoneCall, 
  ShoppingCart, 
  Package, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Clock, 
  X,
  FileCheck2,
  Syringe,
  ShieldAlert
} from "lucide-react";

interface PharmacyInventoryTrackerProps {
  lang: Language;
  config: ClinicConfig;
  medications: MedicationItem[];
  onUpdateStock: (itemId: string, newStock: number) => void;
  onAddNewMedication: (newItem: Omit<MedicationItem, "id" | "lastRestocked">) => void;
  onDispenseItem: (itemId: string, quantity: number, patientName: string) => void;
  triggerAddModal?: boolean;
  onResetTriggerAddModal?: () => void;
}

const CATEGORIES: { id: "all" | MedicationCategory; labelEn: string; labelCkb: string }[] = [
  { id: "all", labelEn: "All Inventory", labelCkb: "هەموو کۆگا" },
  { id: "anesthetic", labelEn: "Anesthetics", labelCkb: "سڕکردن و بەنج" },
  { id: "filler-botox", labelEn: "Fillers & Botox", labelCkb: "فیلەر و بۆتۆکس" },
  { id: "dental-consumable", labelEn: "Dental Consumables", labelCkb: "کەرەستەی ددان و تاقیگە" },
  { id: "antibiotic-pain", labelEn: "Antibiotics & Pain", labelCkb: "دژەهەوکردن و ئازارشکێن" },
  { id: "implant-graft", labelEn: "Implants & Grafts", labelCkb: "چاندن و ئێسکی دەستکرد" },
];

export default function PharmacyInventoryTracker({
  lang,
  config,
  medications,
  onUpdateStock,
  onAddNewMedication,
  onDispenseItem,
  triggerAddModal,
  onResetTriggerAddModal,
}: PharmacyInventoryTrackerProps) {
  const isRtl = lang === "ckb";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | MedicationCategory>("all");
  const [filterAlertOnly, setFilterAlertOnly] = useState<"all" | "low-stock" | "expiring">("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [dispenseModalItem, setDispenseModalItem] = useState<MedicationItem | null>(null);
  const [dispenseQty, setDispenseQty] = useState(1);
  const [dispensePatientName, setDispensePatientName] = useState("");

  useEffect(() => {
    if (triggerAddModal) {
      setIsAddModalOpen(true);
      onResetTriggerAddModal?.();
    }
  }, [triggerAddModal, onResetTriggerAddModal]);

  // Add Item form state
  const [formBrand, setFormBrand] = useState("");
  const [formGeneric, setFormGeneric] = useState("");
  const [formCategory, setFormCategory] = useState<MedicationCategory>("anesthetic");
  const [formBatch, setFormBatch] = useState("");
  const [formExpiry, setFormExpiry] = useState("2027-12-31");
  const [formStock, setFormStock] = useState(20);
  const [formMinLevel, setFormMinLevel] = useState(10);
  const [formUnit, setFormUnit] = useState("cartridges");
  const [formUnitPrice, setFormUnitPrice] = useState(5);
  const [formSupplier, setFormSupplier] = useState("Kurdistan Central Medical Agency");
  const [formSupplierPhone, setFormSupplierPhone] = useState("0750 445 1199");
  const [formLocation, setFormLocation] = useState("Pharmacy Shelf A-1");
  const [formRequiresRx, setFormRequiresRx] = useState(true);
  const [formNotes, setFormNotes] = useState("");

  // Filter calculations
  const nowMs = new Date("2026-09-26").getTime();

  const isExpiringSoon = (expiryDate: string) => {
    const expMs = new Date(expiryDate).getTime();
    return expMs - nowMs < 90 * 24 * 60 * 60 * 1000;
  };

  const filteredItems = medications.filter((item) => {
    const matchesSearch =
      item.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplierName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;

    const isLow = item.currentStock <= item.minStockLevel;
    const isExpiring = isExpiringSoon(item.expiryDate);

    let matchesAlert = true;
    if (filterAlertOnly === "low-stock") matchesAlert = isLow;
    if (filterAlertOnly === "expiring") matchesAlert = isExpiring;

    return matchesSearch && matchesCategory && matchesAlert;
  });

  const lowStockCount = medications.filter((m) => m.currentStock <= m.minStockLevel).length;
  const expiringCount = medications.filter((m) => isExpiringSoon(m.expiryDate)).length;
  const totalValuationUsd = medications.reduce((sum, m) => sum + m.currentStock * m.unitPriceUsd, 0);

  const handleCreateMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBrand.trim()) return;

    onAddNewMedication({
      brandName: formBrand.trim(),
      genericName: formGeneric.trim() || formBrand.trim(),
      category: formCategory,
      batchNumber: formBatch.trim() || "BATCH-" + Math.floor(Math.random() * 90000 + 10000),
      expiryDate: formExpiry,
      currentStock: Number(formStock),
      minStockLevel: Number(formMinLevel),
      unit: formUnit,
      unitPriceUsd: Number(formUnitPrice),
      supplierName: formSupplier.trim(),
      supplierPhone: formSupplierPhone.trim(),
      storageLocation: formLocation.trim(),
      requiresPrescription: formRequiresRx,
      notes: formNotes.trim(),
    });

    setFormBrand("");
    setFormGeneric("");
    setFormBatch("");
    setIsAddModalOpen(false);
  };

  const handleDispenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispenseModalItem || dispenseQty <= 0) return;
    onDispenseItem(dispenseModalItem.id, dispenseQty, dispensePatientName.trim() || "Walk-in Patient");
    setDispenseModalItem(null);
    setDispenseQty(1);
    setDispensePatientName("");
  };

  const triggerSupplierRestock = (item: MedicationItem) => {
    const orderQty = Math.max(item.minStockLevel * 2, 20);
    const msg = buildSupplierReorderMessage(item, config.nameEn, orderQty, lang);
    window.open(msg.waUrl, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total SKUs */}
        <div className="hairline-card p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>{isRtl ? "کۆی کەرەستەکان" : "Total Inventory SKUs"}</span>
            <Package className="w-4 h-4 text-emerald-bright" />
          </div>
          <div className="text-2xl font-black text-white">{medications.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">{isRtl ? "دەرمان و کەرەستەی پزیشکی" : "Pharmaceutical & surgical lines"}</div>
        </div>

        {/* Low Stock Alerts */}
        <div className={`hairline-card p-4 rounded-2xl ${lowStockCount > 0 ? "border-rose-500/30 bg-rose-950/10" : ""}`}>
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>{isRtl ? "ئاگاداری کەمبوونی کۆگا" : "Low-Stock Alerts"}</span>
            <AlertTriangle className={`w-4 h-4 ${lowStockCount > 0 ? "text-rose-400 animate-pulse" : "text-emerald-bright"}`} />
          </div>
          <div className={`text-2xl font-black ${lowStockCount > 0 ? "text-rose-400" : "text-white"}`}>
            {lowStockCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {isRtl ? "پێویستی بە داواکردنەوەی بەپەلە هەیە" : "Requires supplier reorder"}
          </div>
        </div>

        {/* Expiring Soon */}
        <div className={`hairline-card p-4 rounded-2xl ${expiringCount > 0 ? "border-amber-500/30 bg-amber-950/10" : ""}`}>
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>{isRtl ? "نزیک بەسەرچوون (<٩٠ ڕۆژ)" : "Expiring Batches (<90d)"}</span>
            <Clock className={`w-4 h-4 ${expiringCount > 0 ? "text-amber-400" : "text-emerald-bright"}`} />
          </div>
          <div className={`text-2xl font-black ${expiringCount > 0 ? "text-amber-400" : "text-white"}`}>
            {expiringCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {isRtl ? "ئەولەویەتی بەکارهێنان یان گۆڕین" : "Prioritize clinical dispensing"}
          </div>
        </div>

        {/* Inventory Valuation */}
        <div className="hairline-card p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>{isRtl ? "بەهای کۆگای دەرمان" : "Stock Valuation"}</span>
            <DollarSign className="w-4 h-4 text-champagne-400" />
          </div>
          <div className="text-2xl font-black text-champagne-400 font-mono">
            ${totalValuationUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">
            ~{(totalValuationUsd * config.usdToIqdRate).toLocaleString(undefined, { maximumFractionDigits: 0 })} IQD
          </div>
        </div>
      </div>

      {/* 2. Controls & Search & Filter Bar */}
      <div className="hairline-card p-4 sm:p-5 rounded-2xl border border-white/[0.08] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? "گەڕان بەپێی ناوی بازرگانی، پێکهاتە، باچ، یان دابینکەر..." : "Search medication brand, generic name, batch, supplier..."}
              className="w-full bg-obsidian-850 border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 rtl:pl-4 rtl:pr-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-surgical/60 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Quick Filter */}
            <div className="flex items-center bg-obsidian-850 p-1 rounded-xl border border-white/[0.08] text-xs">
              <button
                type="button"
                onClick={() => setFilterAlertOnly("all")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  filterAlertOnly === "all" ? "bg-emerald-surgical text-obsidian-950" : "text-slate-300 hover:text-white"
                }`}
              >
                {isRtl ? "هەمووی" : "All"}
              </button>
              <button
                type="button"
                onClick={() => setFilterAlertOnly("low-stock")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                  filterAlertOnly === "low-stock" ? "bg-rose-500 text-white" : "text-rose-400 hover:text-rose-300"
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                <span>{isRtl ? "کەمەکان" : "Low Stock"}</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterAlertOnly("expiring")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                  filterAlertOnly === "expiring" ? "bg-amber-500 text-obsidian-950" : "text-amber-400 hover:text-amber-300"
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>{isRtl ? "بەسەرچوون" : "Expiring"}</span>
              </button>
            </div>

            {/* Add Medication Button */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-surgical hover:bg-emerald-bright text-obsidian-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0"
            >
              <Plus className="w-4 h-4 text-obsidian-950" />
              <span>{isRtl ? "تۆمارکردنی کەرەستەی نوێ" : "Add Inventory SKU"}</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-emerald-500/20 text-emerald-bright border border-emerald-500/40"
                  : "bg-obsidian-850 text-slate-400 hover:text-white border border-transparent hover:border-white/[0.08]"
              }`}
            >
              {isRtl ? cat.labelCkb : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Comprehensive Pharmacy Inventory Table */}
      <div className="hairline-card rounded-2xl border border-white/[0.08] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse text-xs">
            <thead>
              <tr className="bg-obsidian-850/80 border-b border-white/[0.08] text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3.5 px-4">{isRtl ? "دەرمان / کەرەستە" : "Medication & Generic"}</th>
                <th className="py-3.5 px-4">{isRtl ? "باچ و بەسەرچوون" : "Batch & Expiry"}</th>
                <th className="py-3.5 px-4 text-center">{isRtl ? "ئاستی کۆگا" : "Current Stock Level"}</th>
                <th className="py-3.5 px-4">{isRtl ? "دۆخی کۆگا" : "Status"}</th>
                <th className="py-3.5 px-4">{isRtl ? "نرخ (USD / IQD)" : "Unit Price"}</th>
                <th className="py-3.5 px-4">{isRtl ? "شوێن و دابینکەر" : "Storage & Supplier"}</th>
                <th className="py-3.5 px-4 text-center">{isRtl ? "کردارەکان" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {filteredItems.map((item) => {
                const isLow = item.currentStock <= item.minStockLevel;
                const isExpiring = isExpiringSoon(item.expiryDate);
                const iqdPrice = item.unitPriceUsd * config.usdToIqdRate;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-obsidian-850/50 transition-colors"
                  >
                    {/* Item Brand & Generic */}
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-sm text-white">
                        {item.brandName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                        {item.genericName}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-slate-800 text-slate-300 border border-white/[0.06]">
                          {item.category}
                        </span>
                        {item.requiresPrescription && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            Rx Only
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Batch & Expiry */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-300 font-medium">
                        {item.batchNumber}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-mono mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span className={isExpiring ? "text-amber-400 font-bold" : "text-slate-400"}>
                          {item.expiryDate}
                        </span>
                      </div>
                      {isExpiring && (
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {isRtl ? "ئاگاداری بەسەرچوون" : "Expiring Soon"}
                        </span>
                      )}
                    </td>

                    {/* Current Stock with Quick +/- Buttons */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => onUpdateStock(item.id, Math.max(0, item.currentStock - 1))}
                          className="w-6 h-6 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 text-slate-300 hover:text-white border border-white/[0.08] flex items-center justify-center"
                          title="Deduct 1"
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        <div className="text-center min-w-[60px]">
                          <div className={`font-mono text-sm font-black ${isLow ? "text-rose-400" : "text-white"}`}>
                            {item.currentStock}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            / min: {item.minStockLevel} {item.unit}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onUpdateStock(item.id, item.currentStock + 1)}
                          className="w-6 h-6 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 text-slate-300 hover:text-white border border-white/[0.08] flex items-center justify-center"
                          title="Add 1"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/30">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{isRtl ? "کۆگا کەمە" : "Low Stock"}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-bright border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{isRtl ? "باش و ئاسایی" : "Healthy"}</span>
                        </span>
                      )}
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-white text-xs">
                        ${item.unitPriceUsd}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        ~{iqdPrice.toLocaleString()} IQD
                      </div>
                    </td>

                    {/* Location & Supplier */}
                    <td className="py-3.5 px-4 text-[11px]">
                      <div className="flex items-center gap-1 text-slate-300">
                        <MapPin className="w-3 h-3 text-emerald-bright shrink-0" />
                        <span>{item.storageLocation}</span>
                      </div>
                      <div className="text-slate-400 mt-0.5 truncate max-w-[150px]">
                        {item.supplierName}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* 1-Click WhatsApp Supplier Restock */}
                        <button
                          type="button"
                          onClick={() => triggerSupplierRestock(item)}
                          title={isRtl ? "داواکردنی دەستبەجێ لە دابینکەر بە واتسئەپ" : "1-Click WhatsApp PO to Supplier"}
                          className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                            isLow
                              ? "bg-rose-500 hover:bg-rose-600 text-white shadow-[0_0_10px_rgba(244,63,94,0.3)] animate-pulse"
                              : "bg-obsidian-800 hover:bg-obsidian-750 text-champagne-400 border border-champagne-500/30"
                          }`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline font-mono text-[10px]">
                            {isRtl ? "داواکردنەوە" : "Restock PO"}
                          </span>
                        </button>

                        {/* Dispense Modal Trigger */}
                        <button
                          type="button"
                          onClick={() => setDispenseModalItem(item)}
                          title={isRtl ? "دەرکردنی دەرمان بۆ نەخۆش" : "Dispense to Patient"}
                          className="p-2 rounded-xl bg-emerald-surgical/10 hover:bg-emerald-surgical text-emerald-bright hover:text-obsidian-950 border border-emerald-surgical/30 font-bold transition-all text-xs"
                        >
                          <Syringe className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                    {isRtl ? "هیچ دەرمان یان کەرەستەیەک نەدۆزرایەوە بەم مەرجانە" : "No inventory SKUs matching filter criteria"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Add Inventory Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-white/[0.12] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-emerald-bright" />
                <h3 className="font-extrabold text-base text-white">
                  {isRtl ? "زیادکردنی کەرەستە یان دەرمانی نوێ" : "Add Inventory / Pharmacy SKU"}
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

            <form onSubmit={handleCreateMedication} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isRtl ? "ناوی بازرگانی براند (Brand Name)" : "Brand Name"}
                </label>
                <input
                  type="text"
                  required
                  value={formBrand}
                  onChange={(e) => setFormBrand(e.target.value)}
                  placeholder="e.g. Straumann Roxolid 4.1x10mm"
                  className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isRtl ? "ناوی زانستی / پێکهاتە (Generic Name / Formula)" : "Generic Compound / Specification"}
                </label>
                <input
                  type="text"
                  value={formGeneric}
                  onChange={(e) => setFormGeneric(e.target.value)}
                  placeholder="e.g. Titanium-Zirconium Implant"
                  className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isRtl ? "پۆلێنبەندی" : "Category"}
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white focus:outline-none cursor-pointer"
                  >
                    <option value="anesthetic">{isRtl ? "سڕکردن و بەنج" : "Anesthetic"}</option>
                    <option value="filler-botox">{isRtl ? "فیلەر و بۆتۆکس" : "Fillers & Botox"}</option>
                    <option value="dental-consumable">{isRtl ? "کەرەستەی ددان" : "Dental Consumable"}</option>
                    <option value="antibiotic-pain">{isRtl ? "دژەهەوکردن و ئازارشکێن" : "Antibiotic & Painkiller"}</option>
                    <option value="implant-graft">{isRtl ? "چاندن و ئێسک" : "Implant & Graft"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isRtl ? "ژمارەی باچ (Batch #)" : "Batch Number"}
                  </label>
                  <input
                    type="text"
                    value={formBatch}
                    onChange={(e) => setFormBatch(e.target.value)}
                    placeholder="e.g. CH-STR-99120"
                    className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isRtl ? "کۆگای سەرەتایی" : "Initial Stock"}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isRtl ? "کەمترین ئاست (Min Alert)" : "Min Alert Level"}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formMinLevel}
                    onChange={(e) => setFormMinLevel(Number(e.target.value))}
                    className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isRtl ? "یەکە (Unit)" : "Packaging Unit"}
                  </label>
                  <input
                    type="text"
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    placeholder="boxes / vials"
                    className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isRtl ? "بەرواری بەسەرچوون" : "Expiry Date"}
                  </label>
                  <input
                    type="date"
                    value={formExpiry}
                    onChange={(e) => setFormExpiry(e.target.value)}
                    className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isRtl ? "نرخی یەکە ($ USD)" : "Unit Price ($ USD)"}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formUnitPrice}
                    onChange={(e) => setFormUnitPrice(Number(e.target.value))}
                    className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isRtl ? "دابینکەر (Supplier)" : "Supplier Company"}
                  </label>
                  <input
                    type="text"
                    value={formSupplier}
                    onChange={(e) => setFormSupplier(e.target.value)}
                    className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isRtl ? "مۆبایلی دابینکەر (Iraqi WhatsApp)" : "Supplier WhatsApp"}
                  </label>
                  <input
                    type="text"
                    value={formSupplierPhone}
                    onChange={(e) => setFormSupplierPhone(e.target.value)}
                    className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isRtl ? "شوێنی دانان لە کلینیک" : "Storage Location (Shelf / Fridge)"}
                </label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="e.g. Aesthetics Refrigerator #1 (4°C)"
                  className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-obsidian-800 text-slate-300 hover:text-white font-semibold"
                >
                  {isRtl ? "پاشگەزبوونەوە" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-surgical hover:bg-emerald-bright text-obsidian-950 font-bold"
                >
                  {isRtl ? "پاشەکەوتکردن" : "Save Inventory SKU"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Dispense to Patient Modal */}
      {dispenseModalItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-white/[0.12] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Syringe className="w-5 h-5 text-emerald-bright" />
                <h3 className="font-extrabold text-base text-white">
                  {isRtl ? "دەرکردن و بەکارهێنانی دەرمان" : "Dispense to Clinical Procedure"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDispenseModalItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-obsidian-850 p-3 rounded-xl border border-white/[0.06] text-xs space-y-1">
              <div className="font-bold text-white text-sm">{dispenseModalItem.brandName}</div>
              <div className="text-slate-400 font-mono">Batch: {dispenseModalItem.batchNumber}</div>
              <div className="text-emerald-bright font-mono">
                {isRtl ? "بەردەست لە کۆگا:" : "In Stock:"} {dispenseModalItem.currentStock} {dispenseModalItem.unit}
              </div>
            </div>

            <form onSubmit={handleDispenseSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isRtl ? "بڕی دەرکراو" : "Quantity to Dispense"}
                </label>
                <input
                  type="number"
                  min={1}
                  max={dispenseModalItem.currentStock}
                  value={dispenseQty}
                  onChange={(e) => setDispenseQty(Number(e.target.value))}
                  className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isRtl ? "ناوی نەخۆش یان ژمارەی فایل" : "Patient Name / Chart Number"}
                </label>
                <input
                  type="text"
                  required
                  value={dispensePatientName}
                  onChange={(e) => setDispensePatientName(e.target.value)}
                  placeholder="e.g. Shvan Barzani (Suite 1)"
                  className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setDispenseModalItem(null)}
                  className="px-4 py-2 rounded-xl bg-obsidian-800 text-slate-300 hover:text-white font-semibold"
                >
                  {isRtl ? "پاشگەزبوونەوە" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-surgical hover:bg-emerald-bright text-obsidian-950 font-bold"
                >
                  {isRtl ? "تەواوکردنی دەرکردن" : "Confirm Dispensing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
