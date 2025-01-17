import { parse, isValid } from "date-fns";

export const normalizeDate = (dateInput: string): Date | null => {
  // Supported formats
  const formats = [
    "yyyy-MM-dd",     // 2025-01-17
    "MM/dd/yyyy",     // 01/17/2025
    "dd-MM-yyyy",     // 17-01-2025
    "yyyy/MM/dd",     // 2025/01/17
    "MMM dd, yyyy",   // Jan 17, 2025
    "dd MMM yyyy",    // 17 Jan 2025
    "MMMM dd, yyyy",  // January 17, 2025
    "yyyyMMdd",       // 20250117
    "dd.MM.yyyy",     // 17.01.2025
  ];

  // Try parsing with each format
  for (const format of formats) {
    const parsedDate = parse(dateInput.trim(), format, new Date());
    if (isValid(parsedDate)) {
      return parsedDate; // Return valid Date object
    }
  }

  console.warn(`Invalid date format: ${dateInput}`);
  return null; // Return null for invalid dates
};

