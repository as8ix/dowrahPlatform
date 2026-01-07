
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const filePath = path.join(dataDir, 'quran_data.xlsx');

const headers = ['Student Name', 'Branch', 'Pages', 'Errors', 'Alerts', 'Status', 'Date'];
const data = [
    ['يوسف عبدالرحمن', 'كامل القرآن', 5, 0, 0, 'حاضر', '2025-01-01'],
    ['علي عبدالحميد', '20 جزء', 3, 1, 0, 'حاضر', '2025-01-01'],
    ['عمر محمد', 'كامل القرآن', 0, 0, 0, 'غائب', '2025-01-01'],
];

const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Attendance");

XLSX.writeFile(wb, filePath);
console.log('Excel file created at:', filePath);
