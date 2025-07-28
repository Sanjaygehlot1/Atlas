import {createSlice,createAsyncThunk} from '@reduxjs/toolkit'
import { AxiosInstance } from '../Axios/AxiosInstance'

const initialState = {
    user: null,
    isLoggedIn: false,  
    loading: false,
    error: null,
    isTeacher: false,
    
};


const createUserAccount = createAsyncThunk('auth/createUserAccount', async (userData, { rejectWithValue }) => {
    try {
        const response = await AxiosInstance.post('/api/auth/create-account', userData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
    try {
        const response = await AxiosInstance.post('/api/auth/login', credentials);
        return response.data;   
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});


const authSlice = createSlice({
    name: 'auth',
    initialState,
    extraReducers:(reducer)=>{
        reducer.addCase(createUserAccount.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        reducer.addCase(createUserAccount.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.isLoggedIn = true;
            state.isTeacher = action.payload.isTeacher;
        });
        reducer.addCase(createUserAccount.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        reducer.addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        reducer.addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.isLoggedIn = true;
            state.isTeacher = action.payload.isTeacher;
        });
        reducer.addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

    }
})

export {authSlice, createUserAccount};

export default authSlice.reducer;
