import { createSlice } from "@reduxjs/toolkit";

export const dataTree = createSlice({
  name: "dataTree",
  initialState: [],
  reducers: {
    addData: (state, action) => {
      !state.length > 0 && state.push(action.payload);
    },
    emptyData: () => {
      return [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { addData, emptyData } = dataTree.actions;

export default dataTree.reducer;
