import React from 'react';
import { Menu } from 'antd';
import { AppstoreOutlined, CalendarOutlined, BookOutlined, BellOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';

const menuItems = [
    { key: '1', icon: <AppstoreOutlined />, label: 'Dashboard' },
    { key: '2', icon: <CalendarOutlined />, label: 'Full Timetable' },
    { key: '3', icon: <BookOutlined />, label: 'My Notes' },
    { key: '4', icon: <BellOutlined />, label: 'Announcements' },
    { key: '5', icon: <SettingOutlined />, label: 'Settings' },
    { key: '6', icon: <LogoutOutlined />, label: 'Logout' },
];

const SiderMenu = ({ selectedKey, handleMenuClick }) => {
    return (
        <Menu
            theme="light" // Switched to light theme
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{
                background: 'transparent',
                border: 'none',
                padding: '16px',
            }}
            itemHoverStyle={{
                backgroundColor: '#f5f5f5', // Very light gray on hover
                color: '#000', // Dark text on hover
                borderRadius: '8px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            itemSelectedColor="#000" // Dark text for selected item
            itemSelectedBg="#e8e8e8" // A light gray for the selected item's background
            itemActiveColor="#000"
            itemActiveBg="#e8e8e8"
            itemBorderRadius={8}
            itemMargin={4}
        />
    );
};

export default SiderMenu;