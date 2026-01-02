// client/src/axios/subjectsApi.js

import { AxiosInstance } from '../Axios/AxiosInstance.js';

export const fetchUserSubjects = async (className) => {
  try {
    const response = await AxiosInstance.post('/subjects/get-student-subjects', { className });
    
    const timetableData = response.data.data;

    const subjectsMap = new Map();
    
    timetableData.forEach(entry => {
      if (entry.subjectName && entry.subjectName !== 'Break' && entry.subjectName !== 'LUNCH') {
        subjectsMap.set(entry.subjectName, {
          id: entry.shortForm, // Use subject name as ID for now
          name: entry.subjectName,
          faculty: entry.faculty || "Faculty Name not Known",
          color: getSubjectColor(entry.subjectName),
          icon: getSubjectIcon(entry.subjectName),
        });
      }
    });
    
    return Array.from(subjectsMap.values());
  } catch (error) {
    console.error('Error fetching user subjects:', error);
    throw error;
  }
};

// Helper function to assign colors based on subject name
const getSubjectColor = (subjectName) => {
  const colors = [
    'bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-red-600', 
    'bg-yellow-600', 'bg-indigo-600', 'bg-pink-600', 'bg-gray-600'
  ];
  
  // Simple hash function to consistently assign colors
  let hash = 0;
  for (let i = 0; i < subjectName.length; i++) {
    hash = subjectName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// Helper function to assign icons based on subject name
const getSubjectIcon = (subjectName) => {
  const name = subjectName.toLowerCase();
  
  if (name.includes('math') || name.includes('calculus') || name.includes('algebra')) return '∑';
  if (name.includes('physics')) return '⚛';
  if (name.includes('chemistry')) return '⚗';
  if (name.includes('biology')) return '🧬';
  if (name.includes('computer') || name.includes('programming') || name.includes('software')) return '💻';
  if (name.includes('english') || name.includes('literature')) return '📚';
  if (name.includes('history')) return '📜';
  if (name.includes('geography')) return '🌍';
  if (name.includes('art') || name.includes('design')) return '🎨';
  if (name.includes('music')) return '🎵';
  
  return '📖'; // Default icon
};
