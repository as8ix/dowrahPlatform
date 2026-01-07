import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "700", "800", "900"]
});

export const metadata: Metadata = {
  title: "Quran Dashboard",
  description: "Dashboard for Quran Memorization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tajawal.className} antialiased bg-slate-100`}>
        {children}
      </body>
    </html>
  );
}
