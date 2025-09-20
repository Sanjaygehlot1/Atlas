import React from 'react';
import { Modal, List, Typography, Avatar, Space, Tag } from 'antd';
import { NotificationOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const NotificationModal = ({ isVisible, onClose, notifications = [] }) => {
    return (
        <Modal
            title={
                <Space>
                    <NotificationOutlined style={{ color: "#1890ff" }} />
                    <span style={{ fontWeight: 'bold' }}>Notifications</span>
                </Space>
            }
            open={isVisible}
            onCancel={onClose}
            footer={null}
            centered
            bodyStyle={{ padding: '20px', maxHeight: '70vh', overflowY: 'auto' }}
        >
            {notifications.length === 0 ? (
                <Text type="secondary">No notifications yet.</Text>
            ) : (
                <List
                    itemLayout="vertical"
                    dataSource={notifications}
                    renderItem={(item, index) => (
                        <List.Item key={index}>
                            <List.Item.Meta
                                avatar={<Avatar icon={<UserOutlined />} />}
                                title={
                                    <Space>
                                        <Text strong>{item.title}</Text>
                                        <Tag color="blue">{item.author || "System"}</Tag>
                                    </Space>
                                }
                                description={
                                    <Space direction="vertical" style={{ width: "100%" }}>
                                        <Text>{item.message}</Text>
                                        <Space size="small" style={{ color: "#888" }}>
                                            <ClockCircleOutlined />
                                            <Text type="secondary">
                                                {new Date(item.date).toLocaleString()}
                                            </Text>
                                        </Space>
                                    </Space>
                                }
                            />
                        </List.Item>
                    )}
                />
            )}
        </Modal>
    );
};

export default NotificationModal;
