import React, { useState, useEffect } from 'react';
import { LayoutDashboard, CalendarDays, UserCheck, FileText, Megaphone, Users, Settings, LogOut, Search, Bell, Clock, BookOpenCheck, BarChart3, UsersRound, BookCopy, FileClock, MoreVertical, ChevronRight, CheckCircle, XCircle, AlertCircle, PlusCircle } from 'lucide-react';

// --- MOCK DATA ---

const todaysClasses = [
    { time: '09:00 - 10:00', subject: 'Mathematics - Grade 10A', room: 'Room 301', color: 'bg-blue-500' },
    { time: '10:15 - 11:15', subject: 'Physics - Grade 11B', room: 'Lab 2', color: 'bg-purple-500' },
    { time: '13:00 - 14:00', subject: 'Mathematics - Grade 10C', room: 'Room 303', color: 'bg-teal-500' },
];

const assignmentOverview = { pendingGrading: 12, upcomingDue: 5 };
const quickStats = [
    { icon: UsersRound, label: 'Total Students', value: '124', color: 'text-indigo-500' },
    { icon: BookCopy, label: 'Classes Today', value: '3', color: 'text-green-500' },
    { icon: FileClock, label: 'Pending Review', value: '12', color: 'text-orange-500' },
];
const notifications = [
    { type: 'query', text: 'New query from Alex on "Trigonometry"', time: '5m ago' },
    { type: 'notice', text: 'Staff meeting scheduled for 4 PM today.', time: '1h ago' },
    { type: 'exam', text: 'Mid-term exam schedules are published.', time: '3h ago' },
];

// Data for schedules and students
const detailedScheduleData = {
    'CMPN': {
        'FE 1': { 'Monday': [{ time: '09-10', subject: 'Maths-I' }, { time: '10-11', subject: 'Physics' }], 'Tuesday': [], 'Wednesday': [], 'Thursday': [], 'Friday': [] },
        'SE 1': { 'Monday': [{ time: '09-10', subject: 'Maths-III' }, { time: '10-11', subject: 'Data Structures' }], 'Tuesday': [], 'Wednesday': [], 'Thursday': [], 'Friday': [] }
    },
    'IT': {
        'FE 2': { 'Monday': [], 'Tuesday': [], 'Wednesday': [], 'Thursday': [], 'Friday': [] },
        'SE 2': { 'Monday': [], 'Tuesday': [], 'Wednesday': [], 'Thursday': [], 'Friday': [] }
    },
    'ECS': { 'TE 1': { 'Monday': [], 'Tuesday': [], 'Wednesday': [], 'Thursday': [], 'Friday': [] } },
    'EXTC': { 'BE 2': { 'Monday': [], 'Tuesday': [], 'Wednesday': [], 'Thursday': [], 'Friday': [] } },
};

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

const allClassNames = Object.keys(studentData);

// --- HELPER & UI COMPONENTS ---

const IconWrapper = ({ icon: Icon, className }) => <Icon className={`w-5 h-5 ${className}`} />;

const SidebarItem = ({ icon, text, active, onClick, hasSubmenu, isSubmenuOpen }) => (
    <li className={`flex items-center justify-between py-3 px-4 my-1 font-medium rounded-lg cursor-pointer transition-colors group ${active ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800' : 'hover:bg-indigo-50 text-gray-600'}`} onClick={onClick}>
        <div className="flex items-center"><IconWrapper icon={icon} /><span className="ml-3">{text}</span></div>
        {hasSubmenu && <ChevronRight className={`transform transition-transform duration-200 ${isSubmenuOpen ? 'rotate-90' : ''}`} size={16} />}
    </li>
);

const UserProfile = () => (
    <div className="flex items-center gap-3 p-3 border-t border-gray-200">
        <img src="https://placehold.co/40x40/E8E8E8/4a4a4a?text=P" alt="Professor" className="w-10 h-10 rounded-full" />
        <div className="flex-1"><h4 className="font-semibold text-sm text-gray-800">Prof. Eleanor</h4><p className="text-xs text-gray-500">eleanor.v@school.edu</p></div>
        <MoreVertical size={20} className="text-gray-500" />
    </div>
);

