"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useQuranData } from '@/lib/hooks';
import { DashboardStats, Student, Session } from '@/lib/data';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { BookOpen, Award, Activity, Target, Maximize } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import confetti from 'canvas-confetti';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

function Skeleton({ className }: { className?: string }) {
  return <div className={cn("bg-slate-300 animate-pulse rounded-md", className)} />;
}

function Card({ children, className, title, icon: Icon, isLoading }: { children: React.ReactNode; className?: string; title?: string; icon?: React.ElementType; isLoading?: boolean }) {
  return (
    <div className={cn("bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col transition-all duration-[1500ms]",
      isLoading ? "opacity-90 scale-[0.98]" : "opacity-100 scale-100",
      className)}>
      {title && (
        <div className="bg-primary/5 border-b border-primary/10 px-4 py-2 flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-primary" />}
          <h3 className="text-base font-bold text-primary">{title}</h3>
        </div>
      )}
      <div className="p-3 flex-1 h-full relative">
        {children}
      </div>
    </div>
  );
}

function StatBox({ label, value, subLabel, highlight = false, isLoading }: { label: string; value: string | number; subLabel?: string; highlight?: boolean; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-slate-50 border-slate-100">
        <Skeleton className="h-3 w-12 mb-2" />
        <Skeleton className="h-8 w-16" />
      </div>
    );
  }
  return (
    <div className={cn("flex flex-col items-center justify-center p-2 rounded-lg border transform transition-all duration-500",
      highlight ? "bg-primary/5 border-primary/20" : "bg-slate-50 border-slate-100"
    )}>
      <span className="text-slate-500 text-[10px] font-medium mb-0.5">{label}</span>
      <span className={cn("text-xl font-bold", highlight ? "text-primary" : "text-slate-800 leading-none")}>{value}</span>
      {subLabel && <span className="text-[9px] text-slate-400 mt-0.5 leading-none">{subLabel}</span>}
    </div>
  );
}

function DonutChart({ title, subTitle, value, color, isLoading }: { title: string; subTitle?: string; value: number; color: string; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="h-24 w-24 rounded-full border-8 border-slate-100 border-t-slate-200 animate-spin mb-2" />
        <Skeleton className="h-4 w-20" />
      </div>
    );
  }
  // Ensure value is between 0 and 1
  const safeValue = Math.min(Math.max(value, 0), 1);
  const data = [
    { name: 'Completed', value: safeValue },
    { name: 'Remaining', value: 1 - safeValue },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full transform transition-all duration-[2000ms]">
      <div className="h-24 w-24 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={45}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              <Cell key="cell-0" fill={color} />
              <Cell key="cell-1" fill="#e2e8f0" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-slate-700">{(safeValue * 100).toFixed(0)}%</span>
        </div>
      </div>
      <div className="mt-2 text-center">
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        {subTitle && <p className="text-[10px] text-slate-500 font-medium leading-tight">{subTitle}</p>}
      </div>
    </div>
  );
}

// --- Main Page ---

