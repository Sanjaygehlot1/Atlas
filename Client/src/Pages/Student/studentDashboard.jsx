import React, { useState, useEffect } from 'react';
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
// import { fetchTimeTable } from '../../Slices/Timetable';
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

    useEffect(() => {
        const loadDashboardData = async () => {
            if (user && user.class) {
                const className = getUserClass(user);
                console.log(className);
                setIsLoading(true);
                try {
                    const response = await fetchTimeTable(className);
                    setTodaysTimetable(response);
                    console.log(response)
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

    const handleLogout = () => { /* ... */ };
    const toggleSidebar = () => setCollapsed(!collapsed);
    const toggleMobileDrawer = () => setMobileDrawerVisible(!mobileDrawerVisible);
    const showProfileModal = () => setIsProfileModalVisible(true);
    const hideProfileModal = () => setIsProfileModalVisible(false);

    const getLectureInfo = (lecture) => {
        const info = {
            icon: <ReadOutlined />,
            color: '#3b82f6', // Blue for Theory
            tag: null,
            isFaded: false,
        };

        switch (lecture.lectureType) {
            case 'Lab':
                info.icon = <ExperimentOutlined />;
                info.color = '#8b5cf6';
                break;
            case 'Break':
                info.icon = <CoffeeOutlined />;
                info.color = '#f59e0b';
                break;
        }

        switch (lecture.status) {
            case 'Cancelled':
                info.tag = <Tag icon={<CloseCircleOutlined />} color="error">Cancelled</Tag>;
                info.color = '#ef4444';
                info.isFaded = true;
                break;
            case 'Teacher_Absent':
                info.tag = <Tag icon={<UserSwitchOutlined />} color="warning">Teacher Absent</Tag>;
                info.color = '#f97316';
                info.isFaded = true;
                break;
            case 'Venue_Changed':
                info.tag = <Tag icon={<SwapOutlined />} color="purple">Venue Changed</Tag>;
                break;
            case 'Rescheduled':
                info.tag = <Tag icon={<ClockCircleOutlined />} color="cyan">Rescheduled</Tag>;
                break;
        }
        return info;
    };

    const renderTimelineItem = (lecture, index) => {
        const [startTime, endTime] = lecture.timeSlot.label.split(' - ');
        const liveStatus = getLiveStatus(startTime, endTime);
        const { icon, color, tag, isFaded } = getLectureInfo(lecture);

        const isNextUpcoming = !todaysTimetable.some((l, i) => i < index && getLiveStatus(l.timeSlot.label.split(' - ')[0], l.timeSlot.label.split(' - ')[1]) !== 'finished' && l.status !== 'Cancelled') && liveStatus === 'upcoming' && !isFaded;

        const cardStyle = {
            marginBottom: '16px',
            borderLeft: `5px solid ${color}`,
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            background: '#fff',
        };

        if (liveStatus === 'finished' || isFaded) {
            cardStyle.opacity = 0.65;
            cardStyle.background = '#f9f9f9';
        }
        if (liveStatus === 'ongoing' && !isFaded) {
            cardStyle.boxShadow = `0 4px 12px ${color}40`;
            cardStyle.background = `linear-gradient(90deg, ${color}10, #fff)`;
        }
        if (isNextUpcoming) {
            cardStyle.boxShadow = `0 4px 12px ${color}40`;
        }

        return (
            <Timeline.Item key={lecture._id} color={liveStatus === 'finished' || isFaded ? 'gray' : color} dot={liveStatus === 'ongoing' && !isFaded ? <Spin /> : <ClockCircleOutlined />}>
                <Card style={cardStyle} bodyStyle={{ padding: '20px' }}>
                    <Row justify="space-between" align="top">
                        <Col>
                            <Space direction="vertical" size={2}>
                                <Text strong>{lecture.timeSlot.label}</Text>
                                <Title level={4} style={{ marginTop: 0, textDecoration: isFaded ? 'line-through' : 'none' }}>
                                    <Space>{icon} {lecture.subjectName}</Space>
                                </Title>
                                <Text type="secondary">
                                    {lecture.lectureType !== 'Break' ?
                                        <>
                                            {lecture.faculty[0]?.name + ` (${lecture.faculty[0]?.code})` || 'N/A'} • Room:
                                            <span style={{ textDecoration: lecture.status === 'Venue_Changed' ? 'line-through' : 'none', marginRight: lecture.status === 'Venue_Changed' ? '8px' : '0' }}>
                                                {` ${lecture.rooms[0]?.roomCode  || 'N/A'}`}
                                            </span>
                                            {lecture.status === 'Venue_Changed' && <Text strong>{lecture.updatedRoom}</Text>}
                                            
                                        </>
                                        : 'Enjoy your break!'}
                                </Text>
                            </Space>
                        </Col>
                        <Col style={{ textAlign: 'right' }}>
                            {tag ? tag : (liveStatus === 'ongoing' || isNextUpcoming) && <Badge status={liveStatus === 'ongoing' ? "processing" : "success"} text={liveStatus === 'ongoing' ? "Ongoing" : "Next Up"} />}
                        </Col>
                    </Row>
                    {!isFaded && lecture.lectureType !== 'Break' && (
                        <Row style={{ marginTop: '16px' }}>
                            <Button icon={<PlusOutlined />} onClick={() => message.info(`Creating notes for ${lecture.subjectName}...`)}>Create Notes</Button>
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
        { key: '6', icon: <LogoutOutlined />, label: 'Logout', onClick: handleLogout },
    ];

    const SiderMenu = () => <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={menuItems} />;

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
                    <Spin spinning={isLoading} tip="Loading Dashboard...">
                        <Row gutter={[24, 24]}>
                            
                             <Col xs={24} lg={14}>
                            <Card title={`Today's Schedule: ${today}`} bordered={false} style={{ borderRadius: '12px' }}>
                                <Timeline mode="left">
                                    {todaysTimetable.map(renderTimelineItem)}
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
                    </Spin>
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

const DashboardApp = () => (
    <App><StudentDashboard /></App>
);

export default DashboardApp;
