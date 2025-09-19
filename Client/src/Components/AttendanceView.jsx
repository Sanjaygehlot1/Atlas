import React, { useState, useEffect } from 'react';
import { CardComponent, CardTitle } from './DashboardUIHelpers.jsx';
import { UserCheck, CheckCircle, XCircle, AlertCircle, PlusCircle } from 'lucide-react';

const AttendanceView = ({ students: initialStudents }) => {
    const [students, setStudents] = useState(initialStudents);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newStudentName, setNewStudentName] = useState('');

    const markAttendance = (studentId, status) => {
        setStudents(students.map(student => student.id === studentId ? { ...student, status } : student));
    };

    const handleAddStudent = (e) => {
        e.preventDefault();
        if (newStudentName.trim() === '') return;
        const newStudent = {
            id: Date.now(),
            name: newStudentName.trim(),
            status: 'Pending'
        };
        setStudents([...students, newStudent]);
        setNewStudentName('');
        setIsModalOpen(false);
    };

    const statusStyles = {
        Present: 'bg-green-100 text-green-800',
        Absent: 'bg-red-100 text-red-800',
        Late: 'bg-yellow-100 text-yellow-800',
        Pending: 'bg-gray-100 text-gray-800',
    };

    return (
        <>
            <CardComponent>
                <div className="flex justify-between items-center mb-4">
                    <CardTitle icon={UserCheck} title="Mark Attendance" />
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                        <PlusCircle size={18} />
                        Add Student
                    </button>
                </div>
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th></tr></thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {students.map(student => (
                                <tr key={student.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[student.status]}`}>{student.status}</span></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button onClick={() => markAttendance(student.id, 'Present')} className="p-2 rounded-full hover:bg-green-100 text-green-500 disabled:opacity-50" disabled={student.status === 'Present'}><CheckCircle size={20} /></button>
                                        <button onClick={() => markAttendance(student.id, 'Absent')} className="p-2 rounded-full hover:bg-red-100 text-red-500 disabled:opacity-50" disabled={student.status === 'Absent'}><XCircle size={20} /></button>
                                        <button onClick={() => markAttendance(student.id, 'Late')} className="p-2 rounded-full hover:bg-yellow-100 text-yellow-500 disabled:opacity-50" disabled={student.status === 'Late'}><AlertCircle size={20} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardComponent>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4 text-gray-900">Add New Student</h3>
                        <form onSubmit={handleAddStudent}>
                            <div>
                                <label htmlFor="studentName" className="block text-sm font-medium text-gray-700">Student Name</label>
                                <input
                                    type="text"
                                    id="studentName"
                                    value={newStudentName}
                                    onChange={(e) => setNewStudentName(e.target.value)}
                                    placeholder="Enter full name"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    autoFocus
                                />
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">Save Student</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AttendanceView;
