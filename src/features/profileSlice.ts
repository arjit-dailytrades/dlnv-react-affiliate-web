// src/features/profile/profileThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../api/apiClient";

export const getProfile = createAsyncThunk(
  "profile/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiClient({
        method: "get",
        url: "/profile",
      });

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

interface ProfileState {
  loading: boolean;
  data: any;
  error: string | null;
}

const initialState: ProfileState = {
  loading: false,
  data: null,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default profileSlice.reducer;
