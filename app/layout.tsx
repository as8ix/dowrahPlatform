import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "700", "800", "900"]
});

export const metadata: Metadata = {
  title: "نتائج الدورة القرآنية - جامع الحديقة",
  description: "نتائج الدَّوْرَةُ القُرْآنِيَّةُ بِمَسْجِدِ الحَدِيقَة",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "نتائج الدورة القرآنية - جامع الحديقة",
    description: "نتائج الدَّوْرَةُ القُرْآنِيَّةُ بِمَسْجِدِ الحَدِيقَة",
    images: ["/logo.png"],
  },
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
