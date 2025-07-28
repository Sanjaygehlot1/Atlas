import {
  Typography
} from 'antd';


const { Title, Paragraph } = Typography;

function Registrationllustration() {
  return (
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
      Join Our Academic Community
    </Title>
    <Paragraph style={{ color: 'rgba(255, 255, 255, 0.85)', maxWidth: '300px' }}>
      Access your timetables, notes, and college resources all in one place.
    </Paragraph>
  </div>
  )
}

export default Registrationllustration
