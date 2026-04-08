import { configureStore } from "@reduxjs/toolkit";
import ProfileReducer from "../features/profileSlice";

export const store = configureStore({
  reducer: {
    profile: ProfileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
