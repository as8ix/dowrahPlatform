const XLSX = require('xlsx');
const path = require('path');

const SEED_NAMES = [
    'يوسف عبدالرحمن',
    'علي عبدالحميد',
    'يوسف خالد',
    'قصي حسن',
    'أيمن عبده',
    'خالد علي',
    'عمر يوسف',
    'سعيد حسن',
    'عبدالله إبراهيم',
    'عمر محمد'
];

try {
    const filePath = path.join(__dirname, 'data', 'quran_data.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(sheet);

    // Filter out seed names
    const cleanData = jsonData.filter(row => !SEED_NAMES.includes(row['Student Name']));

    console.log(`Original rows: ${jsonData.length}`);
    console.log(`Clean rows: ${cleanData.length}`);

    const newSheet = XLSX.utils.json_to_sheet(cleanData);
    workbook.Sheets[sheetName] = newSheet;

    XLSX.writeFile(workbook, filePath);
    console.log('Successfully cleaned Excel file.');

} catch (error) {
    console.error('Error processing Excel:', error);
}
