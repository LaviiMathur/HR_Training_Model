import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

// Check auth
export const checkAuth = createAsyncThunk("auth/check", async () => {
  const res = await axios.post(`${API}/auth/refresh`, {}, { withCredentials: true });
  return res.data; 
});

const storedUser = JSON.parse(localStorage.getItem("user"));

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loggedIn: !!storedUser,
    user: storedUser || null,
  },
  reducers: {
    login: (state, action) => {
      state.loggedIn = true;
      state.user = action.payload.username;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.loggedIn = false;
      state.user = null;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loggedIn = true;
        state.user = action.payload.user;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loggedIn = false;
        state.user = null;
        localStorage.removeItem("user");
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
