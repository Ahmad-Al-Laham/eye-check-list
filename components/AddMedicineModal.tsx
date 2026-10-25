"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  generateDoseTimes,
  minutesTo24h,
  minutesToLabel,
  parseTimeInput,
  todayISO,
} from "@/lib/schedule";

type AddMedicineModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (input: {
    name: string;
    instructions: string;
    doseTimes: number[];
    durationDays: number;
    startDate: string;
  }) => void;
};

export function AddMedicineModal({ open, onClose, onSave }: AddMedicineModalProps) {
  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [mode, setMode] = useState<"interval" | "custom">("interval");
  const [intervalHours, setIntervalHours] = useState(2);
  const [startHour, setStartHour] = useState(8);
  const [endHour, setEndHour] = useState(24);
  const [customTime, setCustomTime] = useState("08:00");
  const [doseTimes, setDoseTimes] = useState<number[]>([]);
  const [durationDays, setDurationDays] = useState(14);
  const [startDate, setStartDate] = useState(todayISO());
  const [error, setError] = useState("");

  const previewTimes = useMemo(() => {
    if (mode === "interval") {
      return generateDoseTimes(intervalHours, startHour, endHour);
    }
    return doseTimes;
  }, [mode, intervalHours, startHour, endHour, doseTimes]);

  if (!open) return null;

  const reset = () => {
    setName("");
    setInstructions("");
    setMode("interval");
    setIntervalHours(2);
    setStartHour(8);
    setEndHour(24);
    setCustomTime("08:00");
    setDoseTimes([]);
    setDurationDays(14);
    setStartDate(todayISO());
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const addCustomTime = () => {
    const mins = parseTimeInput(customTime);
    if (mins === null) {
      setError("صيغة الوقت غير صحيحة (مثال 08:00)");
      return;
    }
    if (doseTimes.includes(mins)) return;
    setDoseTimes((prev) =>
      [...prev, mins].sort((a, b) => (a === 0 ? 1440 : a) - (b === 0 ? 1440 : b))
    );
    setError("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("اكتب اسم الدواء");
      return;
    }
    if (previewTimes.length === 0) {
      setError("أضف موعد واحد على الأقل");
      return;
    }
    onSave({
      name,
      instructions: instructions || `مواعيد مخصصة — ${previewTimes.length} جرعات يومياً`,
      doseTimes: previewTimes,
      durationDays: Math.max(1, durationDays),
      startDate,
    });
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/45 p-3 sm:items-center">
      <div
        className="absolute inset-0"
        onClick={handleClose}
        aria-hidden
      />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-5 shadow-lift animate-slide-up"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-arabic text-xl font-bold text-ink-900">إضافة دواء جديد</h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg px-2 py-1 text-ink-400 hover:bg-ink-50"
          >
            ✕
          </button>
        </div>

        <label className="mb-3 block">
          <span className="mb-1 block font-arabic text-sm text-ink-600">اسم الدواء</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-ink-200 bg-ink-50/50 px-3 py-2.5 outline-none ring-mint-500 focus:ring-2"
            placeholder="مثال: Tearmond"
            dir="auto"
          />
        </label>

        <label className="mb-3 block">
          <span className="mb-1 block font-arabic text-sm text-ink-600">التعليمات</span>
          <input
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full rounded-xl border border-ink-200 bg-ink-50/50 px-3 py-2.5 font-arabic outline-none ring-mint-500 focus:ring-2"
            placeholder="نقطة كل ساعتين..."
          />
        </label>

        <div className="mb-3 grid grid-cols-2 gap-3">
          <label>
            <span className="mb-1 block font-arabic text-sm text-ink-600">تاريخ البداية</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-ink-200 bg-ink-50/50 px-3 py-2.5 outline-none ring-mint-500 focus:ring-2"
            />
          </label>
          <label>
            <span className="mb-1 block font-arabic text-sm text-ink-600">المدة (أيام)</span>
            <input
              type="number"
              min={1}
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="w-full rounded-xl border border-ink-200 bg-ink-50/50 px-3 py-2.5 outline-none ring-mint-500 focus:ring-2"
            />
          </label>
        </div>

        <div className="mb-3 flex gap-2 rounded-xl bg-ink-50 p-1">
          <button
            type="button"
            onClick={() => setMode("interval")}
            className={`flex-1 rounded-lg py-2 font-arabic text-sm font-semibold ${
              mode === "interval" ? "bg-white text-ink-900 shadow-soft" : "text-ink-500"
            }`}
          >
            كل X ساعات
          </button>
          <button
            type="button"
            onClick={() => setMode("custom")}
            className={`flex-1 rounded-lg py-2 font-arabic text-sm font-semibold ${
              mode === "custom" ? "bg-white text-ink-900 shadow-soft" : "text-ink-500"
            }`}
          >
            أوقات مخصصة
          </button>
        </div>

        {mode === "interval" ? (
          <div className="mb-3 grid grid-cols-3 gap-2">
            <label>
              <span className="mb-1 block text-xs text-ink-500">كل (ساعات)</span>
              <input
                type="number"
                min={1}
                max={12}
                value={intervalHours}
                onChange={(e) => setIntervalHours(Number(e.target.value))}
                className="w-full rounded-xl border border-ink-200 px-2 py-2 outline-none ring-mint-500 focus:ring-2"
              />
            </label>
            <label>
              <span className="mb-1 block text-xs text-ink-500">من ساعة</span>
              <input
                type="number"
                min={0}
                max={23}
                value={startHour}
                onChange={(e) => setStartHour(Number(e.target.value))}
                className="w-full rounded-xl border border-ink-200 px-2 py-2 outline-none ring-mint-500 focus:ring-2"
              />
            </label>
            <label>
              <span className="mb-1 block text-xs text-ink-500">إلى ساعة</span>
              <input
                type="number"
                min={1}
                max={24}
                value={endHour}
                onChange={(e) => setEndHour(Number(e.target.value))}
                className="w-full rounded-xl border border-ink-200 px-2 py-2 outline-none ring-mint-500 focus:ring-2"
              />
            </label>
          </div>
        ) : (
          <div className="mb-3">
            <div className="flex gap-2">
              <input
                type="time"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                className="flex-1 rounded-xl border border-ink-200 px-3 py-2 outline-none ring-mint-500 focus:ring-2"
              />
              <button
                type="button"
                onClick={addCustomTime}
                className="rounded-xl bg-ink-900 px-4 py-2 text-sm font-semibold text-white"
              >
                إضافة
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {doseTimes.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setDoseTimes((prev) => prev.filter((x) => x !== t))}
                  className="rounded-lg bg-ink-100 px-2 py-1 font-arabic text-xs text-ink-700"
                >
                  {minutesTo24h(t)} ✕
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4 rounded-xl bg-mint-500/10 p-3">
          <p className="mb-2 font-arabic text-xs font-semibold text-mint-600">
            المواعيد ({previewTimes.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {previewTimes.map((t) => (
              <span
                key={t}
                className="rounded-md bg-white px-2 py-1 font-arabic text-xs text-ink-700"
              >
                {minutesToLabel(t)}
              </span>
            ))}
            {previewTimes.length === 0 && (
              <span className="font-arabic text-xs text-ink-400">لا مواعيد بعد</span>
            )}
          </div>
        </div>

        {error && (
          <p className="mb-3 font-arabic text-sm font-semibold text-coral-500">{error}</p>
        )}

        <button
          type="submit"
          className="w-full rounded-2xl bg-mint-500 py-3 font-arabic text-base font-bold text-white shadow-soft transition hover:bg-mint-600 active:scale-[0.99]"
        >
          حفظ وإضافة للإشعارات
        </button>
      </form>
    </div>
  );
}
