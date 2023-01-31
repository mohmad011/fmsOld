import { createSlice } from "@reduxjs/toolkit";

export const userInfo = createSlice({
  name: "userInfo",
  initialState: {
    AddUser1: {},
    AddUser2: {},
    AddUser3: [],
    AllData: [],
  },
  reducers: {
    add: (state, action) => {
      if (
        typeof action.payload === "object" &&
        action.payload !== null &&
        action.payload.hasOwnProperty("firstName")
      ) {
        state.AddUser1 = action.payload;
      }

      if (
        typeof action.payload === "object" &&
        action.payload !== null &&
        action.payload.hasOwnProperty("selectData")
      ) {
        state.AddUser2 = action.payload;
      }

      if (Array.isArray(action.payload)) {
        state.AddUser3 = action.payload;
      }

      if (
        typeof action.payload === "object" &&
        action.payload !== null &&
        action.payload.hasOwnProperty("Finish")
      ) {
        if (state.AllData.length > 0) {
          state.AllData = [
            ...state.AllData,
            {
              ...state.AddUser1,
              ...state.AddUser2,
              ...state.AddUser3,
            },
          ];
        } else {
          state.AllData = [
            { ...state.AddUser1, ...state.AddUser2, ...state.AddUser3 },
          ];
        }
      }
    },
    empty: (state) => {
      state.AddUser1 = {};
      state.AddUser2 = {};
      state.AddUser3 = [];
      state.AllData = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { add, empty } = userInfo.actions;

export default userInfo.reducer;
