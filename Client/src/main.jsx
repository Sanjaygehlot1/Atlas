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
import PublicRoute from './Helper/publicRoute.jsx'
import PrivateRoute from './Helper/privateRoute.jsx'
import { NotFoundPage } from './Pages/Others/NotFoundPage.jsx'
import { UnauthorizedPage } from './Pages/Others/UnAuthorizedPage.jsx'

const router = createBrowserRouter([
  {
    element: <App />,
    path: '/',
    children: [
      {
        element: (
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        ),
        path: '/'
      },
      {
        element: <RegisterPage />,
        path: '/create-account',
      },
      {
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
        path: '/login',
      },
      {
        element: (
          <PrivateRoute allowedRoles={['student']}>
            <AcademicInfoComponent/>
          </PrivateRoute>
        ),
        path: '/student/academic-info',

      },
      {
        element: (
          <PrivateRoute allowedRoles={['teacher']}>
              <TimetableUploadForm/>
          </PrivateRoute>
        ),
        path: '/teacher/upload-timetable',

      },
      {
        element:  (
          <PrivateRoute allowedRoles={['teacher']}>
              <Dashboard/>
          </PrivateRoute>
        ),
        path: '/teacher/dashboard',
      },
      {
        element:  (
          <PrivateRoute allowedRoles={['student']}>
              <StudentDashboard/>
          </PrivateRoute>
        ),
        path: '/student/dashboard',
      },
      {
        element: <UnauthorizedPage/>,
        path: '/unauthorized',
      },
      {
        element: <NotFoundPage/>,
        path: '*',
      }
    ]
  }
])




createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
