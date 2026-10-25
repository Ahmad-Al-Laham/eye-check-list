import type { CheckEntry, DoseSlot, Medicine } from "./types";

/** Generate dose minutes between startHour and endHour (inclusive). Hour 24 = midnight (0). */
export function generateDoseTimes(
  intervalHours: number,
  startHour = 8,
  endHour = 24
): number[] {
  const times: number[] = [];
  for (let h = startHour; h <= endHour; h += intervalHours) {
    if (h === 24) {
      times.push(0);
    } else if (h < 24) {
      times.push(h * 60);
    }
  }
  return times;
}

export function minutesToLabel(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const period = h >= 12 ? "م" : "ص";
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return `${displayH}:${m.toString().padStart(2, "0")} ${period}`;
}

export function minutesTo24h(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function parseTimeInput(value: string): number | null {
  const match = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}

export function todayISO(date = new Date()): string {
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${mo}-${d}`;
}

export function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return todayISO(dt);
}

export function daysBetween(startISO: string, endISO: string): number {
  const [ys, ms, ds] = startISO.split("-").map(Number);
  const [ye, me, de] = endISO.split("-").map(Number);
  const start = new Date(ys, ms - 1, ds);
  const end = new Date(ye, me - 1, de);
  return Math.round((end.getTime() - start.getTime()) / 86_400_000);
}

export function isMedicineActiveOn(medicine: Medicine, dateISO: string): boolean {
  const day = daysBetween(medicine.startDate, dateISO);
  return day >= 0 && day < medicine.durationDays;
}

export function nowMinutes(date = new Date()): number {
  return date.getHours() * 60 + date.getMinutes();
}

/** Sortable timeline minutes: midnight dose (0) counts as end of day (1440). */
export function timelineMinutes(timeMinutes: number): number {
  return timeMinutes === 0 ? 24 * 60 : timeMinutes;
}

export function checkKey(medicineId: string, date: string, timeMinutes: number): string {
  return `${medicineId}|${date}|${timeMinutes}`;
}

export function buildDoseSlots(
  medicines: Medicine[],
  checks: CheckEntry[],
  dateISO: string,
  now: Date = new Date()
): DoseSlot[] {
  const checkMap = new Map(
    checks
      .filter((c) => c.date === dateISO)
      .map((c) => [checkKey(c.medicineId, c.date, c.timeMinutes), c])
  );

  const isToday = dateISO === todayISO(now);
  const currentMinutes = isToday ? nowMinutes(now) : -1;

  const slots: DoseSlot[] = [];

  for (const medicine of medicines) {
    if (!isMedicineActiveOn(medicine, dateISO)) continue;

    for (const timeMinutes of medicine.doseTimes) {
      const existing = checkMap.get(checkKey(medicine.id, dateISO, timeMinutes));
      const checked = Boolean(existing);
      const dueAt = timelineMinutes(timeMinutes);

      let isDue = false;
      let isPast = false;
      let isUpcoming = false;

      if (isToday) {
        const windowStart = dueAt - 15;
        const windowEnd = dueAt + 45;

        if (checked) {
          isPast = true;
        } else if (currentMinutes >= windowStart && currentMinutes <= windowEnd) {
          isDue = true;
        } else if (currentMinutes > windowEnd) {
          isPast = true;
        } else {
          isUpcoming = true;
        }
      }

      slots.push({
        medicine,
        date: dateISO,
        timeMinutes,
        label: minutesToLabel(timeMinutes),
        checked,
        checkId: existing?.id,
        isDue,
        isPast,
        isUpcoming,
      });
    }
  }

  return slots.sort((a, b) => {
    const ta = timelineMinutes(a.timeMinutes);
    const tb = timelineMinutes(b.timeMinutes);
    if (ta !== tb) return ta - tb;
    return a.medicine.name.localeCompare(b.medicine.name);
  });
}

export function getDueDoses(
  medicines: Medicine[],
  checks: CheckEntry[],
  now: Date = new Date()
): DoseSlot[] {
  const dateISO = todayISO(now);
  return buildDoseSlots(medicines, checks, dateISO, now).filter(
    (s) => s.isDue && !s.checked
  );
}

export function formatArabicDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function progressForDay(slots: DoseSlot[]): { done: number; total: number } {
  return {
    done: slots.filter((s) => s.checked).length,
    total: slots.length,
  };
}
