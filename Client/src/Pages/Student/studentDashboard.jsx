import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {
    Layout,
    Menu,
    Typography,
    Row,
    Col,
    Card,
    Timeline,
    Statistic,
    Avatar,
    Badge,
    List,
    Button,
    Drawer,
    Space,
    Spin,
    App,
    Tag,
    Modal,
    Descriptions,
    Empty,
    Progress,
    Tooltip,
    theme,
    
} from 'antd';
import {
    AppstoreOutlined,
    CalendarOutlined,
    BookOutlined,
    UserOutlined,
    BellOutlined,
    SettingOutlined,
    LogoutOutlined,
    MenuOutlined,
    ClockCircleOutlined,
    TrophyOutlined,
    FileTextOutlined,
    CalendarFilled,
    AccountBookOutlined,
    EditOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { BookOpenCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchTimeTable } from '../../Slices/Timetable';
import getUserClass from '../../Helper/getClass';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

// Enhanced data with more comprehensive information
const attendanceData = [
    { name: 'Present', value: 85, color: '#52c41a' },
    { name: 'Absent', value: 15, color: '#ff4d4f' }
];

const weeklyPerformanceData = [
    { day: 'Mon', attendance: 95, assignments: 80 },
    { day: 'Tue', attendance: 90, assignments: 85 },
    { day: 'Wed', attendance: 85, assignments: 90 },
    { day: 'Thu', attendance: 88, assignments: 75 },
    { day: 'Fri', attendance: 92, assignments: 95 },
];

const quickStats = {
    overallAttendance: 85,
    upcomingAssignments: 3,
    subjectsEnrolled: 5,
    completedAssignments: 12
};

const recentAnnouncements = [
    {
        id: 1,
        title: 'Mid-term exam schedule released',
        date: '2025-07-28',
        priority: 'high',
        category: 'Exam'
    },
    {
        id: 2,
        title: 'Guest lecture on AI/ML on Friday',
        date: '2025-07-27',
        priority: 'medium',
        category: 'Event'
    },
    {
        id: 3,
        title: 'Library extended hours during finals',
        date: '2025-07-26',
        priority: 'low',
        category: 'Facility'
    }
];

const parseTime = (timeStr) => {
    if (!timeStr) return new Date(0);
    const now = new Date();
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
};

const getLiveStatus = (timeSlotLabel) => {
    const now = new Date();
    const [startTimeStr, endTimeStr] = timeSlotLabel.split(' - ').map(s => s.trim());

    // Function to parse time strings like "9:05 am" or "10:05 AM"
    const parseTime = (timeStr) => {
        if (!timeStr) return null;
        let [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');

        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);

        if (modifier && modifier.toLowerCase() === 'pm' && hours < 12) {
            hours += 12;
        }
        if (modifier && modifier.toLowerCase() === 'am' && hours === 12) {
            hours = 0;
        }

        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    };

    const start = parseTime(startTimeStr);
    const end = parseTime(endTimeStr);

    if (!start || !end) return 'finished';

    if (now >= start && now < end) return 'ongoing';
    if (now < start) return 'upcoming';
    return 'finished';
};



const AppLogo = ({ collapsed }) => (
    <div className={`flex items-center p-4 transition-all duration-300 ${collapsed ? 'justify-center' : 'justify-start gap-3'}`}>
        <div className="p-2 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpenCheck className="w-6 h-6 text-white" />
        </div>
        <h1 className={`text-xl font-bold text-white pt-2 transition-opacity duration-300 ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
            Plannex
        </h1>
    </div>
);

const StudentDashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
    const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
    const [todaysTimetable, setTodaysTimetable] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { user, logout } = useAuth();
    const { message } = App.useApp();
    const navigate = useNavigate();
    const location = useLocation();

    // Enhanced card styles
    const cardStyle = {
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    };

    const getSelectedKey = () => {
        const path = location.pathname;
        if (path.includes('mynote')) return '3';
        if (path.includes('academic-info')) return '2';
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

    const toggleSidebar = () => setCollapsed(!collapsed);
    const toggleMobileDrawer = () => setMobileDrawerVisible(!mobileDrawerVisible);
    const showProfileModal = () => setIsProfileModalVisible(true);
    const hideProfileModal = () => setIsProfileModalVisible(false);


    const getLectureInfo = (lecture) => {
        const status = getLiveStatus(lecture.timeSlot.label);
        const statusConfig = {
            ongoing: { color: '#52c41a', text: 'Live', icon: <ClockCircleOutlined /> },
            upcoming: { color: '#1890ff', text: 'Upcoming', icon: <CalendarOutlined /> },
            finished: { color: '#8c8c8c', text: 'Completed', icon: <CloseCircleOutlined /> }
        };
        return statusConfig[status] || statusConfig.finished;
    };

    const renderTimelineItem = (lecture, index) => {
        const { color, text, icon } = getLectureInfo(lecture);

        // Access data based on the new structure
        const subject = lecture.subjectName;
        const timeSlotLabel = lecture.timeSlot?.label || "N/A";
        const teacher = lecture.faculty?.[0]?.name || "N/A";
        const room = lecture.rooms?.[0]?.roomCode || "N/A";

        return (
            <Timeline.Item
                key={index}
                dot={<div style={{
                    background: color,
                    borderRadius: '50%',
                    padding: '4px',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>{icon}</div>}
                color={color}
            >
                <div style={{ marginLeft: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <Text strong style={{ fontSize: '16px' }}>{subject}</Text>
                        <Tag color={color} style={{ borderRadius: '12px', fontSize: '11px' }}>
                            {text}
                        </Tag>
                    </div>
                    <div style={{ color: '#666', marginBottom: '4px' }}>
                        <ClockCircleOutlined style={{ marginRight: '4px' }} />
                        {timeSlotLabel}
                    </div>
                    <div style={{ color: '#666' }}>
                        <UserOutlined style={{ marginRight: '4px' }} />
                        {teacher} • {room}
                    </div>
                </div>
            </Timeline.Item>
        );
    };

    const menuItems = [
        { key: '1', icon: <AppstoreOutlined />, label: 'Dashboard' },
        { key: '2', icon: <CalendarOutlined />, label: 'Full Timetable' },
        { key: '3', icon: <BookOutlined />, label: 'My Notes' },
        { key: '4', icon: <BellOutlined />, label: 'Announcements' },
        { key: '5', icon: <SettingOutlined />, label: 'Settings' },
        { key: '6', icon: <LogoutOutlined />, label: 'Logout' },
    ];

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

    const getPriorityColor = (priority) => {
        const colors = {
            high: '#ff4d4f',
            medium: '#fa8c16',
            low: '#52c41a'
        };
        return colors[priority] || '#d9d9d9';
    };

    const SiderMenu = () => (
        <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{
                background: 'transparent',
                border: 'none'
            }}
        />
    );

    return (
        <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            {/* Desktop Sidebar */}
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
                    background: 'linear-gradient(180deg, #001529 0%, #002140 100%)',
                    boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)'
                }}
                className="hide-on-mobile"
            >
                <AppLogo collapsed={collapsed} />
                <SiderMenu />
            </Sider>

            {/* Mobile Drawer */}
            <Drawer
                title={<AppLogo collapsed={false} />}
                placement="left"
                onClose={toggleMobileDrawer}
                open={mobileDrawerVisible}
                className="show-on-mobile"
                bodyStyle={{ padding: 0, background: '#001529' }}
                headerStyle={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderBottom: 0,
                    color: 'white'
                }}
                closeIcon={<Button type="text" style={{ color: 'white' }}>✕</Button>}
            >
                <SiderMenu />
            </Drawer>

            <Layout>
                {/* Enhanced Header */}
                <div className="bg-white border-b border-gray-200 shadow-sm flex items-center justify-between rounded-3xl px-6 py-3 mx-4 sticky top-0 z-50">
                    <div className="flex items-center space-x-4">
                        <button
                            className="lg:hidden text-gray-600 focus:outline-none"
                            onClick={toggleMobileDrawer}
                            aria-label="Open menu"
                        >
                            <MenuOutlined className="text-xl" />
                        </button>
                        <div className="hidden lg:block">
                            <h4 className="text-lg font-semibold text-gray-800">
                                Student Dashboard
                            </h4>
                            <p className="text-sm text-gray-500">
                                Welcome back, {user?.name}!
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <Tooltip title="Notifications">
                                <button
                                    className="text-gray-600 hover:text-blue-500 transition-colors focus:outline-none relative"
                                    aria-label="Notifications"
                                >
                                    <BellOutlined className="text-xl" />
                                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                    </span>
                                </button>
                            </Tooltip>
                        </div>

                        <div
                            onClick={showProfileModal}
                            className="flex items-center space-x-3 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <div className="relative w-10 h-10 flex-shrink-0">
                                {user?.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt="User Avatar"
                                        className="w-full h-full rounded-full border-2 border-white shadow-sm object-cover"
                                    />
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
                </div>

                <Content style={{
                    padding: '24px',
                    background: 'linear-gradient(135deg, #f0f2f5 0%, #e6f7ff 100%)',
                    minHeight: 'calc(100vh - 64px)'
                }}>
                    {/* Dashboard Content */}
                    {location.pathname === '/student/dashboard' && (
                        <Spin spinning={isLoading} tip="Loading Dashboard..." size="large">
                            <div style={{ marginBottom: '24px' }}>
                                <Title level={2} style={{
                                    marginBottom: '8px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    Good Morning! 👋
                                </Title>
                                <Text type="secondary" style={{ fontSize: '16px' }}>
                                    Here's what's happening with your studies today, {today}
                                </Text>
                            </div>

                            <Row gutter={[24, 24]}>
                                {/* Quick Stats Cards */}
                                <Col xs={24} style={{ marginBottom: '16px' }}>
                                    <Row gutter={[16, 16]}>
                                        <Col xs={12} sm={6}>
                                            <Card style={cardStyle} bodyStyle={{ padding: '20px' }}>
                                                <Statistic
                                                    title={<span style={{ color: '#666' }}>Attendance</span>}
                                                    value={quickStats.overallAttendance}
                                                    suffix="%"
                                                    prefix={<TrophyOutlined style={{ color: '#52c41a' }} />}
                                                    valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: 'bold' }}
                                                />
                                                <Progress
                                                    percent={quickStats.overallAttendance}
                                                    showInfo={false}
                                                    strokeColor={{
                                                        '0%': '#52c41a',
                                                        '100%': '#73d13d',
                                                    }}
                                                    style={{ marginTop: '8px' }}
                                                />
                                            </Card>
                                        </Col>
                                        <Col xs={12} sm={6}>
                                            <Card style={cardStyle} bodyStyle={{ padding: '20px' }}>
                                                <Statistic
                                                    title={<span style={{ color: '#666' }}>Assignments</span>}
                                                    value={quickStats.upcomingAssignments}
                                                    prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
                                                    valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }}
                                                />
                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                    {quickStats.completedAssignments} completed
                                                </Text>
                                            </Card>
                                        </Col>
                                        <Col xs={12} sm={6}>
                                            <Card style={cardStyle} bodyStyle={{ padding: '20px' }}>
                                                <Statistic
                                                    title={<span style={{ color: '#666' }}>Subjects</span>}
                                                    value={quickStats.subjectsEnrolled}
                                                    prefix={<AccountBookOutlined style={{ color: '#fa8c16' }} />}
                                                    valueStyle={{ color: '#fa8c16', fontSize: '24px', fontWeight: 'bold' }}
                                                />
                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                    Active courses
                                                </Text>
                                            </Card>
                                        </Col>
                                        <Col xs={12} sm={6}>
                                            <Card style={cardStyle} bodyStyle={{ padding: '20px' }}>
                                                <Statistic
                                                    title={<span style={{ color: '#666' }}>This Week</span>}
                                                    value="92"
                                                    suffix="%"
                                                    prefix={<CalendarFilled style={{ color: '#722ed1' }} />}
                                                    valueStyle={{ color: '#722ed1', fontSize: '24px', fontWeight: 'bold' }}
                                                />
                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                    Weekly average
                                                </Text>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Col>

                                {/* Main Content Row */}
                                <Col xs={24} lg={15}>
                                    <Card
                                        title={
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <CalendarOutlined style={{ color: '#1890ff' }} />
                                                <span>Today's Schedule</span>
                                                <Tag color="blue" style={{ marginLeft: 'auto' }}>
                                                    {today}
                                                </Tag>
                                            </div>
                                        }
                                        bordered={false}
                                        style={cardStyle}
                                        bodyStyle={{ padding: '24px' }}
                                    >
                                        {todaysTimetable.length > 0 ? (
                                            <Timeline mode="left" style={{ marginTop: '16px' }}>
                                                {todaysTimetable.map(renderTimelineItem)}
                                            </Timeline>
                                        ) : (
                                            <Empty
                                                description="No classes scheduled for today"
                                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                style={{ margin: '40px 0' }}
                                            />
                                        )}
                                    </Card>
                                </Col>

                                {/* Sidebar Content */}
                                <Col xs={24} lg={9}>
                                    {/* Attendance Chart */}
                                    <Card
                                        title={
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <TrophyOutlined style={{ color: '#52c41a' }} />
                                                <span>Attendance Overview</span>
                                            </div>
                                        }
                                        bordered={false}
                                        style={cardStyle}
                                        bodyStyle={{ padding: '24px' }}
                                    >
                                        <div style={{ height: 250, position: 'relative' }}>
                                            <ResponsiveContainer>
                                                <PieChart>
                                                    <Pie
                                                        data={attendanceData}
                                                        dataKey="value"
                                                        nameKey="name"
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={90}
                                                        paddingAngle={5}
                                                        labelLine={false}
                                                    >
                                                        {attendanceData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <RechartsTooltip />
                                                    <Legend iconType="circle" />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                textAlign: 'center'
                                            }}>
                                                <Text type="secondary" style={{ fontSize: '12px' }}>Overall</Text>
                                                <Title level={2} style={{ margin: 0, color: '#52c41a' }}>
                                                    {quickStats.overallAttendance}%
                                                </Title>
                                            </div>
                                        </div>
                                    </Card>

                                    {/* Weekly Performance */}
                                    <Card
                                        title={
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <CalendarFilled style={{ color: '#722ed1' }} />
                                                <span>Weekly Performance</span>
                                            </div>
                                        }
                                        style={{ ...cardStyle, marginTop: '24px' }}
                                        bordered={false}
                                        bodyStyle={{ padding: '24px' }}
                                    >
                                        <div style={{ height: 200 }}>
                                            <ResponsiveContainer>
                                                <BarChart data={weeklyPerformanceData}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="day" />
                                                    <YAxis />
                                                    <RechartsTooltip />
                                                    <Bar dataKey="attendance" fill="#52c41a" radius={[4, 4, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </Card>

                                    {/* Recent Announcements */}
                                    <Card
                                        title={
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <BellOutlined style={{ color: '#fa8c16' }} />
                                                <span>Recent Announcements</span>
                                            </div>
                                        }
                                        style={{ ...cardStyle, marginTop: '24px' }}
                                        bordered={false}
                                        bodyStyle={{ padding: '16px' }}
                                    >
                                        <List
                                            itemLayout="horizontal"
                                            dataSource={recentAnnouncements}
                                            renderItem={item => (
                                                <List.Item style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                                                    <List.Item.Meta
                                                        avatar={
                                                            <Avatar
                                                                icon={<BellOutlined />}
                                                                style={{
                                                                    backgroundColor: getPriorityColor(item.priority),
                                                                    color: 'white'
                                                                }}
                                                                size="small"
                                                            />
                                                        }
                                                        title={
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <Text strong style={{ fontSize: '14px' }}>
                                                                    {item.title}
                                                                </Text>
                                                                <Tag
                                                                    color={getPriorityColor(item.priority)}
                                                                    style={{ fontSize: '10px', padding: '2px 6px' }}
                                                                >
                                                                    {item.category}
                                                                </Tag>
                                                            </div>
                                                        }
                                                        description={
                                                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                                                {item.date}
                                                            </Text>
                                                        }
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </Spin>
                    )}

                    {/* Child Routes */}
                    <Outlet />
                </Content>
            </Layout>

            {/* Profile Modal */}
            <Modal
                title="Profile Information"
                open={isProfileModalVisible}
                onCancel={hideProfileModal}
                footer={[
                    <Button key="close" onClick={hideProfileModal}>
                        Close
                    </Button>,
                    <Button key="edit" type="primary" icon={<EditOutlined />}>
                        Edit Profile
                    </Button>,
                ]}
                width={600}
            >
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <Avatar
                        size={80}
                        src={user?.picture}
                        icon={<UserOutlined />}
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: '4px solid white',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                        }}
                    />
                    <Title level={4} style={{ marginTop: '12px', marginBottom: '4px' }}>
                        {user?.name || 'Student Name'}
                    </Title>
                    <Text type="secondary">{user?.email || 'student@college.edu'}</Text>
                </div>

                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Roll Number">
                        {user?.rollNo || 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Class">
                        {user?.class || 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Year">
                        {user?.year + ' [' + `${user.department}` + '] ' || 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phone">
                        {user?.phone || 'N/A'}
                    </Descriptions.Item>

                </Descriptions>
            </Modal>

            {/* Custom Styles */}
            <style jsx>{`
                @media (max-width: 768px) {
                    .hide-on-mobile {
                        display: none !important;
                    }
                    .show-on-mobile {
                        display: block !important;
                    }
                }

                @media (min-width: 769px) {
                    .show-on-mobile {
                        display: none !important;
                    }
                }

                .ant-card {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .ant-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12) !important;
                }

                .ant-timeline-item-tail {
                    border-left: 2px solid #f0f0f0;
                }

                .ant-timeline-item-head {
                    background: transparent;
                    border: none;
                }

                .ant-statistic-content {
                    font-weight: 600;
                }

                .ant-progress-bg {
                    transition: all 0.3s ease;
                }

                .ant-menu-dark {
                    background: transparent;
                }

                .ant-menu-dark .ant-menu-item {
                    margin: 4px 8px;
                    border-radius: 8px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .ant-menu-dark .ant-menu-item:hover {
                    background: rgba(255, 255, 255, 0.1);
                    transform: translateX(4px);
                }

                .ant-menu-dark .ant-menu-item-selected {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 8px;
                }

                .ant-badge-count {
                    background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(255, 77, 79, 0.3);
                }

                .ant-spin-container {
                    transition: all 0.3s ease;
                }

                .ant-empty-description {
                    color: #999;
                    font-style: italic;
                }

                /* Custom scrollbar */
                ::-webkit-scrollbar {
                    width: 6px;
                }

                ::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 3px;
                }

                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 3px;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
                }

                /* Enhanced animations */
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .ant-card {
                    animation: fadeInUp 0.6s ease-out;
                }

                .ant-statistic {
                    animation: fadeInUp 0.8s ease-out;
                }

                /* Responsive text sizes */
                @media (max-width: 576px) {
                    .ant-typography h2 {
                        font-size: 20px;
                    }

                    .ant-typography h4 {
                        font-size: 16px;
                    }

                    .ant-statistic-content-value {
                        font-size: 18px !important;
                    }
                }

                /* Loading spinner enhancement */
                .ant-spin-dot {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                }

                /* Modal enhancements */
                .ant-modal-header {
                    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                    border-bottom: 1px solid #e2e8f0;
                }

                .ant-modal-title {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-weight: 600;
                }

                /* Button hover effects */
                .ant-btn {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border-radius: 6px;
                }

                .ant-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }

                .ant-btn-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                }

                .ant-btn-primary:hover {
                    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
                }

                /* Timeline enhancements */
                .ant-timeline-item-content {
                    margin-left: 20px;
                    padding: 12px 16px;
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: 12px;
                    border-left: 4px solid #e8e8e8;
                    transition: all 0.3s ease;
                }

                .ant-timeline-item-content:hover {
                    background: rgba(255, 255, 255, 1);
                    border-left-color: #1890ff;
                    transform: translateX(4px);
                }

                /* Tag animations */
                .ant-tag {
                    animation: fadeInUp 0.4s ease-out;
                    transition: all 0.3s ease;
                }

                .ant-tag:hover {
                    transform: scale(1.05);
                }

                /* List item enhancements */
                .ant-list-item {
                    transition: all 0.3s ease;
                    border-radius: 8px;
                    margin: 4px 0;
                    padding: 8px 12px !important;
                }

                .ant-list-item:hover {
                    background: rgba(24, 144, 255, 0.04);
                    transform: translateX(4px);
                }

                /* Progress bar enhancements */
                .ant-progress-line {
                    margin-top: 8px;
                }

                .ant-progress-bg {
                    border-radius: 4px;
                }

                .ant-progress-outer {
                    padding-right: 0;
                }

                /* Responsive grid adjustments */
                @media (max-width: 1200px) {
                    .ant-col-lg-15 {
                        flex: 0 0 60%;
                        max-width: 60%;
                    }

                    .ant-col-lg-9 {
                        flex: 0 0 40%;
                        max-width: 40%;
                    }
                }

                @media (max-width: 992px) {
                    .ant-col-lg-15,
                    .ant-col-lg-9 {
                        flex: 0 0 100%;
                        max-width: 100%;
                    }
                }

                /* Enhanced shadows and gradients */
                .gradient-card {
                    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                    border: 1px solid rgba(0, 0, 0, 0.06);
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                }

                .gradient-card:hover {
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
                }

                /* Mobile optimizations */
                @media (max-width: 576px) {
                    .ant-layout-content {
                        padding: 16px;
                    }

                    .ant-card {
                        margin-bottom: 16px;
                    }

                    .ant-row {
                        margin-left: -8px;
                        margin-right: -8px;
                    }

                    .ant-col {
                        padding-left: 8px;
                        padding-right: 8px;
                    }

                    .ant-statistic-content-value {
                        font-size: 20px !important;
                    }

                    .ant-card-head-title {
                        font-size: 16px;
                        padding: 8px 0;
                    }

                    .ant-timeline-item-content {
                        margin-left: 16px;
                        padding: 8px 12px;
                    }
                }
            `}</style>
        </Layout>
    );
};

const DashboardApp = () => (
    <App>
        <StudentDashboard />
    </App>
);

export default DashboardApp;