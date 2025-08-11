import React, { useState } from 'react';
import { Button, Card, Tag, Typography, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const AttendancePage = () => {
  const students = [
    { name: 'John Elipse', roll: 'BU/PS/2025/0012', status: 'Present' },
    { name: 'Gretchen Nolan', roll: 'BU/PS/2025/0009', status: 'Present' },
    { name: 'Belle Stark', roll: 'BU/PS/2024/0002', status: 'Absent' },
  ];

  const [attendance, setAttendance] = useState(students);

  const markStatus = (index, status) => {
    const updated = [...attendance];
    updated[index].status = status;
    setAttendance(updated);
  };

  const markAllPresent = () => {
    const updated = attendance.map((s) => ({ ...s, status: 'Present' }));
    setAttendance(updated);
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 'Present':
        return <Tag color="green">Present</Tag>;
      case 'Absent':
        return <Tag color="red">Absent</Tag>;
      case 'Excused':
        return <Tag color="gold">Excused</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <Title level={4} className="!mb-1">Attendance for S1 1B - English</Title>
          <Text type="secondary">April 12, 2025 | 12:05 PM - 01:05 PM</Text>
        </div>
        <Space>
          <Button type="primary" onClick={markAllPresent}>
            Mark All Present
          </Button>
          <Button >
            Saving...
          </Button>
        </Space>
      </div>

      <Space direction="vertical" size="middle" className="w-full">
        {attendance.map((student, idx) => (
          <Card key={idx} className="w-full rounded-xl shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <Text strong className="block text-lg">{student.name}</Text>
                <Text type="secondary" className="text-xs">{student.roll}</Text>
              </div>
              <Space wrap>
                {getStatusTag(student.status)}
                <Button icon={<CheckCircleOutlined />} onClick={() => markStatus(idx, 'Present')}>
                  Present
                </Button>
                <Button icon={<CloseCircleOutlined />} danger onClick={() => markStatus(idx, 'Absent')}>
                  Absent
                </Button>
                <Button icon={<ClockCircleOutlined />} onClick={() => markStatus(idx, 'Excused')}>
                  Excused
                </Button>
              </Space>
            </div>
          </Card>
        ))}
      </Space>
    </div>
  );
};

export default AttendancePage;
