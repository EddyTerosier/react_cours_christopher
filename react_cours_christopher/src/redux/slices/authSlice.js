import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import MyAxios from '../../utils/interceptor.js';
import Cookies from 'js-cookie';

export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await MyAxios.post('/login', credentials);
            if (response.data.token) {
                Cookies.set('token', response.data.token, { expires: 7, secure: true });
            }
            return response.data;
        } catch (error) {
            console.error(error);
            return rejectWithValue(error.response?.error || "Une erreur est survenue");
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await MyAxios.post('/register', credentials);
            if (response.data.token) {
                Cookies.set('token', response.data.token, { expires: 7, secure: true });
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Une erreur est survenue");
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: 'idle',
        user: null,
        isAuthenticated: !!Cookies.get('token'),
        token: Cookies.get('token') || null,
        error: null,
    },
    reducers: {
        logout: (state) => {
            Cookies.remove('token');
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = !!Cookies.get('token');
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || "Erreur inconnue";
            })
            .addCase(register.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = !!Cookies.get('token');
                state.error = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || "Erreur inconnue";
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;