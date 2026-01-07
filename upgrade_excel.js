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

    // Prepare new structure
    // Columns: A=Student Name, B=Branch, C=From, D=To, E=Pages, F=Errors, G=Alerts, H=Status, I=Date
    const newHeaders = [
        "Student Name",
        "Branch",
        "From",
        "To",
        "Pages",
        "Errors",
        "Alerts",
        "Status",
        "Date"
    ];

    const newData = [newHeaders]; // Row 1 is headers

    // Add existing rows
    oldData.forEach(row => {
        const pages = Number(row['Pages']) || 1;
        const from = 1;
        const to = pages; // Default to 1-to-N

        newData.push([
            row['Student Name'],
            row['Branch'],
            from,
            to,
            // We will set formula later, put placeholder for now
            null,
            row['Errors'],
            row['Alerts'],
            row['Status'],
            row['Date']
        ]);
    });

    // Add some empty rows for future use (up to row 50)
    for (let i = 0; i < 20; i++) {
        newData.push([null, null, null, null, null, null, null, null, null]);
    }

    // Create Worksheet
    const ws = XLSX.utils.aoa_to_sheet(newData);

    // Apply Formulas to Column E (Pages) starting from Row 2
    // Formula: D{i}-C{i}+1
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let R = 1; R <= range.e.r; ++R) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: 4 }); // Column E (index 4)
        // Only apply if From/To are numbers? No, let Excel handle errors or wrap in IFERROR
        // =IF(OR(ISBLANK(C2),ISBLANK(D2)), 0, D2-C2+1)
        const rowNum = R + 1;
        const formula = `IF(OR(ISBLANK(C${rowNum}),ISBLANK(D${rowNum})), 0, D${rowNum}-C${rowNum}+1)`;

        if (!ws[cellRef]) ws[cellRef] = { t: 'n', v: 0 };
        ws[cellRef].f = formula;
    }

    // Create Workbook and Write
    const newWb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWb, ws, "Attendance");

    XLSX.writeFile(newWb, filePath);
    console.log('Successfully upgraded Excel structure.');

} catch (error) {
    console.error('Error upgrading Excel:', error);
}
