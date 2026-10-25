import { createDefaultMedicines } from "./defaults";
import type { AppData, CheckEntry, Medicine } from "./types";

const STORAGE_KEY = "eye-check-list:v1";

export function emptyAppData(): AppData {
  return {
    medicines: [],
    checks: [],
    notificationsEnabled: false,
    initialized: false,
  };
}

export function loadAppData(): AppData {
  if (typeof window === "undefined") return emptyAppData();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded: AppData = {
        medicines: createDefaultMedicines(),
        checks: [],
        notificationsEnabled: false,
        initialized: true,
      };
      saveAppData(seeded);
      return seeded;
    }

    const parsed = JSON.parse(raw) as AppData;
    if (!parsed.initialized) {
      parsed.medicines = createDefaultMedicines();
      parsed.initialized = true;
      saveAppData(parsed);
    }
    return {
      medicines: parsed.medicines ?? [],
      checks: parsed.checks ?? [],
      notificationsEnabled: Boolean(parsed.notificationsEnabled),
      initialized: true,
    };
  } catch {
    const fallback: AppData = {
      medicines: createDefaultMedicines(),
      checks: [],
      notificationsEnabled: false,
      initialized: true,
    };
    saveAppData(fallback);
    return fallback;
  }
}

export function saveAppData(data: AppData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function exportAppDataJson(data: AppData): string {
  return JSON.stringify(data, null, 2);
}

export function importAppDataJson(json: string): AppData {
  const parsed = JSON.parse(json) as AppData;
  if (!Array.isArray(parsed.medicines) || !Array.isArray(parsed.checks)) {
    throw new Error("Invalid data file");
  }
  const data: AppData = {
    medicines: parsed.medicines,
    checks: parsed.checks,
    notificationsEnabled: Boolean(parsed.notificationsEnabled),
    initialized: true,
  };
  saveAppData(data);
  return data;
}

export function upsertMedicine(data: AppData, medicine: Medicine): AppData {
  const index = data.medicines.findIndex((m) => m.id === medicine.id);
  const medicines =
    index >= 0
      ? data.medicines.map((m, i) => (i === index ? medicine : m))
      : [...data.medicines, medicine];
  const next = { ...data, medicines };
  saveAppData(next);
  return next;
}

export function removeMedicine(data: AppData, medicineId: string): AppData {
  const next = {
    ...data,
    medicines: data.medicines.filter((m) => m.id !== medicineId),
    checks: data.checks.filter((c) => c.medicineId !== medicineId),
  };
  saveAppData(next);
  return next;
}

export function addCheck(data: AppData, entry: CheckEntry): AppData {
  const exists = data.checks.some(
    (c) =>
      c.medicineId === entry.medicineId &&
      c.date === entry.date &&
      c.timeMinutes === entry.timeMinutes
  );
  if (exists) return data;
  const next = { ...data, checks: [...data.checks, entry] };
  saveAppData(next);
  return next;
}

export function removeCheck(data: AppData, checkId: string): AppData {
  const next = {
    ...data,
    checks: data.checks.filter((c) => c.id !== checkId),
  };
  saveAppData(next);
  return next;
}

export function setNotificationsEnabled(data: AppData, enabled: boolean): AppData {
  const next = { ...data, notificationsEnabled: enabled };
  saveAppData(next);
  return next;
}
