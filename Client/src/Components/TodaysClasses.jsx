import React, { useState, useEffect } from 'react';
import { App, Button, Dropdown, Menu, Tag, Space, Typography, Card as Card1 } from 'antd';
import { UserSwitchOutlined, SwapOutlined } from '@ant-design/icons';
import { Clock, CheckCircle, XCircle, MoreVertical, Megaphone } from 'lucide-react';
import ChangeVenueModal from './changeVenue.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getTeacherSchedule, updateLectureStatus } from '../Slices/Timetable';
import { useNavigate } from 'react-router';

const { Text } = Typography;

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
                } catch (error) {
                    message.error("Failed to load today's classes.");
                }
            }
            getTodaysClasses();
        }
    }, [user, todaysClasses])

    const handleOpenChangeVenueModal = (lecture) => {
        setSelectedLecture(lecture);
        setIsModalOpen(true);
    };

    const markStudentAttendance = (lecture) => {
        navigate('/teacher/mark-attendance')
    }

    const updateStatus = async (lecture, status, updatedRoom) => {
        try {
            if (lecture && status) {
                const response = await updateLectureStatus(lecture._id, status, updatedRoom);
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
            variant="outlined"
            style={{ width: '100%' }}
        >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {todaysClasses.map((item, index) => {
                    const handleVenueSubmit = (updatedRoom) => {
                        setIsModalOpen(false);
                        updateStatus(selectedLecture, "Venue_Changed", updatedRoom);
                    };
                    return (
                        <Card1
                            key={index}
                            size="small"
                            variant="outlined"
                            hoverable
                            style={{ width: '100%' }}
                            bodyStyle={{ padding: '16px' }}
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
                                <div className="text-left w-full md:w-auto">
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                                        <strong className="text-base md:text-lg text-gray-800">
                                            {item.subjectName}
                                        </strong>
                                        <span className="text-sm md:text-base text-gray-600">|</span>
                                        <span className="bg-gray-200 text-gray-800 text-sm md:text-base px-2 py-1 rounded-xl">
                                            {item.class}
                                        </span>
                                    </div>
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
                                    <span className="text-sm text-gray-500 block">
                                        {item.timeSlot.label}
                                    </span>
                                    {item.lectureType === 'Theory' ? 'Room :' : 'Lab :'}
                                    <span style={{ textDecoration: (item.status === 'Venue_Changed' && item.updatedRoom !== item.rooms[0]?.roomCode) ? 'line-through' : 'none', marginRight: item.status === 'Venue_Changed' ? '8px' : '0' }}>
                                        {`  ${item.rooms[0]?.roomCode || 'N/A'}`}
                                    </span>
                                    {(item.status === 'Venue_Changed' && item.updatedRoom !== item.rooms[0]?.roomCode) && <Text strong>{item.updatedRoom}</Text>}
                                </div>
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

export default TodaysClasses;
