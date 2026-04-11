// src/features/profile/profileSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../api/apiClient";

export const getProfile = createAsyncThunk(
  "profile/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiClient({
        method: "get",
        url: "/affiliate/profile",
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const UpdateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (dp: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("dp", dp);

      const data = await apiClient({
        method: "patch",
        url: "/affiliate/profile-update-dp",
        data: formData,
        isFormData: true,
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

  upLoadingProfile: boolean;
  updateSuccess: boolean;
  updateError: string | null;
  isProfileBlocked: boolean;
  blockedNote?: string;
}

const initialState: ProfileState = {
  loading: false,
  data: null,
  error: null,

  upLoadingProfile: false,
  updateSuccess: false,
  updateError: null,
  isProfileBlocked: false,
  blockedNote: "",
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetProfileState: (state) => {
      state.updateSuccess = false;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ===== GET PROFILE ===== */
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.isProfileBlocked = action.payload?.isBlocked || false;
        state.blockedNote = action.payload?.blockedNote || "";
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* ===== UPDATE DP ===== */
      .addCase(UpdateProfile.pending, (state) => {
        state.upLoadingProfile = true;
        state.updateSuccess = false;
        state.updateError = null;
      })
      .addCase(UpdateProfile.fulfilled, (state, action) => {
        state.upLoadingProfile = false;
        state.updateSuccess = true;

        if (state.data) {
          state.data = {
            ...state.data,
            dp: action.payload?.dp || action.payload?.data?.dp,
          };
        }
      })
      .addCase(UpdateProfile.rejected, (state, action) => {
        state.upLoadingProfile = false;
        state.updateError = action.payload as string;
      });
  },
});

export const { resetProfileState } = profileSlice.actions;
export default profileSlice.reducer;
