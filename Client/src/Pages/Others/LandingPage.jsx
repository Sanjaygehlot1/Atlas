
import React from "react";
import {
  Layout,
  Button,
  Row,
  Col,
  Typography,
  Card,
  Avatar,
  Space
} from "antd";
import {
  CalendarOutlined,
  BookOutlined,
  NotificationOutlined,
  RightOutlined,
  TeamOutlined,
  LoginOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};


// CSS pattern utility (can go in a CSS file or styled-components)
const dottedBg = {
  backgroundImage: `
    radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px),
    linear-gradient(135deg, #dfe9ff, #f0f5ff)
  `,
  backgroundSize: "20px 20px",
};

const gridBg = {
  backgroundImage: `
    linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px),
    linear-gradient(135deg, #e6f0ff, #f9fbff)
  `,
  backgroundSize: "20px 20px, 20px 20px, 100% 100%",
};


const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.05, rotate: 1 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Card
      variant="borderless"
      style={{
        textAlign: "center",
        padding: "24px",
        borderRadius: "16px",
        height: "100%",
        background: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)"
      }}
    >
      <div style={{ fontSize: "48px", color: "#1677ff", marginBottom: "16px" }}>
        {icon}
      </div>
      <Title level={4}>{title}</Title>
      <Paragraph type="secondary">{description}</Paragraph>
    </Card>
  </motion.div>
);

const LandingPage = () => {
  return (
    <Layout style={{ background: "linear-gradient(135deg, #f0f5ff, #e6f0ff)" }}>
      {/* HEADER */}
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Header
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(50px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Title
                level={3}
                style={{
                  color: "#1677ff",
                  margin: 0,
                  fontWeight: "bold",
                  letterSpacing: "0.5px"
                }}
              >
                Atlas
              </Title>
            </Col>
            <Col>
              <Space>
                <Link to="/sign-in">
                  <Button icon={<LoginOutlined />} style={{ backdropFilter: "blur(6px)" }}>
                    Login
                  </Button>
                </Link>
                <Link to="/sign-in">
                  <Button
                    type="primary"
                    icon={<TeamOutlined />}
                    style={{ backdropFilter: "blur(6px)" }}
                  >
                    Sign Up
                  </Button>
                </Link>
              </Space>
            </Col>
          </Row>
        </Header>

      </motion.div>

      {/* HERO */}
      <Content>
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          style={{
            padding: "100px 24px",
            textAlign: "center",
            ...dottedBg
          }}
        >
          <Row justify="center">
            <Col xs={24} md={20} lg={16}>
              <Title
                style={{
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  marginBottom: "16px"
                }}
              >
                Your Academic Life, Simplified.
              </Title>
              <Paragraph
                style={{
                  fontSize: "18px",
                  color: "#595959",
                  maxWidth: "700px",
                  margin: "0 auto 32px auto"
                }}
              >
                Access your timetables, manage lecture notes, and stay connected
                with your college community, all in one seamless platform.
              </Paragraph>
              <Link to="/sign-in">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    type="primary"
                    size="large"
                    style={{
                      height: "50px",
                      padding: "0 40px",
                      fontSize: "18px",
                      borderRadius: "30px"
                    }}
                  >
                    Get Started <RightOutlined />
                  </Button>
                </motion.div>
              </Link>
            </Col>
          </Row>
        </motion.section>

        {/* FEATURES */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          style={{
            padding: "80px 24px",
            ...gridBg
          }}
        >
          <Title
            level={2}
            style={{ textAlign: "center", marginBottom: "16px" }}
          >
            Everything You Need to Succeed
          </Title>
          <Paragraph
            type="secondary"
            style={{
              textAlign: "center",
              maxWidth: "600px",
              margin: "0 auto 48px auto"
            }}
          >
            Our platform is designed to help students and teachers stay
            organized and focused on what matters most.
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
        </motion.section>

        {/* TESTIMONIALS */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          style={{
            padding: "80px 24px",
            backgroundImage: `
      radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px),
      linear-gradient(135deg, #f0f5ff, #e6f0ff)
    `,
            backgroundSize: "18px 18px, 100% 100%"
          }}
        >
          <Title
            level={2}
            style={{ textAlign: "center", marginBottom: "48px" }}
          >
            Loved by Students & Teachers
          </Title>
          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} md={12} lg={8}>
              <motion.div whileHover={{ scale: 1.02 }}>
                <Card
                  variant="borderless"
                  style={{
                    borderRadius: "12px",
                    height: "100%",
                    background: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(6px)"
                  }}
                >
                  <Paragraph>
                    "This app has been a lifesaver! I can finally keep track of
                    all my classes without any hassle. The interface is so clean
                    and easy to use."
                  </Paragraph>
                  <Space>
                    <Avatar size="large" style={{ backgroundColor: "#1677ff" }}>
                      JD
                    </Avatar>
                    <div>
                      <Typography.Text strong>John Doe</Typography.Text>
                      <br />
                      <Typography.Text type="secondary">
                        SE INFT Student
                      </Typography.Text>
                    </div>
                  </Space>
                </Card>
              </motion.div>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <motion.div whileHover={{ scale: 1.02 }}>
                <Card
                  variant="borderless"
                  style={{
                    borderRadius: "12px",
                    height: "100%",
                    background: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(6px)"
                  }}
                >
                  <Paragraph>
                    "As a teacher, managing schedules for multiple divisions was
                    always a challenge. This platform simplifies everything.
                    Highly recommended!"
                  </Paragraph>
                  <Space>
                    <Avatar size="large" style={{ backgroundColor: "#faad14" }}>
                      JS
                    </Avatar>
                    <div>
                      <Typography.Text strong>Jane Smith</Typography.Text>
                      <br />
                      <Typography.Text type="secondary">
                        Professor, INFT Dept.
                      </Typography.Text>
                    </div>
                  </Space>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </motion.section>
      </Content>

      {/* FOOTER */}
      <Footer
        style={{
          textAlign: "center",
          background: "#001529",
          color: "rgba(255, 255, 255, 0.65)",
          padding: "40px 24px"
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Title level={4} style={{ color: "white" }}>
            CollegeApp
          </Title>
          <Paragraph style={{ color: "rgba(255, 255, 255, 0.45)" }}>
            Streamlining academic life for the students and faculty of Atharva
            College of Engineering.
          </Paragraph>
          <Space size="large" style={{ fontSize: "24px", margin: "24px 0" }}>
            <motion.a whileHover={{ scale: 1.2 }} href="#" style={{ color: "rgba(255, 255, 255, 0.85)" }}>
              Twitter
            </motion.a>
            <motion.a whileHover={{ scale: 1.2 }} href="#" style={{ color: "rgba(255, 255, 255, 0.85)" }}>
              LinkedIn
            </motion.a>
            <motion.a whileHover={{ scale: 1.2 }} href="#" style={{ color: "rgba(255, 255, 255, 0.85)" }}>
              GitHub
            </motion.a>
          </Space>
          <br />
          CollegeApp ©{new Date().getFullYear()} - Created with ❤️ for a better
          college experience.
        </motion.div>
      </Footer>
    </Layout>
  );
};

export default LandingPage;
