"use client";

import type { DoseSlot } from "@/lib/types";

type DueBannerProps = {
  slots: DoseSlot[];
  onDismiss: () => void;
  onCheck: (slot: DoseSlot) => void;
};

export function DueBanner({ slots, onDismiss, onCheck }: DueBannerProps) {
  if (slots.length === 0) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50 animate-shake p-3 safe-pb">
      <div className="mx-auto max-w-lg rounded-2xl border border-coral-400/40 bg-coral-500 text-white shadow-lift">
        <div className="flex items-start justify-between gap-2 px-4 pt-3">
          <div>
            <p className="font-display text-xs font-semibold tracking-wide uppercase opacity-90">
              Now due
            </p>
            <p className="font-arabic text-base font-bold">حان موعد الدواء</p>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg px-2 py-1 text-sm opacity-80 hover:bg-white/10"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
        <ul className="space-y-2 px-4 py-3">
          {slots.map((slot) => (
            <li
              key={`${slot.medicine.id}-${slot.timeMinutes}`}
              className="flex items-center justify-between gap-3 rounded-xl bg-white/15 px-3 py-2"
            >
              <div>
                <p className="font-semibold">{slot.medicine.name}</p>
                <p className="font-arabic text-xs opacity-90">{slot.label}</p>
              </div>
              <button
                type="button"
                onClick={() => onCheck(slot)}
                className="rounded-xl bg-white px-3 py-1.5 font-arabic text-sm font-bold text-coral-600"
              >
                تم
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
