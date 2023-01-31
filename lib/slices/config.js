import { createSlice } from "@reduxjs/toolkit";
import { encryptName } from "../../helpers/encryptions";

let initialConfig = {
  darkMode: false,
  language: "en",
  userImg: null
};

const storage = (key, value) => {
  initialConfig[key] = value;
  localStorage.setItem(encryptName("config"), JSON.stringify(initialConfig));
};

export const ConfigSlice = createSlice({
  name: "config",
  initialState: {
    ...initialConfig,
  },
  reducers: {
    darkMode: (state) => {
      state.darkMode = !state.darkMode;
      storage("darkMode", state.darkMode);
    },
    changeLanguage: (state, action) => {
      state.language = action.payload;
      storage("language", state.language);
      localStorage.language = state.language;
    },
    setConfig: (state, action) => {
      Object.assign(state, action.payload);
    },
    userConfigImg: (state, action) => {
      state.userImg = action.payload;
      storage("userImg", state.userImg);


    },
  },
});

// Action creators are generated for each case reducer function
export const { darkMode, setConfig, changeLanguage, userConfigImg } = ConfigSlice.actions;

export default ConfigSlice.reducer;
