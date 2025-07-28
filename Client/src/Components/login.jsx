import {useEffect, useState } from 'react';
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
import { Link, useNavigate } from 'react-router-dom'; 

import { loginUser } from '../Slices/AuthSlice';
const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
import { useAuth } from '../context/AuthContext';
const LoginIllustration = () => (
  <div style={{
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #1677ff 0%, #3a8dff 100%)',
    padding: '40px',
    color: 'white',
    textAlign: 'center',
    borderRadius: '8px 0 0 8px'
  }}>
    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '24px' }}>
      <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 7L12 12M12 22V12M22 7L12 12M17 4.5L7 9.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <Title level={3} style={{ color: 'white', marginBottom: '12px' }}>
      Welcome Back!
    </Title>
    <Paragraph style={{ color: 'rgba(255, 255, 255, 0.85)', maxWidth: '300px' }}>
      Log in to access your academic dashboard, timetables, and more.
    </Paragraph>
  </div>
);


const LoginPage = () => {
 
  const [loading, setLoading] = useState(false);
const {user} = useAuth();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(0);
  const [resetEmail, setResetEmail] = useState('');
  const navigate = useNavigate();
  const handleLogin = async (values) => {
    try {
      setLoading(true);
      console.log('Login form submitted with values:', values);
   
      const res = await loginUser(values)
      console.log('Login response:', res);
      setTimeout(() => {
        message.success(`Welcome back, ${values.email}!`);
        setLoading(false);
       navigate('/teacher/upload-timetable');
      }, 1500);
    } catch (error) {
      console.error('Login error:', error);
      message.error('Login failed. Please check your credentials and try again.');
      
    }finally{
      setLoading(false);
    }
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

 useEffect(() => {
    if (user) {
      navigate('/teacher/upload-timetable');
    }
  }, [user, navigate]);

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
        <Col xs={24} sm={22} md={20} lg={16} xl={14}>
          <Card style={{ boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)', borderRadius: '8px' }} bodyStyle={{ padding: 0 }}>
            <Row>
              <Col xs={0} md={10}>
                <LoginIllustration />
              </Col>
              
              <Col xs={24} md={14}>
                <div style={{ padding: '40px' }}>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <Title level={2}>Log In</Title>
                    <Text type="secondary">Enter your credentials to access your account.</Text>
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
                        size="large"
                      />
                    </Form.Item>

                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, message: 'Please input your Email!' },
                        { type: 'email', message: 'Please enter a valid email!' },
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
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                          <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                      </Col>
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
                </div>
              </Col>
            </Row>
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
            <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email' }]}>
              <Input placeholder="Enter your registered email" size="large" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">Send Reset Code</Button>
            </Form.Item>
          </Form>
        )}

        {forgotPasswordStep === 1 && (
          <Form name="verifyCode" onFinish={handleVerifyCode} layout="vertical">
            <Text style={{ display: 'block', textAlign: 'center', marginBottom: 16 }}>
              A 6-digit code has been sent to <strong>{resetEmail}</strong>.
            </Text>
            <Form.Item name="otp" label="Verification Code" rules={[{ required: true, message: 'Please enter the 6-digit code', len: 6 }]}>
              <Input placeholder="Enter 6-digit code" size="large" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">Verify Code</Button>
            </Form.Item>
          </Form>
        )}

        {forgotPasswordStep === 2 && (
          <Form name="resetPassword" onFinish={handleResetPassword} layout="vertical">
            <Form.Item name="newPassword" label="New Password" rules={[{ required: true, message: 'Please enter a new password' }]} hasFeedback>
              <Input.Password size="large" />
            </Form.Item>
            <Form.Item name="confirmPassword" label="Confirm New Password" dependencies={['newPassword']} hasFeedback rules={[{ required: true, message: 'Please confirm your new password' }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('newPassword') === value) { return Promise.resolve(); } return Promise.reject(new Error('The two passwords do not match!')); }, })]}>
              <Input.Password size="large" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">Reset Password</Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </ConfigProvider>
  );
};

export default LoginPage;
