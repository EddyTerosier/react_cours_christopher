import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import forumReducer from './slices/forumSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    forum: forumReducer,
  },
});

export default store;