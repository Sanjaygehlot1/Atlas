import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import RegisterPage from './Components/register.jsx'
import LoginPage from './Components/login.jsx'
import TimetableUploadForm from './Pages/Teacher/uploadTimtable.jsx'
import Dashboard from './Pages/Teacher/teacherDashboard.jsx'
import LandingPage from './Pages/Others/LandingPage.jsx'
import StudentDashboard from './Pages/Student/studentDashboard.jsx'
import AcademicInfoComponent from './Pages/Student/academicInfo.jsx'
import AcademicInfoPage from './Pages/Student/academicInfo.jsx'

const router = createBrowserRouter([
  {
    element: <App/>,
    path: '/',
    children:[     
      {
        element: <LandingPage/>,
        path : '/'
      },      
      {
        element: <RegisterPage/>,
        path: '/create-account',
      },
      {
        element: <LoginPage/>,
        path: '/login',
      },
      {
        element: <AcademicInfoPage/>,
        path: '/student/academic-info',
        
      },
      {
        element: <TimetableUploadForm/>,
        path: '/teacher/upload-timetable',
        
      },
      {
        element: <Dashboard/>,
        path: '/teacher/dashboard',
      },
      {
        element: <StudentDashboard/>,
        path: '/student/dashboard',
      }
    ]
  }
])




createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)
