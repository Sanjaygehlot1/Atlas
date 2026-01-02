import React, { useState, useEffect } from 'react';
import { App, Button, Dropdown, Menu, Tag, Space, Typography, Card as Card1 } from 'antd';
import { UserSwitchOutlined, SwapOutlined } from '@ant-design/icons';
import { Clock, CheckCircle, XCircle, MoreVertical, Megaphone, ClipboardClock } from 'lucide-react';
import ChangeVenueModal from './changeVenue.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getTeacherSchedule, updateLectureStatus } from '../Slices/Timetable';
import { useNavigate } from 'react-router';
import { classes } from './data.js';
const { Text } = Typography;

const TodaysClasses = () => {
    const { user } = useAuth();
    const { message } = App.useApp();
    const [todaysClasses, setTodaysClasses] = useState([]); // Start with empty array
    const [fetched, setfetched] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLecture, setSelectedLecture] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                // In production, use: const response = await getTeacherSchedule();
                // For now using your imported demo data
                setTodaysClasses(classes); 
                setfetched(true);
            } catch (error) {
                message.error("Failed to load today's classes.");
            }
        };
        if (!fetched) fetchClasses();
    }, [fetched]);

    const updateStatus = async (lectureId, status, updatedRoom = null) => {
        try {
            // await updateLectureStatus(lectureId, status, updatedRoom);
            
            // Sync local state
            setTodaysClasses(prev => prev.map(item => {
                if (item._id === lectureId) {
                    return { 
                        ...item, 
                        status: status, 
                        updatedRoom: updatedRoom || item.updatedRoom 
                    };
                }
                return item;
            }));
            
            message.success("Schedule updated successfully");
        } catch (error) {
            message.error("Action failed. Please try again.");
        }
    };

    const handleVenueSubmit = (updatedRoom) => {
        if (selectedLecture) {
            updateStatus(selectedLecture._id, "Venue_Changed", updatedRoom);
            setIsModalOpen(false);
            setSelectedLecture(null);
        }
    };

    return (
        <Card1 title={<Space><Clock size={18} /> Today's Classes</Space>} style={{ width: '100%' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {todaysClasses.length === 0 ? "No lectures scheduled for today." :
                    todaysClasses.map((item) => (
                        <Card1 key={item._id} size="small" hoverable>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
                                <div className="text-left">
                                    <Space>
                                        <strong className="text-lg">{item.subjectName}</strong>
                                        <Tag color="blue">{item.class}</Tag>
                                    </Space>
                                    
                                    {/* Dynamic Status Tag Rendering */}
                                    <div className="my-2">
                                        {item.status === 'Cancelled' ? (
                                            <Tag icon={<XCircle size={14} />} color="error">Cancelled</Tag>
                                        ) : item.status === 'Venue_Changed' ? (
                                            <Tag icon={<SwapOutlined />} color="purple">Venue Changed</Tag>
                                        ) : (
                                            <Tag icon={<CheckCircle size={14} />} color="success">Scheduled</Tag>
                                        )}
                                    </div>

                                    <Text type="secondary" block>{item.timeSlot.label}</Text>
                                    
                                    <Space>
                                        <Text>{item.lectureType === 'Theory' ? 'Room:' : 'Lab:'}</Text>
                                        <Text delete={item.status === 'Venue_Changed'}>
                                            {item.rooms[0]?.roomCode}
                                        </Text>
                                        {item.status === 'Venue_Changed' && <Text strong color="green">{item.updatedRoom}</Text>}
                                    </Space>
                                </div>

                                <div className="flex gap-2">
                                    <Button type="primary" onClick={() => navigate('/teacher/mark-attendance')}>
                                        Attendance
                                    </Button>
                                    
                                    <Dropdown
                                        menu={{
                                            items: [
                                                {
                                                    key: '1',
                                                    label: item.status === 'Cancelled' ? "Restore Lecture" : "Cancel Lecture",
                                                    danger: item.status !== 'Cancelled',
                                                    onClick: () => updateStatus(item._id, item.status === 'Cancelled' ? 'Scheduled' : 'Cancelled')
                                                },
                                                {
                                                    key: '2',
                                                    label: "Change Venue",
                                                    onClick: () => {
                                                        setSelectedLecture(item);
                                                        setIsModalOpen(true);
                                                    }
                                                }
                                            ]
                                        }}
                                    >
                                        <Button icon={<MoreVertical size={16} />}>Manage</Button>
                                    </Dropdown>
                                </div>
                            </div>
                        </Card1>
                    ))
                }
            </Space>

            <ChangeVenueModal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onSubmit={handleVenueSubmit}
                currentRoom={selectedLecture?.rooms[0]?.roomCode}
            />
        </Card1>
    );
};


export default TodaysClasses;
