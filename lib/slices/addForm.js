

import { createSlice } from "@reduxjs/toolkit";

const data = { formdata: {} }
export const addFormDatas = createSlice({
    name: "addFormDatas",
    initialState: data,
    reducers: {
        addFormData: (state, action) => {
            state.formdata = { ...state.formdata, ...action.payload };
        },
    },
}
);

export const { addFormData } = addFormDatas.actions;
export default addFormDatas.reducer;
