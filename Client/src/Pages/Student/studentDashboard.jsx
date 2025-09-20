import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layout, App, Drawer, Tooltip } from 'antd';
import { UserOutlined, MenuOutlined, BellOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { fetchTimeTable } from '../../Slices/Timetable';
import getUserClass from '../../Helper/getClass';

// Import modular components
import AppLogo from './Components/appLogo';
import SiderMenu from './Components/sideMenu';
import DashboardContent from './Components/dashboardContent';
import ProfileModal from './Components/profileModal';
import NotificationModal from './Components/notificationModal';
import { useSocket } from '../../context/socketContext';


const { Header, Sider, Content } = Layout;

const attendanceData = [{ name: 'Present', value: 85, color: '#52c41a' }, { name: 'Absent', value: 15, color: '#ff4d4f' }];
const weeklyPerformanceData = [
    { day: 'Mon', attendance: 95, assignments: 80 }, { day: 'Tue', attendance: 90, assignments: 85 },
    { day: 'Wed', attendance: 85, assignments: 90 }, { day: 'Thu', attendance: 88, assignments: 75 },
    { day: 'Fri', attendance: 92, assignments: 95 },
];
const quickStats = { overallAttendance: 85, upcomingAssignments: 3, subjectsEnrolled: 5, completedAssignments: 12 };
const recentAnnouncements = [
    { id: 1, title: 'Mid-term exam schedule released', date: '2025-07-28', priority: 'high', category: 'Exam' },
    { id: 2, title: 'Guest lecture on AI/ML on Friday', date: '2025-07-27', priority: 'medium', category: 'Event' },
    { id: 3, title: 'Library extended hours during finals', date: '2025-07-26', priority: 'low', category: 'Facility' }
];

const StudentDashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
    const [todaysTimetable, setTodaysTimetable] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
    const [isNotificationModalVisible, setisNotificationModalVisible] = useState(false)

    const { lectureUpdate } = useSocket();

    const { user, logout } = useAuth();
    const { message } = App.useApp();
    const navigate = useNavigate();
    const location = useLocation();

    const getSelectedKey = () => {
        const path = location.pathname;
        if (path.includes('mynote')) return '3';
        if (path.includes('full-timetable')) return '2';
        return '1';
    };

    useEffect(() => {
        const loadDashboardData = async () => {
            if (user && user.class) {
                const className = getUserClass(user);
                setIsLoading(true);
                try {
                    const response = await fetchTimeTable(className);
                    setTodaysTimetable(response);
                } catch (error) {
                    console.error('Error fetching timetable:', error);
                    message.error('Failed to load timetable.');
                } finally {
                    setIsLoading(false);
                }
            } else if (user) {
                setIsLoading(false);
            }
        };
        loadDashboardData();
    }, [user, message]);

    useEffect(() => {



        if (lectureUpdate) {
            setTodaysTimetable((prev) =>
                prev.map((lecture) =>
                    lecture._id === lectureUpdate.lectureId
                        ? { ...lecture, status: lectureUpdate.status, updatedRoom: lectureUpdate.newVenue }
                        : lecture
                )
            );

            
        }

    }, [lectureUpdate])

    console.log(todaysTimetable)

    const today = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    }).format(new Date());

    const handleLogout = async () => {
        try {
            await logout();
            message.success('Logged out successfully');
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            message.error('Logout failed');
        }
    };

    const handleMenuClick = (e) => {
        switch (e.key) {
            case '1':
                navigate('/student/dashboard');
                break;
            case '2':
                navigate('/student/dashboard/full-timetable');
                break;
            case '3':
                navigate('/student/dashboard/mynote');
                break;
            case '6':
                handleLogout();
                break;
            default:
                break;
        }
    };

    const toggleSidebar = () => setCollapsed(!collapsed);
    const toggleMobileDrawer = () => setMobileDrawerVisible(!mobileDrawerVisible);
    const showProfileModal = () => setIsProfileModalVisible(true);
    const hideProfileModal = () => setIsProfileModalVisible(false);

    return (
        <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={toggleSidebar}
                breakpoint="lg"
                collapsedWidth="80"
                style={{
                    position: 'sticky',
                    top: 0,
                    height: '100vh',
                    background: '#ffffff',
                    boxShadow: '4px 0 20px rgba(0, 0, 0, 0.05)'
                }}
                className="hide-on-mobile"
            >
                <AppLogo collapsed={collapsed} />
                <SiderMenu selectedKey={getSelectedKey()} handleMenuClick={handleMenuClick} />
            </Sider>

            <Drawer
                title={<AppLogo collapsed={false} />}
                placement="left"
                onClose={toggleMobileDrawer}
                open={mobileDrawerVisible}
                className="show-on-mobile"
                bodyStyle={{ padding: 0, background: '#ffffff' }}
                headerStyle={{ background: '#ffffff', borderBottom: '1px solid #f0f0f0' }}
            >
                <SiderMenu selectedKey={getSelectedKey()} handleMenuClick={handleMenuClick} />
            </Drawer>

            <Layout>
                <Header style={{ background: 'white', padding: 0, paddingLeft: 24, paddingRight: 24, borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '24px', margin: '16px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)' }}>
                    <div className="flex items-center space-x-4">
                        <button className="lg:hidden text-gray-600 focus:outline-none" onClick={toggleMobileDrawer} aria-label="Open menu">
                            <MenuOutlined className="text-xl" />
                        </button>
                        <div className="hidden lg:block">
                            <h4 className="text-lg font-semibold text-gray-800">Student Dashboard</h4>
                            <p className="text-sm text-gray-500">Welcome back, {user?.name}!</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <Tooltip title="Notifications">
                                <button className="text-gray-600 hover:text-blue-500 transition-colors focus:outline-none relative" aria-label="Notifications">
                                    <BellOutlined className="text-xl" onClick={()=> setisNotificationModalVisible(true)} />
                                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                    </span>
                                </button>
                            </Tooltip>
                        </div>
                        <div className="flex items-center space-x-3 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors"
                            onClick={() => setIsProfileModalVisible(true)}>
                            <div className="relative w-10 h-10 flex-shrink-0">
                                {user?.picture ? (
                                    <img src={user.picture} alt="User Avatar" className="w-full h-full rounded-full border-2 border-white shadow-sm object-cover" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                                        <UserOutlined className="text-xl" />
                                    </div>
                                )}
                            </div>
                            <div className="hidden md:block text-sm text-gray-800 font-medium">
                                {user?.name || 'Student'}
                            </div>
                        </div>
                    </div>
                </Header>
                <Content style={{ padding: '24px', background: 'linear-gradient(135deg, #f0f2f5 0%, #e6f7ff 100%)', minHeight: 'calc(100vh - 96px)' }}>
                    {location.pathname === '/student/dashboard' ? (
                        <DashboardContent
                            isLoading={isLoading}
                            todaysTimetable={todaysTimetable}
                            today={today}
                            quickStats={quickStats}
                            attendanceData={attendanceData}
                            weeklyPerformanceData={weeklyPerformanceData}
                            recentAnnouncements={recentAnnouncements}
                        />
                    ) : (
                        <Outlet />
                    )}
                </Content>
            </Layout>

            <ProfileModal
                isVisible={isProfileModalVisible}
                onClose={hideProfileModal}
                user={user}
            />
            
        </Layout>
    );
};

export default StudentDashboard;