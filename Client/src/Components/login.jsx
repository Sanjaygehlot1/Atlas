import React, { useState, useEffect } from 'react'; // 👈 Import useEffect
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
  Segmented,
  App,
  Spin
} from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, TeamOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

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
      <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 7L12 12M12 22V12M22 7L12 12M17 4.5L7 9.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <Title level={3} style={{ color: 'white', marginBottom: '12px' }}>
      Welcome Back!
    </Title>
    <Paragraph style={{ color: 'rgba(255, 255, 255, 0.85)', maxWidth: '300px' }}>
      Log in to access your academic dashboard, timetables, and more.
    </Paragraph>
  </div>
);


const LoginComponent = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(0);
  const [resetEmail, setResetEmail] = useState('');
  const navigate = useNavigate();
  const { login, user, isLoading} = useAuth();
  const { message } = App.useApp();

 useEffect(() => {
  if (!isLoading && user) {
    if (user.role === 'teacher') {
      navigate('/teacher/dashboard');
    } else if (user.role === 'student') {
      if (user.hasFilledDetails) {
        navigate('/student/dashboard');
      } else {
        navigate('/student/academic-info');
      }
    }
  }
  console.log(user)
}, [user, isLoading, navigate]);




  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await login(values.email, values.password);
      const loggedInUser = response.data.user;

      message.success(`Welcome back, ${loggedInUser.name}!`);

    } catch (error) {
      console.error('Login error:', error);
      message.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const showForgotPasswordModal = () => setIsModalVisible(true);
  const handleCancelModal = () => { /* ... */ };
  const handleSendResetCode = (values) => { /* ... */ };
  const handleVerifyCode = (values) => { /* ... */ };
  const handleResetPassword = (values) => { /* ... */ };


  if (isLoading) {
  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Spin size="large" tip="Checking session..." />
    </Row>
  );
}


  return (
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
        <Card style={{ boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)', borderRadius: '8px' }} styles={{ body: { padding: 0 } }}>
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
  );
};

const LoginPage = () => (
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
    <App>
      <LoginComponent />
    </App>
  </ConfigProvider>
);

export default LoginPage;
