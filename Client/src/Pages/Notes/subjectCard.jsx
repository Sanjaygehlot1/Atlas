import React from 'react';

// A list of high-quality, free-to-use background images from Unsplash
const cardBackgrounds = [
  'https://unsplash.com/photos/a-laptop-computer-with-a-bunch-of-different-screens-on-top-of-it-XV2kGdTo9II'
];

const getRandomBackground = () => {
  const randomIndex = Math.floor(Math.random() * cardBackgrounds.length);
  return cardBackgrounds[randomIndex];
};

const SubjectCard = ({ subject, onViewNotes, onUploadNote, userRole }) => {
  const backgroundUrl = getRandomBackground();
  console.log(subject)

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-shadow duration-300 transform hover:-translate-y-1 w-full relative">
      <div 
        className="aspect-w-16 aspect-h-9 w-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(https://unsplash.com/photos/a-laptop-computer-with-a-bunch-of-different-screens-on-top-of-it-XV2kGdTo9II)` }}
      >
        {/* Semi-transparent overlay to improve text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        
        {/* Subject icon and name */}
        <div className="absolute bottom-4 left-4 text-white p-2">
          <h2 className="text-xl font-bold">{subject.name}</h2>
          <p className="text-sm font-medium">{subject.faculty}</p>
        </div>
      </div>
      
      <div className="p-4 flex items-center justify-between">
        <button
          onClick={() => onViewNotes(subject)}
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-full text-xs hover:bg-blue-700 transition duration-300"
        >
          View Notes
        </button>
        {userRole === 'teacher' && (
          <button
            onClick={() => onUploadNote(subject)}
            className="bg-green-600 text-white font-semibold py-2 px-4 rounded-full text-xs hover:bg-green-700 transition duration-300"
          >
            Upload Note
          </button>
        )}
      </div>
    </div>
  );
};

export default SubjectCard;