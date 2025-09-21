import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import RegisterPage from './Components/register.jsx'
import SignIn from './Components/signIn.jsx'
import TimetableUploadForm from './Pages/Teacher/uploadTimtable.jsx'
import Dashboard from './Pages/Teacher/teacherDashboard.jsx'
import LandingPage from './Pages/Others/LandingPage.jsx'
import StudentDashboard from './Pages/Student/studentDashboard.jsx'
import ConnectPage from './Pages/Others/connect.jsx'
import AcademicInfoComponent from './Pages/Student/academicInfo.jsx'
import AcademicInfoPage from './Pages/Student/academicInfo.jsx'
import PublicRoute from './Helper/publicRoute.jsx'
import PrivateRoute from './Helper/privateRoute.jsx'
import { NotFoundPage } from './Pages/Others/NotFoundPage.jsx'
import { UnauthorizedPage } from './Pages/Others/UnAuthorizedPage.jsx'
import MarkAttendancePage from './Pages/Teacher/MarkAttendance.jsx'
import MyNote from './Pages/Notes/notes.jsx'
import LoginSkeleton from './Pages/Others/loginSkeleton.jsx'

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
        element: (
          <PublicRoute>
            <LoginSkeleton />
          </PublicRoute>
        ),
        path: '/auth/success'
      },
      {
        element: (
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        ),
        path: '/sign-in',
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
        children: [
          {
            path: 'academic-info',
            element: <AcademicInfoComponent />
          },
          {
            path: 'mynote',
            element: <MyNote />
          },
          {
            path: 'connect',
            element: <ConnectPage />
          }
        ]
      },
      {
        element:  (
          <PrivateRoute allowedRoles={['teacher']}>
              <MarkAttendancePage/>
          </PrivateRoute>
        ),
        path: '/teacher/mark-attendance',
      },
      {
        element:  (
          <PrivateRoute allowedRoles={['teacher']}>
              <MarkAttendancePage/>
          </PrivateRoute>
        ),
        path: '/teacher/mark-attendance',
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
