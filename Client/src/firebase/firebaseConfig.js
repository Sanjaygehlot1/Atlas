import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCyylz5hR326F9NhLhXQXpvBKZjK-dwtww",
  authDomain: "plannex-99186.firebaseapp.com",
  projectId: "plannex-99186",
  storageBucket: "plannex-99186.firebasestorage.app",
  messagingSenderId: "484804775446",
  appId: "1:484804775446:web:7ab10c78c8075c0f206f37",
  measurementId: "G-9WV4BZ1REV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);