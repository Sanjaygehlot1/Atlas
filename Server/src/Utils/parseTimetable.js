
import xlsx from 'xlsx';
import fs from 'fs';

/**
 * @param {string} filePath - The path to the uploaded Excel file.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of all parsed records for all classes.
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

  // Find the header row to map column indexes to time slots
  const headerIndex = data.findIndex(row => row && row.some(cell => typeof cell === 'string' && cell.toUpperCase().includes('CLASS')));
  if (headerIndex === -1) {
    throw new Error("Could not find a header row containing 'Class'.");
  }
  const headerRow = data[headerIndex];
  const timeSlotMap = {};
  headerRow.forEach((cell, index) => {
    if (index > 1 && cell) { // Assuming time slots start after 'Day' and 'Class'
      timeSlotMap[index] = cell.trim();
    }
  });

  // Iterate through all data rows to find timetable entries
  for (let i = headerIndex + 1; i < data.length; i++) {
    const row = data[i];

    // A valid row must have a Day and a Class defined
    if (row && row[0] && row[1]) {
      const day = row[0].trim();
      const classId = row[1].trim();

      for (let j = 2; j < row.length; j++) {
        const lectureCell = row[j];
        const timeSlot = timeSlotMap[j];

        if (timeSlot && lectureCell && typeof lectureCell === 'string') {
          let record;
          if (lectureCell.toUpperCase().includes('LUNCH')) {
            record = { subjectName: "LUNCH", faculty: "N/A", room: "N/A", lectureType: "Break" };
          } else {
            const match = lectureCell.match(/(.+?)\s\((\w+)\)\s(.+)/);
            if (match) {
              const [, subjectName, faculty, room] = match;
              record = {
                subjectName: subjectName.trim(),
                faculty: faculty.trim(),
                room: room.trim(),
                lectureType: /lab/i.test(subjectName) ? 'Lab' : 'Theory',
              };
            }
          }

          if (record) {
            allRecords.push({
              day: day,
              class: classId,
              timeSlot: timeSlot,
              ...record,
            });
          }
        }
      }
    }
  }

  return allRecords;
}