import React, { useState } from 'react';
import { Modal, Input, Avatar, Descriptions, Space, Button, Typography, message } from 'antd';
import { UserOutlined, ReadOutlined, GiftOutlined, EditOutlined, MailOutlined, PhoneOutlined, SolutionOutlined, SaveOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ProfileModal = ({ isVisible, onClose, user, onSave }) => {
    if (!user) {
        return null;
    }

    const [isEditing, setIsEditing] = useState(false);
    const [editedPhone, setEditedPhone] = useState(user.phone || '');

    const handleSave = async () => {
        try {
            // Here you would call the onSave prop from the parent component
            // to update the user data in the backend or global state.
            await onSave({ ...user, phone: editedPhone });
            message.success('Profile updated successfully!');
            setIsEditing(false); // Switch back to view mode
        } catch (error) {
            console.error('Failed to save profile:', error);
            message.error('Failed to save changes.');
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedPhone(user.phone || ''); // Reset the input to the original value
    };

    const renderPhoneField = () => {
        if (isEditing) {
            return (
                <Descriptions.Item label="Phone" labelStyle={{ fontWeight: 'bold' }}>
                    <Input
                        value={editedPhone}
                        onChange={(e) => setEditedPhone(e.target.value)}
                        placeholder="Enter phone number"
                        prefix={<PhoneOutlined />}
                        onPressEnter={handleSave}
                    />
                </Descriptions.Item>
            );
        } else {
            return (
                <Descriptions.Item label="Phone" labelStyle={{ fontWeight: 'bold' }}>
                    <Space>
                        <PhoneOutlined />
                        {user.phone || 'N/A'}
                    </Space>
                </Descriptions.Item>
            );
        }
    };

    return (
        <Modal
            title={<span style={{ fontWeight: 'bold' }}>User Profile</span>}
            open={isVisible}
            onCancel={onClose}
            footer={isEditing ? [
                <Button key="cancel" onClick={handleCancelEdit}>Cancel</Button>,
                <Button key="save" type="primary" icon={<SaveOutlined />} onClick={handleSave}>Save</Button>
            ] : [
                <Button key="edit" onClick={() => setIsEditing(true)} icon={<EditOutlined />}>Edit Profile</Button>,
                <Button key="close" onClick={onClose}>Close</Button>,
            ]}
            centered
            bodyStyle={{ padding: '30px' }}
        >
            <Space direction="vertical" align="center" style={{ width: '100%', marginBottom: '20px' }}>
                <Avatar size={100} src={user.picture}>
                    <UserOutlined />
                </Avatar>
                <Title level={4} style={{ margin: '10px 0 0' }}>{user.name}</Title>
            </Space>

            <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Email" labelStyle={{ fontWeight: 'bold' }}>
                    <Space>
                        <MailOutlined />
                        {user.email}
                    </Space>
                </Descriptions.Item>
                
                {renderPhoneField()} {/* Use the helper function here */}

                <Descriptions.Item label="Class" labelStyle={{ fontWeight: 'bold' }}>
                    <Space>
                        <SolutionOutlined />
                        {user.class || 'N/A'}
                    </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Academic Year" labelStyle={{ fontWeight: 'bold' }}>
                    <Space>
                        <ReadOutlined />
                        {user.year && user.department ? `${user.year} - ${user.department}` : 'N/A'}
                    </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Date of Birth" labelStyle={{ fontWeight: 'bold' }}>
                    <Space>
                        <GiftOutlined />
                        {user.dob || 'N/A'}
                    </Space>
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};

export default ProfileModal;