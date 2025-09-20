import React from 'react';
import { Card, Row, Col, Statistic, Progress, Spin, Timeline, Tag, Empty, Typography, Tooltip, List, Avatar } from 'antd';
import { TrophyOutlined, FileTextOutlined, AccountBookOutlined, CalendarFilled, ClockCircleOutlined, UserOutlined, BellOutlined, CloseCircleOutlined, CalendarOutlined as CalendarOutlinedAnt } from '@ant-design/icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const { Title, Text } = Typography;

const cardStyle = {
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
};

const getPriorityColor = (priority) => {
    const colors = { high: '#ff4d4f', medium: '#fa8c16', low: '#52c41a' };
    return colors[priority] || '#d9d9d9';
};

const getLiveStatus = (startTime, endTime) => {
    const now = new Date();

    console.log("ss:", startTime);
    console.log("es:", endTime);

    const parseTime = (timeStr) => {
        if (!timeStr) return null;
        let [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);
        if (modifier?.toLowerCase() === 'pm' && hours < 12) hours += 12;
        if (modifier?.toLowerCase() === 'am' && hours === 12) hours = 0;
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    };

    const start = parseTime(startTime);
    const end = parseTime(endTime);
    console.log("Start Time:", start);
    console.log("End Time:", end);
    if (!start || !end) return 'finished';
    if (now >= start && now < end) return 'ongoing';
    if (now < start) return 'upcoming';
    return 'finished';
};

const getLectureInfo = (lecture) => {
    console.log("Evaluating lecture:", lecture);
    const status = getLiveStatus(lecture.timeSlot.startTime, lecture.timeSlot.endTime);
    console.log(status)
    const statusConfig = {
        ongoing: { color: '#52c41a', text: 'Live', icon: <ClockCircleOutlined /> },
        upcoming: { color: '#1890ff', text: 'Upcoming', icon: <CalendarOutlinedAnt /> },
        finished: { color: '#8c8c8c', text: 'Completed', icon: <CloseCircleOutlined /> }
    };
    return statusConfig[status] || statusConfig.finished;
};

const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case "cancelled":
            return "red";
        case "scheduled":
            return "blue";
        case "venue_changed":
            return "orange";
        case "ongoing":
            return "green";
        case "completed":
            return "gray";
        default:
            return "blue";
    }
};

const renderTimelinelecture = (lecture, index) => {
    const subject = lecture.subjectName;
    const timeSlotLabel = lecture.timeSlot?.label || "N/A";
    const teacher = lecture.faculty?.[0]?.name || "N/A";
    const room = lecture.rooms?.[0]?.roomCode || "N/A";
    const updatedRoom = lecture.updatedRoom || null;
    const status = lecture.status || "Scheduled";
    const statusColor = getStatusColor(status);

    return (
        <Timeline.lecture
            key={index}
            dot={
                <div
                    style={{
                        background: statusColor,
                        borderRadius: "50%",
                        padding: "4px",
                        color: "white",
                        display: "flex",
                        alignlectures: "center",
                        justifyContent: "center",
                    }}
                >
                </div>
            }
            color={statusColor}
        >
            <div style={{ marginLeft: "12px" }}>
                <div
                    style={{
                        display: "flex",
                        alignlectures: "center",
                        gap: "8px",
                        marginBottom: "4px",
                    }}
                >
                    <Text strong style={{ fontSize: "16px" }}>
                        {subject}
                    </Text>
                    <Tag
                        color={statusColor}
                        style={{ borderRadius: "12px", fontSize: "11px" }}
                    >
                        {status}
                    </Tag>
                </div>

                <div style={{ color: "#666", marginBottom: "4px" }}>
                    <ClockCircleOutlined style={{ marginRight: "4px" }} />
                    {timeSlotLabel}
                </div>

                <div style={{ color: "#666" }}>
                    <UserOutlined style={{ marginRight: "4px" }} />
                    {teacher} • <span style={{ textDecoration: (status === 'Venue_Changed' && updatedRoom !== room) ? 'line-through' : 'none', marginRight: status === 'Venue_Changed' ? '8px' : '0' }}>
                        {room}
                    </span>
                    {(status === 'Venue_Changed' && updatedRoom !== room) && <Text strong>{updatedRoom}</Text>}
                </div>
            </div>
        </Timeline.lecture>
    );
};


