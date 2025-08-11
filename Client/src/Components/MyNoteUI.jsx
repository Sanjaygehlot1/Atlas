import React, { useState, useEffect } from 'react';
import { fetchNotesForSubjectAndUser, uploadNote } from '../Axios/notesApi';
import { fetchUserSubjects } from '../Axios/subjectsApi';
import { useAuth } from '../context/AuthContext';
import getUserClass from '../Helper/getClass';

// --- Subject Card Component ---
const SubjectCard = ({ subject, onViewNotes, onUploadNote, userRole }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full">
    {/* Top half - Subject info with light colored background */}
    <div className={`${subject.color} bg-opacity-20 p-6 border-b border-gray-200`}>
      <div className="flex items-center">
        <div className={`${subject.color} rounded-full w-12 h-12 flex items-center justify-center text-2xl font-semibold mr-4 text-white`}>
          {subject.icon}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{subject.name}</h2>
          <p className="text-sm text-gray-600">{subject.faculty}</p>
        </div>
      </div>
    </div>
    
    {/* Bottom half - Actions */}
    <div className="p-6 bg-white flex items-center justify-center">
      <div className="flex gap-3">
        <button
          onClick={() => onViewNotes(subject)}
          className="bg-white text-blue-600 border-2 border-blue-600 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-600 hover:text-white hover:scale-110 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 min-w-[100px] transform"
        >
          📖 View Notes
        </button>
        {/* Only show Upload button for teachers */}
        {userRole === 'teacher' && (
          <button
            onClick={() => onUploadNote(subject)}
            className="bg-white text-emerald-600 border-2 border-emerald-600 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-emerald-600 hover:text-white hover:scale-110 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 min-w-[100px] transform"
          >
            📤 Upload Note
          </button>
        )}
      </div>
    </div>
  </div>
);

// --- Notes Detail View Component ---
const NotesDetailView = ({ subject, onBack }) => {
  const [subjectNotes, setSubjectNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNotes = async () => {
      setLoadingNotes(true);
      setError(null);
      try {
        console.log('Fetching notes for subject:', subject.id); // Debug log
        const notes = await fetchNotesForSubjectAndUser(subject.id);
        console.log('Notes received:', notes); // Debug log
        setSubjectNotes(notes);
      } catch (err) {
        console.error('Error loading notes:', err); // Enhanced debug log
        setError('Failed to load notes. Try again later.');
      }
      setLoadingNotes(false);
    };

    if (subject?.id) {
      loadNotes();
    }
  }, [subject.id]);

  if (error) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-8">
        <button onClick={onBack} className="mb-6 text-blue-600 hover:underline flex items-center font-semibold">
          &larr; Back to Subjects
        </button>
        <div className="text-red-600 p-4">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-8">
      <button onClick={onBack} className="mb-6 text-blue-600 hover:underline flex items-center font-semibold">
        &larr; Back to Subjects
      </button>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">{subject.name} Notes</h2>
      <p className="text-gray-600 mb-6 font-medium">Faculty: {subject.faculty}</p>

      {loadingNotes ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notes...</p>
        </div>
      ) : subjectNotes.length > 0 ? (
        <div className="space-y-4">
          {subjectNotes.map(note => (
            <div key={note._id || note.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">{note.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{note.description || note.topic}</p>
              <p className="text-xs text-gray-400 mt-2">Created: {new Date(note.createdAt).toLocaleDateString()}</p>
              {note.url && (
                <a 
                  href={note.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm mt-2 inline-block bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition duration-200"
                >
                  📖 View Note File
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No notes found for {subject.name}.</p>
        </div>
      )}
    </div>
  );
};

// --- Upload Note Modal Component ---
const UploadNoteModal = ({ subject, isOpen, onClose, onUploadSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    topic: '',
    file: null
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError(null);

    try {
      const uploadData = {
        ...formData,
        subjectName: subject.name
      };

      await uploadNote(uploadData);
      
      // Reset form
      setFormData({ title: '', description: '', topic: '', file: null });
      onUploadSuccess();
      onClose();
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload note. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Upload Note for {subject?.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter note title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Topic
            </label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter topic"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note File *
            </label>
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              required
              accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: PDF, DOC, DOCX, TXT, PPT, PPTX
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                'Upload Note'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Notes Dashboard component
const MyNote = () => {
  const { user } = useAuth(); // Get logged-in user from context
  const [currentView, setCurrentView] = useState('subjectList');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadSubject, setUploadSubject] = useState(null);

  console.log('MyNote component rendered', { user, currentView }); // Debug log

  // Fetch user's subjects from timetable
  useEffect(() => {
    const loadSubjects = async () => {
      if (user && user.class) {
        setLoadingSubjects(true);
        try {
          const className = getUserClass(user);
          console.log('🔍 Loading subjects for class:', className);
          
          const userSubjects = await fetchUserSubjects(className);
          console.log('📚 Fetched subjects:', userSubjects);
          setSubjects(userSubjects);
        } catch (error) {
          console.error('Error fetching subjects:', error);
          setSubjects([]);
        } finally {
          setLoadingSubjects(false);
        }
      }
    };
    
    loadSubjects();
  }, [user]);

  const handleViewNotes = (subject) => {
    console.log('handleViewNotes called with:', subject);
    setSelectedSubject(subject);
    setCurrentView('notesDetail');
  };

  const handleUploadNote = (subject) => {
    // Only allow teachers to upload notes
    if (user?.role !== 'teacher') {
      console.log('Upload not allowed for non-teachers');
      return;
    }
    
    console.log('handleUploadNote called with:', subject);
    setUploadSubject(subject);
    setUploadModalOpen(true);
  };

  const handleUploadSuccess = () => {
    console.log('Note uploaded successfully');
    // If we're currently viewing notes for this subject, we could refresh them
    // For now, we'll just close the modal
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
    setCurrentView('subjectList');
  };

  // Early return for debugging
  if (!user) {
    console.log('No user found, showing loading...');
    return <div className="p-4">Loading user info...</div>;
  }

  if (loadingSubjects) {
    return (
      <div className="bg-white p-8" style={{ minHeight: '400px' }}>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subjects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8" style={{ minHeight: '400px' }}>
      {currentView === 'subjectList' ? (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">My Subjects & Notes</h1>
          </div>
          {subjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subjects.map(subject => (
                <SubjectCard 
                  key={subject.id} 
                  subject={subject} 
                  onViewNotes={handleViewNotes}
                  onUploadNote={handleUploadNote}
                  userRole={user?.role}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No subjects found. Please check your timetable.</p>
            </div>
          )}
        </>
      ) : (
        <NotesDetailView subject={selectedSubject} onBack={handleBackToSubjects} />
      )}
      
      {/* Upload Modal - Only for teachers */}
      {user?.role === 'teacher' && (
        <UploadNoteModal
          subject={uploadSubject}
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
};

export default MyNote;
