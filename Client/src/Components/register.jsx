
import  { useState } from 'react';
import { Form, Input, Button, Typography, message, Card, Steps, Alert } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Step } = Steps;

const RegisterPage = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [registrationData, setRegistrationData] = useState(null);
    const [emailPreviewUrl, setEmailPreviewUrl] = useState('');
    const navigate = useNavigate();

    const registerAndSendCode = async (name, email, password) => {
        const response = await axios.post('/api/users/register', { name, email, password });
        return response.data;
    };
    
    const verifyCodeAndLogin = async (email, verificationCode) => {
        const response = await axios.post('/api/users/verify-email', { email, verificationCode });
       
    };

    const handleRegisterSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await registerAndSendCode(values.name, values.email, values.password);
            console.log('Registration response:',values);
            setRegistrationData({ ...values });
            setEmailPreviewUrl(response.data.previewUrl); 
            message.success(`Verification code sent to ${values.email}. Please check your inbox.`);
            setCurrentStep(1); 
        } catch (error) {
            message.error(error.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifySubmit = async (values) => {
        setLoading(true);
        try {
            await verifyCodeAndLogin(registrationData.email, values.verificationCode);
            message.success('Verification successful! Welcome.');
            navigate('/dashboard'); // Redirect to dashboard after successful verification
        } catch (error) {
            message.error(error.response?.data?.message || 'Verification failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
            <Card style={{ width: 450 }}>
                <Steps current={currentStep} style={{ marginBottom: 24 }}>
                    <Step title="Register" />
                    <Step title="Verify Email" />
                </Steps>
                
                {currentStep === 0 && (
                    <>
                        <Title level={3} style={{ textAlign: 'center' }}>Create Your Account</Title>
                        <Form name="register" onFinish={handleRegisterSubmit} layout="vertical">
                            {/* Form fields for name, email, password */}
                            <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="email" label="College Email" rules={[{ required: true, pattern: /@atharvacoe\.ac\.in$/ }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                                <Input.Password />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                                    Send Verification Code
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                )}

                {currentStep === 1 && (
                    <>
                        <Title level={3} style={{ textAlign: 'center' }}>Check Your Email</Title>
                        <p style={{ textAlign: 'center', marginBottom: 20 }}>
                            We've sent a 6-digit verification code to <strong>{registrationData?.email}</strong>.
                        </p>
                        {emailPreviewUrl && (
                            <Alert 
                                message="Test Environment Notice"
                                description={<>Email preview available here: <a href={emailPreviewUrl} target="_blank" rel="noopener noreferrer">View Email</a></>}
                                type="info"
                                showIcon
                                style={{ marginBottom: 20 }}
                            />
                        )}
                        <Form name="verify" onFinish={handleVerifySubmit} layout="vertical">
                            <Form.Item name="verificationCode" label="Verification Code" rules={[{ required: true, len: 6 }]}>
                                <Input placeholder="Enter 6-digit code" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                                    Verify and Register
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                )}
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Link to="/login">Back to Login</Link>
                </div>
            </Card>
        </div>
    );
};

export default RegisterPage;
