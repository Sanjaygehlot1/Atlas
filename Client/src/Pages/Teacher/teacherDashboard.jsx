import React, { useState, useEffect } from 'react';
import { LayoutDashboard, CalendarDays, UserCheck, FileText, Megaphone, Users, Settings, LogOut, Search, Bell, Clock, BookOpenCheck, MoreVertical, BookOpen, BookCopy, FileClock, UsersRound, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getTeacherSchedule, updateLectureStatus, getCompleteTT } from '../../Slices/Timetable';
import { App, Tag, Card as Card1, Button, Dropdown, Menu, Row, Col, Space,Typography } from 'antd'
import MyNoteUI from '../../Components/MyNoteUI.jsx';

const { Text } = Typography;
import { UserSwitchOutlined, SwapOutlined, CompressOutlined,  } from '@ant-design/icons';
import ChangeVenueModal from '../../Components/changeVenue.jsx';
import { useNavigate } from 'react-router';




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




// --- HELPER & UI COMPONENTS ---

const IconWrapper = ({ icon: Icon, className }) => <Icon className={`w-5 h-5 ${className}`} />;

const SidebarItem = ({ icon, text, active, onClick }) => (
    <li className={`flex items-center py-3 px-4 my-1 font-medium rounded-lg cursor-pointer transition-colors group ${active ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800' : 'hover:bg-indigo-50 text-gray-600'}`} onClick={onClick}>
        <IconWrapper icon={icon} />
        <span className="ml-3">{text}</span>
    </li>
);

const UserProfile = () => {

    const { user } = useAuth();
    console.log(user)


    return (
        <div className="flex items-center gap-3 p-3 border-t border-gray-200">
            <img src={`https://placehold.co/40x40/E8E8E8/4a4a4a?text=${user.name[0]}`} alt="Professor" className="w-10 h-10 rounded-full" />
            <div className="flex-1"><h4 className="font-semibold text-sm text-gray-800">Prof. {user.name}</h4><p className="text-xs text-gray-500">{user.email}</p></div>
            <MoreVertical size={20} className="text-gray-500" />
        </div>
    )
}

