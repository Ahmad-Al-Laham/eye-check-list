"use client";

import { useState } from "react";
import { useAppStore } from "@/hooks/useAppStore";
import { formatArabicDate, progressForDay } from "@/lib/schedule";
import { AddMedicineModal } from "./AddMedicineModal";
import { DateNav } from "./DateNav";
import { DoseCard } from "./DoseCard";
import { DueBanner } from "./DueBanner";
import { Header } from "./Header";
import { MedicineList } from "./MedicineList";

export function ChecklistApp() {
  const {
    data,
    ready,
    selectedDate,
    setSelectedDate,
    slots,
    dueBanner,
    dismissBanner,
    toggleCheck,
    addMedicine,
    deleteMedicine,
    enableNotifications,
  } = useAppStore();

  const [addOpen, setAddOpen] = useState(false);

  if (!ready || !data) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-lg items-center justify-center px-4">
        <p className="font-arabic text-ink-500">جاري التحميل...</p>
      </main>
    );
  }

  const { done, total } = progressForDay(slots);

  return (
    <main className="mx-auto min-h-dvh max-w-lg px-4 pb-10 pt-6 safe-pb">
      <DueBanner
        slots={dueBanner}
        onDismiss={dismissBanner}
        onCheck={(slot) => {
          toggleCheck(slot);
          dismissBanner();
        }}
      />

      <Header
        dateLabel={formatArabicDate(selectedDate)}
        done={done}
        total={total}
        notificationsEnabled={data.notificationsEnabled}
        onEnableNotifications={async () => {
          const ok = await enableNotifications();
          if (!ok) {
            alert(
              "لم يتم تفعيل الإشعارات. على الجوال: افتح الموقع في المتصفح واسمح بالإشعارات. لأفضل نتيجة أضف الصفحة للشاشة الرئيسية."
            );
          }
        }}
        onOpenAdd={() => setAddOpen(true)}
      />

      <DateNav selectedDate={selectedDate} onChange={setSelectedDate} />

      <section className="space-y-2.5">
        {slots.length === 0 ? (
          <div className="rounded-2xl bg-white/70 p-6 text-center shadow-soft">
            <p className="font-arabic text-ink-600">لا مواعيد لهذا اليوم</p>
            <p className="mt-1 text-sm text-ink-400">
              ربما انتهت مدة الدواء أو لم يبدأ بعد
            </p>
          </div>
        ) : (
          slots.map((slot) => (
            <DoseCard
              key={`${slot.medicine.id}-${slot.timeMinutes}`}
              slot={slot}
              onToggle={toggleCheck}
            />
          ))
        )}
      </section>

      <MedicineList medicines={data.medicines} onDelete={deleteMedicine} />

      <p className="mt-8 text-center text-xs text-ink-400">
        الحفظ محلي على الجهاز · بدون قاعدة بيانات
      </p>

      <AddMedicineModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={addMedicine}
      />
    </main>
  );
}
