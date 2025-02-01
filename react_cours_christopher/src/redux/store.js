// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import matchesReducer from "./slices/matchesSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    matches: matchesReducer,
  },
});

export default store;
