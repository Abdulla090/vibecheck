"use client";

import React, { useState } from "react";
import { Language, ClinicConfig } from "@/types/clinic";
import { ClinicalAppointment, AppointmentStatus } from "@/types/crm";
import { buildAppointmentReminderMessage, buildQueueCallMessage } from "@/utils/crmDispatch";
import { normalizeIraqiPhone } from "@/utils/phone";
import { 
  Calendar, 
  Clock, 
  User, 
  PhoneCall, 
  MessageCircle, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Filter, 
  MapPin, 
  Stethoscope, 
  X,
  Volume2,
  CalendarCheck2
} from "lucide-react";

interface AppointmentSchedulerQueueProps {
  lang: Language;
  config: ClinicConfig;
  appointments: ClinicalAppointment[];
  onUpdateStatus: (aptId: string, newStatus: AppointmentStatus) => void;
  onAddNewAppointment: (newApt: Omit<ClinicalAppointment, "id">) => void;
}

export default function AppointmentSchedulerQueue({
  lang,
  config,
  appointments,
  onUpdateStatus,
  onAddNewAppointment,
}: AppointmentSchedulerQueueProps) {
  const isRtl = lang === "ckb";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<"all" | AppointmentStatus>("all");
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // New Appointment form
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [doctor, setDoctor] = useState("Dr. Zana A. Karim, DDS, MSc");
  const [department, setDepartment] = useState<any>("Cosmetic Dentistry");
  const [date, setDate] = useState("2026-09-26");
  const [timeSlot, setTimeSlot] = useState("02:00 PM");
  const [room, setRoom] = useState("VIP Dental Suite 1");
  const [procEn, setProcEn] = useState("Hollywood Smile Veneers Consultation");
  const [procCkb, setProcCkb] = useState("ڕاوێژی ڤینێری هۆلیوود سمایڵ");
  const [notes, setNotes] = useState("");

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.phone.includes(searchQuery) ||
      apt.procedureTitleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.procedureTitleCkb.includes(searchQuery);

    const matchesDoc = selectedDoctorFilter === "all" || apt.doctor.includes(selectedDoctorFilter);
    const matchesStatus = selectedStatusFilter === "all" || apt.status === selectedStatusFilter;

    return matchesSearch && matchesDoc && matchesStatus;
  });

  const inChairCount = appointments.filter((a) => a.status === "in-chair").length;
  const waitingCount = appointments.filter((a) => a.status === "waiting").length;
  const scheduledCount = appointments.filter((a) => a.status === "scheduled").length;
  const completedCount = appointments.filter((a) => a.status === "completed").length;

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !phone.trim()) return;

    onAddNewAppointment({
      patientId: "lead-" + Math.floor(Math.random() * 9000 + 1000),
      patientName: patientName.trim(),
      phone: phone.trim(),
      doctor,
      department,
      date,
      timeSlot,
      room,
      status: "scheduled",
      procedureTitleEn: procEn,
      procedureTitleCkb: procCkb,
      notes: notes.trim(),
    });

    setPatientName("");
    setPhone("");
    setNotes("");
    setIsBookModalOpen(false);
  };

  const handleCallRoom = (apt: ClinicalAppointment) => {
    const callMsg = buildQueueCallMessage(apt, config.nameEn, lang);
    window.open(callMsg.waUrl, "_blank");
    onUpdateStatus(apt.id, "in-chair");
  };

  const handleSendReminder = (apt: ClinicalAppointment) => {
    const reminderMsg = buildAppointmentReminderMessage(apt, config.nameEn, lang);
    window.open(reminderMsg.waUrl, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* 1. Queue Status Counter Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Waiting at reception */}
        <div className="hairline-card p-4 rounded-2xl border-champagne-500/20 bg-champagne-950/10">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>{isRtl ? "لە چاوەڕوانی" : "Waiting Reception"}</span>
            <Clock className="w-4 h-4 text-champagne-400" />
          </div>
          <div className="text-2xl font-black text-champagne-400 font-mono">{waitingCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">{isRtl ? "نەخۆش لە ڕیسێپشنە" : "Patients checked in"}</div>
        </div>

        {/* In Chair / Active Surgery */}
        <div className="hairline-card p-4 rounded-2xl border-emerald-500/30 bg-emerald-950/15">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>{isRtl ? "لە ژوورەوەیە (لە کورسی)" : "In Chair / Surgery"}</span>
            <Stethoscope className="w-4 h-4 text-emerald-bright" />
          </div>
          <div className="text-2xl font-black text-emerald-bright font-mono">{inChairCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">{isRtl ? "لە ژێر چارەسەردایە" : "Currently in treatment"}</div>
        </div>

        {/* Scheduled Today */}
        <div className="hairline-card p-4 rounded-2xl">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>{isRtl ? "نۆرەی داهاتوو" : "Upcoming Today"}</span>
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{scheduledCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">{isRtl ? "سەردانی چاوەڕوانکراو" : "Slots remaining"}</div>
        </div>

        {/* Completed */}
        <div className="hairline-card p-4 rounded-2xl">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>{isRtl ? "تەواوکراو" : "Completed"}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-surgical" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{completedCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">{isRtl ? "چارەسەری بەسەرکەوتوو" : "Finished consultations"}</div>
        </div>
      </div>

      {/* 2. Controls & Search & Filter Bar */}
      <div className="hairline-card p-4 sm:p-5 rounded-2xl border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? "گەڕان بەپێی ناوی نەخۆش، مۆبایل، یان چارەسەر..." : "Search patient name, phone, or treatment..."}
              className="w-full bg-obsidian-850 border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 rtl:pl-4 rtl:pr-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-surgical/60 transition-all"
            />
          </div>

          {/* Doctor Filter */}
          <div className="flex items-center gap-1.5 bg-obsidian-850 px-3 py-2 rounded-xl border border-white/[0.08] text-xs">
            <User className="w-3.5 h-3.5 text-emerald-bright" />
            <select
              aria-label={isRtl ? "پزیشکی پسپۆڕ" : "Specialist Physician"}
              value={selectedDoctorFilter}
              onChange={(e) => setSelectedDoctorFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold text-xs focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-obsidian-900 text-white">{isRtl ? "هەموو پزیشکەکان" : "All Specialists"}</option>
              <option value="Zana" className="bg-obsidian-900 text-white">Dr. Zana Karim (Dental / Implants)</option>
              <option value="Sarah" className="bg-obsidian-900 text-white">Dr. Sarah Jalal (Aesthetics / Laser)</option>
              <option value="Aso" className="bg-obsidian-900 text-white">Dr. Aso Rawanduzi (Ortho)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-obsidian-850 px-3 py-2 rounded-xl border border-white/[0.08] text-xs">
            <Filter className="w-3.5 h-3.5 text-champagne-400" />
            <select
              aria-label={isRtl ? "دۆخی نۆرە" : "Queue Status"}
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
              className="bg-transparent text-slate-200 font-semibold text-xs focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-obsidian-900 text-white">{isRtl ? "هەموو دۆخەکان" : "All Statuses"}</option>
              <option value="in-chair" className="bg-obsidian-900 text-white">{isRtl ? "لە ژوورەوەیە" : "In Chair"}</option>
              <option value="waiting" className="bg-obsidian-900 text-white">{isRtl ? "لە چاوەڕوانی" : "Waiting"}</option>
              <option value="scheduled" className="bg-obsidian-900 text-white">{isRtl ? "حیجزکراو" : "Scheduled"}</option>
              <option value="completed" className="bg-obsidian-900 text-white">{isRtl ? "تەواوکراو" : "Completed"}</option>
            </select>
          </div>
        </div>

        {/* Book Appointment CTA */}
        <button
          type="button"
          onClick={() => setIsBookModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-emerald-surgical hover:bg-emerald-bright text-obsidian-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0"
        >
          <Plus className="w-4 h-4 text-obsidian-950" />
          <span>{isRtl ? "حیجزکردنی نۆرەی نوێ" : "Schedule Appointment"}</span>
        </button>
      </div>

      {/* 3. Clinical Queue Schedule List */}
      <div className="space-y-3">
        {filteredAppointments.map((apt) => {
          const phoneInfo = normalizeIraqiPhone(apt.phone);

          return (
            <div
              key={apt.id}
              className={`hairline-card p-4 sm:p-5 rounded-2xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                apt.status === "in-chair"
                  ? "border-emerald-500/50 bg-emerald-950/10 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  : apt.status === "waiting"
                  ? "border-champagne-500/40 bg-champagne-950/10"
                  : "border-white/[0.08] hover:border-white/[0.14]"
              }`}
            >
              {/* Left: Time & Patient & Procedure */}
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-16 sm:w-20 text-center py-2 px-1 rounded-xl bg-obsidian-850 border border-white/[0.08] shrink-0">
                  <div className="text-xs sm:text-sm font-black text-champagne-400 font-mono">
                    {apt.timeSlot}
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                    {apt.date}
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-black text-base text-white">
                      {apt.patientName}
                    </h3>
                    <span className="font-mono text-xs text-slate-400">
                      {phoneInfo.displayPhone}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-white/[0.06]">
                      {apt.department}
                    </span>
                  </div>

                  <div className="text-xs text-emerald-bright/90 font-medium mt-1">
                    {isRtl ? apt.procedureTitleCkb : apt.procedureTitleEn}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-1">
                    <span className="text-slate-300 font-semibold">{apt.doctor}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-emerald-bright">
                      <MapPin className="w-3 h-3" />
                      {apt.room}
                    </span>
                  </div>

                  {apt.notes && (
                    <div className="text-[11px] text-slate-400 mt-1.5 italic bg-obsidian-900/60 px-2.5 py-1 rounded-lg border border-white/[0.04]">
                      {apt.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Status Dropdown & WhatsApp Room Call Actions */}
              <div className="flex flex-wrap items-center gap-2 self-end lg:self-center">
                {/* Status Switcher */}
                <select
                  aria-label={isRtl ? "گۆڕینی دۆخی نۆرە" : "Change Appointment Status"}
                  value={apt.status}
                  onChange={(e) => onUpdateStatus(apt.id, e.target.value as AppointmentStatus)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${
                    apt.status === "in-chair"
                      ? "bg-emerald-500/20 text-emerald-bright border-emerald-500/40"
                      : apt.status === "waiting"
                      ? "bg-champagne-500/20 text-champagne-400 border-champagne-500/40"
                      : apt.status === "completed"
                      ? "bg-blue-500/20 text-blue-400 border-blue-500/40"
                      : "bg-obsidian-850 text-slate-300 border-white/[0.08]"
                  }`}
                >
                  <option value="waiting" className="bg-obsidian-900 text-white">{isRtl ? "لە چاوەڕوانی" : "Waiting"}</option>
                  <option value="in-chair" className="bg-obsidian-900 text-white">{isRtl ? "لە ژوورەوەیە" : "In Chair"}</option>
                  <option value="scheduled" className="bg-obsidian-900 text-white">{isRtl ? "حیجزکراو" : "Scheduled"}</option>
                  <option value="completed" className="bg-obsidian-900 text-white">{isRtl ? "تەواوکراو" : "Completed"}</option>
                  <option value="cancelled" className="bg-obsidian-900 text-white">{isRtl ? "هەڵوەشاوە" : "Cancelled"}</option>
                </select>

                {/* 1-Click WhatsApp Room Call button */}
                <button
                  type="button"
                  onClick={() => handleCallRoom(apt)}
                  title={isRtl ? "بانگکردنی نەخۆش بە واتسئەپ" : "1-Click WhatsApp Room Call"}
                  className="px-3 py-1.5 rounded-xl bg-emerald-surgical hover:bg-emerald-bright text-obsidian-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isRtl ? "بانگی بکە" : "Call to Suite"}</span>
                </button>

                {/* WhatsApp Reminder button */}
                <button
                  type="button"
                  onClick={() => handleSendReminder(apt)}
                  title={isRtl ? "ناردنی بیرخستنەوەی نۆرە بە واتسئەپ" : "WhatsApp Appointment Reminder"}
                  className="p-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-emerald-bright border border-white/[0.08] transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </button>

                {/* Direct Call button */}
                <a
                  href={`tel:+${phoneInfo.cleanDigits}`}
                  title="Direct Phone Call"
                  className="p-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-blue-400 border border-white/[0.08] transition-all"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}

        {filteredAppointments.length === 0 && (
          <div className="hairline-card p-12 text-center rounded-2xl text-slate-500 text-xs">
            {isRtl ? "هیچ نۆرەیەک نەدۆزرایەوە بەم مەرجانە" : "No appointments scheduled matching filters"}
          </div>
        )}
      </div>

      {/* 4. Book New Appointment Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-white/[0.12] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <CalendarCheck2 className="w-5 h-5 text-emerald-bright" />
                <h3 className="font-extrabold text-base text-white">
                  {isRtl ? "حیجزکردنی نۆرەی نوێ لە کلینیک" : "Schedule New VIP Appointment"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsBookModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isRtl ? "ناوی نەخۆش" : "Patient Full Name"}
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Dana H. Rostam"
                  className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isRtl ? "ژمارەی مۆبایل (Iraqi Mobile)" : "Iraqi Phone Number"}
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0750 123 4567"
                  className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isRtl ? "پزیشکی پسپۆڕ" : "Attending Doctor"}
                  </label>
                  <select
                    value={doctor}
                    onChange={(e) => {
                      setDoctor(e.target.value);
                      if (e.target.value.includes("Sarah")) setDepartment("Laser & Dermatology");
                      else if (e.target.value.includes("Aso")) setDepartment("Orthodontics");
                      else setDepartment("Cosmetic Dentistry");
                    }}
                    className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Dr. Zana A. Karim, DDS, MSc">Dr. Zana A. Karim (Dentistry & Implants)</option>
                    <option value="Dr. Sarah Jalal, MD">Dr. Sarah Jalal (Dermatology & Laser)</option>
                    <option value="Dr. Aso Rawanduzi, BDS, MOrth">Dr. Aso Rawanduzi (Orthodontics)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isRtl ? "ژوور / سوئیت" : "Suite / Op Room"}
                  </label>
                  <select
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white focus:outline-none cursor-pointer"
                  >
                    <option value="VIP Dental Suite 1">VIP Dental Suite 1 (Gulan)</option>
                    <option value="VIP Dental Suite 2">VIP Dental Suite 2</option>
                    <option value="Laser Suite B">Laser Suite B (Candela Room)</option>
                    <option value="Sterile Op-1">Sterile Op-1 (Surgical Implant Theatre)</option>
                    <option value="Ortho Suite 3">Ortho Suite 3</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isRtl ? "بەرواری سەردان" : "Date"}
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isRtl ? "کاتی سەردان (Time Slot)" : "Time Slot"}
                  </label>
                  <input
                    type="text"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    placeholder="e.g. 03:30 PM"
                    className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isRtl ? "چارەسەر (English)" : "Procedure (English)"}
                  </label>
                  <input
                    type="text"
                    required
                    value={procEn}
                    onChange={(e) => setProcEn(e.target.value)}
                    className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isRtl ? "چارەسەر (کوردی)" : "Procedure (Kurdish)"}
                  </label>
                  <input
                    type="text"
                    required
                    value={procCkb}
                    onChange={(e) => setProcCkb(e.target.value)}
                    className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isRtl ? "تێبینی" : "Preparation Notes"}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isRtl ? "تێبینی پێش سەردان، پێداویستی ستێریل، پشکنینی تیشک..." : "Pre-op instructions, radiology scans ready, sterile trays..."}
                  className="w-full bg-obsidian-800 border border-white/[0.08] rounded-xl px-3.5 py-2 text-white focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-obsidian-800 text-slate-300 hover:text-white font-semibold"
                >
                  {isRtl ? "پاشگەزبوونەوە" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-surgical hover:bg-emerald-bright text-obsidian-950 font-bold"
                >
                  {isRtl ? "تەواوکردنی حیجز" : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
