"use client";

import React, { useState, useEffect } from 'react';
import { useQuranData } from '@/lib/hooks';
import Link from 'next/link';
import { ArrowRight, Save, RotateCcw } from 'lucide-react';

export default function AdminPage() {
    const { students, addSession, resetData } = useQuranData();
    const [formData, setFormData] = useState({
        studentId: '',
        pages: 1,
        errors: 0,
        alerts: 0,
    });
    const [msg, setMsg] = useState('');

    // Set initial student after mount to avoid build-time errors
    useEffect(() => {
        if (students && students.length > 0 && !formData.studentId) {
            setFormData(prev => ({ ...prev, studentId: students[0].id }));
        }
    }, [students, formData.studentId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.studentId) return;

        addSession({
            studentId: formData.studentId,
            date: new Date().toISOString().split('T')[0],
            pages: Number(formData.pages),
            errors: Number(formData.errors),
            alerts: Number(formData.alerts),
            cleanPages: Math.max(0, Number(formData.pages) - (Number(formData.errors) + Number(formData.alerts))),
            status: 'حاضر'
        });

        setMsg('تم الحفظ بنجاح! ✅');
        setTimeout(() => setMsg(''), 3000);
    };

    return (
        <main className="min-h-screen bg-slate-50 font-sans direction-rtl" dir="rtl">
            <div className="max-w-md mx-auto p-6">
                <Link href="/" className="inline-flex items-center text-slate-500 hover:text-primary mb-6 gap-2">
                    <ArrowRight className="w-4 h-4" />
                    <span>العودة للوحة الاحصائيات</span>
                </Link>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h1 className="text-2xl font-bold text-primary mb-6">تسجيل تسميع جديد</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">الطالب</label>
                            <select
                                value={formData.studentId}
                                onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            >
                                {students.map(s => (
                                    <option key={s.id} value={s.id}>{s.name} - {s.branch}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">عدد الصفحات</label>
                                <input
                                    type="number" min="0" max="100"
                                    value={formData.pages}
                                    onChange={e => setFormData({ ...formData, pages: Number(e.target.value) })}
                                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">التنبيهات</label>
                                <input
                                    type="number" min="0"
                                    value={formData.alerts}
                                    onChange={e => setFormData({ ...formData, alerts: Number(e.target.value) })}
                                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">الأخطاء</label>
                            <input
                                type="number" min="0"
                                value={formData.errors}
                                onChange={e => setFormData({ ...formData, errors: Number(e.target.value) })}
                                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>

                        <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
                            <Save className="w-5 h-5" />
                            حفظ البيانات
                        </button>

                        {msg && <div className="p-3 bg-green-50 text-green-700 rounded-lg text-center font-medium animate-in fade-in">{msg}</div>}
                    </form>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-200">
                    <button onClick={() => { if (confirm('هل أنت متأكد من حذف جميع البيانات وإعادة التوليد العشوائي؟')) { resetData(); location.reload(); } }} className="text-red-500 text-sm flex items-center gap-1 hover:underline">
                        <RotateCcw className="w-3 h-3" />
                        إعادة ضبط البيانات (توليد عشوائي)
                    </button>
                </div>
            </div>
        </main>
    );
}
