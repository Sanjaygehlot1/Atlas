import { Axios } from "axios";
import { AxiosInstance } from "../Axios/AxiosInstance";

export const fetchTimeTable = async(className)=>{
    if(className === undefined || className === null || className === ''){
        throw new Error('Class name is required');
    }
    try {
        const res = await AxiosInstance.post('/timetable/get-timetable', {className});

        
        console.log(res.data.data);
        return res.data.data;
    } catch (error) {
        console.error('Error fetching timetable:', error);
        throw error;
        
    }
}
export const uploadTimetable = async(data)=>{
    if( !data ){
        throw new Error('Data is required');
    }
    console.log(data);
    
    try {
        const res = await AxiosInstance.post('/timetable/upload', data);
        console.log('Upload response:', res);
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.error('Error uploading timetable:', error);
        throw error;
        
    }
}