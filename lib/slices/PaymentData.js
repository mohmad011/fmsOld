import { createSlice } from "@reduxjs/toolkit";

export const PaymentSlice = createSlice({
  name: "PaymentSlice",
  initialState: {value:null},
  reducers: {
      TakeId: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { TakeId } = PaymentSlice.actions;

export default PaymentSlice.reducer;
