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
    ReadOutlined,
    ExperimentOutlined,
    CoffeeOutlined,
    CloseCircleOutlined,
    PlusOutlined,
    EditOutlined,
    SwapOutlined,
    UserSwitchOutlined,
} from '@ant-design/icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchTimeTable } from '../../Slices/Timetable';
import getUserClass from '../../Helper/getClass';
const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const attendanceData = [{ name: 'Present', value: 85 }, { name: 'Absent', value: 15 }];
const ATTENDANCE_COLORS = ['#3b82f6', '#ef4444'];
const quickStats = { overallAttendance: 85, upcomingAssignments: 3, subjectsEnrolled: 5 };
const recentAnnouncements = [{ title: 'Mid-term exam schedule released', date: '2025-07-28' }, { title: 'Guest lecture on AI/ML on Friday', date: '2025-07-27' }];

const parseTime = (timeStr) => {
    if (!timeStr) return new Date(0);
    const now = new Date();
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
};

const getLiveStatus = (startTime, endTime) => {
    const now = new Date();
    const start = parseTime(startTime);
    const end = parseTime(endTime);
    if (now >= start && now < end) return 'ongoing';
    if (now < start) return 'upcoming';
    return 'finished';
};

const AppLogo = ({ collapsed }) => (
    <div style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: collapsed ? '16px' : '20px', fontWeight: 'bold', transition: 'font-size 0.2s' }}>
        {collapsed ? 'CA' : 'CollegeApp'}
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

    // Get current selected key based on location
    const getSelectedKey = () => {
        const path = location.pathname;
        if (path === '/student/dashboard/mynote') return '3';
        if (path === '/student/dashboard/academic-info') return '2';
        if (path === '/student/dashboard') return '1';
        return '1'; // default to dashboard
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
    }, [user]);

    const today = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());

    const handleLogout = async () => {
        console.log('Logout function called'); // Temporary debug
        try {
            console.log('Calling logout...'); // Temporary debug
            await logout();
            console.log('Logout successful, navigating...'); // Temporary debug
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
        // ... unchanged ...
    };

    const renderTimelineItem = (lecture, index) => {
        // ... unchanged ...
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
        console.log('Menu item clicked:', e.key); // Temporary debug
        switch (e.key) {
            case '1':
                navigate('/student/dashboard');
                break;
            case '2':
                navigate('/student/dashboard/academic-info');
                break;
            case '3':
                navigate('/student/dashboard/mynote');
                break;
            case '6':
                console.log('Logout menu item selected'); // Temporary debug
                handleLogout();
                break;
            default:
                break;
        }
    };

    const SiderMenu = () => <Menu theme="dark" mode="inline" selectedKeys={[getSelectedKey()]} items={menuItems} onClick={handleMenuClick} />;

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={toggleSidebar} breakpoint="lg" collapsedWidth="80" style={{ position: 'sticky', top: 0, height: '100vh', background: '#001529' }} className="hide-on-mobile">
                <AppLogo collapsed={collapsed} />
                <SiderMenu />
            </Sider>
            <Drawer title={<AppLogo collapsed={false} />} placement="left" onClose={toggleMobileDrawer} open={mobileDrawerVisible} className="show-on-mobile" bodyStyle={{ padding: 0, background: '#001529' }} headerStyle={{ background: '#001529', borderBottom: 0 }} closeIcon={<Button type="text" style={{ color: 'white' }}>X</Button>}>
                <SiderMenu />
            </Drawer>

            <Layout>
                <Header style={{ padding: '0 24px', background: '#fff', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button className="show-on-mobile" icon={<MenuOutlined />} onClick={toggleMobileDrawer} type="text" />
                    <Title level={4} style={{ margin: 0 }} className="hide-on-mobile">Student Dashboard</Title>
                    <Space align="center" size="large">
                        <Badge count={3}><BellOutlined style={{ fontSize: '20px' }} /></Badge>
                        <Space onClick={showProfileModal} style={{ cursor: 'pointer' }}>
                            <Avatar src={user?.avatar} icon={<UserOutlined />} />
                            <Text strong className="hide-on-mobile">Welcome, {user?.name || 'Student'}!</Text>
                        </Space>
                    </Space>
                </Header>
                <Content style={{ padding: '24px', background: '#f0f2f5' }}>
                    {/* Show dashboard content only on main dashboard route */}
                    {location.pathname === '/student/dashboard' && (
                        <Spin spinning={isLoading} tip="Loading Dashboard...">
                            <Row gutter={[24, 24]}>
                                <Col xs={24} lg={14}>
                                    <Card title={`Today's Schedule: ${today}`} variant="borderless" style={{ borderRadius: '12px' }}>
                                        <Timeline mode="left">
                                            {todaysTimetable.map(renderTimelineItem)}
                                        </Timeline>
                                    </Card>
                                </Col>

                                <Col xs={24} lg={10}>
                                    <Card title="Overall Attendance" variant="borderless" style={{ borderRadius: '12px' }}>
                                        <div style={{ height: 250, position: 'relative' }}>
                                            <ResponsiveContainer>
                                                <PieChart>
                                                    <Pie data={attendanceData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} labelLine={false}>
                                                        {attendanceData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={ATTENDANCE_COLORS[index % ATTENDANCE_COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                    <Legend iconType="circle" />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                                <Text type="secondary">Total</Text>
                                                <Title level={2} style={{ margin: 0 }}>{quickStats.overallAttendance}%</Title>
                                            </div>
                                        </div>
                                    </Card>
                                    <Card title="Quick Stats" style={{ marginTop: '24px', borderRadius: '12px' }} variant="borderless">
                                        <Row gutter={16}>
                                            <Col span={8} style={{ textAlign: 'center' }}><Statistic title="Attendance" value={quickStats.overallAttendance} suffix="%" /></Col>
                                            <Col span={8} style={{ textAlign: 'center' }}><Statistic title="Assignments" value={quickStats.upcomingAssignments} /></Col>
                                            <Col span={8} style={{ textAlign: 'center' }}><Statistic title="Subjects" value={quickStats.subjectsEnrolled} /></Col>
                                        </Row>
                                    </Card>
                                    <Card title="Recent Announcements" style={{ marginTop: '24px', borderRadius: '12px' }} variant="borderless">
                                        <List
                                            itemLayout="horizontal"
                                            dataSource={recentAnnouncements}
                                            renderItem={item => (
                                                <List.Item>
                                                    <List.Item.Meta
                                                        avatar={<Avatar icon={<BellOutlined />} style={{ backgroundColor: '#e6f7ff', color: '#1677ff' }} />}
                                                        title={<a href="#">{item.title}</a>}
                                                        description={item.date}
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </Spin>
                    )}

                    {/* Render child routes */}
                    <Outlet />
                </Content>
            </Layout>
            {/* styles and modal unchanged */}
            {/* ... rest of your component */}
        </Layout>
    );
};

const DashboardApp = () => (
    <App><StudentDashboard /></App>
);

export default DashboardApp;
