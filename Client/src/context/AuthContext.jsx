
import  { createContext, useState, useContext, useEffect } from 'react';
import { AxiosInstance } from '../Axios/AxiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); 

    
    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const response = await AxiosInstance.get('/users/current-user');
                console.log("Current user response:", response.data);
                if (response.data.success) {
                    setUser(response.data.data);
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
            const response = await AxiosInstance.post('/users/auth/login', { email, password });
            console.log("Login response:", response.data);
            if (response.data.success) {
                setUser(response.data.data.user);
            }
            return response.data;
        } catch (error) {
           
            throw error.response.data;
        }
    };

    const logout = async () => {
        try {
            await AxiosInstance.post('/users/auth/logout');
            setUser(null); 
        } catch (error) {
            console.error("Logout failed:", error);
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



