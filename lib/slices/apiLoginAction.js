import { createSlice } from "@reduxjs/toolkit";

export const apiLoginActionSlice = createSlice({
  name: "apiLoginAction",
  initialState: {
    loginData: null,
    loading: false,
    error: {
      error: null,
      message: null,
    },
  },
  reducers: {
    loginAction: (state, action) => {
      state.loginData = action.payload;
    },
  },
});

export const { loginAction } = apiLoginActionSlice.actions;
export default apiLoginActionSlice.reducer;
