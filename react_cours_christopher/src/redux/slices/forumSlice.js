import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import MyAxios from '../../utils/interceptor.js';

export const fetchPosts = createAsyncThunk(
    'forum/fetchPosts',
    async (_, { getState, rejectWithValue }) => {
      try {
        const state = getState().forum || {}; // ✅ Vérification si forum existe
        const response = await MyAxios.get('/posts', {
          params: { lastTimestamp: state.lastTimestamp },
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.error);
      }
    }
);

const forumSlice = createSlice({
  name: 'forum',
  initialState: {
    posts: [],
    lastTimestamp: null,
    hasMore: true,
    loading: false,
    error: null,
  },
  reducers: {
    resetForum: (state) => {
      state.posts = [];
      state.lastTimestamp = null;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(fetchPosts.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchPosts.fulfilled, (state, action) => {
          state.loading = false;
          if (Array.isArray(action.payload) && action.payload.length === 0) {
            state.hasMore = false;
          } else {
            state.posts = [...state.posts, ...(action.payload || [])];
            state.lastTimestamp = action.payload?.[action.payload.length - 1]?.timestamp || null;
          }
        })
        .addCase(fetchPosts.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
  },
});

export default forumSlice.reducer;