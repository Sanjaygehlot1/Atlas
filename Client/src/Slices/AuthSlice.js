import { AxiosInstance } from '../Axios/AxiosInstance'

// Custom ApiError class for frontend
class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'ApiError';
    }
}



const createUserAccount = async (userData) => {
    try {
        console.log(userData)
        const response = await AxiosInstance.post('/api/users/auth/create-account', userData);
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw new ApiError(
            error.response?.status || 500,
            error.response?.data?.message || 'An error occurred while creating the account.')
    }
};

const verifyUserwithCode = async (data) => {
    try {
        console.log(data)
        const response = await AxiosInstance.post('/api/users/auth/verify', data);
        return response.data;
    } catch (error) {
        throw new ApiError(
            error.response?.status || 500,
            error.response?.data?.message || 'An error occurred while verifying the user.')
    }
}

const loginUser = async (credentials) => {
    try {
        console.log(credentials)
        const response = await AxiosInstance.post('/api/users/auth/login', credentials);
        return response.data;
    } catch (error) {
        throw new ApiError(
            error.response?.status || 500,
            error.response?.data?.message || 'An error occurred while logging the user.')
    }
};

const updateAcademicInfo = async (data) => {
    try {
        console.log(data)
        const response = await AxiosInstance.put('/api/users/update-academic-info', data);
        return response.data;
    } catch (error) {
        throw new ApiError(
            error.response?.status || 500,
            error.response?.data?.message || 'An error occurred while updating academic info.')
    }
};




export {
    createUserAccount,
    verifyUserwithCode,
    loginUser,
    updateAcademicInfo
};

