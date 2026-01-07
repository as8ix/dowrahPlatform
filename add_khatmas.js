const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

try {
    const filePath = path.join(__dirname, 'data', 'quran_data.xlsx');

    // Read existing data
    let oldData = [];
    if (fs.existsSync(filePath)) {
        const workbook = XLSX.readFile(filePath);
        oldData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    }

    // New Headers
    const newHeaders = [
        "Student Name", "Branch", "From", "To", "Pages", "Errors", "Alerts", "Status", "Date", "Khatmas"
    ];

    const newData = [newHeaders];

    // Add existing rows + preserve formulas if possible (hard to preserve formulas with json conversion, but we can re-apply)
    // Actually, better to just map the old data
    oldData.forEach(row => {
        newData.push([
            row['Student Name'],
            row['Branch'],
            row['From'],
            row['To'],
            null, // Pages (Formula)
            row['Errors'],
            row['Alerts'],
            row['Status'],
            row['Date'],
            row['Khatmas'] || 0 // New Column
        ]);
    });

    // Fill empty rows if needed
    if (newData.length < 20) {
        for (let i = 0; i < 20; i++) newData.push(new Array(10).fill(null));
    }

    const ws = XLSX.utils.aoa_to_sheet(newData);

    // Re-apply Pages Formula (Column E / Index 4)
    // Formula: D{i}-C{i}+1
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let R = 1; R <= range.e.r; ++R) {
        const rowNum = R + 1;
        const cellRef = XLSX.utils.encode_cell({ r: R, c: 4 });
        // Logic: if From/To blank, 0. Else To-From+1
        const formula = `IF(OR(ISBLANK(C${rowNum}),ISBLANK(D${rowNum})), 0, D${rowNum}-C${rowNum}+1)`;
        if (!ws[cellRef]) ws[cellRef] = { t: 'n', v: 0 };
        ws[cellRef].f = formula;
    }

    const newWb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWb, ws, "Attendance");
    XLSX.writeFile(newWb, filePath);
    console.log('Added Khatmas column.');

} catch (error) {
    console.error('Error:', error);
}
