
import  { createContext, useState, useContext, useEffect } from 'react';
import { AxiosInstance } from '../Axios/AxiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); 

    
    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const response = await AxiosInstance.get('/api/users/current-user');
                console.log("Current user response:", response.data);
                if (response.data.success) {
                    setUser(response.data.data || null);
                }
            } catch (error) {
                console.log("No active session found.");
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkUserSession();
    }, []);


    const login = async (email, password) => {
        try {
            const response = await AxiosInstance.post('/api/users/auth/login', { email, password });
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
            console.log('AuthContext: Starting logout...'); // Temporary debug
            const response = await AxiosInstance.post('/api/users/auth/logout');
            console.log('AuthContext: Logout API response:', response); // Temporary debug
            setUser(null); 
            console.log('AuthContext: User state cleared'); // Temporary debug
        } catch (error) {
            console.error("Logout failed:", error);
            console.error("Logout error details:", error.response?.data); // More detailed error
            // Even if API fails, clear the user state
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



