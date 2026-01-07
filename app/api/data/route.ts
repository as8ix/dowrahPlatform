
import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'data', 'quran_data.xlsx');

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'Data file not found' }, { status: 404 });
        }

        const fileBuffer = fs.readFileSync(filePath);
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

        // Assume first sheet is the one
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        return NextResponse.json(jsonData);
    } catch (error) {
        console.error('Error reading Excel:', error);
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }
}
