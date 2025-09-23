import axios from "axios";
import { auth } from "../firebase/firebaseConfig";

const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  
});



AxiosInstance.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    // Get a fresh ID token
    const idToken = await user.getIdToken(true); 
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${idToken}`,
    };
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export { AxiosInstance };
