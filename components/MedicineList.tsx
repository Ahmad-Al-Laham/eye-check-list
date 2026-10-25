"use client";

import { minutesToLabel } from "@/lib/schedule";
import type { Medicine } from "@/lib/types";

type MedicineListProps = {
  medicines: Medicine[];
  onDelete: (id: string) => void;
};

export function MedicineList({ medicines, onDelete }: MedicineListProps) {
  if (medicines.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="mb-3 font-arabic text-lg font-bold text-ink-800">الأدوية المسجّلة</h2>
      <ul className="space-y-2">
        {medicines.map((m) => (
          <li
            key={m.id}
            className="rounded-2xl border border-white/80 bg-white/80 p-3 shadow-soft"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: m.color }}
                  />
                  <p className="truncate font-display font-semibold text-ink-900">
                    {m.name}
                  </p>
                </div>
                <p className="mt-1 font-arabic text-xs text-ink-500">{m.instructions}</p>
                <p className="mt-1 text-xs text-ink-400">
                  {m.durationDays} يوم · من {m.startDate}
                </p>
                <p className="mt-1 font-arabic text-xs text-ink-500">
                  {m.doseTimes.map(minutesToLabel).join(" · ")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`حذف ${m.name}؟`)) onDelete(m.id);
                }}
                className="shrink-0 rounded-lg px-2 py-1 font-arabic text-xs text-coral-500 hover:bg-coral-500/10"
              >
                حذف
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
