import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

const login = createAsyncThunk(
    'auth/login',
    async (data, {rejectWithValue}) => {
        const response = await MyAxios.post('login', data);
    }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    status: 'idle',
    user: null,
    isAuthenticated: false,
    error: null,
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'idle';
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;