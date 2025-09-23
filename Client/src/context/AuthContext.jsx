import { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import axios from 'axios';
import { auth } from "../firebase/firebaseConfig.js";
import { AxiosInstance } from '../Axios/AxiosInstance.js';
import { logOut } from '../Slices/AuthSlice.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkUserSession = async () => {
        setIsLoading(true);
       
            try {
                
                const response = await AxiosInstance.get('/users/current-user');
                
                if (response.data.success) {
                    setUser(response.data.data);
                    console.log("User session found and state set.");
                } else {
                    setUser(null);
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    console.log("No active session found - user not logged in.");
                } else {
                    console.error("Error checking user session:", error.message);
                }
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            checkUserSession(firebaseUser);
        });

        return () => unsubscribe();
    }, []);

    const login = async (token) => {
        try {
            const response = await AxiosInstance.post('/users/auth/create-account', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Login response:", response.data);
            if (response.data.success) {
                setUser(response.data.data.user);
            }
            return response.data;
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            throw error.response?.data || { message: 'Login failed' };
        }
    };

    const logout = async () => {
        try {
            await logOut();
            setUser(null);
            console.log('AuthContext: User state cleared');
        } catch (error) {
            console.error("Logout failed:", error);
            setUser(null);
        }
    };

    const value = {
        user,
        setUser,
        login,
        logout,
        isLoading,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