const Sidebar = ({ activeItem, setActiveItem }) => {
    const [openMenus, setOpenMenus] = useState({});
    const { logout } = useAuth() // Handles multiple dropdowns

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




const TodaysClasses = () => {

    const { user } = useAuth();
    const { message } = App.useApp();
    const [todaysClasses, setTodaysClasses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLecture, setSelectedLecture] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        if (todaysClasses.length === 0) {
            const getTodaysClasses = async () => {

                try {
                    const response = await getTeacherSchedule(user?._id);
                    setTodaysClasses(response);
                    console.log(response);
                } catch (error) {
                    message.error("Failed to load today's classes.");
                }
            }

            getTodaysClasses();
        }
    }, [user, todaysClasses])



    const handleOpenChangeVenueModal = (lecture) => {
        setSelectedLecture(lecture);
        console.log(lecture) // 1. Set the lecture you want to edit
        setIsModalOpen(true);       // 2. Open the modal
    };

    const markStudentAttendance = (lecture) => {
        navigate('/teacher/mark-attendance')

    }


    const updateStatus = async (lecture, status, updatedRoom) => {
        try {
            if (lecture && status) {
                console.log("Updating lecture:", lecture._id, "to status:", status, "with new room:", updatedRoom);
                console.log(lecture)
                const response = await updateLectureStatus(lecture._id, status, updatedRoom);
                console.log(lecture, status, updatedRoom)
                console.log(response)
                const res = await getTeacherSchedule(user?._id);
                setTodaysClasses(res);

                if (status === "Venue_Changed") {
                    message.success(`${lecture.subjectName} lecture has been shifted to ${updatedRoom} for today.`);
                } else {
                    message.success(`${lecture.subjectName} lecture has been ${status.toLowerCase()} for today.`);
                }
            }
        } catch (error) {
            message.error("Failed to cancel the lecture.");
        }

    }


    return (
        <Card1
            title={<Space><Clock size={18} /> Today's Classes</Space>}
            bordered
            style={{ width: '100%' }}
        >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {todaysClasses.map((item, index) => {

                    const handleChangeVenueClick = () => {
                        setIsModalOpen(true);
                    };

                    const handleVenueSubmit = (updatedRoom) => {
                        setIsModalOpen(false);
                        updateStatus(selectedLecture, "Venue_Changed", updatedRoom);
                        console.log("Changing room to:", updatedRoom, "for lecture:", selectedLecture._id);

                    };
                    return (
                        <Card1
                            key={index}
                            size="small"
                            bordered
                            hoverable
                            style={{ width: '100%' }}
                            bodyStyle={{ padding: '16px' }}
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">

                                {/* LEFT: Lecture Info */}
                                <div className="text-left w-full md:w-auto">
                                    {/* Subject Name */}
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                                        <strong className="text-base md:text-lg text-gray-800">
                                            {item.subjectName}
                                        </strong>
                                        <span className="text-sm md:text-base text-gray-600">|</span>
                                        <span className="bg-gray-200 text-gray-800 text-sm md:text-base px-2 py-1 rounded-xl">
                                            {item.class}
                                        </span>

                                    </div>



                                    {/* Status Tag */}
                                    <div className="mt-1">
                                        {item.status === 'Cancelled' ? (
                                            <Tag className="inline-flex items-center gap-1" icon={<span ><XCircle size={15} /></span>} color="error">
                                                Cancelled
                                            </Tag>
                                        ) : item.status === 'Teacher_Absent' ? (
                                            <Tag icon={<UserSwitchOutlined />} color="warning">Teacher Absent</Tag>
                                        ) : item.status === 'Rescheduled' ? (
                                            <Tag className="inline-flex items-center gap-1" icon={<Clock size={14} />} color="cyan">Rescheduled</Tag>
                                        ) : item.status === 'Replaced' ? (
                                            <Tag icon={<SwapOutlined />} color="purple">Replaced</Tag>
                                        ) : (item.status === 'Venue_Changed' && item.updatedRoom !== item.rooms[0]?.roomCode) ? (
                                            <Tag icon={<SwapOutlined />} color="purple">Venue Changed</Tag>
                                        ) : (
                                            <Tag className="inline-flex items-center gap-1" icon={<CheckCircle size={14} />} color="success">Scheduled</Tag>
                                        )}
                                    </div>

                                    {/* Time Slot */}
                                    <span className="text-sm text-gray-500 block">
                                        {item.timeSlot.label}
                                    </span>

                                    {/* Room / Lab Info */}
                                    {item.lectureType === 'Theory' ? 'Room :' : 'Lab :'}
                                    <span style={{ textDecoration: (item.status === 'Venue_Changed' && item.updatedRoom !== item.rooms[0]?.roomCode) ? 'line-through' : 'none', marginRight: item.status === 'Venue_Changed' ? '8px' : '0' }}>

                                        {`  ${item.rooms[0]?.roomCode || 'N/A'}`}
                                    </span>
                                    {(item.status === 'Venue_Changed' && item.updatedRoom !== item.rooms[0]?.roomCode) && <Text strong>{item.updatedRoom}</Text>}

                                </div>


                                {/* RIGHT: Buttons Row */}
                                <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                                    <Button type="primary" onClick={() => markStudentAttendance(item)}>
                                        Mark Attendance
                                    </Button>

                                    <Dropdown
                                        overlay={
                                            <Menu>
                                                <Menu.Item key="1" onClick={() => updateStatus(item, item.status === 'Cancelled' ? 'Scheduled' : 'Cancelled')}>
                                                    {item.status === 'Cancelled' ? "Live Lecture" : "Cancel Lecture"}
                                                </Menu.Item>
                                                <Menu.Item key="2" onClick={() => handleOpenChangeVenueModal(item)}>
                                                    Change Venue
                                                </Menu.Item>
                                            </Menu>
                                        }
                                        trigger={['click']}
                                    >
                                        <Button icon={<MoreVertical size={16} />}>Manage</Button>
                                    </Dropdown>
                                    <ChangeVenueModal
                                        open={isModalOpen}
                                        onCancel={() => {
                                            setIsModalOpen(false);
                                            setSelectedLecture(null);
                                        }}
                                        onSubmit={handleVenueSubmit}
                                        currentRoom={selectedLecture?.rooms[0]?.roomCode}
                                    />

                                    <Button
                                        icon={<Megaphone size={16} />}
                                        onClick={() => console.log('Notify', item)}
                                    >
                                        Notify Students
                                    </Button>
                                </div>
                            </div>
                        </Card1>
                    )
                })
                }
            </Space >
        </Card1 >


    )
}

const RightPanel = () => <aside className="w-80 bg-white shadow-sm p-6 flex-shrink-0">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
    <div className="space-y-4">
        <div className="text-center py-8 text-gray-500">
            <p>Statistics will be loaded from the database.</p>
        </div>
    </div>
    <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h3>
        <div className="text-center py-8 text-gray-500">
            <p>No notifications at this time.</p>
        </div>
    </div>
</aside>;







