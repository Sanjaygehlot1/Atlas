import React, { useState, useEffect, use } from 'react';
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
    message
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
    EditOutlined
} from '@ant-design/icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Link } from 'react-router-dom';
import { fetchTimeTable } from '../../Slices/Timetable';
import { useAuth } from '../../context/AuthContext';
import getUserClass from '../../Helper/getClass';

const { Header, Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;


const mockUser = {
    name: 'Bheem',
    class: 'SE IT 1',
    avatarUrl: 'https://i.pravatar.cc/150?u=bheem',
};




const attendanceData = [
    { name: 'Present', value: 85 },
    { name: 'Absent', value: 15 },
];
const ATTENDANCE_COLORS = ['#3b82f6', '#ef4444'];

const quickStats = {
    overallAttendance: 85,
    upcomingAssignments: 3,
    subjectsEnrolled: 5,
};

const recentAnnouncements = [
    { title: 'Mid-term exam schedule released', date: '2025-07-28' },
    { title: 'Guest lecture on AI/ML on Friday', date: '2025-07-27' },
    { title: 'Last day for fee payment is Aug 5th', date: '2025-07-26' },
];


const parseTime = (timeStr) => {
    const now = new Date();
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
        hours = '00';
    }
    if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
    }
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
};


const getLectureStatus = (startTime, endTime) => {
    const now = new Date();
    const start = parseTime(startTime);
    const end = parseTime(endTime);

    if (now >= start && now < end) return 'ongoing';
    if (now < start) return 'upcoming';
    return 'finished';
};


const AppLogo = ({ collapsed }) => (
    <div style={{
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: collapsed ? '16px' : '20px',
        fontWeight: 'bold',
        transition: 'font-size 0.2s',
    }}>
        {collapsed ? 'CA' : 'CollegeApp'}
    </div>
);


const StudentDashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
    const [currentTT, setCurrentTT] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update time every minute
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (user && currentTT.length === 0) {
            const fetchTimetable = async () => {
                try {
                         const userClass = getUserClass(user);
                    console.log(userClass);

                    const response = await fetchTimeTable(userClass);
                    setCurrentTT(response);
                } catch (error) {
                    message.error(error.response?.data?.message || 'Failed to fetch timetable. Please try again later.');
                    console.error('Error fetching timetable:', error);
                }
            };

            fetchTimetable();
        }
    }, [currentTT, user])

    const today = new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(currentTime);

    const toggleSidebar = () => setCollapsed(!collapsed);
    const toggleMobileDrawer = () => setMobileDrawerVisible(!mobileDrawerVisible);
    const showProfileModal = () => setIsProfileModalVisible(true);
    const hideProfileModal = () => setIsProfileModalVisible(false);


    const getLectureIcon = (type) => {
        switch (type) {
            case 'Lab': return <ExperimentOutlined />;
            case 'Break': return <CoffeeOutlined />;
            default: return <ReadOutlined />;
        }
    };

    const handleLogout = () => {
        logout();
        message.success('You have been logged out.');
        navigate('/login');
    };

    const getLectureTypeColor = (type, status) => {
        if (status === 'Cancelled') return '#ef4444'; // Red for cancelled
        switch (type) {
            case 'Lab': return '#8b5cf6'; // Violet for Lab
            case 'Break': return '#f59e0b'; // Amber for Break
            default: return '#3b82f6'; // Blue for Theory
        }
    };

    const renderTimelineItem = (lecture, index) => {
        const [startTime, endTime] = lecture.timeSlot.label.split(' - ');
        const liveStatus = getLectureStatus(startTime, endTime);

        const isCancelled = false; // hardcoded for now
        const cardColor = getLectureTypeColor(lecture.lectureType, "Cancelled");

        const isNextUpcoming = !currentTT.some((l, i) => i < index && getLectureStatus(l.timeSlot.label.split(' - ')[0], l.timeSlot.label.split(' - ')[1]) !== 'finished') && liveStatus === 'upcoming' && !isCancelled;

        const cardStyle = {
            marginBottom: '16px',
            borderLeft: `5px solid ${cardColor}`,
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            background: '#fff',
        };

        if (liveStatus === 'finished' || isCancelled) {
            cardStyle.opacity = 0.65;
            cardStyle.background = '#f9f9f9';
        }
        if (liveStatus === 'ongoing' && !isCancelled) {
            cardStyle.boxShadow = `0 4px 12px ${cardColor}40`;
            cardStyle.background = `linear-gradient(90deg, ${cardColor}10, #fff)`;
        }
        if (isNextUpcoming) {
            cardStyle.boxShadow = `0 4px 12px ${cardColor}40`;
        }

        return (
            <Timeline.Item key={index} color={liveStatus === 'finished' || isCancelled ? 'gray' : cardColor} dot={liveStatus === 'ongoing' && !isCancelled ? <Spin /> : <ClockCircleOutlined />}>
                <Card
                    style={cardStyle}
                    bodyStyle={{ padding: '20px' }}
                >
                    <Row justify="space-between" align="top">
                        <Col>
                            <Space direction="vertical" size={2}>
                                <Text strong>{lecture.timeSlot.label}</Text>
                                <Title level={4} style={{ marginTop: 0, textDecoration: isCancelled ? 'line-through' : 'none' }}>
                                    <Space>
                                        {getLectureIcon(lecture.lectureType)}
                                        {lecture.subjectName}
                                    </Space>
                                </Title>
                                <Text type="secondary">
                                    {lecture.lectureType !== 'Break' ? `${lecture.faculty[0].code} • Room: ${lecture.rooms[0].roomCode}` : 'Enjoy your break!'}
                                </Text>
                            </Space>
                        </Col>
                        <Col style={{ textAlign: 'right' }}>
                            {isCancelled ? (
                                <Tag icon={<CloseCircleOutlined />} color="error">Cancelled</Tag>
                            ) : (liveStatus === 'ongoing' || isNextUpcoming) && (
                                <Badge status={liveStatus === 'ongoing' ? "processing" : "success"} text={liveStatus === 'ongoing' ? "Ongoing" : "Next Up"} />
                            )}
                        </Col>
                    </Row>
                    {!isCancelled && lecture.type !== 'Break' && (
                        <Row style={{ marginTop: '16px' }}>
                            <Button icon={<PlusOutlined />} onClick={() => message.info(`Creating notes for ${lecture.subject}...`)}>
                                Create Notes
                            </Button>
                        </Row>
                    )}
                </Card>
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

    const SiderMenu = () => (
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={menuItems} />
    );

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={toggleSidebar}
                breakpoint="lg"
                collapsedWidth="80"
                style={{ position: 'sticky', top: 0, height: '100vh', background: '#001529' }}
                className="hide-on-mobile"
            >
                <AppLogo collapsed={collapsed} />
                <SiderMenu />
            </Sider>

            <Drawer
                title={<AppLogo collapsed={false} />}
                placement="left"
                onClose={toggleMobileDrawer}
                open={mobileDrawerVisible}
                className="show-on-mobile"
                bodyStyle={{ padding: 0, background: '#001529' }}
                headerStyle={{ background: '#001529', borderBottom: 0 }}
                closeIcon={<Button type="text" style={{ color: 'white' }}>X</Button>}
            >
                <SiderMenu />
            </Drawer>

            <Layout>
                <Header style={{ padding: '0 24px', background: '#fff', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        className="show-on-mobile"
                        icon={<MenuOutlined />}
                        onClick={toggleMobileDrawer}
                        type="text"
                    />
                    <Title level={4} style={{ margin: 0 }} className="hide-on-mobile">Student Dashboard</Title>
                    <Space align="center" size="large">
                        <Badge count={3}><BellOutlined style={{ fontSize: '20px' }} /></Badge>
                        <Space>
                            <Avatar src={mockUser.avatarUrl} icon={<UserOutlined />} onClick={showProfileModal}/>
                            <Text strong className="hide-on-mobile">Welcome, {user.name}!</Text>
                        </Space>
                    </Space>
                </Header>

                <Content style={{ padding: '24px', background: '#f0f2f5' }}>
                    <Row gutter={[24, 24]}>
                        <Col xs={24} lg={14}>
                            <Card title={`Today's Schedule: ${today}`} bordered={false} style={{ borderRadius: '12px' }}>
                                <Timeline mode="left">
                                    {currentTT.map(renderTimelineItem)}
                                </Timeline>
                            </Card>
                        </Col>

                        <Col xs={24} lg={10}>
                            <Card title="Overall Attendance" bordered={false} style={{ borderRadius: '12px' }}>
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
                            <Card title="Quick Stats" style={{ marginTop: '24px', borderRadius: '12px' }} bordered={false}>
                                <Row gutter={16}>
                                    <Col span={8} style={{ textAlign: 'center' }}><Statistic title="Attendance" value={quickStats.overallAttendance} suffix="%" /></Col>
                                    <Col span={8} style={{ textAlign: 'center' }}><Statistic title="Assignments" value={quickStats.upcomingAssignments} /></Col>
                                    <Col span={8} style={{ textAlign: 'center' }}><Statistic title="Subjects" value={quickStats.subjectsEnrolled} /></Col>
                                </Row>
                            </Card>
                            <Card title="Recent Announcements" style={{ marginTop: '24px', borderRadius: '12px' }} bordered={false}>
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
                </Content>
            </Layout>
            <style>{`
        .hide-on-mobile {
          display: block;
        }
        .show-on-mobile {
          display: none;
        }
        @media (max-width: 991px) {
          .hide-on-mobile {
            display: none;
          }
          .show-on-mobile {
            display: block;
          }
        }
        .ant-timeline-item-content {
            width: 100%;
        }
      `}</style>
            <Modal
                title="Student Profile"
                open={isProfileModalVisible}
                onCancel={hideProfileModal}
                footer={[
                    <Button key="logout" danger icon={<LogoutOutlined />} onClick={handleLogout}>Logout</Button>,
                    <Link to="/academic-info" key="edit"><Button key="edit" type="primary" icon={<EditOutlined />} onClick={hideProfileModal}>Edit Profile</Button></Link>,
                ]}
            >
                <Row align="middle" gutter={24}>
                    <Col><Avatar size={80} src={user?.avatar} icon={<UserOutlined />} /></Col>
                    <Col>
                        <Title level={3} style={{ margin: 0 }}>{user?.name}</Title>
                        <Text type="secondary">{user?.email}</Text>
                    </Col>
                </Row>
                <Descriptions bordered column={1} style={{ marginTop: '24px' }}>
                    <Descriptions.Item label="Class">{user?.class || 'Not Set'}</Descriptions.Item>
                    <Descriptions.Item label="Year">{user?.year || 'Not Set'}</Descriptions.Item>
                    <Descriptions.Item label="Department">{user?.department || 'Not Set'}</Descriptions.Item>
                    <Descriptions.Item label="Roll Number">{user?.rollNo || 'Not Set'}</Descriptions.Item>
                </Descriptions>
            </Modal>
        </Layout>
    );
};




export default StudentDashboard;
