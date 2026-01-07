"use client";

import { useState, useEffect } from 'react';
import { Session, calculateStats, STUDENTS } from '@/lib/data';

export function useQuranData() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [students, setStudents] = useState(STUDENTS);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Poll for data updates
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/data');
                if (!res.ok) throw new Error('Failed to fetch');

                const rawData = await res.json();

                // Dynamic Student Extraction
                const dynamicStudentsMap = new Map<string, any>();
                STUDENTS.forEach(s => dynamicStudentsMap.set(s.name, s));

                const mappedSessions: Session[] = rawData.map((row: any, index: number) => {
                    const name = row['Student Name'];
                    if (!name) return null;

                    let student = dynamicStudentsMap.get(name);
                    if (!student) {
                        student = {
                            id: `xls-${index}`,
                            name: name,
                            branch: row['Branch'] || 'غير محدد',
                            branchVolume: getVolumeFromBranch(row['Branch'])
                        };
                        dynamicStudentsMap.set(name, student);
                    }

                    const pages = Number(row['Pages']) || 0;
                    const errors = Number(row['Errors']) || 0;
                    const alerts = Number(row['Alerts']) || 0;
                    const khatmas = Number(row['Khatmas']) || 0;

                    return {
                        id: `row-${index}`,
                        studentId: student.id,
                        date: row['Date'] || new Date().toISOString().split('T')[0],
                        pages: pages,
                        errors: errors,
                        alerts: alerts,
                        khatmas: khatmas,
                        cleanPages: Math.max(0, pages - (errors + alerts)),
                        status: row['Status'] || 'غائب', // Allow any string from Excel
                    };
                }).filter((s: any) => s !== null);

                const allStudents = Array.from(dynamicStudentsMap.values());

                setStudents(allStudents);
                setSessions(mappedSessions);
                setIsLoaded(true);
            } catch (e) {
                console.error(e);
                setError('فشل في تحميل البيانات');
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }, []);

    return {
        sessions,
        stats: isLoaded ? calculateStats(sessions, students) : null,
        isLoaded,
        error,
        students: students
    };
}


function getVolumeFromBranch(branch: any): number {
    if (!branch) return 604;
    const branchStr = String(branch); // Safely convert to string (handles numbers like 18)

    if (branchStr.includes('كامل')) return 604;
    if (branchStr.includes('25')) return 500;
    if (branchStr.includes('20')) return 400;
    if (branchStr.includes('15')) return 300;
    if (branchStr.includes('10')) return 200;
    if (branchStr.includes('5')) return 100;
    if (branchStr.includes('3')) return 60;

    // Fallback: If it's a number (e.g. "18"), assume it means 18 Juz? 
    // Usually Juz = 20 pages. So 18 * 20 = 360? 
    // Or maybe the user means "18 pages"? 
    // For now, default to 604 to be safe, or try to parse number.
    const num = Number(branchStr);
    if (!isNaN(num) && num < 31) return num * 20; // Assume number < 31 is Juz count

    return 604;
}
