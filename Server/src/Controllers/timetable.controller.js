import parseYearlyTimetableExcel from '../Utils/parseTimetable.js';
import { Timetable } from '../Models/timetable.model.js';
import LectureException from '../Models/exceptionLectures.model.js';
import Year from '../Models/year.model.js';
import TimeSlot from '../Models/timeSlots.model.js';
import Faculty from '../Models/faculty.model.js';
import Room from '../Models/rooms.model.js';
import mongoose from 'mongoose';
import crypto from 'crypto';
import fs from 'fs';
import { ApiResponse } from '../Utils/ApiResponse.js';
import { AsyncHandler } from '../Utils/AsyncHandler.js';
import { ApiError } from '../Utils/ApiError.js';

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

  const decodedToken = req.user;
  console.log(decodedToken);

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

        const facultyDoc = await Faculty.findOneAndUpdate({ code: record.faculty }, { $setOnInsert: { code: record.faculty, name: 'TBD', department: 'INFT', uid : decodedToken.uid } }, { upsert: true, new: true });

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
      .populate('rooms', 'roomCode type')
      .select(' -createdAt -updatedAt -entryHash').exec();

    console.log(timetable);
    console.log();

    if (!timetable || timetable.length === 0) {
      return res.status(404).json({ message: `No timetable found for class ${className} for today.` });
    }
    return res.status(200).json(new ApiResponse(200, timetable, `Timetable for class ${className} retrieved successfully.`));
  } catch (error) {
    throw new ApiError(500, "An error occurred while retrieving the timetable.");
  }

}

export const getScheduleForATeacher = AsyncHandler(async (req, res) => {

  const decodedToken = req.user;

  if (!decodedToken) {
    return new ApiError(400, "Unauthorized Access: No Token provided.");
  }
  try {

    const day = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date())

     const teacher = await Faculty.findOne({uid : decodedToken.uid});
     console.log("!!",teacher);

    const schedule = await Timetable.find({
      faculty: { $in: [teacher._id] },
      day: day
    })
      .populate('year', 'name')
      .populate('timeSlot', 'label')
      .populate('faculty', 'name code')
      .populate('rooms', 'roomCode floor')
      .select(' -createdAt -updatedAt -entryHash').exec();

    console.log(schedule);

    if (!schedule || schedule.length === 0) {
      return res.status(404).json({ message: `No schedule found for today.` });
    }
    return res.status(200).json(new ApiResponse(200, schedule, `Schedule for today retrieved successfully.`));
  } catch (error) {
    throw new ApiError(500, error.message);
  }

})

export async function getExceptionsForAClass(req, res) {
  const { className } = req.body;
  if (!className) {
    return res.status(400).json({ error: 'Class name is required.' });
  }
  try {
    const day = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date())
    console.log(day)
    const exceptions = await LectureException.find({ class: className, day: day.trim() })
      .populate('timetableEntry', 'subjectName timeSlot class')
      .populate('timetableEntry.year', 'name')
      .populate('timetableEntry.faculty', 'name code')
      .populate('timetableEntry.rooms', 'roomCode floor')
      .select(' -createdAt -updatedAt -entryHash').exec();

    if (!exceptions || exceptions.length === 0) {
      return res.status(200).json(new ApiResponse(200, [], `No exceptions found for class ${className} for today.`));
    }
    console.log(exceptions.length)
    return res.status(200).json(new ApiResponse(200, exceptions, `Exceptions for class ${className} retrieved successfully.`));
  } catch (error) {
    throw new ApiError(500, "An error occurred while retrieving the exceptions.");
  }
}

export async function getExceptionsForAFaculty(req, res) {
  const { facultyId } = req.body;
  console.log(facultyId)
  if (!facultyId) {
    return res.status(400).json({ error: 'Faculty ID is required.' });
  }
  try {
    const day = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date())
    console.log(day)
    const exceptions = await LectureException.find({ faculty: facultyId, day: day })
      .populate('timetableEntry', 'subjectName timeSlot class')
      .populate('timetableEntry.year', 'name')
      .populate('timetableEntry.faculty', 'name code')
      .populate('timetableEntry.rooms', 'roomCode floor')
      .select(' -createdAt -updatedAt -entryHash').exec();

    if (!exceptions || exceptions.length === 0) {
      return res.status(200).json(new ApiResponse(200, [], `No exceptions found for today.`));
    }
    console.log(exceptions)
    return res.status(200).json(new ApiResponse(200, exceptions, `Exceptions retrieved successfully.`));
  } catch (error) {
    throw new ApiError(500, "An error occurred while retrieving the exceptions.");
  }
}

