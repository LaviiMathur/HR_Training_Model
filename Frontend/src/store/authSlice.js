import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

// Check auth
export const checkAuth = createAsyncThunk("auth/check", async () => {
  const res = await axios.post(
    `${API}/auth/refresh`,
    {},
    { withCredentials: true }
  );
  return res.data;
});

const storedUser = JSON.parse(localStorage.getItem("user") || "{}");


const authSlice = createSlice({
  name: "auth",
  initialState: {
    loggedIn: !!storedUser,
    user: storedUser?.username || null,
    userId: storedUser?.userId || null,
    role: storedUser?.role || null,
  },
  reducers: {
    login: (state, action) => {
      const { username, role, userId } = action.payload;
      state.loggedIn = true;
      state.user = username;
      state.userId = userId;
      state.role = role;
      localStorage.setItem("user", JSON.stringify({ username, role, userId }));

    },
    logout: (state) => {
      state.loggedIn = false;
      state.user = null;
      state.userId = null;
      state.role = null;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.fulfilled, (state, action) => {
        const { username, role, userId } = action.payload;
        state.loggedIn = true;
        state.user = username;
        state.role = role;
        state.userId = userId;
        localStorage.setItem("user", JSON.stringify({ username, role, userId }));
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loggedIn = false;
        state.user = null;
        state.userId = null;
        state.role = null;
        localStorage.removeItem("user");
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