const ClassScheduleView = ({ data }) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const [filteredSchedule, setFilteredSchedule] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);

    const normalize = str => str?.trim().toLowerCase();

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const res = await getCompleteTT();
                const rawData = res.data;

               
                const [department, classLabel] = data;
                const targetYear = `${classLabel.split(" ")[0]} ${department} ${classLabel.split(" ")[1]} `;
                console.log(targetYear) 

                const filtered = rawData.filter(item =>
                    normalize(item.year)?.includes(normalize(classLabel)) &&
                    normalize(item.year)?.includes(normalize(department))
                );

                setFilteredSchedule(filtered);

                const slotSet = new Set();
                filtered.forEach(item => {
                    const time = normalize(item.timeSlot?.label);
                    if (time) slotSet.add(time);
                });

                const sortedSlots = Array.from(slotSet).sort();
                setTimeSlots(sortedSlots);
            } catch (err) {
                console.error(err);
            }
        };

        fetchSchedule();
    }, [data]);

    return (
        <Card className="w-full">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="p-3 text-sm font-semibold text-gray-500 bg-gray-50 border border-gray-200 rounded-tl-lg">
                                Time
                            </th>
                            {days.map(day => (
                                <th key={day} className="p-3 text-sm font-semibold text-gray-500 bg-gray-50 border border-gray-200">
                                    {day}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {timeSlots.map(time => (
                            <tr key={time}>
                                <td className="p-3 font-mono text-xs text-gray-600 bg-gray-50 border border-gray-200">
                                    {time}
                                </td>
                                {days.map(day => {
                                    const lecture = filteredSchedule.find(
                                        lec =>
                                            normalize(lec.timeSlot?.label) === time &&
                                            lec.day === day
                                    );

                                    return (
                                        <td key={`${day}-${time}`} className="p-0 border border-gray-200 align-top">
                                            {lecture ? (
                                                <div className="p-3 bg-indigo-50 text-indigo-800 h-full">
                                                    <p className="font-semibold text-sm">{lecture.subjectName}</p>
                                                    <p className="text-xs text-gray-500">{lecture.lectureType}</p>
                                                    <p className="text-xs">{lecture.faculty?.[0]?.name || 'TBD'}</p>
                                                    <p className="text-[10px] text-gray-400">
                                                        {lecture.rooms?.[0]?.roomCode?.[0] || 'Room N/A'}
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="p-3 h-full" />
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
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
                                        <button onClick={() => markAttendance(student.id, 'Present')} className="p-2 rounded-full hover:bg-green-100 text-green-500 disabled:opacity-50" disabled={student.status === 'Present'}><CheckCircle size={20} /></button>
                                        <button onClick={() => markAttendance(student.id, 'Absent')} className="p-2 rounded-full hover:bg-red-100 text-red-500 disabled:opacity-50" disabled={student.status === 'Absent'}><XCircle size={20} /></button>
                                        <button onClick={() => markAttendance(student.id, 'Late')} className="p-2 rounded-full hover:bg-yellow-100 text-yellow-500 disabled:opacity-50" disabled={student.status === 'Late'}><AlertCircle size={20} /></button>
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
        </div>
        <div className="text-center py-8 text-white">
            <p>No notifications at this time.</p>
        </div>
    </div>
);


// --- MAIN APP COMPONENT ---

export default function Dashboard() {
    const [activeItem, setActiveItem] = useState('Dashboard');
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            // Redirect will be handled by the PrivateRoute component
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

        // if (activeItem === 'Schedule') {
        //     return (
        //         <div className="text-center py-8 text-gray-500">
        //             <h2 className="text-2xl font-bold text-gray-700">Class Schedule</h2>
        //             <p className="mt-2">Schedule data will be loaded from the database.</p>
        //         </div>
        //     );
        // }

        if (activeItem.startsWith('Schedule: ')) {
            const [branch, className] = activeItem.replace('Schedule: ', '').split(' - ');
            console.log(activeItem,branch,className)
            return <ClassScheduleView data={[branch , className ]} />;
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

        return <div className="flex items-center justify-center h-full"><div className="text-center p-8 bg-white rounded-xl shadow-sm"><h2 className="text-2xl font-bold text-gray-700">{activeItem}</h2><p className="mt-2 text-gray-500">Page not found or is under construction.</p></div></div>;
    };

    const getHeaderTitle = () => {
        if (activeItem === 'Dashboard') return "Welcome back, Professor!";

    };

    return (
        <div className="bg-gray-50 min-h-screen flex">
            <div className="hidden md:block"><Sidebar activeItem={activeItem} setActiveItem={setActiveItem} onLogout={handleLogout} /></div>
            <main className="flex-1 md:ml-64 flex flex-col lg:flex-row">
                <div className="flex-1 flex flex-col">
                    <Header title={getHeaderTitle()} />
                    <div className="p-6 flex-1 overflow-y-auto">{renderContent()}</div>
                </div>
                <div className="hidden lg:block"><RightPanel /></div>
            </main>
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 z-30">{[{ icon: LayoutDashboard, text: 'Dashboard' }, { icon: CalendarDays, text: 'Schedule' }, { icon: UserCheck, text: 'Attendance' }, { icon: BookOpen, text: 'Notes' }, { icon: Users, text: 'Students' }].map(item => <button key={item.text} onClick={() => setActiveItem(item.text)} className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-colors ${activeItem.startsWith(item.text) ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500'}`}><IconWrapper icon={item.icon} className="w-6 h-6 mb-1" /><span className="text-xs">{item.text}</span></button>)}</div>
        </div>
    );
}
