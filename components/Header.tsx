"use client";

type HeaderProps = {
  dateLabel: string;
  done: number;
  total: number;
  notificationsEnabled: boolean;
  onEnableNotifications: () => void;
  onOpenAdd: () => void;
};

export function Header({
  dateLabel,
  done,
  total,
  notificationsEnabled,
  onEnableNotifications,
  onOpenAdd,
}: HeaderProps) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <header className="mb-5 animate-slide-up">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-xs font-semibold tracking-[0.18em] text-ink-400 uppercase">
            Eye Check
          </p>
          <h1 className="mt-1 font-arabic text-2xl font-bold text-ink-900 sm:text-3xl">
            قائمة القطرات
          </h1>
          <p className="mt-1 font-arabic text-sm text-ink-500">{dateLabel}</p>
        </div>
        <button
          type="button"
          onClick={onOpenAdd}
          className="shrink-0 rounded-2xl bg-ink-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-ink-800 active:scale-95"
        >
          + دواء
        </button>
      </div>

      <div className="mt-4 rounded-2xl bg-white/70 p-3 shadow-soft backdrop-blur">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-arabic text-ink-600">
            اليوم: {done} / {total}
          </span>
          <span className="font-semibold text-mint-600">{pct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-ink-100">
          <div
            className="h-full rounded-full bg-mint-500 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {!notificationsEnabled && (
        <button
          type="button"
          onClick={onEnableNotifications}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-sun-400/50 bg-sun-400/15 px-3 py-2.5 font-arabic text-sm font-semibold text-ink-800 transition hover:bg-sun-400/25"
        >
          تفعيل الإشعارات
        </button>
      )}
    </header>
  );
}
