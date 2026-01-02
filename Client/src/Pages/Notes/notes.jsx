import React, { useState, useEffect } from 'react';
import { fetchUserSubjects } from '../../Slices/subjectsSlice.js';
import { useAuth } from '../../context/AuthContext.jsx';
import getUserClass from '../../Helper/getClass.js';

// Import UI components
import SubjectCard from '../Notes/subjectCard.jsx';
import NotesDetailView from '../Notes/notesDetailView.jsx';
import UploadNoteModal from '../Notes/uploadNotesModal.jsx';

const MyNote = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('subjectList');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadSubject, setUploadSubject] = useState(null);

  useEffect(() => {
    const loadSubjects = async () => {
      if (user && user.class) {
        setLoadingSubjects(true);
        try {
          const className = getUserClass(user);
          console.log(className)
          const userSubjects = await fetchUserSubjects(className);
          console.log(userSubjects)
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
    setSelectedSubject(subject);
    setCurrentView('notesDetail');
  };

  const handleUploadNote = (subject) => {
    if (user?.role !== 'teacher') return;
    setUploadSubject(subject);
    setUploadModalOpen(true);
  };

  const handleUploadSuccess = () => {
    // Logic to refresh notes list or simply close modal
    setUploadModalOpen(false);
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
    setCurrentView('subjectList');
  };

  if (loadingSubjects) {
    return (
      <div className="bg-white p-8 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subjects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-6 min-h-screen">
      {currentView === 'subjectList' ? (
        <>
          <h1 className="text-4xl font-bold text-gray-800 mb-6">My Subjects</h1>
          {subjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg">No subjects found. Please check your timetable.</p>
            </div>
          )}
        </>
      ) : (
        <NotesDetailView
          subject={selectedSubject}
          onBack={handleBackToSubjects}
          userRole={user?.role}
          onUploadNote={handleUploadNote}
        />
      )}

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