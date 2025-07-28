import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  Row,
  Col,
  ConfigProvider,
  Checkbox,
  Modal,
  Steps,
  message,
  Segmented,
} from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, TeamOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'; // Assuming you are using React Router

const { Title, Text } = Typography;
const { Step } = Steps;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(0);
  const [resetEmail, setResetEmail] = useState('');

  const handleLogin = (values) => {
    setLoading(true);
    console.log('Login form submitted with values:', values);
    setTimeout(() => {
      message.success(`Welcome back, ${values.email}!`);
      setLoading(false);
    }, 1500);
  };

  const showForgotPasswordModal = () => setIsModalVisible(true);
  const handleCancelModal = () => {
    setIsModalVisible(false);
    setForgotPasswordStep(0); 
  };


  const handleSendResetCode = (values) => {
    console.log('Sending reset code to:', values.email);
    setResetEmail(values.email);
    message.info(`A password reset code has been sent to ${values.email}.`);
    setForgotPasswordStep(1); 
  };

  const handleVerifyCode = (values) => {
    console.log('Verifying OTP:', values.otp);
    message.success('Code verified successfully.');
    setForgotPasswordStep(2); 
  };

  const handleResetPassword = (values) => {
    console.log('Resetting password for:', resetEmail);
    message.success('Your password has been reset successfully. Please log in.');
    handleCancelModal();
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          fontFamily: 'Inter, sans-serif',
          borderRadius: 8,
        },
        components: {
          Segmented: {
            itemSelectedBg: '#1677ff',
            itemSelectedColor: '#fff',
          },
        },
      }}
    >
      <Row
        justify="center"
        align="middle"
        style={{
          minHeight: '100vh',
          background: '#f0f2f5',
          padding: '20px',
        }}
      >
        <Col xs={24} sm={20} md={12} lg={8} xl={7}>
          <Card
            style={{
              padding: '20px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Title level={2}>Welcome Back!</Title>
              <Text type="secondary">Log in to continue to your account.</Text>
            </div>

            <Form
              name="login"
              initialValues={{ remember: true, role: 'Student' }}
              onFinish={handleLogin}
              layout="vertical"
            >
              <Form.Item name="role">
                <Segmented
                  options={[
                    { label: 'Student', value: 'Student', icon: <UserOutlined /> },
                    { label: 'Teacher', value: 'Teacher', icon: <TeamOutlined /> },
                  ]}
                  block
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please input your Email!' },
                  { pattern: /@atharvacoe\.ac\.in$/, message: 'Please use your college email!' },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="College Email Address"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                  size="large"
                />
              </Form.Item>

              <Row justify="space-between" align="middle">
                <Col>
                  <a onClick={showForgotPasswordModal}>
                    Forgot password?
                  </a>
                </Col>
              </Row>

              <Form.Item style={{ marginTop: '24px' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{ width: '100%' }}
                  size="large"
                >
                  Log In
                </Button>
              </Form.Item>

              <Text style={{ textAlign: 'center', display: 'block' }}>
                Don't have an account? <Link to="/create-account">Register now</Link>
              </Text>
            </Form>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Reset Your Password"
        open={isModalVisible}
        onCancel={handleCancelModal}
        footer={null}
        destroyOnHidden
      >
        <Steps current={forgotPasswordStep} style={{ margin: '24px 0' }}>
          <Step title="Enter Email" />
          <Step title="Verify Code" />
          <Step title="New Password" />
        </Steps>

        {forgotPasswordStep === 0 && (
          <Form name="sendCode" onFinish={handleSendResetCode} layout="vertical">
            <Form.Item
              name="email"
              label="Email Address"
              rules={[{ required: true, type: 'email' }]}
            >
              <Input placeholder="Enter your registered email" size="large" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">
                Send Reset Code
              </Button>
            </Form.Item>
          </Form>
        )}

        {forgotPasswordStep === 1 && (
          <Form name="verifyCode" onFinish={handleVerifyCode} layout="vertical">
            <Text style={{ display: 'block', textAlign: 'center', marginBottom: 16 }}>
              A 6-digit code has been sent to <strong>{resetEmail}</strong>.
            </Text>
            <Form.Item
              name="otp"
              label="Verification Code"
              rules={[{ required: true, message: 'Please enter the 6-digit code', len: 6 }]}
            >
              <Input placeholder="Enter 6-digit code" size="large" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">
                Verify Code
              </Button>
            </Form.Item>
          </Form>
        )}

        {forgotPasswordStep === 2 && (
          <Form name="resetPassword" onFinish={handleResetPassword} layout="vertical">
            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[{ required: true, message: 'Please enter a new password' }]}
              hasFeedback
            >
              <Input.Password size="large" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Confirm New Password"
              dependencies={['newPassword']}
              hasFeedback
              rules={[
                { required: true, message: 'Please confirm your new password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password size="large" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </ConfigProvider>
  );
};



export default LoginPage;
