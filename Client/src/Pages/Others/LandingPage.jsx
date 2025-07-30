import React from 'react';
import { Layout, Button, Row, Col, Typography, Card, Avatar, Space } from 'antd';
import {
  CalendarOutlined,
  BookOutlined,
  NotificationOutlined,
  RightOutlined,
  TeamOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom'; 

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const FeatureCard = ({ icon, title, description }) => (
  <Card
    bordered={false}
    style={{ textAlign: 'center', padding: '24px', borderRadius: '12px', height: '100%' }}
  >
    <div style={{ fontSize: '48px', color: '#1677ff', marginBottom: '16px' }}>{icon}</div>
    <Title level={4}>{title}</Title>
    <Paragraph type="secondary">{description}</Paragraph>
  </Card>
);


const LandingPage = () => {
  return (
    <Layout style={{ backgroundColor: '#fff' }}>
      <Header style={{
        background: '#fff',
        padding: '0 24px',
        borderBottom: '1px solid #f0f0f0',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ color: '#1677ff', margin: 0 }}>
              CollegeApp
            </Title>
          </Col>
          <Col>
            <Space>
              <Link to="/login">
                <Button icon={<LoginOutlined />}>Login</Button>
              </Link>
              <Link to="/create-account">
                <Button type="primary" icon={<TeamOutlined />}>Register</Button>
              </Link>
            </Space>
          </Col>
        </Row>
      </Header>

      <Content>
        <div style={{ background: '#f0f5ff', padding: '80px 24px', textAlign: 'center' }}>
          <Row justify="center">
            <Col xs={24} md={20} lg={16}>
              <Title style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '16px' }}>
                Your Academic Life, Simplified.
              </Title>
              <Paragraph style={{ fontSize: '18px', color: '#595959', maxWidth: '700px', margin: '0 auto 32px auto' }}>
                Access your timetables, manage lecture notes, and stay connected with your college community, all in one seamless platform.
              </Paragraph>
              <Link to="/register">
                <Button type="primary" size="large" style={{ height: '50px', padding: '0 40px', fontSize: '18px' }}>
                  Get Started <RightOutlined />
                </Button>
              </Link>
            </Col>
          </Row>
        </div>

        <div style={{ padding: '80px 24px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '16px' }}>
            Everything You Need to Succeed
          </Title>
          <Paragraph type="secondary" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 48px auto' }}>
            Our platform is designed to help students and teachers stay organized and focused on what matters most.
          </Paragraph>
          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} sm={12} lg={8}>
              <FeatureCard
                icon={<CalendarOutlined />}
                title="Dynamic Timetables"
                description="Instantly access your weekly class schedule. Always up-to-date, always available."
              />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <FeatureCard
                icon={<BookOutlined />}
                title="Lecture Notes"
                description="Organize and review your notes for every subject, ensuring you never miss a key concept."
              />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <FeatureCard
                icon={<NotificationOutlined />}
                title="Instant Notifications"
                description="Receive important updates, announcements, and reminders directly from the college."
              />
            </Col>
          </Row>
        </div>

        <div style={{ background: '#f0f5ff', padding: '80px 24px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '48px' }}>
            Loved by Students & Teachers
          </Title>
          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} md={12} lg={8}>
              <Card bordered={false} style={{ borderRadius: '12px', height: '100%' }}>
                <Paragraph>"This app has been a lifesaver! I can finally keep track of all my classes without any hassle. The interface is so clean and easy to use."</Paragraph>
                <Space>
                  <Avatar size="large" style={{ backgroundColor: '#1677ff' }}>JD</Avatar>
                  <div>
                    <Typography.Text strong>John Doe</Typography.Text><br />
                    <Typography.Text type="secondary">SE INFT Student</Typography.Text>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Card bordered={false} style={{ borderRadius: '12px', height: '100%' }}>
                <Paragraph>"As a teacher, managing schedules for multiple divisions was always a challenge. This platform simplifies everything. Highly recommended!"</Paragraph>
                <Space>
                  <Avatar size="large" style={{ backgroundColor: '#faad14' }}>JS</Avatar>
                  <div>
                    <Typography.Text strong>Jane Smith</Typography.Text><br />
                    <Typography.Text type="secondary">Professor, INFT Dept.</Typography.Text>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>

      <Footer style={{ textAlign: 'center', background: '#001529', color: 'rgba(255, 255, 255, 0.65)' }}>
        <Title level={4} style={{ color: 'white' }}>CollegeApp</Title>
        <Paragraph style={{ color: 'rgba(255, 255, 255, 0.45)' }}>
          Streamlining academic life for the students and faculty of Atharva College of Engineering.
        </Paragraph>
        <Space size="large" style={{ fontSize: '24px', margin: '24px 0' }}>
          <a href="#" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Twitter</a>
          <a href="#" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>LinkedIn</a>
          <a href="#" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>GitHub</a>
        </Space>
        <br />
        CollegeApp ©{new Date().getFullYear()} - Created with ❤️ for a better college experience.
      </Footer>
    </Layout>
  );
};



export default LandingPage;
