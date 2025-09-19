import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  console.log(user)

  if (isLoading) {
     return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Spin size="large" tip="Checking session..." />
    </Row>
  ); 
  }

  if (user) {
    if (user.role === 'teacher') return <Navigate to="/teacher/dashboard" />;
    if (user.role === 'student') {
      return <Navigate to={user.hasFilledDetails ? "/student/dashboard" : "/student/academic-info"} />;
    }
  }

  return children;
};

export default PublicRoute;
