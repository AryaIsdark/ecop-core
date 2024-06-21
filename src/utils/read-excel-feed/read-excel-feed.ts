import * as fs from 'fs'
import * as path from 'path'
import axios from 'axios'
import *  as XLSX from 'xlsx'

// Function to download a file from a URL
export const downloadFile = async (url : string, outputPath : string) => {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });

    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(outputPath);
        response.data.pipe(writer);
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
};

// Function to copy an Excel file
export const copyFile = (filePath) => {
    const dirname = path.dirname(filePath);
    const extname = path.extname(filePath);
    const basename = path.basename(filePath, extname);
    const clonedFilePath = path.join(dirname, `${basename}_copy_${new Date().getTime()}${extname}`);
    fs.copyFileSync(filePath, clonedFilePath);
    return clonedFilePath;
};

// Function to remove specific rows from an Excel file
export const removeRows = (filePath, rowsToBeRemoved) => {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert sheet to JSON to manipulate rows easily
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Filter out rows that need to be removed and empty rows
    const newData = data.filter((row, index) => {
        const isEmptyRow = (row as any).every(cell => !cell || cell.toString().trim() === '');
        return !rowsToBeRemoved.includes(index + 1) && !isEmptyRow;
    });

    // Convert JSON back to sheet
    const newWorksheet = XLSX.utils.aoa_to_sheet(newData as any);
    workbook.Sheets[sheetName] = newWorksheet;

    // Write the new file
    XLSX.writeFile(workbook, filePath);
};

export const readAndMapExcel = async (url, rowsToBeRemoved, mappingKeys) => {
    const outputPath = path.join(__dirname, 'downloaded_file.xlsx');
    await downloadFile(url, outputPath);

    const clonedFilePath = copyFile(outputPath);
    removeRows(clonedFilePath, rowsToBeRemoved);

    const workbook = XLSX.readFile(clonedFilePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert sheet to JSON
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Get the headers from the first row of data
    const headers = data[0];

    // Map the data based on the mapping keys
    const products = data.slice(1).map(row => {
        let product = {};
        for (let key in mappingKeys) {
            const columnIndex = (headers as any).indexOf(mappingKeys[key]);
            if (columnIndex !== -1) {
                product[key] = row[columnIndex];
            } else {
                product[key] = 'COLUMN_NOT_FOUND'; // If column not found, set to null or handle accordingly
            }
        }
        return product;
    });

    return products;
};
