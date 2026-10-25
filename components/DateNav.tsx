"use client";

import { addDaysISO, todayISO } from "@/lib/schedule";

type DateNavProps = {
  selectedDate: string;
  onChange: (date: string) => void;
};

export function DateNav({ selectedDate, onChange }: DateNavProps) {
  const today = todayISO();

  return (
    <div className="mb-4 flex items-center justify-between gap-2">
      <button
        type="button"
        onClick={() => onChange(addDaysISO(selectedDate, -1))}
        className="rounded-xl bg-white/80 px-3 py-2 text-sm font-semibold text-ink-700 shadow-soft"
      >
        <span className="inline-block rotate-180">←</span>
      </button>
      <button
        type="button"
        onClick={() => onChange(today)}
        className={`rounded-xl px-4 py-2 font-arabic text-sm font-semibold shadow-soft ${
          selectedDate === today
            ? "bg-mint-500 text-white"
            : "bg-white/80 text-ink-700"
        }`}
      >
        اليوم
      </button>
      <button
        type="button"
        onClick={() => onChange(addDaysISO(selectedDate, 1))}
        className="rounded-xl bg-white/80 px-3 py-2 text-sm font-semibold text-ink-700 shadow-soft"
      >
        <span className="inline-block rotate-180">→</span>
      </button>
    </div>
  );
}
