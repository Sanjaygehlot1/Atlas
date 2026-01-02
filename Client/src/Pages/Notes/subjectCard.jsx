import React from 'react';

// A list of high-quality, free-to-use background images from Unsplash
const cardBackgrounds = [
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80', // Tech/coding
  'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80', // Books
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80', // Study
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80', // Learning
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80', // Education
];

const getRandomBackground = () => {
  const randomIndex = Math.floor(Math.random() * cardBackgrounds.length);
  return cardBackgrounds[randomIndex];
};

const SubjectCard = ({ subject, onViewNotes, onUploadNote, userRole }) => {
  const backgroundUrl = getRandomBackground();
  
  
  return (
    <div 
      className="relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 w-full h-full min-h-[280px] sm:min-h-[320px] flex flex-col"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Stronger semi-transparent overlay to improve text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>
      
      {/* Content */}
      <div className="relative z-10 p-4 sm:p-6 flex flex-col h-full justify-between">
        {/* Subject icon and name */}
        <div className="flex items-start gap-3 mb-3 sm:mb-4">
          <div className="text-3xl sm:text-4xl flex-shrink-0 drop-shadow-lg">
            {subject.icon || '📚'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1 leading-tight drop-shadow-md line-clamp-2">
              {subject.name || 'Unnamed Subject'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-100 drop-shadow-md line-clamp-1">
              {subject.faculty && subject.faculty !== 'Faculty Name not Known' 
                ? subject.faculty 
                : 'Faculty not assigned'}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-auto">
          <button
            onClick={() => onViewNotes(subject)}
            className="bg-blue-600 text-white font-semibold py-2.5 sm:py-2 px-4 rounded-lg text-xs sm:text-sm hover:bg-blue-700 active:scale-95 transition-all duration-200 flex-1 shadow-lg"
          >
            View Notes
          </button>
          
          {userRole === 'teacher' && (
            <button
              onClick={() => onUploadNote(subject)}
              className="bg-green-600 text-white font-semibold py-2.5 sm:py-2 px-4 rounded-lg text-xs sm:text-sm hover:bg-green-700 active:scale-95 transition-all duration-200 flex-1 shadow-lg"
            >
              Upload Note
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectCard;