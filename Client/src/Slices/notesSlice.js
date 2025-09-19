// client/src/axios/notesApi.js

import { AxiosInstance } from '../Axios/AxiosInstance.js';

export const fetchNotesForSubjectAndUser = async (subjectId) => {
  try {
    console.log('🔍 Fetching notes for subject:', subjectId);
    // Option 1: Use POST with body data (if you prefer POST)
    const response = await AxiosInstance.post('/notes/get-notes', {
      subjectId
    });
    console.log('📝 Notes API response:', response.data);
    return response.data.data || response.data;
  } catch (error) {
    console.error('❌ Error fetching notes:', error.response?.data || error.message);
    throw error;
  }
};

export const uploadNote = async (noteData) => {
  try {
    console.log('📤 Uploading note:', noteData);
    const formData = new FormData();
    
    // Append text fields
    Object.keys(noteData).forEach(key => {
      if (key !== 'file') {
        formData.append(key, noteData[key]);
      }
    });
    
    // Append file
    if (noteData.file) {
      formData.append('noteFile', noteData.file);
    }
    
    const response = await AxiosInstance.post('/api/notes/upload-notes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('✅ Note uploaded successfully:', response.data);
    return response.data.data || response.data;
  } catch (error) {
    console.error('❌ Error uploading note:', error.response?.data || error.message);
    throw error;
  }
};
