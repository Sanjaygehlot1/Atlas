import React, { useState, useEffect } from 'react';
import { LayoutDashboard, CalendarDays, UserCheck, FileText, Megaphone, Users, Settings, LogOut, Search, Bell, Clock, BookOpenCheck, MoreVertical, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getTeacherSchedule, updateLectureStatus } from '../../Slices/Timetable';
import { App, Switch, Tag, Card as Card1, Button, Dropdown, Menu, Row, Col, Space } from 'antd'
import MyNoteUI from '../../Components/MyNoteUI.jsx';
import { UserSwitchOutlined, SwapOutlined, CompressOutlined } from '@ant-design/icons';
import ChangeVenueModal from '../../Components/changeVenue.jsx';


// --- HELPER & UI COMPONENTS ---

const IconWrapper = ({ icon: Icon, className }) => <Icon className={`w-5 h-5 ${className}`} />;

const SidebarItem = ({ icon, text, active, onClick }) => (
    <li className={`flex items-center py-3 px-4 my-1 font-medium rounded-lg cursor-pointer transition-colors group ${active ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800' : 'hover:bg-indigo-50 text-gray-600'}`} onClick={onClick}>
        <IconWrapper icon={icon} />
        <span className="ml-3">{text}</span>
    </li>
);

const UserProfile = () => (
    <div className="flex items-center gap-3 p-3 border-t border-gray-200">
        <img src="https://placehold.co/40x40/E8E8E8/4a4a4a?text=P" alt="Professor" className="w-10 h-10 rounded-full" />
        <div className="flex-1"><h4 className="font-semibold text-sm text-gray-800">Prof. Eleanor</h4><p className="text-xs text-gray-500">eleanor.v@school.edu</p></div>
        <MoreVertical size={20} className="text-gray-500" />
    </div>
);

const Sidebar = ({ activeItem, setActiveItem, onLogout }) => {
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
                    <SidebarItem icon={LogOut} text="Logout" onClick={onLogout} />
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


const ManageMenu = ({ onCancel, onVenueChange }) => (
    <Menu>
        <Menu.Item key="1" onClick={onCancel}>
            Cancel Lecture
        </Menu.Item>
        <Menu.Item key="2" onClick={onVenueChange}>
            Change Venue
        </Menu.Item>
    </Menu>
);

const TodaysClasses = () => {

    const { user } = useAuth();
    const { message } = App.useApp();
    const [todaysClasses, setTodaysClasses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    

    useEffect(() => {
        if (todaysClasses.length === 0) {
            const getTodaysClasses = async () => {
                try {
                    const response = await getTeacherSchedule("68860d94cf2bfd5edb077450");
                    setTodaysClasses(response);
                    console.log(response);
                } catch (error) {
                    message.error("Failed to load today's classes.");
                }
            }

            getTodaysClasses();
        }
    }, [user, todaysClasses])

    const handleChangeVenueClick = () => {
        setIsModalOpen(true);
        console.log(isModalOpen)
    };


    const updateStatus = async (lecture, status, updatedRoom) => {
        try {
            if (lecture && status) {
                console.log(lecture)
                const response = await updateLectureStatus(lecture._id, status,updatedRoom);
                console.log(response)
                if (status === "Venue_Changed") {
                    message.success(`${lecture.subjectName} lecture has been shifted to ${response.updatedRoom} for today.`);
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
                        updateStatus(item, "Venue_Changed", updatedRoom);
                        console.log("Changing room to:", updatedRoom, "for lecture:", item._id);
                        message.success(`Lecture room changed to ${updatedRoom}`);
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
                                    <strong className="text-base md:text-lg block text-gray-800">
                                        {item.subjectName}
                                    </strong>

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
                                        ) : item.status === 'Venue_Changed' ? (
                                            <Tag icon={<SwapOutlined />} color="purple">Venue Changed</Tag>
                                        ) : (
                                            <Tag icon={<CheckCircle size={14} />} color="success">Scheduled</Tag>
                                        )}
                                    </div>

                                    {/* Time Slot */}
                                    <span className="text-sm text-gray-500 block">
                                        {item.timeSlot.label}
                                    </span>

                                    {/* Room / Lab Info */}
                                    <span className="text-sm text-gray-500 block">
                                        {item.lectureType === 'Theory' ? 'Room No.' : 'Lab No.'}: {item.updatedRoom || item.rooms[0]?.roomCode || 'Room TBD'}
                                    </span>
                                </div>


                                {/* RIGHT: Buttons Row */}
                                <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                                    <Button type="primary">
                                        Mark Attendance
                                    </Button>

                                    <Dropdown
                                        overlay={
                                            <Menu>
                                                <Menu.Item key="1" onClick={() => updateStatus(item, "Cancelled")}>
                                                    Cancel Lecture
                                                </Menu.Item>
                                                <Menu.Item key="2" onClick={() => handleChangeVenueClick()}>
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
                                        onCancel={() => setIsModalOpen(false)}
                                        onSubmit={(newRoom) => handleVenueSubmit(newRoom)}  // ✅ newRoom is defined here
                                        currentRoom={item.rooms[0]?.roomCode}
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

// --- VIEW COMPONENTS ---

const NotificationsView = () => (
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

        if (activeItem === 'Schedule') {
            return (
                <div className="text-center py-8 text-gray-500">
                    <h2 className="text-2xl font-bold text-gray-700">Class Schedule</h2>
                    <p className="mt-2">Schedule data will be loaded from the database.</p>
                </div>
            );
        }

        if (activeItem === 'Attendance') {
            return (
                <div className="text-center py-8 text-gray-500">
                    <h2 className="text-2xl font-bold text-gray-700">Attendance</h2>
                    <p className="mt-2">Attendance data will be loaded from the database.</p>
                </div>
            );
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
        if (activeItem.includes(': ')) return active - item.replace(': ', ' - ');
        return activeItem;
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
