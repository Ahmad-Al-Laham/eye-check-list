export type Medicine = {
  id: string;
  name: string;
  instructions: string;
  /** Minutes from midnight for each dose, e.g. 480 = 08:00 */
  doseTimes: number[];
  /** Treatment length in days */
  durationDays: number;
  /** ISO date YYYY-MM-DD when treatment starts */
  startDate: string;
  color: string;
  createdAt: string;
};

export type CheckEntry = {
  id: string;
  medicineId: string;
  medicineName: string;
  /** YYYY-MM-DD */
  date: string;
  /** Minutes from midnight */
  timeMinutes: number;
  checkedAt: string;
};

export type AppData = {
  medicines: Medicine[];
  checks: CheckEntry[];
  notificationsEnabled: boolean;
  initialized: boolean;
};

export type DoseSlot = {
  medicine: Medicine;
  date: string;
  timeMinutes: number;
  label: string;
  checked: boolean;
  checkId?: string;
  isDue: boolean;
  isPast: boolean;
  isUpcoming: boolean;
};
