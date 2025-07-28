import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import RegisterPage from './Components/register.jsx'
import LoginPage from './Components/login.jsx'

const router = createBrowserRouter([
  {
    element: <App/>,
    path: '/',
    children:[
      {
        element: <RegisterPage/>,
        path: '/create-account',
      },
      {
        element: <LoginPage/>,
        path: '/login',
      }
    ]
  }
])




createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)
