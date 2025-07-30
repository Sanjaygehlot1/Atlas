import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    Button,
    Typography,
    Card,
    Row,
    Col,
    ConfigProvider,
    Select,
    message,
    Spin,
    App,
    Steps,
    DatePicker,
    Upload,
    Avatar,
} from 'antd';
import {
    UserOutlined,
    NumberOutlined,
    UsergroupAddOutlined,
    SaveOutlined,
    BookOutlined,
    CalendarOutlined,
    PhoneOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { updateAcademicInfo } from '../../Slices/AuthSlice';

const { Title, Text } = Typography;
const { Option } = Select;
const { Step } = Steps;


const AcademicInfoComponent = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();
    const { message } = App.useApp();
    const { user } = useAuth();
    const [form] = Form.useForm();

    const updateAcademics = async (values) => {
        console.log("Updating academics with:", values);
        const res = await updateAcademicInfo({...values, studentClass : values.studentClass});
        console.log(res);
        
    };

    useEffect(() => {
        if (user) {
            form.setFieldsValue({ name: user.name });
        }
    }, [user, form]);

    const handleNext = async () => {
        try {
            const values = await form.validateFields();
            setFormData(prev => ({ ...prev, ...values }));
            setCurrentStep(current => current + 1);
        } catch (error) {
            message.error("Please fill in all required fields.");
        }
    };

    const handlePrev = () => {
        setCurrentStep(current => current - 1);
    };

    const handleFormSubmit = async () => {
        try {
            setIsLoading(true);
            const values = await form.validateFields();
            const finalData = { ...formData, ...values };

            console.log('Submitting final academic details:', finalData);
            await updateAcademics(finalData);

            message.success('Your details have been saved successfully!');
            navigate('/student/dashbaord');
        } catch (error) {
            console.error('Failed to update academic info:', error);
            message.error(error.response?.data?.message || 'Failed to save details. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const steps = [
        {
            title: 'Personal Info',
            content: (
                <>
                    <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                        <Input prefix={<UserOutlined />} placeholder="e.g., John Doe" size="large" />
                    </Form.Item>
                    <Form.Item name="dob" label="Date of Birth" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} size="large" />
                    </Form.Item>
                    <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
                        <Select placeholder="Select Gender" size="large">
                            <Option value="male">Male</Option>
                            <Option value="female">Female</Option>
                            <Option value="other">Other</Option>
                        </Select>
                    </Form.Item>
                </>
            ),
        },
        {
            title: 'Academic Info',
            content: (
                <>
                    <Form.Item name="department" label="Department" rules={[{ required: true }]}>
                        <Select placeholder="Select your department" size="large" suffixIcon={<BookOutlined />}>
                            <Option value="INFT">INFT</Option><Option value="CMPN">CMPN</Option><Option value="EXTC">EXTC</Option><Option value="ECS">ECS</Option>
                        </Select>
                    </Form.Item>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item name="year" label="Year" rules={[{ required: true }]}>
                                <Select placeholder="Select Year" size="large" suffixIcon={<CalendarOutlined />}>
                                    <Option value="FE">FE</Option><Option value="SE">SE</Option><Option value="TE">TE</Option><Option value="BE">BE</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="studentClass" label="Class" rules={[{ required: true }]}>
                                <Select placeholder="Select Class" size="large" suffixIcon={<UsergroupAddOutlined />}>
                                    <Option value="Class 1">Class 1</Option><Option value="Class 2">Class 2</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="rollNo" label="Roll Number" rules={[{ required: true }]}>
                        <Input prefix={<NumberOutlined />} placeholder="Enter your 2-digit roll number" size="large" maxLength={2} />
                    </Form.Item>
                </>
            ),
        },
        {
            title: 'Other Details',
            content: (
                <>
                    <Form.Item name="contactNumber" label="Contact Number" rules={[{ required: true, pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit number.' }]}>
                        <Input prefix={<PhoneOutlined />} placeholder="Your 10-digit mobile number" size="large" />
                    </Form.Item>
                   
                </>
            ),
        },
    ];

    return (
        <Row justify="center" align="middle" style={{ minHeight: '100vh', background: '#f0f2f5', padding: '20px' }}>
            <Col xs={24} sm={22} md={20} lg={16} xl={12}>
                <Spin spinning={isLoading} tip="Saving Details...">
                    <Card style={{ boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)', borderRadius: '12px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <Title level={2}>Complete Your Profile</Title>
                            <Text type="secondary">This information helps us personalize your experience.</Text>
                        </div>

                        <Steps current={currentStep} style={{ marginBottom: '32px' }}>
                            {steps.map(item => <Step key={item.title} title={item.title} />)}
                        </Steps>

                        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                            <div>{steps[currentStep].content}</div>

                            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between' }}>
                                {currentStep > 0 && (
                                    <Button size="large" style={{ width: '120px' }} onClick={handlePrev}>
                                        Previous
                                    </Button>
                                )}
                                {currentStep < steps.length - 1 && (
                                    <Button type="primary" size="large" style={{ width: '120px', marginLeft: 'auto' }} onClick={handleNext}>
                                        Next
                                    </Button>
                                )}
                                {currentStep === steps.length - 1 && (
                                    <Button type="primary" htmlType="submit" size="large" style={{ width: '100%' }} icon={<SaveOutlined />}>
                                        Save & Continue
                                    </Button>
                                )}
                            </div>
                        </Form>
                    </Card>
                </Spin>
            </Col>
        </Row>
    );
};

const AcademicInfoPage = () => (
    <ConfigProvider theme={{ token: { colorPrimary: '#1677ff', fontFamily: 'Inter, sans-serif', borderRadius: 8 } }}>
        <App>
            <AcademicInfoComponent />
        </App>
    </ConfigProvider>
);

export default AcademicInfoPage;