export const updateLectureStatus = AsyncHandler(async (req, res) => {
  console.log("updateLectureStatus triggered");

  const { lectureId } = req.params;
  const { status, updatedRoom } = req.body;
  console.log(req.body)
  const teacherId = req.user?._id;
  console.log(lectureId, status)

  if (!status) {
    throw new ApiError(400, "No update status provided.");
  }

  console.log(status);

  if (status === "Venue_Changed") {

    if (!updatedRoom) {
      throw new ApiError(400, "No updated room provided.");
    }
  }



  const lecture = await Timetable.findById(lectureId).populate('faculty');
  if (!lecture) {
    throw new ApiError(404, "Lecture not found.");
  }

  console.log(lecture)

  // if (!lecture.faculty.some(f => f._id.equals(teacherId)) && req.user.role !== 'admin') {
  //     throw new ApiError(403, "You are not authorized to update this lecture.");
  // }
  let lectureException;
  if (status === "Scheduled") {
    await LectureException.deleteMany({ timetableEntry: lectureId, day: lecture.day, class: lecture.class });
  } else {
    lectureException = await LectureException.findOneAndUpdate(
      { timetableEntry: lectureId, day: lecture.day, class: lecture.class },
      { $set: { status, notes: lecture.notes, faculty: lecture.faculty[0]._id, name: lecture.subjectName, date: new Date(), updatedRoom } },
      { upsert: true, new: true }
    );
    await lectureException.save();
  }



  console.log(updatedRoom)
  let message = `The ${lecture.subjectName} lecture at ${lecture.timeSlot.label} has been ${status.toLowerCase()}.`;

  if (updatedRoom != undefined) {
    message = `The ${lecture.subjectName} lecture at ${lecture.timeSlot.label} has been  shifted to Room ${updatedRoom} on ${lecture.day}.`;
  }
  console.log("Lectreeeeee:",lecture)

  const io = req.app.get('io');
  console.log(req.app)
    const notifyMessage = `The ${lecture.subjectName} lecture  has been ${status.replace('_', ' ')}.`;
    console.log("Messagegegege",notifyMessage)
    
    // Emit an event to the specific class's room
    io.to(lecture.class).emit('lecture_update', {
        lectureId: lecture._id,
        status: status,
        message: notifyMessage,
        newVenue: updatedRoom
    });

  // await sendNotificationToClass(lecture.class, "Lecture Status Update", message);

  return res.status(200).json(new ApiResponse(200, lectureException, message));
});

export const getCompleteTimetable = AsyncHandler(async (req,res)=>{
  
  const timetable = await Timetable.aggregate([
  // Join with Year collection
  {
    $lookup: {
      from: "years",
      localField: "year",
      foreignField: "_id",
      as: "yearDetails"
    }
  },
  { $unwind: "$yearDetails" },

  // Join with TimeSlot collection
  {
    $lookup: {
      from: "timeslots",
      localField: "timeSlot",
      foreignField: "_id",
      as: "timeSlotDetails"
    }
  },
  { $unwind: "$timeSlotDetails" },

  // Join with Rooms collection
  {
    $lookup: {
      from: "rooms",
      localField: "rooms",
      foreignField: "_id",
      as: "roomDetails"
    }
  },

  // Join with Faculty collection
  {
    $lookup: {
      from: "faculties",
      localField: "faculty",
      foreignField: "_id",
      as: "facultyDetails"
    }
  },

  // Optional: Clean up and shape the final output
  {
    $project: {
      _id: 1,
      day: 1,
      subjectName: 1,
      lectureType: 1,
      class: 1,
      entryHash: 1,
      createdAt: 1,
      updatedAt: 1,

      year: "$yearDetails.name", // or any field you want
      timeSlot: {
        label: "$timeSlotDetails.label",
        
      },
      rooms: {
      	roomCode : "$roomDetails.roomCode",
        type: "$roomDetails.type"
      }, // or array of objects if needed
      faculty: {
        $map: {
          input: "$facultyDetails",
          as: "fac",
          in: {
            name: "$$fac.name",
            code: "$$fac.code"
          }
        }
      }
    }
  }
]
);

  console.log(timetable);

  if(timetable.length === 0){
    return res.status(200).json(new ApiResponse(404,[],"No timetable found."));
  }

  return res.status(200).json(new ApiResponse(200,timetable,"Timetable retrieved successfully."));
})