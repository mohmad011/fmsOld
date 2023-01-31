import { createSlice } from "@reduxjs/toolkit";

export const parentAccountData = createSlice({
  name: "parentAccountData",
  initialState: [],
  reducers: {
    addParentAccount: (state, action) => {
      state = action.payload;
    },
    // empty: (state) => {
    //   state = [...state];
    // },
  },
});

// Action creators are generated for each case reducer function
export const { addParentAccount } = parentAccountData.actions;

export default parentAccountData.reducer;
