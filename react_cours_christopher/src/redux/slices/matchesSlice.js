import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import MyAxios from "../../utils/interceptor";

// Thunk pour récupérer les matchs de l'utilisateur connecté
export const fetchMatches = createAsyncThunk(
  "matches/fetchMatches",
  async (_, { rejectWithValue }) => {
    try {
      const response = await MyAxios.get("/matches");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error ||
          "Erreur lors de la récupération des matchs",
      );
    }
  },
);

const matchesSlice = createSlice({
  name: "matches",
  initialState: {
    matches: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.matches = action.payload;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default matchesSlice.reducer;
