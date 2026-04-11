import { configureStore } from "@reduxjs/toolkit";
import ProfileReducer from "../features/profileSlice";
import TransactionReducer from "../features/transactionSlice";
import uiReducer from "../features/uiSlice";

export const store = configureStore({
  reducer: {
    profile: ProfileReducer,
    transaction: TransactionReducer,
     ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
