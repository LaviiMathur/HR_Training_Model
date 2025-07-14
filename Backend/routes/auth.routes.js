import express from "express";
import { signup,login, logout, handleRefreshToken, fetchNotifications } from "../controllers/auth.controller.js";

const authRoute = express.Router();

// Signup Route
authRoute.post("/signup", signup);
//Login Route
authRoute.post("/login", login);
//Logout Route
authRoute.post("/logout", logout);
//refresh token Route
authRoute.post("/refresh", handleRefreshToken);
authRoute.post("/fetchNotifications", fetchNotifications);

export default authRoute;
