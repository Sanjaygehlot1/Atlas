import { Axios } from "axios";
import { AxiosInstance } from "../Axios/AxiosInstance";

export const fetchTimeTable = async (className) => {
    if (className === undefined || className === null || className === '') {
        throw new Error('Class name is required');
    }
    try {
        const res = await AxiosInstance.post('/api/timetable/get-timetable', { className });

        const excepRes = await AxiosInstance.post('/api/timetable/get-exceptional-timetable', { className });
        console.log(excepRes.data);


        console.log(res.data.data);


        const exceptionsMap = new Map(
            excepRes.data.data.map(exception => [exception.timetableEntry._id, { status: exception.status, updatedRoom: exception.updatedRoom }])
        );

        console.log(exceptionsMap);

        // Merge the template with the exceptions
        const mergedTimetable = res.data.data.map(lecture => {
            // Check if the current lecture's ID exists in our exceptions map
            if (exceptionsMap.has(lecture._id)) {
                // If it does, override the status
                return { ...lecture, status: exceptionsMap.get(lecture._id).status, updatedRoom: exceptionsMap.get(lecture._id).updatedRoom };
            } else {
                // Otherwise, it's a normal, scheduled lecture
                return { ...lecture, status: 'Scheduled' };
            }
        });





        return mergedTimetable;


    } catch (error) {
        console.error('Error fetching timetable:', error);
        throw error;

    }
}

export const uploadTimetable = async (data) => {
    if (!data) {
        throw new Error('Data is required');
    }
    console.log(data);

    try {
        const res = await AxiosInstance.post('/api/timetable/upload', data);
        console.log('Upload response:', res);
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.error('Error uploading timetable:', error);
        throw error;

    }
}

export const getTeacherSchedule = async (facultyId) => {
    try {
        const res = await AxiosInstance.get('/api/timetable/get-teacher-schedule');
        console.log(res.data);
        const excepRes = await AxiosInstance.post('/api/timetable/get-faculty-exceptional-timetable', { facultyId });
        console.log(excepRes.data);


        console.log(res.data.data);


        const exceptionsMap = new Map(
            excepRes.data.data.map(exception => [exception.timetableEntry._id, { status: exception.status, updatedRoom: exception.updatedRoom }])
        );

        console.log(exceptionsMap);

        // Merge the template with the exceptions
        const mergedTimetable = res.data.data.map(lecture => {
            // Check if the current lecture's ID exists in our exceptions map
            if (exceptionsMap.has(lecture._id)) {
                // If it does, override the status
                return { ...lecture, status: exceptionsMap.get(lecture._id).status, updatedRoom: exceptionsMap.get(lecture._id).updatedRoom };
            } else {
                // Otherwise, it's a normal, scheduled lecture
                return { ...lecture, status: 'Scheduled' };
            }
        });





        return mergedTimetable;

        return res.data;
    } catch (error) {
        console.error('Error fetching teacher schedule:', error);
        throw error;
    }
}

export const updateLectureStatus = async (lectureId, status,updatedRoom) => {
    if (!lectureId) {
        throw new Error('Lecture ID is required');
    }
    try {
        const res = await AxiosInstance.patch(`/api/timetable/${lectureId}/status`, { status ,updatedRoom});
        console.log('Cancel response:', res);
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.error('Error canceling lecture:', error);
        throw error;
    }
}