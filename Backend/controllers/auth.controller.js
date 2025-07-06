import connectDB from "../Database/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from "../utils/createError.js";
dotenv.config();
const generateToken = (user) => {
  const payload = {
    username: user.username,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};
//Refresh Token
export async function handleRefreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "No token" });

  try {
    const { username } = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const db = await connectDB();
    const users = db.collection("users");
    const user = await users.findOne({ username });
    if (!user) throw createError("user no longer exists", 401);

    const tokens = generateToken(user);
    return res
      .status(200)
      .cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "accessToken refreshed",
        accessToken: tokens.accessToken,
        username: username,
      });
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
}

//Signup
export async function signup(req, res) {
  const { username, password, role } = req.body;
  const db = await connectDB();
  const users = db.collection("users");
  try {
    //verify all fields prrovided
    if (!username || !password || !role) {
      throw createError("All fields are required", 400);
    }
    //check username exists
    const usernameExists = await users.findOne({ username });
    if (usernameExists) throw createError("Username already exists", 409);
    const hashedPassword = await bcrypt.hash(password, 10);
    //instert into DB
    const result = await users.insertOne({
      username,
      password: hashedPassword,
      role,
    });
    const user = { username: username, role: role };
    const tokens = generateToken(user);
    return res
      .status(201)
      .cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Signup Sucessfull",
        accessToken: tokens.accessToken,
        username: username,
      });
  } catch (error) {
    console.error("Signup error:", error);
    throw createError("Signup failed", 500);
  }
}
//Login
export async function login(req, res) {
  const { username, password, role } = req.body;

  const db = await connectDB();
  const users = db.collection("users");
  try {
    //verify all fields prrovided
    if (!username || !password || !role)
      throw createError("All fields are required", 400);

    //check user exists
    const user = await users.findOne({ username });
    if (!user) throw createError("Invalid email or password", 401);

    //Check Pass
    const passCheck = await bcrypt.compare(password, user.password);
    if (!passCheck) throw createError("Invalid email or password", 401);

    const tokens = generateToken(user);
    return res
      .status(201)
      .cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Login Sucessfull",
        accessToken: tokens.accessToken,
        username: username,
      });

    //instert into DB
  } catch (error) {
    console.error("Signup error:", error);
    throw createError("Login failed", 500);
  }
}

//Logout
export async function logout(req, res) {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  return res.status(200).json({ message: "Logged out" });
}
