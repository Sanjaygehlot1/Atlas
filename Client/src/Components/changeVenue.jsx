import React, { useEffect } from 'react';
import { Modal, Form, Select, message } from 'antd';

const { Option } = Select;

/**
 * A corrected and robust modal component for changing a lecture's venue.
 * It now properly uses Ant Design's form management.
 * @param {boolean} open - Controls if the modal is visible.
 * @param {function} onCancel - Function to call when the modal is cancelled.
 * @param {function} onSubmit - Function to call with the new room value on submission.
 * @param {string} currentRoom - The current room of the lecture.
 */
const ChangeVenueModal = ({ open, onCancel, onSubmit, currentRoom }) => {
  // Use Ant Design's form instance to manage form state
  const [form] = Form.useForm();

  // Use useEffect to set the initial value of the form when the modal opens
  useEffect(() => {
    if (open) {
      form.setFieldsValue({ newRoom: currentRoom || '' });
    }
  }, [open, currentRoom, form]);

  const handleOk = () => {
    // Validate the form fields before submitting
    form.validateFields()
      .then(values => {
        // The onSubmit function is called with the new room value
        onSubmit(values.newRoom);
        form.resetFields(); // Reset the form after successful submission
      })
      .catch(info => {
        console.log('Validate Failed:', info);
        message.error("Please select a valid room.");
      });
  };

  return (
    <Modal
      title="Change Lecture Venue"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Confirm Change"
      cancelText="Cancel"
      destroyOnClose // This ensures the form is reset every time it's closed
    >
      <Form
        form={form}
        layout="vertical"
        name="changeVenueForm"
        initialValues={{ newRoom: currentRoom || '' }}
      >
        <Form.Item
          name="newRoom"
          label="New Room or Venue"
          rules={[{ required: true, message: 'Please select a new room!' }]}
        >
          <Select
            showSearch
            placeholder="Select or type a new room (e.g., R1)"
            size="large"
          >
            {/* You can map over an array of available rooms here */}
            <Option value="R1">R1</Option>
            <Option value="R2">R2</Option>
            <Option value="R3">R3</Option>
            <Option value="R4">R4</Option>
            <Option value="R5">R5</Option>
            <Option value="R6">R6</Option>
            <Option value="R7">R7</Option>
            <Option value="R8">R8</Option>
            <Option value="R9">R9</Option>
            <Option value="Lab 1">Lab 1</Option>
            <Option value="Lab 2">Lab 2</Option>
            <Option value="Lab 3">Lab 3</Option>
            <Option value="Lab 4">Lab 4</Option>
            <Option value="Lab 5">Lab 5</Option>
            <Option value="Lab 6">Lab 6</Option>
            <Option value="Lab 7">Lab 7</Option>
            <Option value="Lab 8">Lab 8</Option>
            <Option value="SM 1">SM 1</Option>
            <Option value="SM 2">SM 2</Option>
            <Option value="SM 3">SM 3</Option>
            <Option value="SM 4">SM 4</Option>
            <Option value="SM 5">SM 5</Option>
            <Option value="SM 6">SM 6</Option>
            <Option value="SM 7">SM 7</Option>
            <Option value="Smart Classroom">Smart Classroom</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangeVenueModal;