const Sidebar = ({ activeItem, setActiveItem }) => {
    const [openMenus, setOpenMenus] = useState({}); // Handles multiple dropdowns

    const toggleMenu = (menu) => {
        setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu], [`${menu}Branch`]: null }));
        if (!openMenus[menu]) setActiveItem(menu);
    };

    const toggleBranch = (menu, branch) => {
        setOpenMenus(prev => ({ ...prev, [`${menu}Branch`]: prev[`${menu}Branch`] === branch ? null : branch }));
        setActiveItem(branch);
    };

    const handleSubItemClick = (menu, branch, subItem) => {
        const activeID = `${menu}: ${branch} - ${subItem}`;
        setActiveItem(activeID);
    };

    const renderSubMenu = (menu, data) => (
        <ul className="pl-6 mt-1 border-l-2 border-indigo-100">
            {Object.keys(data).map(branch => (
                <li key={`${menu}-${branch}`}>
                    <div className={`flex items-center justify-between py-2 px-3 my-1 text-sm font-medium rounded-md cursor-pointer ${activeItem.includes(branch) ? 'text-indigo-700 bg-indigo-50' : 'text-gray-500 hover:bg-gray-100'}`} onClick={() => toggleBranch(menu, branch)}>
                        <span>{branch}</span>
                        <ChevronRight size={14} className={`transform transition-transform duration-200 ${openMenus[`${menu}Branch`] === branch ? 'rotate-90' : ''}`} />
                    </div>
                    {openMenus[`${menu}Branch`] === branch && (
                        <ul className="pl-4 mt-1 border-l-2 border-gray-200">
                            {Object.keys(data[branch]).map(subItem => (
                                <li key={`${menu}-${branch}-${subItem}`} className={`py-1.5 px-3 text-sm rounded-md cursor-pointer ${activeItem.endsWith(`${branch} - ${subItem}`) ? 'text-indigo-700 font-semibold' : 'text-gray-500 hover:text-gray-800'}`} onClick={() => handleSubItemClick(menu, branch, subItem)}>
                                    {subItem}
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    );

    return (
        <aside className="h-screen w-64 bg-white shadow-sm flex flex-col fixed top-0 left-0 z-20">
            <div className="flex items-center gap-2 p-4 border-b border-gray-200"><div className="p-2 bg-indigo-600 rounded-lg"><BookOpenCheck className="w-6 h-6 text-white" /></div><h1 className="text-xl font-bold text-gray-800">Atlas</h1></div>
            <nav className="flex-1 px-3 py-4 overflow-y-auto">
                <ul>
                    <SidebarItem icon={LayoutDashboard} text="Dashboard" active={activeItem === 'Dashboard'} onClick={() => { setActiveItem('Dashboard'); setOpenMenus({}); }} />
                    <SidebarItem icon={CalendarDays} text="Class Schedule" active={activeItem.startsWith('Schedule')} onClick={() => toggleMenu('Schedule')} hasSubmenu={true} isSubmenuOpen={openMenus['Schedule']} />
                    {openMenus['Schedule'] && renderSubMenu('Schedule', detailedScheduleData)}
                    <SidebarItem icon={UserCheck} text="Attendance" active={activeItem.startsWith('Attendance')} onClick={() => toggleMenu('Attendance')} hasSubmenu={true} isSubmenuOpen={openMenus['Attendance']} />
                    {openMenus['Attendance'] && renderSubMenu('Attendance', detailedScheduleData)}
                    <SidebarItem icon={FileText} text="Assignments" active={activeItem === 'Assignments'} onClick={() => { setActiveItem('Assignments'); setOpenMenus({}); }} />
                    <SidebarItem icon={Megaphone} text="Announcements" active={activeItem === 'Announcements'} onClick={() => { setActiveItem('Announcements'); setOpenMenus({}); }} />
                    <SidebarItem icon={Users} text="Student List" active={activeItem === 'Student List'} onClick={() => { setActiveItem('Student List'); setOpenMenus({}); }} />
                </ul>
            </nav>
            <div>
                <ul>
                    <SidebarItem icon={Settings} text="Settings" active={activeItem === 'Settings'} onClick={() => setActiveItem('Settings')} />
                    <SidebarItem icon={LogOut} text="Logout" />
                </ul>
            </div>
            <UserProfile />
        </aside>
    );
};

const Header = ({ title }) => (
    <header className="flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <p className="text-sm text-gray-500">{title === "Welcome back, Professor!" ? "Here's what's happening today." : "Manage your class activities."}</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" /></div>
            <button className="relative p-2 rounded-full hover:bg-gray-100"><Bell size={20} className="text-gray-600" /><span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span></button>
        </div>
    </header>
);

const Card = ({ children, className = '' }) => <div className={`bg-white p-6 rounded-xl shadow-sm ${className}`}>{children}</div>;
const CardTitle = ({ icon: Icon, title }) => <div className="flex items-center gap-3"><div className="p-2 bg-gray-100 rounded-lg"><Icon className="w-5 h-5 text-gray-600" /></div><h3 className="text-lg font-semibold text-gray-800">{title}</h3></div>;

// --- DASHBOARD & GENERIC WIDGETS ---
const TodaysClasses = () => <Card><div className="mb-4"><CardTitle icon={Clock} title="Today's Classes" /></div><div className="space-y-4">{todaysClasses.map((item, index) => <div key={index} className="flex items-center p-3 rounded-lg hover:bg-gray-50"><div className={`w-1.5 h-12 rounded-full ${item.color}`}></div><div className="ml-4 flex-1"><p className="font-semibold text-gray-700">{item.subject}</p><p className="text-sm text-gray-500">{item.time} • {item.room}</p></div><button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 px-3 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100">Mark Attendance</button></div>)}</div></Card>;
const AssignmentOverview = () => <Card><div className="mb-4"><CardTitle icon={BookOpenCheck} title="Assignment Overview" /></div><div className="grid grid-cols-2 gap-4"><div className="p-4 bg-orange-50 rounded-lg text-center"><p className="text-3xl font-bold text-orange-600">{assignmentOverview.pendingGrading}</p><p className="text-sm font-medium text-orange-500">Pending Grading</p></div><div className="p-4 bg-blue-50 rounded-lg text-center"><p className="text-3xl font-bold text-blue-600">{assignmentOverview.upcomingDue}</p><p className="text-sm font-medium text-blue-500">Upcoming Due</p></div></div></Card>;
const RightPanel = () => <aside className="w-80 bg-white shadow-sm p-6 flex-shrink-0"><h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3><div className="space-y-4">{quickStats.map(stat => <div key={stat.label} className="flex items-center p-3 bg-gray-50 rounded-lg"><div className={`p-2 rounded-full bg-white`}><IconWrapper icon={stat.icon} className={stat.color} /></div><div className="ml-3"><p className="text-2xl font-bold text-gray-800">{stat.value}</p><p className="text-xs font-medium text-gray-500">{stat.label}</p></div></div>)}</div><div className="mt-8"><h3 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h3><div className="space-y-3">{notifications.map((notif, index) => <div key={index} className="flex gap-3"><div className="w-10 h-10 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center">{notif.type === 'query' && <UsersRound size={20} className="text-blue-500" />}{notif.type === 'notice' && <Megaphone size={20} className="text-purple-500" />}{notif.type === 'exam' && <CalendarDays size={20} className="text-green-500" />}</div><div><p className="text-sm text-gray-700">{notif.text}</p><p className="text-xs text-gray-400">{notif.time}</p></div></div>)}</div><button className="w-full mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-800">View All</button></div></aside>;

// --- VIEW COMPONENTS ---

const ClassScheduleView = ({ schedule }) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['09-10', '10-11', '11-12', '12-13', '13-14', '14-15', '15-16', '16-17'];
    return <Card className="w-full"><div className="overflow-x-auto"><table className="w-full text-left border-collapse"><thead><tr><th className="p-3 text-sm font-semibold text-gray-500 bg-gray-50 border border-gray-200 rounded-tl-lg">Time</th>{days.map(day => <th key={day} className="p-3 text-sm font-semibold text-gray-500 bg-gray-50 border border-gray-200">{day}</th>)}</tr></thead><tbody>{timeSlots.map(slot => <tr key={slot}><td className="p-3 font-mono text-xs text-gray-600 bg-gray-50 border border-gray-200">{slot.replace('-',':00 - ')}:00</td>{days.map(day => { const lecture = schedule[day]?.find(l => l.time === slot); return <td key={`${day}-${slot}`} className="p-0 border border-gray-200 align-top">{lecture ? <div className="p-3 bg-indigo-50 text-indigo-800 h-full"><p className="font-semibold text-sm">{lecture.subject}</p></div> : <div className="p-3 h-full"></div>}</td>; })}</tr>)}</tbody></table></div></Card>;
};

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
            id: Date.now(), // Using timestamp for a simple unique ID in this mock setup
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
            <Card>
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
                                        <button onClick={() => markAttendance(student.id, 'Present')} className="p-2 rounded-full hover:bg-green-100 text-green-500 disabled:opacity-50" disabled={student.status==='Present'}><CheckCircle size={20} /></button>
                                        <button onClick={() => markAttendance(student.id, 'Absent')} className="p-2 rounded-full hover:bg-red-100 text-red-500 disabled:opacity-50" disabled={student.status==='Absent'}><XCircle size={20} /></button>
                                        <button onClick={() => markAttendance(student.id, 'Late')} className="p-2 rounded-full hover:bg-yellow-100 text-yellow-500 disabled:opacity-50" disabled={student.status==='Late'}><AlertCircle size={20} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

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

const NotificationsView = ({ notifications }) => (
    <div className="w-full p-6 rounded-xl shadow-sm bg-gradient-to-br from-blue-500 to-indigo-600">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Notifications</h3>
            <button className="text-sm font-medium text-white hover:text-indigo-200">View All</button>
        </div>
        <div className="space-y-3">
            {notifications.map((notif, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white/20 rounded-lg">
                    <div className="w-10 h-10 flex-shrink-0 rounded-full bg-white/30 flex items-center justify-center">
                        {notif.type === 'query' && <UsersRound size={20} className="text-white" />}
                        {notif.type === 'notice' && <Megaphone size={20} className="text-white" />}
                        {notif.type === 'exam' && <CalendarDays size={20} className="text-white" />}
                    </div>
                    <div>
                        <p className="text-sm text-white font-medium">{notif.text}</p>
                        <p className="text-xs text-indigo-200">{notif.time}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);


// --- MAIN APP COMPONENT ---

export default function App() {
    const [activeItem, setActiveItem] = useState('Dashboard');

    const renderContent = () => {
        if (activeItem === 'Dashboard') {
            return (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <TodaysClasses />
                    </div>
                    <div className="space-y-6">
                        <AssignmentOverview />
                    </div>
                </div>
            );
        }

        if (activeItem.startsWith('Schedule: ')) {
            const [branch, className] = activeItem.replace('Schedule: ', '').split(' - ');
            const schedule = detailedScheduleData[branch]?.[className];
            if (schedule) return <ClassScheduleView schedule={schedule} />;
        }

        if (activeItem.startsWith('Attendance: ')) {
            const className = activeItem.replace('Attendance: ', '');
            const students = studentData[className];
            if (students) return <AttendanceView students={students} />;
        }
        
        if (activeItem === 'Announcements') {
            return <NotificationsView notifications={notifications} />;
        }

        return <div className="flex items-center justify-center h-full"><div className="text-center p-8 bg-white rounded-xl shadow-sm"><h2 className="text-2xl font-bold text-gray-700">{activeItem}</h2><p className="mt-2 text-gray-500">Page not found or is under construction.</p></div></div>;
    };

    const getHeaderTitle = () => {
        if (activeItem === 'Dashboard') return "Welcome back, Professor!";
        if (activeItem.includes(': ')) return active-item.replace(': ', ' - ');
        return activeItem;
    };

    return (
        <div className="bg-gray-50 min-h-screen flex">
            <div className="hidden md:block"><Sidebar activeItem={activeItem} setActiveItem={setActiveItem} /></div>
            <main className="flex-1 md:ml-64 flex flex-col lg:flex-row">
                <div className="flex-1 flex flex-col">
                    <Header title={getHeaderTitle()} />
                    <div className="p-6 flex-1 overflow-y-auto">{renderContent()}</div>
                </div>
                <div className="hidden lg:block"><RightPanel /></div>
            </main>
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 z-30">{[{ icon: LayoutDashboard, text: 'Dashboard' }, { icon: CalendarDays, text: 'Schedule' }, { icon: UserCheck, text: 'Attendance' }, { icon: Users, text: 'Students' }].map(item => <button key={item.text} onClick={() => setActiveItem(item.text)} className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-colors ${activeItem.startsWith(item.text) ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500'}`}><IconWrapper icon={item.icon} className="w-6 h-6 mb-1"/><span className="text-xs">{item.text}</span></button>)}</div>
        </div>
    );
}
