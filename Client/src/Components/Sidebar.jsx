import React, { useState } from 'react';
import { LayoutDashboard, CalendarDays, UserCheck, FileText, Megaphone, Users, Settings, LogOut, BookOpenCheck, BookOpen, MoreVertical } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const IconWrapper = ({ icon: Icon, className }) => <Icon className={`w-5 h-5 ${className}`} />;

const SidebarItem = ({ icon, text, active, onClick }) => (
    <li className={`flex items-center py-3 px-4 my-1 font-medium rounded-lg cursor-pointer transition-colors group ${active ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800' : 'hover:bg-indigo-50 text-gray-600'}`} onClick={onClick}>
        <IconWrapper icon={icon} />
        <span className="ml-3">{text}</span>
    </li>
);

const UserProfile = () => {
    const { user } = useAuth();
    return (
        <div className="flex items-center gap-3 p-3 border-t border-gray-200">
            <img src={`https://placehold.co/40x40/E8E8E8/4a4a4a?text=${user.name[0]}`} alt="Professor" className="w-10 h-10 rounded-full" />
            <div className="flex-1"><h4 className="font-semibold text-sm text-gray-800">Prof. {user.name}</h4><p className="text-xs text-gray-500">{user.email}</p></div>
            <MoreVertical size={20} className="text-gray-500" />
        </div>
    )
}

const Sidebar = ({ activeItem, setActiveItem }) => {
    const { logout } = useAuth();
    return (
        <aside className="h-screen w-64 bg-white shadow-sm flex flex-col fixed top-0 left-0 z-20">
            <div className="flex items-center gap-2 p-4 border-b border-gray-200">
                <div className="p-2 bg-indigo-600 rounded-lg">
                    <BookOpenCheck className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-800">Atlas</h1>
            </div>
            <nav className="flex-1 px-3 py-4 overflow-y-auto">
                <ul>
                    <SidebarItem icon={LayoutDashboard} text="Dashboard" active={activeItem === 'Dashboard'} onClick={() => setActiveItem('Dashboard')} />
                    <SidebarItem icon={CalendarDays} text="Class Schedule" active={activeItem === 'Schedule'} onClick={() => setActiveItem('Schedule')} />
                    <SidebarItem icon={UserCheck} text="Attendance" active={activeItem === 'Attendance'} onClick={() => setActiveItem('Attendance')} />
                    <SidebarItem icon={FileText} text="Assignments" active={activeItem === 'Assignments'} onClick={() => setActiveItem('Assignments')} />
                    <SidebarItem icon={BookOpen} text="Notes" active={activeItem === 'Notes'} onClick={() => setActiveItem('Notes')} />
                    <SidebarItem icon={Megaphone} text="Announcements" active={activeItem === 'Announcements'} onClick={() => setActiveItem('Announcements')} />
                    <SidebarItem icon={Users} text="Student List" active={activeItem === 'Student List'} onClick={() => setActiveItem('Student List')} />
                </ul>
            </nav>
            <div>
                <ul>
                    <SidebarItem icon={Settings} text="Settings" active={activeItem === 'Settings'} onClick={() => setActiveItem('Settings')} />
                    <SidebarItem icon={LogOut} text="Logout" onClick={() => logout()} />
                </ul>
            </div>
            <UserProfile />
        </aside>
    );
};

export default Sidebar;
