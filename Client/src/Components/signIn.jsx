// SignIn.tsx
import React,{useEffect, useState} from "react";
import { Button, Card, Typography, App } from "antd";
import {Link, useNavigate} from 'react-router-dom'
import { GoogleOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { AxiosInstance } from "../Axios/AxiosInstance";
import { useAuth } from "../context/AuthContext";

const { Title, Text } = Typography;

const SignIn = () => {

  const [Loading, setloading] = useState(false)
  const { login, user, isLoading} = useAuth();
  const { message } = App.useApp();
  const navigate = useNavigate();
  
  const handleGoogleSignIn = async  () => {
    // Redirect to your backend Google OAuth endpoint
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');

    try {
      setloading(true)
      const result = await signInWithPopup(auth,provider)
      const userData = result.user;

      if (!userData.email.endsWith('@atharvacoe.ac.in')) {
        await signOut(auth);
        message.error("Invalid email address. Please try again.");
        return;
      }
      const idToken = await userData.getIdToken(true);

      const response = await login(idToken)


      if (response.statusCode === 200 || response.statusCode === 201) {
        message.success(response.message || "Registration successful! Redirecting to login.");

        console.log("SSS")

      } else {
        console.log(response.data.error)
        const errorMessage = response.data.error || 'An error occurred with your registration. Please try again.';
        message.error(errorMessage);
        await signOut(auth);
      }

      console.log(userData)


    } catch (error) {
      console.error("Google Sign-In Failed:", error);
      const errorMessage = error?.response?.data?.message?.includes('auth/popup-closed-by-user')
        ? 'Sign-in window was closed.'
        : error?.response?.data?.message || error.message;

      message.error(errorMessage);
    } finally {
      setloading(false);
    }
  };



 useEffect(() => {
  if (!isLoading && user) {
    if (user.data.role === 'teacher') {
      navigate('/teacher/dashboard');
    } else if (user.role === 'student') {
      if (user.data.hasFilledDetails) {
        navigate('/student/dashboard');
      } else {
        navigate('/student/academic-info');
      }
    }
  }
  console.log(user)
}, [user, isLoading, navigate]);


  return (
  <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Dynamic Gradient Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-100 to-white animate-gradient-slow-pulse"></div>

      {/* Login Panel Container */}
      <div className="relative z-10 w-full max-w-sm shadow-2xl rounded-3xl overflow-hidden">
        {/* Login Form Panel */}
        <div className="p-8 flex flex-col justify-center bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg">
          <div className="text-center  mb-8">
            <img
              src="/logo.svg"
              alt="Atlas Logo"
              className="mx-auto h-32 w-32 sm:h-20 object-contain"
            />
          </div>

          <div className="text-center mb-6">
            <Title level={2} className="!text-blue-800 font-bold !text-2xl">
              Welcome Back!
            </Title>
            <Text type="secondary" className="!text-md !text-gray-500 mt-1">
              Please sign in to continue.
            </Text>
          </div>

          <Link to={`${import.meta.env.VITE_SERVER}/auth/google`}> 
          <Button
            type="primary"
            icon={<GoogleOutlined />}
            size="large"
            className="w-full h-12 text-lg bg-blue-600 hover:!bg-blue-700 text-white border-none transition-all duration-300 ease-in-out transform hover:scale-105 rounded-full"
          >
            Sign in with Google
          </Button>
          </Link>

          <div className="mt-6 text-center text-gray-500 text-xs sm:text-sm">
            By signing in, you agree to our{' '}
            <a href="/terms" className="text-blue-600 hover:underline font-medium">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-blue-600 hover:underline font-medium">
              Privacy Policy
            </a>
            .
          </div>
        </div>
      </div>
    </div>


  );
};

export default SignIn;
