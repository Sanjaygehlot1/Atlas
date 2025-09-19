import React, { useState, useEffect } from 'react';
import { FilePdfOutlined, FileImageOutlined, FileTextOutlined, CloudUploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Button, message, Spin, Empty } from 'antd';
import { fetchNotesForSubjectAndUser } from '../../Slices/notesSlice.js';

const NotesDetailView = ({ subject, onBack, userRole, onUploadNote }) => {
  const [subjectNotes, setSubjectNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNotes = async () => {
      setLoadingNotes(true);
      setError(null);
      try {
        const notes = await fetchNotesForSubjectAndUser(subject.id);
        setSubjectNotes(notes);
      } catch (err) {
        setError('Failed to load notes. Please try again later.');
      } finally {
        setLoadingNotes(false);
      }
    };
    if (subject?.id) {
      loadNotes();
    }
  }, [subject.id]);

  const getFileIcon = (url) => {
    const urlLower = url.toLowerCase();
    if (urlLower.endsWith('.pdf')) return <FilePdfOutlined className="text-red-500 text-3xl" />;
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].some(ext => urlLower.includes(ext))) return <FileImageOutlined className="text-blue-500 text-3xl" />;
    return <FileTextOutlined className="text-gray-500 text-3xl" />;
  };

  const getFilePreviewUrl = (url) => {
    if (url.toLowerCase().endsWith('.pdf')) {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
    }
    return url;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <Button onClick={onBack} icon={<ArrowLeftOutlined />} className="text-blue-600 font-semibold border-none shadow-none">
          Back
        </Button>
        {userRole === 'teacher' && (
          <Button type="primary" onClick={() => onUploadNote(subject)} icon={<CloudUploadOutlined />} className="bg-blue-600 hover:bg-blue-700">
            Upload New Note
          </Button>
        )}
      </div>
      
      <h2 className="text-3xl font-bold text-gray-800 mb-2">{subject.name} Notes</h2>
      <p className="text-gray-600 mb-6">Faculty: {subject.faculty}</p>

      {loadingNotes ? (
        <div className="text-center py-8">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Loading notes...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      ) : subjectNotes.length > 0 ? (
        <div className="space-y-4">
          {subjectNotes.map(note => (
            <div key={note._id || note.id} className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex items-center justify-between transition-shadow hover:shadow-md">
              <div className="flex items-center space-x-4">
                {getFileIcon(note.url)}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{note.title}</h3>
                  <p className="text-sm text-gray-600">{note.topic || note.description}</p>
                </div>
              </div>
              <a
                href={getFilePreviewUrl(note.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-full text-xs hover:bg-blue-700 transition duration-200"
              >
                View
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <Empty description={<span className="text-lg">No notes found for this subject.</span>} />
        </div>
      )}
    </div>
  );
};

export default NotesDetailView;