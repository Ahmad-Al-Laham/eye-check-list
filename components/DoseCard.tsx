"use client";

import type { DoseSlot } from "@/lib/types";

type DoseCardProps = {
  slot: DoseSlot;
  onToggle: (slot: DoseSlot) => void;
};

export function DoseCard({ slot, onToggle }: DoseCardProps) {
  const { medicine, checked, isDue, isPast, isUpcoming, label } = slot;

  return (
    <button
      type="button"
      onClick={() => onToggle(slot)}
      className={`group relative flex w-full items-center gap-3 rounded-2xl border p-3.5 text-right shadow-soft transition active:scale-[0.99] ${
        checked
          ? "border-mint-500/30 bg-mint-500/10"
          : isDue
            ? "border-coral-400 bg-white ring-2 ring-coral-400/40"
            : isPast
              ? "border-ink-100 bg-white/60 opacity-80"
              : "border-white/80 bg-white/90"
      }`}
    >
      {isDue && !checked && (
        <span className="absolute -right-1 -top-1 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-coral-400" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-coral-500" />
        </span>
      )}

      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white ${
          checked ? "bg-mint-500" : ""
        }`}
        style={!checked ? { backgroundColor: medicine.color } : undefined}
      >
        {checked ? "✓" : label.split(" ")[0].split(":")[0]}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="truncate font-display text-base font-semibold text-ink-900">
            {medicine.name}
          </span>
          <span
            className={`shrink-0 rounded-lg px-2 py-0.5 font-arabic text-xs font-semibold ${
              checked
                ? "bg-mint-500/15 text-mint-600"
                : isDue
                  ? "bg-coral-500/15 text-coral-600"
                  : isUpcoming
                    ? "bg-ink-100 text-ink-500"
                    : "bg-ink-100 text-ink-400"
            }`}
          >
            {label}
          </span>
        </span>
        <span className="mt-0.5 block truncate font-arabic text-xs text-ink-500">
          {medicine.instructions}
        </span>
        {isDue && !checked && (
          <span className="mt-1 block font-arabic text-xs font-bold text-coral-500">
            الآن — اضغط للتأكيد
          </span>
        )}
        {checked && (
          <span className="mt-1 block font-arabic text-xs font-semibold text-mint-600">
            تم الأخذ
          </span>
        )}
        {!checked && isPast && (
          <span className="mt-1 block font-arabic text-xs font-semibold text-ink-400">
            فائت — يمكنك التأكيد الآن
          </span>
        )}
      </span>
    </button>
  );
}