const DashboardContent = ({ isLoading, todaysTimetable, today, quickStats, attendanceData, weeklyPerformanceData, recentAnnouncements }) => (
    <Spin spinning={isLoading} tip="Loading Dashboard..." size="large">
        <div style={{ marginBottom: '24px' }}>
            <Title level={2} style={{ marginBottom: '8px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Good Morning! 👋
            </Title>
            <Text type="secondary" style={{ fontSize: '16px' }}>
                Here's what's happening with your studies today, {today}
            </Text>
        </div>

        <Row gutter={[24, 24]}>
            <Col xs={24} style={{ marginBottom: '16px' }}>
                <Row gutter={[16, 16]}>
                    <Col xs={12} sm={6}>
                        <Card style={cardStyle} bodyStyle={{ padding: '20px' }}>
                            <Statistic title={<span style={{ color: '#666' }}>Attendance</span>} value={quickStats.overallAttendance} suffix="%" prefix={<TrophyOutlined style={{ color: '#52c41a' }} />} valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: 'bold' }} />
                            <Progress percent={quickStats.overallAttendance} showInfo={false} strokeColor={{ '0%': '#52c41a', '100%': '#73d13d' }} style={{ marginTop: '8px' }} />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card style={cardStyle} bodyStyle={{ padding: '20px' }}>
                            <Statistic title={<span style={{ color: '#666' }}>Assignments</span>} value={quickStats.upcomingAssignments} prefix={<FileTextOutlined style={{ color: '#1890ff' }} />} valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }} />
                            <Text type="secondary" style={{ fontSize: '12px' }}>{quickStats.completedAssignments} completed</Text>
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card style={cardStyle} bodyStyle={{ padding: '20px' }}>
                            <Statistic title={<span style={{ color: '#666' }}>Subjects</span>} value={quickStats.subjectsEnrolled} prefix={<AccountBookOutlined style={{ color: '#fa8c16' }} />} valueStyle={{ color: '#fa8c16', fontSize: '24px', fontWeight: 'bold' }} />
                            <Text type="secondary" style={{ fontSize: '12px' }}>Active courses</Text>
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card style={cardStyle} bodyStyle={{ padding: '20px' }}>
                            <Statistic title={<span style={{ color: '#666' }}>This Week</span>} value="92" suffix="%" prefix={<CalendarFilled style={{ color: '#722ed1' }} />} valueStyle={{ color: '#722ed1', fontSize: '24px', fontWeight: 'bold' }} />
                            <Text type="secondary" style={{ fontSize: '12px' }}>Weekly average</Text>
                        </Card>
                    </Col>
                </Row>
            </Col>

            <Col xs={24} lg={15}>
                <Card title={<div style={{ display: 'flex', alignlectures: 'center', gap: '8px' }}><CalendarOutlinedAnt style={{ color: '#1890ff' }} /><span>Today's Schedule</span><Tag color="blue" style={{ marginLeft: 'auto' }}>{today}</Tag></div>} bordered={false} style={cardStyle} bodyStyle={{ padding: '24px' }}>
                    {todaysTimetable.length > 0 ? (
                        <Timeline mode="left" style={{ marginTop: '16px' }}>
                            {todaysTimetable.map(renderTimelinelecture)}
                        </Timeline>
                    ) : (
                        <Empty description="No classes scheduled for today" image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: '40px 0' }} />
                    )}
                </Card>
            </Col>

            <Col xs={24} lg={9}>
                <Card title={<div style={{ display: 'flex', alignlectures: 'center', gap: '8px' }}><TrophyOutlined style={{ color: '#52c41a' }} /><span>Attendance Overview</span></div>} bordered={false} style={cardStyle} bodyStyle={{ padding: '24px' }}>
                    <div style={{ height: 250, position: 'relative' }}>
                        <ResponsiveContainer><PieChart>
                            <Pie data={attendanceData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} labelLine={false}>
                                {attendanceData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                            </Pie>
                            <RechartsTooltip />
                            <Legend iconType="circle" />
                        </PieChart></ResponsiveContainer>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                            <Text type="secondary" style={{ fontSize: '12px' }}>Overall</Text>
                            <Title level={2} style={{ margin: 0, color: '#52c41a' }}>{quickStats.overallAttendance}%</Title>
                        </div>
                    </div>
                </Card>

                <Card title={<div style={{ display: 'flex', alignlectures: 'center', gap: '8px' }}><CalendarFilled style={{ color: '#722ed1' }} /><span>Weekly Performance</span></div>} style={{ ...cardStyle, marginTop: '24px' }} bordered={false} bodyStyle={{ padding: '24px' }}>
                    <div style={{ height: 200 }}>
                        <ResponsiveContainer><BarChart data={weeklyPerformanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <RechartsTooltip />
                            <Bar dataKey="attendance" fill="#52c41a" radius={[4, 4, 0, 0]} />
                        </BarChart></ResponsiveContainer>
                    </div>
                </Card>

                <Card title={<div style={{ display: 'flex', alignlectures: 'center', gap: '8px' }}><BellOutlined style={{ color: '#fa8c16' }} /><span>Recent Announcements</span></div>} style={{ ...cardStyle, marginTop: '24px' }} bordered={false} bodyStyle={{ padding: '16px' }}>
                    <List lectureLayout="horizontal" dataSource={recentAnnouncements} renderlecture={lecture => (
                        <List.lecture style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                            <List.lecture.Meta
                                avatar={<Avatar icon={<BellOutlined />} style={{ backgroundColor: getPriorityColor(lecture.priority), color: 'white' }} size="small" />}
                                title={<div style={{ display: 'flex', alignlectures: 'center', gap: '8px' }}><Text strong style={{ fontSize: '14px' }}>{lecture.title}</Text><Tag color={getPriorityColor(lecture.priority)} style={{ fontSize: '10px', padding: '2px 6px' }}>{lecture.category}</Tag></div>}
                                description={<Text type="secondary" style={{ fontSize: '12px' }}>{lecture.date}</Text>}
                            />
                        </List.lecture>
                    )} />
                </Card>
            </Col>
        </Row>
    </Spin>
);

export default DashboardContent;