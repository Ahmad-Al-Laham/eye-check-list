import type { Metadata, Viewport } from "next";
import { Cairo, Manrope, Outfit } from "next/font/google";
import "./globals.css";

const display = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const arabic = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Eye Check List | قائمة أدوية العين",
  description: "Medication checklist with reminders for eye drops",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Eye Check",
  },
};

export const viewport: Viewport = {
  themeColor: "#2bb98f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${display.variable} ${body.variable} ${arabic.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
