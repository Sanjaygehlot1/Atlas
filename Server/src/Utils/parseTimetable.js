import xlsx from 'xlsx';
import fs from 'fs';

/**
 * A robust parser for extracting all timetable data from an Excel file for a full year.
 * This version uses a more flexible regex and correctly skips header/invalid rows.
 * @param {string} filePath - The path to the uploaded Excel file.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of all parsed records.
 */
export default async function parseYearlyTimetableExcel(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found at path: ${filePath}`);
  }

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: null });

  const allRecords = [];

  // --- THE FIX IS HERE ---
  // The header detection is now more specific, looking for a row that contains BOTH "DAY" and "CLASS".
  const headerIndex = data.findIndex(row => 
    row && 
    row.some(cell => typeof cell === 'string' && cell.toUpperCase().trim() === 'DAY') &&
    row.some(cell => typeof cell === 'string' && cell.toUpperCase().trim() === 'CLASS')
  );

  if (headerIndex === -1) {
    throw new Error("Could not find a valid header row containing 'DAY' and 'Class'.");
  }
  const headerRow = data[headerIndex];

  const classColumnIndex = headerRow.findIndex(cell => typeof cell === 'string' && cell.toUpperCase().trim() === 'CLASS');
  if (classColumnIndex === -1) {
      throw new Error("Could not find the 'Class' column in the header.");
  }

  const timeSlotMap = {};
  headerRow.forEach((cell, index) => {
    if (index > classColumnIndex && cell) { 
      timeSlotMap[index] = cell.trim();
    }
  });

  let currentDay = null; // Variable to hold the day for merged cells

  for (let i = headerIndex + 1; i < data.length; i++) {
    const row = data[i];

    // Update the current day if it's specified in the first column (for merged cells)
    const potentialDay = row && row[0] ? row[0].trim() : null;
    const validDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    if (potentialDay && validDays.includes(potentialDay.toUpperCase())) {
        currentDay = potentialDay;
    }

    // A valid data row must have a class and a currentDay must be set.
    if (currentDay && row && row[classColumnIndex]) {
      const classId = row[classColumnIndex].trim();

      for (let j = classColumnIndex + 1; j < row.length; j++) {
        const lectureCell = row[j];
        const timeSlot = timeSlotMap[j];

        if (timeSlot && lectureCell && typeof lectureCell === 'string') {
          let record = null;
          const cellContent = lectureCell.trim();
          
          if (cellContent.toUpperCase().includes('LUNCH')) {
            record = { subjectName: "LUNCH", faculty: "N/A", room: "N/A", lectureType: "Break" };
          } else {
            // This improved regex is more specific about the faculty code format.
            const match = cellContent.match(/(.+?)\s*\(([\w\s/&]+)\)\s*(.*)/);
            
            if (match) {
              const [, subjectName, faculty, room] = match;
              record = {
                subjectName: subjectName.trim(),
                faculty: faculty.trim(),
                room: room.trim() || "N/A", // Handle cases where room might be empty
                lectureType: /lab/i.test(subjectName) ? 'Lab' : 'Theory',
              };
            } else if (cellContent) {
              // Handles cases with no faculty code, like "PROJECT FRIDAY"
              record = {
                subjectName: cellContent,
                faculty: "N/A",
                room: "N/A",
                lectureType: "Other",
              };
            }
          }

          if (record) {
            allRecords.push({
              day: currentDay,
              class: classId,
              timeSlot: timeSlot,
              ...record,
            });
          }
        }
      }
    }
  }

  console.log(`--- Successfully parsed ${allRecords.length} records. ---`);
  return allRecords;
}
