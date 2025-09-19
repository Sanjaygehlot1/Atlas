import React, { useState } from 'react';
import { Modal, Input, Button, Upload, Form, message, Space } from 'antd';
import { UploadOutlined, FilePdfOutlined, FileTextOutlined } from '@ant-design/icons';
import { uploadNote } from '../../Slices/notesSlice.js';

const UploadNoteModal = ({ subject, isOpen, onClose, onUploadSuccess }) => {
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (values) => {
    setUploading(true);
    try {
      const { title, topic, description, file } = values;
      const fileList = file?.fileList || [];
      const noteFile = fileList[0]?.originFileObj;

      if (!noteFile) {
        message.error('Please select a file to upload.');
        setUploading(false);
        return;
      }

      await uploadNote({
        title,
        topic,
        description,
        subjectName: subject.name,
        file: noteFile
      });

      message.success('Note uploaded successfully!');
      onUploadSuccess();
      onClose();
    } catch (err) {
      console.error('Upload error:', err);
      message.error('Failed to upload note. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <Modal
      title={`Upload Note for ${subject?.name}`}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please enter a title for the note.' }]}
        >
          <Input placeholder="E.g., Lecture 1: Introduction to Physics" />
        </Form.Item>

        <Form.Item
          name="topic"
          label="Topic"
        >
          <Input placeholder="E.g., Kinematics" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea rows={3} placeholder="A brief description of the note content." />
        </Form.Item>

        <Form.Item
          name="file"
          label="Note File"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: 'Please upload a file.' }]}
          extra="Supported formats: PDF, DOCX, PPTX"
        >
          <Upload 
            name="file" 
            beforeUpload={() => false} // Prevent automatic upload
            listType="text"
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>

        <Form.Item className="flex justify-end mt-4">
          <Space>
            <Button onClick={onClose} disabled={uploading}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={uploading}>
              Upload Note
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UploadNoteModal;