import { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  Row,
  Col,
  Steps,
  Spin,
  App,
} from 'antd';
import { MailOutlined, LockOutlined, UserOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
const { Title, Text } = Typography;
const { Step } = Steps;
import RegistrationIllustration from './Registrationllustration';

const RegisterPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { message } = App.useApp();

  const [form1] = Form.useForm();


  const handleAccountSubmit = async () => {
    try {
      setIsLoading(true);
      const values = await form1.validateFields();
      setFormData(values);

      console.log('Submitting account details to backend:', values);
      const response = await createUserAccount(values);
      message.success('Account created successfully! Please check your email for the verification code.');
      console.log('API Response:', response);
      setCurrentStep(1);
    } catch (error) {
      console.log('API or Validation Failed:', error);
      message.error(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySubmit = async () => {
    try {
      setIsLoading(true);
      await form1.validateFields();
      const verificationValues = form1.getFieldsValue();

      if (!verificationValues.verificationCode) {
        throw new Error('Could not capture verification code.');
      }

      const finalData = {
        email: formData.email,
        code: verificationValues.verificationCode
      };

      console.log('Submitting final verification data:', finalData);
      const response = await verifyUserwithCode(finalData);
      message.success('Verification successful! You can now log in.');
      navigate('/login');
      console.log('Verification API Response:', response);
    } catch (error) {
      if (error) {
        message.error(error.message);
      } else {
        message.error('An unexpected error occurred. Please try again.');
      }
      console.log('Verification Failed:', error);

    } finally {
      setIsLoading(false);
    }
  };

  const prevStep = () => {
    setCurrentStep(current => current - 1);
  };


  const steps = [
    {
      title: 'Account',
      content: (
        <Form form={form1} layout="vertical" name="accountForm">
          <Title level={4}>Create Your Account</Title>
          <Text type="secondary">Let's start with your name and login credentials.</Text>
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]} style={{ marginTop: '24px' }}>
            <Input prefix={<UserOutlined />} placeholder="e.g., John Doe" size="large" />
          </Form.Item>
          <Form.Item name="email" label="College Email" rules={[{ required: true }, { type: 'email' }, { pattern: /@atharvacoe\.ac\.in$/, message: 'Email must end with @atharvacoe.ac.in' }]}>
            <Input prefix={<MailOutlined />} placeholder="your.name@atharvacoe.ac.in" size="large" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }, { min: 6 }]} hasFeedback>
            <Input.Password prefix={<LockOutlined />} placeholder="Create a secure password" size="large" />
          </Form.Item>
          <Form.Item name="confirmPassword" label="Confirm Password" dependencies={['password']} hasFeedback rules={[{ required: true }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('password') === value) return Promise.resolve(); return Promise.reject(new Error('Passwords do not match!')); } })]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm your password" size="large" />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Verification',
      content: (

        <Form form={form1} layout="vertical" name="verificationForm">
          <Title level={4}>Email Verification</Title>
          <Text type="secondary">A 6-digit code has been sent to <strong>{formData.email}</strong>. Please enter it below.</Text>
          <Form.Item name="verificationCode" label="Verification Code" rules={[{ required: true, len: 6 }]} style={{ marginTop: '24px' }}>
            <Input prefix={<SafetyCertificateOutlined />} placeholder="Enter 6-digit code" size="large" style={{ textAlign: 'center' }} />
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh', background: '#f0f2f5', padding: '20px' }}>
      <Col xs={24} sm={22} md={20} lg={18} xl={16}>
        <Spin spinning={isLoading} tip="Processing...">
          <Card style={{ boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)', borderRadius: '8px' }} styles={{ body: { padding: 0 } }}>
            <Row>
              <Col xs={0} md={10} lg={12}><RegistrationIllustration /></Col>
              <Col xs={24} md={14} lg={12}>
                <div style={{ padding: '40px' }}>
                  <Title level={2} style={{ textAlign: 'center', marginBottom: '12px' }}>Student Registration</Title>
                  <Steps current={currentStep} style={{ marginBottom: '32px' }} size="small">
                    {steps.map(item => <Step key={item.title} title={item.title} />)}
                  </Steps>
                  <div>{steps[currentStep].content}</div>
                  <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
                    {currentStep > 0 && <Button style={{ width: '120px' }} size="large" onClick={prevStep}>Previous</Button>}
                    {currentStep < steps.length - 1 && <Button type="primary" style={{ width: '120px', marginLeft: 'auto' }} size="large" onClick={handleAccountSubmit}>Next</Button>}
                    {currentStep === steps.length - 1 && <Button type="primary" style={{ width: '100%' }} size="large" onClick={handleVerifySubmit}>Verify & Register</Button>}
                  </div>
                  <Text style={{ textAlign: 'center', display: 'block', marginTop: '24px' }}>
                    Already have an account? <Link to="/login">Log in here</Link>
                  </Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Spin>
      </Col>
    </Row>
  );
};



export default RegisterPage;
