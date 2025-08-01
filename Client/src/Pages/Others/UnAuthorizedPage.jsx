import { Button, Result, Row, Col} from 'antd';
import {  useNavigate } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';


const UnauthorizedIllustration = () => (
    <svg width="250" height="200" viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="evenodd">
            <path d="M200 110c-38.66 0-70 31.34-70 70s31.34 70 70 70 70-31.34 70-70-31.34-70-70-70z" fill="#FFF" stroke="#FFADD2" strokeWidth="2"/>
            <path d="M200 130v30" stroke="#F5222D" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="200" cy="175" r="3" fill="#F5222D"/>
            <path d="M110 250h180c11.046 0 20-8.954 20-20V130c0-11.046-8.954-20-20-20h-20" stroke="#91C3FF" strokeWidth="2" strokeLinecap="round"/>
            <path d="M110 110H90c-11.046 0-20 8.954-20 20v100c0 11.046 8.954 20 20 20h20" stroke="#91C3FF" strokeWidth="2" strokeLinecap="round"/>
            <rect fill="#FFF7E6" x="160" y="40" width="80" height="100" rx="8"/>
            <rect stroke="#FFD591" strokeWidth="2" x="160" y="40" width="80" height="100" rx="8"/>
            <path d="M220 80a20 20 0 00-40 0v20h40V80z" stroke="#FFA940" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
    </svg>
);

export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Col>
        <Result
          status="403"
          icon={<UnauthorizedIllustration />}
          title="403 - Access Denied"
          subTitle="Sorry, you do not have permission to access this page."
          extra={
            <Button 
              type="primary" 
              size="large" 
              icon={<HomeOutlined />} 
              onClick={() => navigate(-2)}
            >
              Go Back
            </Button>
          }
        />
      </Col>
    </Row>
  );
};
