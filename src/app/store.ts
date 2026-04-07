import { configureStore } from "@reduxjs/toolkit";
import ProfileReducer from "../features/profileSlice";
import UpdatePasswordReducer from "../features/updatePasswordSlice";

export const store = configureStore({
  reducer: {
    profile: ProfileReducer,
    password: UpdatePasswordReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
