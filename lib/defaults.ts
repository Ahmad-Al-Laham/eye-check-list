import { v4 as uuid } from "uuid";
import { generateDoseTimes } from "./schedule";
import type { Medicine } from "./types";

/** Treatment start from the spreadsheet: 25/10 (year inferred as current / 2026). */
const START_DATE = "2026-10-25";

const COLORS = ["#2bb98f", "#e85a46", "#3d7dd9", "#e8b02a", "#9b59b6", "#16a085"];

export function createDefaultMedicines(): Medicine[] {
  const now = new Date().toISOString();

  return [
    {
      id: uuid(),
      name: "Levoquix",
      instructions: "نقطة كل ساعتين لمدة اسبوعين — من الساعة 8 ص لل 12 م",
      doseTimes: generateDoseTimes(2, 8, 24),
      durationDays: 14,
      startDate: START_DATE,
      color: COLORS[0],
      createdAt: now,
    },
    {
      id: uuid(),
      name: "Methoflor 0.25%",
      instructions: "نقطة كل 3 ساعات لمدة اسبوعين — من الساعة 8 ص لل 12 م",
      doseTimes: generateDoseTimes(3, 8, 23),
      durationDays: 14,
      startDate: START_DATE,
      color: COLORS[1],
      createdAt: now,
    },
    {
      id: uuid(),
      name: "Tearmond",
      instructions: "نقطة كل 3 ساعات لمدة شهر — من الساعة 8 ص لل 12 م",
      doseTimes: generateDoseTimes(3, 8, 23),
      durationDays: 30,
      startDate: START_DATE,
      color: COLORS[2],
      createdAt: now,
    },
  ];
}

export function nextMedicineColor(existingCount: number): string {
  return COLORS[existingCount % COLORS.length];
}
