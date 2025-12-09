import { createSlice } from "@reduxjs/toolkit";

// ✅ Load admin from localStorage on app start
const storedAdmin = localStorage.getItem("admin");

const initialState = {
  user: storedAdmin ? JSON.parse(storedAdmin) : null,
  isAuthenticated: !!storedAdmin,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    // ✅ Save admin to Redux + localStorage
    setAdmin: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("admin", JSON.stringify(action.payload));
    },

    // ✅ Clear admin from Redux + localStorage
    clearAdmin: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("admin");
    },
  },
});

export const { setAdmin, clearAdmin } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
