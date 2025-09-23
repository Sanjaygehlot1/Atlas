import { AxiosInstance } from '../Axios/AxiosInstance'

// Custom ApiError class for frontend
class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'ApiError';
    }
}


const logOut = async () => {
    try {
        await AxiosInstance.post('/users/auth/logout');
        return { message: 'Logout successful' };
    } catch (error) {
        throw new ApiError(
            error.response?.status || 500,
            error.response?.data?.message || 'An error occurred while logging out.')
    }
}

const updateAcademicInfo = async (data) => {
    try {
        console.log(data)
        const response = await AxiosInstance.put('/users/update-academic-info', data);
        return response.data;
    } catch (error) {
        throw new ApiError(
            error.response?.status || 500,
            error.response?.data?.message || 'An error occurred while updating academic info.')
    }
};




export {
    updateAcademicInfo,
    logOut
};

