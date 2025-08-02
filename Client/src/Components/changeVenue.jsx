import { Modal, Input, Form, message } from 'antd';
import { useState } from 'react';

const ChangeVenueModal = ({ open, onCancel, onSubmit, currentRoom }) => {
  const [newRoom, setNewRoom] = useState(currentRoom || '');

  const handleOk = () => {
    if (!newRoom.trim()) {
      message.error("Please enter a valid room number.");
      return;
    }
    onSubmit(newRoom.trim());
    setNewRoom('');
  };

  const handleCancel = () => {
    onCancel();
    setNewRoom('');
  };

  return (
    <Modal
      title="Change Lecture Venue"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Confirm"
      cancelText="Cancel"
    >
      <Form layout="vertical">
        <Form.Item label="New Room Number">
          <Input
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
            placeholder="Enter new room (e.g., B101)"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangeVenueModal;
