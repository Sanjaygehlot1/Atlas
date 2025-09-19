import React, { useState } from 'react';
import { LayoutDashboard, CalendarDays, UserCheck, BookOpen, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getTeacherSchedule, updateLectureStatus, getCompleteTT } from '../../Slices/Timetable';
import { App, Tag, Card as Card1, Button, Dropdown, Menu, Row, Col, Space,Typography } from 'antd'
import MyNoteUI from '../../Components/MyNoteUI.jsx';
import Sidebar from '../../Components/Sidebar.jsx';
import Header from '../../Components/Header.jsx';
import RightPanel from '../../Components/RightPanel.jsx';
import TodaysClasses from '../../Components/TodaysClasses.jsx';
import AttendanceView from '../../Components/AttendanceView.jsx';
import ClassScheduleView from '../../Components/ClassScheduleView.jsx';
import NotificationsView from '../../Components/NotificationsView.jsx';



// Mock data for student attendance view
const studentData = {
    'CMPN - FE 1': [
        { id: 101, name: 'Aarav Sharma', status: 'Pending' },
        { id: 102, name: 'Diya Patel', status: 'Pending' },
        { id: 103, name: 'Rohan Mehta', status: 'Pending' },
        { id: 104, name: 'Priya Singh', status: 'Pending' },
        { id: 105, name: 'Arjun Gupta', status: 'Pending' },
    ],
    'CMPN - SE 1': [
        { id: 201, name: 'Vivaan Joshi', status: 'Pending' },
        { id: 202, name: 'Ishaan Kumar', status: 'Pending' },
        { id: 203, name: 'Saanvi Desai', status: 'Pending' },
        { id: 204, name: 'Kabir Shah', status: 'Pending' },
    ],
    'IT - FE 2': [
        { id: 301, name: 'Myra Iyer', status: 'Pending' },
        { id: 302, name: 'Advik Nair', status: 'Pending' },
    ]
};


export default function Dashboard() {
    const [activeItem, setActiveItem] = useState('Dashboard');
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const renderContent = () => {
        if (activeItem === 'Dashboard') {
            return (
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-6">
                        <TodaysClasses />
                    </div>
                </div>
            );
        }

        if (activeItem.startsWith('Schedule: ')) {
            const [branch, className] = activeItem.replace('Schedule: ', '').split(' - ');
            return <ClassScheduleView data={[branch, className]} />;
        }

        if (activeItem === 'Attendance') {
            return <AttendanceView students={studentData['CMPN - FE 1']} />;
        }

        if (activeItem === 'Assignments') {
            return (
                <div className="text-center py-8 text-gray-500">
                    <h2 className="text-2xl font-bold text-gray-700">Assignments</h2>
                    <p className="mt-2">Assignments feature coming soon.</p>
                </div>
            );
        }

        if (activeItem === 'Announcements') {
            return <NotificationsView />;
        }

        if (activeItem === 'Notes') {
            return <MyNoteUI />;
        }

        if (activeItem === 'Student List') {
            return (
                <div className="text-center py-8 text-gray-500">
                    <h2 className="text-2xl font-bold text-gray-700">Student List</h2>
                    <p className="mt-2">Student data will be loaded from the database.</p>
                </div>
            );
        }

        if (activeItem === 'Settings') {
            return (
                <div className="text-center py-8 text-gray-500">
                    <h2 className="text-2xl font-bold text-gray-700">Settings</h2>
                    <p className="mt-2">Settings page coming soon.</p>
                </div>
            );
        }

        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center p-8 bg-white rounded-xl shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-700">{activeItem}</h2>
                    <p className="mt-2 text-gray-500">Page not found or is under construction.</p>
                </div>
            </div>
        );
    };

    const getHeaderTitle = () => {
        if (activeItem === 'Dashboard') return "Welcome back, Professor!";
        return activeItem;
    };

    const IconWrapper = ({ icon: Icon, className }) => <Icon className={`w-5 h-5 ${className}`} />;

    return (
        <div className="bg-gray-50 min-h-screen flex">
            <div className="hidden md:block">
                <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} onLogout={handleLogout} />
            </div>
            <main className="flex-1 md:ml-64 flex flex-col lg:flex-row">
                <div className="flex-1 flex flex-col">
                    <Header title={getHeaderTitle()} />
                    <div className="p-6 flex-1 overflow-y-auto">{renderContent()}</div>
                </div>
                <div className="hidden lg:block">
                    <RightPanel />
                </div>
            </main>
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 z-30">
                {[
                    { icon: LayoutDashboard, text: 'Dashboard' },
                    { icon: CalendarDays, text: 'Schedule' },
                    { icon: UserCheck, text: 'Attendance' },
                    { icon: BookOpen, text: 'Notes' },
                    { icon: Users, text: 'Students' }
                ].map(item => (
                    <button
                        key={item.text}
                        onClick={() => setActiveItem(item.text)}
                        className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-colors ${
                            activeItem.startsWith(item.text) ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500'
                        }`}
                    >
                        <IconWrapper icon={item.icon} className="w-6 h-6 mb-1" />
                        <span className="text-xs">{item.text}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
