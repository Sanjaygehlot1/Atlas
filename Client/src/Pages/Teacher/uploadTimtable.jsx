import React, { useState } from 'react';
import { Form, Select, Button, Upload, Typography, message, Row, Col, ConfigProvider,App } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { uploadTimetable } from '../../Slices/Timetable';

const { Title, Text } = Typography;
const { Option } = Select;

const TimetableUploadForm = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const { message } = App.useApp();
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
    formData.append('file', fileList[0]); 

    setIsUploading(true);

    try {
      console.log(fileList)
      console.log("--- FormData Content ---");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      
      const response = await uploadTimetable(formData);
      console.log(response);
      message.success(response.message || 'Timetable processed successfully!');
      
      form.resetFields();
      setFileList([]);

    } catch (error) {
      const errorMessage = error.response?.data?.error || 'An unexpected error occurred during the upload.';
      message.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

 
  const uploadProps = {
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      setFileList([file]);
    
      return false;
    },
    fileList,
    maxCount: 1,
    accept: ".xlsx, .xls", // We only accept Excel files.
  };

  return (
      <Row 
        justify="center" 
        align="middle" 
        style={{ 
          minHeight: '100vh', 
          background: '#f0f2f5', 
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
              initialValues={{ year: 'TE' }} 
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
    
  );
};

const TimetableUpload = () => (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          fontFamily: 'Inter, sans-serif',
          borderRadius: 8,
        },
      }}
    >
      <App>
        <TimetableUploadForm />
      </App>
    </ConfigProvider>
);

export default TimetableUpload;

