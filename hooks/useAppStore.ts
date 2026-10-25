"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import { nextMedicineColor } from "@/lib/defaults";
import {
  canNotify,
  notifyDueDoses,
  requestNotificationPermission,
} from "@/lib/notifications";
import {
  buildDoseSlots,
  getDueDoses,
  todayISO,
} from "@/lib/schedule";
import {
  addCheck,
  loadAppData,
  removeCheck,
  removeMedicine,
  setNotificationsEnabled,
  upsertMedicine,
} from "@/lib/storage";
import type { AppData, DoseSlot, Medicine } from "@/lib/types";

export function useAppStore() {
  const [data, setData] = useState<AppData | null>(null);
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [now, setNow] = useState(() => new Date());
  const [dueBanner, setDueBanner] = useState<DoseSlot[]>([]);

  useEffect(() => {
    setData(loadAppData());
  }, []);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!data?.notificationsEnabled) return;

    const run = () => {
      const due = getDueDoses(data.medicines, data.checks, new Date());
      setDueBanner(due);
      notifyDueDoses(due);
    };

    run();
    const id = window.setInterval(run, 30_000);
    return () => window.clearInterval(id);
  }, [data]);

  const slots = useMemo(() => {
    if (!data) return [];
    return buildDoseSlots(data.medicines, data.checks, selectedDate, now);
  }, [data, selectedDate, now]);

  const toggleCheck = useCallback(
    (slot: DoseSlot) => {
      if (!data) return;
      if (slot.checked && slot.checkId) {
        setData(removeCheck(data, slot.checkId));
        return;
      }
      setData(
        addCheck(data, {
          id: uuid(),
          medicineId: slot.medicine.id,
          medicineName: slot.medicine.name,
          date: slot.date,
          timeMinutes: slot.timeMinutes,
          checkedAt: new Date().toISOString(),
        })
      );
    },
    [data]
  );

  const addMedicine = useCallback(
    (input: {
      name: string;
      instructions: string;
      doseTimes: number[];
      durationDays: number;
      startDate: string;
    }) => {
      if (!data) return;
      const medicine: Medicine = {
        id: uuid(),
        name: input.name.trim(),
        instructions: input.instructions.trim(),
        doseTimes: [...input.doseTimes].sort(
          (a, b) => (a === 0 ? 1440 : a) - (b === 0 ? 1440 : b)
        ),
        durationDays: input.durationDays,
        startDate: input.startDate,
        color: nextMedicineColor(data.medicines.length),
        createdAt: new Date().toISOString(),
      };
      setData(upsertMedicine(data, medicine));
    },
    [data]
  );

  const deleteMedicine = useCallback(
    (medicineId: string) => {
      if (!data) return;
      setData(removeMedicine(data, medicineId));
    },
    [data]
  );

  const enableNotifications = useCallback(async () => {
    if (!data) return false;
    if (!canNotify()) return false;
    const permission = await requestNotificationPermission();
    const enabled = permission === "granted";
    setData(setNotificationsEnabled(data, enabled));
    if (enabled) {
      const due = getDueDoses(data.medicines, data.checks, new Date());
      setDueBanner(due);
      notifyDueDoses(due);
    }
    return enabled;
  }, [data]);

  const dismissBanner = useCallback(() => setDueBanner([]), []);

  return {
    data,
    ready: Boolean(data),
    selectedDate,
    setSelectedDate,
    slots,
    dueBanner,
    dismissBanner,
    toggleCheck,
    addMedicine,
    deleteMedicine,
    enableNotifications,
    now,
  };
}
