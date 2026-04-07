// src/features/auth/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../api/apiClient";

interface UpdatePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (payload: UpdatePasswordPayload, { rejectWithValue }) => {
    try {
      const data = await apiClient({
        method: "post",
        url: "/auth/update-password",
        data: payload,
      });

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

interface AuthState {
  updatePasswordLoading: boolean;
  updatePasswordSuccess: boolean;
  updatePasswordError: string | null;
}

const initialState: AuthState = {
  updatePasswordLoading: false,
  updatePasswordSuccess: false,
  updatePasswordError: null,
};

const updatePasswordSlice = createSlice({
  name: "password",
  initialState,
  reducers: {
    resetUpdatePasswordState: (state) => {
      state.updatePasswordLoading = false;
      state.updatePasswordSuccess = false;
      state.updatePasswordError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updatePassword.pending, (state) => {
        state.updatePasswordLoading = true;
        state.updatePasswordSuccess = false;
        state.updatePasswordError = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.updatePasswordLoading = false;
        state.updatePasswordSuccess = true;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.updatePasswordLoading = false;
        state.updatePasswordError = action.payload as string;
      });
  },
});

export const { resetUpdatePasswordState } = updatePasswordSlice.actions;
export default updatePasswordSlice.reducer;
