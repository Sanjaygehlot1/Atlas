import React, { useState } from 'react';
import { Form, Select, Button, Upload, Typography, message, Row, Col, ConfigProvider } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

const TimetableUploadForm = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  /**
   * This function is triggered when the user submits the form.
   * It handles form validation, file preparation, and the API call to the backend.
   * @param {object} values - The values from the form fields (e.g., the selected year).
   */
  const onFinish = async (values) => {
    if (fileList.length === 0) {
      message.error('Please select an Excel file to upload!');
      return;
    }

    const formData = new FormData();
    formData.append('year', values.year);
    formData.append('file', fileList[0].originFileObj); 

    setIsUploading(true);

    try {
      const API_URL = '/api/timetable/upload'; 
      
      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Display a success message from the server.
      message.success(response.data.message || 'Timetable processed successfully!');
      
      // Reset the form and file list after a successful upload.
      form.resetFields();
      setFileList([]);

    } catch (error) {
      // Provide detailed and user-friendly error feedback.
      const errorMessage = error.response?.data?.error || 'An unexpected error occurred during the upload.';
      message.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Configuration for the Ant Design Upload component.
   */
  const uploadProps = {
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      // We only want to handle one file at a time.
      setFileList([file]);
      // Returning false prevents the component from uploading the file automatically.
      // We will handle the upload manually when the form is submitted.
      return false;
    },
    fileList,
    maxCount: 1,
    accept: ".xlsx, .xls", // We only accept Excel files.
  };

  return (
    // We use ConfigProvider to set a global theme for Ant Design components.
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff', // A modern blue color for primary actions.
          fontFamily: 'Inter, sans-serif',
          borderRadius: 8,
        },
      }}
    >
      <Row 
        justify="center" 
        align="middle" 
        style={{ 
          minHeight: '100vh', 
          background: '#f0f2f5', // A light grey background for better contrast.
          padding: '20px' 
        }}
      >
        <Col xs={24} sm={22} md={16} lg={12} xl={10}>
          <div 
            style={{ 
              padding: '40px', 
              border: '1px solid #e8e8e8', 
              borderRadius: '12px', 
              background: '#ffffff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // A subtle shadow for depth.
            }}
          >
            <Title level={2} style={{ textAlign: 'center', marginBottom: '16px' }}>
              Upload Timetable
            </Title>
            <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: '32px' }}>
              Select the academic year and upload the corresponding timetable file.
            </Text>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{ year: 'SE' }} // Set a default value for the year.
            >
              <Form.Item
                name="year"
                label="Select Year"
                rules={[{ required: true, message: 'Please select an academic year!' }]}
              >
                <Select placeholder="Select the academic year for the timetable">
                  <Option value="FE">First Year (FE)</Option>
                  <Option value="SE">Second Year (SE)</Option>
                  <Option value="TE">Third Year (TE)</Option>
                  <Option value="BE">Fourth Year (BE)</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Timetable File"
                required
              >
                <Upload.Dragger {...uploadProps}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined style={{ color: '#1890ff' }} />
                  </p>
                  <p className="ant-upload-text">Click or drag Excel file to this area to upload</p>
                  <p className="ant-upload-hint">
                    Please upload the complete timetable for the selected year. Only .xlsx and .xls files are accepted.
                  </p>
                </Upload.Dragger>
              </Form.Item>

              <Form.Item style={{ marginTop: '24px' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isUploading}
                  style={{ width: '100%' }}
                  size="large"
                >
                  {isUploading ? 'Processing...' : 'Submit Timetable'}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </ConfigProvider>
  );
};

// To use this component in your application, you would typically export it as the default.
// For example, in your main App.js file:
// import TimetableUploadForm from './components/TimetableUploadForm';
// function App() { return <TimetableUploadForm />; }
export default TimetableUploadForm;