export default function Dashboard() {
  const { stats } = useQuranData();
  const [revealed, setRevealed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleReveal = () => {
    setRevealed(true);
    // 🎉 Confetti Blast
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: ReturnType<typeof setInterval> = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  // Auto-Refresh Logic handled by hook/UI updates naturally when localstorage changes in this tab? 
  // No, useQuranData reads once on mount. To support multi-tab or live updates we'd need event listeners.
  // For now simple reload interval to check localStorage?
  // Let's stick to simple mount for now, user can refresh. Or add polling to hook.

  // Re-implementing poll in component for simplicity if hook doesn't support it yet
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 30000); // Poll every 30s to refresh view if needed
    // Actually best to force reload data from storage?
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Default Empty Stats to prevent crash during initial server render / hydration
  // We render the layout immediately.
  const displayStats = stats || {
    overview: {
      target: 15460, completed: 0, clean: 0, khatmas: 0, completionRate: 0, purityRate: 0, qualityRate: 0, teachers: 21, sessions: 0, attendance: 0, goalsAchieved: 0,
    },
    students: [],
    topQuality: [],
  } as DashboardStats;

  return (
    <main className="min-h-screen w-full bg-slate-100 direction-rtl p-4 pb-10 flex flex-col relative lg:h-screen lg:overflow-hidden" dir="rtl">

      {/* Background Pattern Overlay */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url(/background.jpg)', backgroundSize: 'cover' }}></div>

      {/* Header */}
      <header className="relative z-10 mb-4 flex-none flex flex-col sm:flex-row items-center justify-between bg-white rounded-2xl shadow-sm border border-slate-200 p-3 md:px-6 gap-4">
        <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto">
          <div className="w-12 h-12 md:w-14 md:h-14 relative flex-shrink-0">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" priority />
          </div>
          <div>
            <h1 className="text-lg md:text-2xl font-extrabold text-primary leading-tight">الاحصائيات العامة للدورة القرآنية</h1>
            <p className="text-secondary font-semibold text-sm md:text-base">مسجد الحديقة - حلقة الجامعيين</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={toggleFullscreen} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-primary transition-colors">
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Grid Layout - Flex-1 to auto-fit remaining height */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 lg:min-h-0">

        {/* 1. الاحصائيات (Statistics) - Mobile: 1, Desktop: Right Top */}
        <div className={cn("order-1 lg:order-3 lg:col-span-3 transition-all duration-[1500ms]", !revealed && "blur-md brightness-90")} style={{ transitionDelay: revealed ? '800ms' : '0ms' }}>
          <Card title="الاحصائيات" icon={Activity} className="h-auto" isLoading={!revealed}>
            <div className="grid grid-cols-2 gap-3">
              <StatBox label="المجلس" value="جميع الأيام" highlight isLoading={!revealed} />
              <StatBox label="المعلمين" value={displayStats.overview.teachers} isLoading={!revealed} />
              <StatBox label="جلسات التسميع" value={32} isLoading={!revealed} />
              <StatBox label="الحضور الفعلي" value={displayStats.overview.attendance} highlight subLabel=" " isLoading={!revealed} />
            </div>
          </Card>
        </div>

        {/* 2. المنجزات (Achievements) - Mobile: 2, Desktop: Left Top */}
        <div className={cn("order-2 lg:order-1 lg:col-span-3 transition-all duration-[1500ms]", !revealed && "blur-md brightness-90")}>
          <Card title="المنجزات" icon={Target} className="h-auto" isLoading={!revealed}>
            <div className="grid grid-cols-2 gap-3">
              <StatBox label="المستهدف" value={displayStats.overview.target.toLocaleString()} isLoading={!revealed} />
              <StatBox label="الختمات" value={displayStats.overview.khatmas.toFixed(2)} highlight subLabel="دورة كاملة" isLoading={!revealed} />
              <StatBox label="المنجزة" value={displayStats.overview.completed.toLocaleString()} isLoading={!revealed} />
              <StatBox label="النقية" value={displayStats.overview.clean.toLocaleString()} highlight isLoading={!revealed} />
            </div>
          </Card>
        </div>

        {/* 3. المعدلات (Charts) - Mobile: 3, Desktop: Center */}
        <div className="order-3 lg:order-2 lg:col-span-6 lg:row-span-2 flex flex-col justify-center h-auto lg:h-full relative py-4 lg:py-0">
          <div className={cn("grid grid-cols-1 sm:grid-cols-3 gap-4 h-full max-h-[600px] content-center transition-all duration-[2000ms]", !revealed ? "scale-95 opacity-0" : "scale-100 opacity-100")} style={{ transitionDelay: revealed ? '1600ms' : '0ms' }}>
            <Card className="aspect-square flex items-center justify-center max-h-64 mx-auto w-full" isLoading={!revealed}>
              <DonutChart title="الإنجاز" subTitle="بناءً على المستهدف" value={displayStats.overview.completionRate} color="#115e59" isLoading={!revealed} />
            </Card>
            <Card className="aspect-square flex items-center justify-center max-h-64 mx-auto w-full" isLoading={!revealed}>
              <DonutChart title="تحقيق الأهداف" subTitle="نسبة الختمات" value={displayStats.overview.goalsAchieved} color="#0f766e" isLoading={!revealed} />
            </Card>
            <Card className="aspect-square flex items-center justify-center max-h-64 mx-auto w-full" isLoading={!revealed}>
              <DonutChart title="النقاء" subTitle="الصفحات النقية" value={displayStats.overview.qualityRate} color="#b45309" isLoading={!revealed} />
            </Card>
          </div>

          {!revealed && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-auto gap-12">
              <div className="bg-white/95 backdrop-blur-md border border-amber-400 px-6 py-4 md:px-10 md:py-4 rounded-3xl shadow-[0_0_40px_rgba(251,191,36,0.4)] animate-in fade-in zoom-in-95 duration-1000 border-2 text-center">
                <h2 className="text-2xl md:text-4xl font-black flex flex-col md:flex-row items-center gap-3 md:gap-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 bg-clip-text text-transparent drop-shadow-sm">
                  <Award className="w-8 h-8 md:w-10 md:h-10 text-amber-500 hidden md:block" />
                  <span>انتهت الدورة القرآنية</span>
                  <Award className="w-8 h-8 md:w-10 md:h-10 text-amber-500" />
                </h2>
              </div>
              <button
                onClick={handleReveal}
                className="bg-primary text-white px-8 py-3 rounded-full text-xl font-bold shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 animate-bounce flex items-center gap-3 group"
              >
                <span>كشف النتائج</span>
                <Target className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* 4. الأكثر تسميعاً (Most Reciting) - Mobile: 4, Desktop: Left Bottom */}
        <div className={cn("order-4 lg:order-4 lg:col-span-3 lg:col-start-1 lg:row-start-2 flex flex-col transition-all duration-[1500ms]", !revealed && "blur-md brightness-90")} style={{ transitionDelay: revealed ? '2400ms' : '0ms' }}>
          <Card title="الأكثر تسميعاً" icon={BookOpen} className="h-full" isLoading={!revealed}>
            <div className="overflow-y-auto pr-1 flex-1 custom-scrollbar">
              {!revealed ? (
                <div className="space-y-4 p-2">
                  {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : (
                <table className="w-full text-sm text-right animate-in fade-in slide-in-from-bottom-4 duration-[2000ms]">
                  <thead className="text-[10px] text-slate-500 bg-slate-50 uppercase border-b sticky top-0">
                    <tr>
                      <th className="px-3 py-2">م</th>
                      <th className="px-3 py-2">المشارك</th>
                      <th className="px-3 py-2 text-center">الصحفات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayStats.students.length > 0 ? displayStats.students.slice(0, 5).map((s: Student & { pages: number }, i: number) => (
                      <tr key={s.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-1.5 text-slate-400 font-medium text-sm">{i + 1}</td>
                        <td className="px-4 py-1.5">
                          <div className="font-bold text-slate-800 text-base leading-none">{s?.name || 'غير معروف'}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{s?.branch}</div>
                        </td>
                        <td className="px-4 py-1.5 text-center font-black text-primary text-lg">{s.pages}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan={3} className="p-4 text-center text-slate-400 text-sm">لا توجد بيانات</td></tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </div>

        {/* 5. الأجود تسميعاً (Top Quality) - Mobile: 5, Desktop: Right Bottom */}
        <div className={cn("order-5 lg:order-5 lg:col-span-3 lg:col-start-10 lg:row-start-2 flex flex-col transition-all duration-[1500ms]", !revealed && "blur-md brightness-90")} style={{ transitionDelay: revealed ? '3200ms' : '0ms' }}>
          <Card title="الأجود تسميعاً" icon={Award} className="h-full" isLoading={!revealed}>
            <div className="overflow-y-auto pr-1 flex-1 custom-scrollbar">
              {!revealed ? (
                <div className="space-y-4 p-2">
                  {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : (
                <table className="w-full text-sm text-right animate-in fade-in slide-in-from-bottom-4 duration-[2000ms]">
                  <thead className="text-[10px] text-slate-500 bg-slate-50 uppercase border-b sticky top-0">
                    <tr>
                      <th className="px-3 py-2">م</th>
                      <th className="px-3 py-2">المشارك</th>
                      <th className="px-3 py-2 text-center">النسبة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayStats.topQuality.length > 0 ? displayStats.topQuality.slice(0, 5).map((s: Student & { quality: number }, i: number) => (
                      <tr key={s.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-1.5 text-slate-400 font-medium text-sm">{i + 1}</td>
                        <td className="px-4 py-1.5">
                          <div className="font-bold text-slate-800 text-base leading-none">{s.name}</div>
                          <div className="text-[10px] text-transparent mt-0.5 select-none text-right">placeholder</div>
                        </td>
                        <td className="px-4 py-1.5 text-center font-black text-primary text-lg">{(s.quality * 100).toFixed(1)}%</td>
                      </tr>
                    )) : (
                      <tr><td colSpan={3} className="p-4 text-center text-slate-400 text-sm">لا توجد بيانات</td></tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </div>

      </div>
    </main>
  );
}
