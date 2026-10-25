import type { DoseSlot } from "./types";

const NOTIFIED_KEY = "eye-check-list:notified";

function loadNotified(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = sessionStorage.getItem(NOTIFIED_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function saveNotified(set: Set<string>) {
  sessionStorage.setItem(NOTIFIED_KEY, JSON.stringify([...set]));
}

export function notificationKey(slot: DoseSlot): string {
  return `${slot.medicine.id}|${slot.date}|${slot.timeMinutes}`;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  return Notification.requestPermission();
}

export function canNotify(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function showDoseNotification(slot: DoseSlot): void {
  if (!canNotify() || Notification.permission !== "granted") return;

  const title = `وقت الدواء: ${slot.medicine.name}`;
  const body = `حان موعد أخذ ${slot.medicine.name} — ${slot.label}\n${slot.medicine.instructions}`;

  try {
    const notification = new Notification(title, {
      body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: notificationKey(slot),
      requireInteraction: true,
      silent: false,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  } catch {
    // Some browsers block Notification constructor outside service worker
  }
}

export function notifyDueDoses(slots: DoseSlot[]): DoseSlot[] {
  const notified = loadNotified();
  const freshlyNotified: DoseSlot[] = [];

  for (const slot of slots) {
    if (slot.checked || !slot.isDue) continue;
    const key = notificationKey(slot);
    if (notified.has(key)) continue;
    showDoseNotification(slot);
    notified.add(key);
    freshlyNotified.push(slot);
  }

  saveNotified(notified);
  return freshlyNotified;
}

export function clearNotifiedForCheck(slot: DoseSlot): void {
  const notified = loadNotified();
  notified.delete(notificationKey(slot));
  saveNotified(notified);
}
