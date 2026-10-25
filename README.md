# Eye Check List

Mobile-friendly medication checklist for eye drops. Built with Next.js + Tailwind CSS.

Data is saved in the browser (`localStorage`) — no database required.

## Features

- Preloaded medicines from your schedule (Levoquix, Methoflor 0.25%, Tearmond)
- Daily checklist with check / uncheck (saved locally)
- Browser notifications that show the **medicine name** when a dose is due
- Add new medicines with interval or custom times
- Arabic RTL UI, PWA-ready for mobile

## Install (run this first)

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push the project to GitHub
2. Import it in [Vercel](https://vercel.com)
3. Deploy (no env vars needed)

On mobile: open the site → allow notifications → (optional) **Add to Home Screen** for app-like use.

## Notes about notifications

- The page must stay open (or recently used) for in-browser reminders to fire.
- Notifications include the medicine name, e.g. `وقت الدواء: Levoquix`.
- iPhone Safari may need the site added to the Home Screen and notification permission granted.

## Default schedule (from your sheet)

| Medicine           | Interval     | Window           | Duration |
|--------------------|--------------|------------------|----------|
| Levoquix           | every 2h     | 8 AM → midnight  | 14 days  |
| Methoflor 0.25%    | every 3h     | 8 AM → midnight  | 14 days  |
| Tearmond           | every 3h     | 8 AM → midnight  | 30 days  |

Start date: **2026-10-25**
