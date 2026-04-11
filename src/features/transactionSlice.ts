// src/features/profile/transactionSlice.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../api/apiClient";

/* ================== TYPES ================== */

interface TransactionResponse {
  data: any;
  counts: {
    totalRecords: number;
    totalPages: number;
  };
}

interface FetchParams {
  page?: number;
  searchText?: string;
}

interface TransactionState {
  loading: boolean;
  transactionHistory: [];
  totalItem: number;
  totalPages: number;
  error: string | null;
}

export const getTransactionHistory = createAsyncThunk<
  TransactionResponse,
  FetchParams
>(
  "affiliate/getTransactionHistory",
  async ({ page = 1, searchText = "" }, { rejectWithValue }) => {
    try {
      const res = await apiClient({
        method: "get",
        url: "/affiliate/payment-history",
        params: { page, pageSize: 10, search: searchText },
      });
      console.log(res, "==========res");

      return res;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Something went wrong");
    }
  },
);

const initialState: TransactionState = {
  loading: false,
  transactionHistory: [],
  totalItem: 0,
  totalPages: 0,
  error: null,
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTransactionHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactionHistory.fulfilled, (state, action) => {
        state.loading = false;

        state.transactionHistory = action.payload?.data || [];
        state.totalItem = action.payload?.counts?.totalRecords || 0;
        state.totalPages = action.payload?.counts?.totalPages || 0;
      })
      .addCase(getTransactionHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default transactionSlice.reducer;
