import parseYearlyTimetableExcel from '../Utils/parseTimetable.js';
import { Timetable } from '../Models/timetable.model.js';
import Year from '../Models/year.model.js';
import TimeSlot from '../Models/timeSlots.model.js';
import Faculty from '../Models/faculty.model.js';
import Room from '../Models/rooms.model.js';
import mongoose from 'mongoose';
import crypto from 'crypto';
import fs from 'fs';
import { ApiResponse } from '../Utils/ApiResponse.js';

const generateRecordHash = (record) => {
  const dataString = [
    record.day,
    record.timeSlot,
    record.subjectName,
    record.faculty,
    record.room,
    record.lectureType,
    record.class,
  ].join('|');
  return crypto.createHash('sha256').update(dataString).digest('hex');
};

export async function handleTimetableUpload(req, res) {
  const filePath = req.file ? req.file.path : null;

  try {
    if (!filePath || !req.body.year) {
      return res.status(400).json({ error: 'Missing file or year' });
    }

    const { year } = req.body;
    console.log(`Starting hash-based update for YEAR: ${year}`);

    const newRawRecords = await parseYearlyTimetableExcel(filePath);
    if (newRawRecords.length === 0) {
      return res.status(404).json({ message: 'No data could be parsed from the uploaded file.' });
    }

    const newRecordsWithHashes = newRawRecords.map(rec => ({
      ...rec,
      hash: generateRecordHash(rec),
    }));

    const newHashes = newRecordsWithHashes.map(rec => rec.hash);
    const yearRegex = new RegExp(`^${year}`);

    const totalOldRecords = await Timetable.countDocuments({ class: { $regex: yearRegex } });
    const existingHashesCount = await Timetable.countDocuments({
      entryHash: { $in: newHashes },
      class: { $regex: yearRegex },
    });

    if (existingHashesCount === newRecordsWithHashes.length && totalOldRecords === newRecordsWithHashes.length) {
      console.log(`No changes detected for year ${year}.`);
      return res.status(200).json({
        message: `No changes required for ${year}. The timetable is already up-to-date.`,
        wasUpdateNeeded: false,
      });
    }

    console.log(`Changes detected for year ${year}. Updating the database...`);
    const recordsToSave = await Promise.all(
      newRecordsWithHashes.map(async (record) => {

        const yearDoc = await Year.findOneAndUpdate({ name: record.class }, { $setOnInsert: { name: record.class, year: year, division: 'TBD', department: 'TBD' } }, { upsert: true, new: true });

        const timeSlotDoc = await TimeSlot.findOneAndUpdate({ label: record.timeSlot }, { $setOnInsert: { label: record.timeSlot, startTime: '00:00', endTime: '00:00' } }, { upsert: true, new: true });

        const facultyDoc = await Faculty.findOneAndUpdate({ code: record.faculty }, { $setOnInsert: { code: record.faculty, name: 'TBD', department: 'INFT' } }, { upsert: true, new: true });

        const roomDoc = await Room.findOneAndUpdate({ roomCode: record.room }, { $setOnInsert: { roomCode: record.room, floor: 'TBD' } }, { upsert: true, new: true });

        return {
          year: yearDoc._id,
          day: record.day,
          timeSlot: timeSlotDoc._id,
          subjectName: record.subjectName,
          lectureType: record.lectureType,
          faculty: [facultyDoc._id],
          rooms: [roomDoc._id],
          class: record.class,
          entryHash: record.hash,
        };
      })
    );

    await mongoose.connection.transaction(async (session) => {
      await Timetable.deleteMany({ class: { $regex: yearRegex } }, { session });
      await Timetable.insertMany(recordsToSave, { session });
    });

    console.log(`Database updated successfully for year ${year}.`);
    return res.status(200).json({
      message: `Timetable for ${year} has been successfully updated.`,
      wasUpdateNeeded: true,
      recordsProcessed: recordsToSave.length,
    });

  } catch (err) {
    console.error('An error occurred during the timetable update process:', err);

    if (err.code === 11000) {
        return res.status(409).json({
            error: "Duplicate key error.",
            details: "This error can occur if the Excel file contains identical rows for the same class. Please check the file for duplicates."
        });
    }

    return res.status(500).json({
      error: 'An internal server error occurred.',
      details: err.message,
    });
  } finally {
    if (filePath) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting temporary file ${filePath}:`, err);
        } else {
          console.log(`Successfully deleted temporary file: ${filePath}`);
        }
      });
    }
  }
}

export async function getTimetableForAClass(req, res) {

  const { className } = req.body;
  if (!className) {
    return res.status(400).json({ error: 'Class name is required.' });
  }
  try {

    const day = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date())

    const timetable = await Timetable.find({ class: className, day })
      .populate('year', 'name')
      .populate('timeSlot', 'label')
      .populate('faculty', 'name code')
      .populate('rooms', 'roomCode floor')
      .select(' -createdAt -updatedAt -entryHash').exec();

    console.log(timetable);
    console.log();

    if (!timetable || timetable.length === 0) {
      return res.status(404).json({ message: `No timetable found for class ${className} for today.` });
    }
    return res.status(200).json(new ApiResponse(200, timetable, `Timetable for class ${className} retrieved successfully.`));
  } catch (error) {

  }

}