
import { startOfDay, subDays, format } from 'date-fns';

// Types
export interface Student {
    id: string;
    name: string;
    branch: string;
    branchVolume: number; // Pages
}

export interface Session {
    id: string;
    studentId: string;
    date: string;
    pages: number;
    errors: number;
    alerts: number;
    cleanPages: number;
    khatmas?: number;
    status: string;
}

export interface DashboardStats {
    overview: {
        target: number;
        completed: number;
        clean: number;
        khatmas: number;
        completionRate: number;
        purityRate: number;
        qualityRate: number;
        teachers: number;
        sessions: number;
        attendance: number;
        goalsAchieved: number;
    };
    students: any[];
    topQuality: any[];
}

// Config
const TARGET_PAGES = 6441;
const TEACHERS_COUNT = 12; // Baseline

export const STUDENTS: Student[] = [];

// No longer needing generateData as we fetch from Excel
export function generateData(days = 30): Session[] {
    return [];
}

// Analysis Logic
export function calculateStats(sessions: Session[], studentsList: Student[] = STUDENTS): DashboardStats {
    const totalPages = sessions.reduce((acc, s) => acc + s.pages, 0);
    const totalClean = sessions.reduce((acc, s) => acc + s.cleanPages, 0);
    // Count as present if status is NOT exactly 'غائب' (Absent). 
    // This allows "Sunday, Monday" to count as attendance.
    const totalAttendance = sessions.filter(s => s.status !== 'غائب').length;
    const totalSessions = sessions.length;

    // Khatmas (Cycles)
    // Now calculated via manual input from Excel ('Khatmas' column)
    const totalCycles = sessions.reduce((acc, s) => acc + (s.khatmas || 0), 0);

    const studentStats: Record<string, any> = {};

    // Use the provided list (which might come from Excel)
    studentsList.forEach(student => {
        const studentSessions = sessions.filter(s => s.studentId === student.id);
        const sPages = studentSessions.reduce((acc, s) => acc + s.pages, 0);
        const sClean = studentSessions.reduce((acc, s) => acc + s.cleanPages, 0);
        const sErrors = studentSessions.reduce((acc, s) => acc + s.errors, 0);
        const sKhatmas = studentSessions.reduce((acc, s) => acc + (s.khatmas || 0), 0);

        // Cycle = Recited / Volume
        // Prevent division by zero if volume matches
        const vol = student.branchVolume || 604;
        const calculatedCycles = sPages > 0 ? sPages / vol : 0;

        studentStats[student.id] = {
            id: student.id,
            name: student.name,
            pages: sPages,
            clean: sClean,
            errors: sErrors,
            cycles: sKhatmas > 0 ? sKhatmas : calculatedCycles,
            quality: sPages > 0 ? sClean / sPages : 0,
        };
    });

    // Goals Achieved Calculation:
    // User Request: "Rate of how many students completed (khatam) out of all students"
    const totalStudentsCount = Object.keys(studentStats).length;
    const studentsWithKhatma = Object.values(studentStats).filter((s: any) => s.cycles >= 1).length;

    // Avoid division by zero
    const goalsAchievedRate = totalStudentsCount > 0 ? (studentsWithKhatma / totalStudentsCount) : 0;

    return {
        overview: {
            target: TARGET_PAGES,
            completed: totalPages,
            clean: totalClean,
            khatmas: totalCycles,
            completionRate: totalPages / TARGET_PAGES,
            purityRate: totalClean / totalPages || 0,
            qualityRate: totalClean / totalPages || 0, // General Quality
            teachers: TEACHERS_COUNT, // Dynamic in real app
            sessions: totalSessions,
            attendance: totalAttendance,
            goalsAchieved: goalsAchievedRate // Modified Logic
        },
        students: Object.values(studentStats).sort((a: any, b: any) => b.pages - a.pages),
        topQuality: Object.values(studentStats).sort((a: any, b: any) => b.quality - a.quality),
    };
}
