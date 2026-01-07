const XLSX = require('xlsx');
const path = require('path');

try {
    const filePath = path.join(__dirname, 'data', 'quran_data.xlsx');

    // Define Headers including new requested columns
    const headers = [
        "Student Name",
        "Branch",
        "From",
        "To",
        "Pages",
        "Errors",
        "Alerts",
        "Status",
        "Date",
        "Khatmas"
    ];

    const data = [headers];

    // RESTORED DATA ROW: Othman Sharif
    // We set From=1, To=225 to match the previous 225 pages count.
    data.push([
        "عثمان شريف",  // Name
        18,            // Branch (as number, which we fixed code to handle)
        1,             // From
        225,           // To
        null,          // Pages (will be formula)
        0,             // Errors
        0,             // Alerts
        "حاضر",        // Status
        new Date().toISOString().split('T')[0], // Date
        0              // Khatmas
    ]);

    // Add empty rows for data entry
    for (let i = 0; i < 20; i++) {
        data.push(new Array(10).fill(null));
    }

    // Create Sheet
    const ws = XLSX.utils.aoa_to_sheet(data);

    // ADD FORMULAS to 'Pages' column (Column E / Index 4)
    // Formula: IF(To and From exist, To - From + 1, 0)
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let R = 1; R <= range.e.r; ++R) {
        const rowNum = R + 1;
        const cellRef = XLSX.utils.encode_cell({ r: R, c: 4 }); // Column E
        // Formula: D{row} - C{row} + 1
        // We use ISNUMBER to check if inputs exist
        const formula = `IF(AND(ISNUMBER(C${rowNum}), ISNUMBER(D${rowNum})), D${rowNum}-C${rowNum}+1, 0)`;

        if (!ws[cellRef]) ws[cellRef] = { t: 'n', v: 0 };
        ws[cellRef].f = formula;
    }

    // Create Workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");

    // Write File
    XLSX.writeFile(wb, filePath);
    console.log("File restored successfully with Othman data and Formulas.");

} catch (error) {
    console.error("Error restoring file:", error);
}
