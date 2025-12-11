import { createSlice } from "@reduxjs/toolkit";

// ✅ Load station from localStorage on app start
const storedStation = localStorage.getItem("station");

const initialState = {
  user: storedStation ? JSON.parse(storedStation) : null,
  isAuthenticated: !!storedStation,
};

const stationAuthSlice = createSlice({
  name: "stationAuth",
  initialState,
  reducers: {
    // ✅ Save station to Redux + localStorage
    setStation: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("station", JSON.stringify(action.payload));
    },

    // ✅ Clear station from Redux + localStorage
    clearStation: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("station");
    },
  },
});

export const { setStation, clearStation } = stationAuthSlice.actions;
export default stationAuthSlice.reducer;
