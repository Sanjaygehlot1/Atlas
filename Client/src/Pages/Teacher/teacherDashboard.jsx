import React, { useState } from 'react';
import { FaUserGraduate, FaUsers, FaChalkboardTeacher, FaBars } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

const Sidebar = ({ activePage, setActivePage }) => {
  const menuItems = [
    { name: 'Dashboard', icon: <MdDashboard />, key: 'dashboard' },
    { name: 'Student Management', icon: <FaUserGraduate />, key: 'students' },
    { name: 'Attendance', icon: <FaChalkboardTeacher />, key: 'attendance' },
    { name: 'Users', icon: <FaUsers />, key: 'users' },
  ];

  return (
    <div className="bg-white w-64 min-h-screen shadow-md p-4">
      <h1 className="text-xl font-bold mb-6">Unique High</h1>
      <ul>
        {menuItems.map(item => (
          <li
            key={item.key}
            className={`flex items-center gap-2 p-2 mb-2 rounded cursor-pointer hover:bg-gray-100 ${activePage === item.key ? 'bg-gray-200' : ''}`}
            onClick={() => setActivePage(item.key)}
          >
            {item.icon} {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

const AttendancePage = () => {
  const students = [
    { id: 'BU/PS/2025/0012', name: 'John Elipse' },
    { id: 'BU/PS/2025/0009', name: 'Gretchen Nolan' },
    { id: 'BU/PS/2024/0002', name: 'Belle Stark' },
  ];

  const [attendance, setAttendance] = useState({});

  const handleMark = (id, status) => {
    setAttendance(prev => ({ ...prev, [id]: status }));
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Attendance for S1 1B - English</h2>
      <div className="mb-4 flex gap-4">
        <input type="date" className="border p-2 rounded" />
        <input type="time" className="border p-2 rounded" />
        <input type="time" className="border p-2 rounded" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Mark All Present</button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Student</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.id}>
              <td className="border p-2">{s.name} <span className="text-sm text-gray-500">({s.id})</span></td>
              <td className="border p-2">{attendance[s.id] || 'Not Marked'}</td>
              <td className="border p-2 flex gap-2">
                <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => handleMark(s.id, 'Present')}>Present</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleMark(s.id, 'Absent')}>Absent</button>
                <button className="bg-yellow-500 text-white px-2 py-1 rounded" onClick={() => handleMark(s.id, 'Excused')}>Excused</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Dashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'attendance':
        return <AttendancePage />;
      default:
        return <div className="p-6 text-lg">Welcome to the dashboard!</div>;
    }
  };

  return (
    <div className="flex">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 bg-gray-50 min-h-screen">{renderPage()}</div>
    </div>
  );
};

export default Dashboard;