import { LoadingOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { AxiosInstance } from '../../Axios/AxiosInstance'

function LoginSkeleton() {
  const [loading, setLoading] = useState(true)

  const login = async () => {
    try {
      // Get token (example: from query string)
      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get("token")

      if (!token) throw new Error("No token found in URL")

      const res = await AxiosInstance.post(
        "/users/auth/signin",
        {}, // empty body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      console.log("User saved:", res.data)
      setLoading(false)

      // redirect to dashboard
     if(res.data.statusCode === 200){
        if(res.data.data.hasFilledDetails){
          window.location.href = "/student/dashboard"
        }else{
          window.location.href = "/student/academic-info"
        }
     }

    } catch (err) {
      console.error("Login error:", err)
      setLoading(false)
    }
  }

  useEffect(() => {
    login()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <LoadingOutlined style={{ fontSize: 32 }} spin />
      <p className="mt-4 text-lg">We are setting up your account. Please wait...</p>
    </div>
  )
}

export default LoginSkeleton
