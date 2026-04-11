import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type UIState = {
  isProfileBlockedModalOpen: boolean;
};

const initialState: UIState = {
  isProfileBlockedModalOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openProfileBlockedModal: (state) => {
      state.isProfileBlockedModalOpen = true;
    },
    closeProfileBlockedModal: (state) => {
      state.isProfileBlockedModalOpen = false;
    },
    setProfileBlockedModal: (state, action: PayloadAction<boolean>) => {
      state.isProfileBlockedModalOpen = action.payload;
    },
  },
});

export const {
  openProfileBlockedModal,
  closeProfileBlockedModal,
  setProfileBlockedModal,
} = uiSlice.actions;

export default uiSlice.reducer;
