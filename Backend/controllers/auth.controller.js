import connectDB from "../Database/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
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
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "No token" });

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
  try {
    const { username, password, role } = req.body;
    //verify all fields prrovided
    if (!username || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const db = await connectDB();
    const users = db.collection("users");

    //check username exists
    const usernameExists = await users.findOne({ username });
    if (usernameExists)
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    //instert new user into DB
    const result = await users.insertOne({
      username,
      password: hashedPassword,
      role,
    });
    const user = { username: result.username, role: result.role };
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
        userId: result._id,
        username: result.username,
      });
  } catch (error) {
    console.error("Signup failed:", error);
    return res.status(500).json({ success: false, message: "Signup failed" });
  }
}
//Login
export async function login(req, res) {
  try {
    const { username, password, role } = req.body;
    //verify all fields prrovided
    if (!username || !password || !role)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });

    const db = await connectDB();
    const users = db.collection("users");

    //check user exists
    const user = await users.findOne({ username });
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });

    //Check Pass
    const passCheck = await bcrypt.compare(password, user.password);
    if (!passCheck)
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });

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
        userId: user._id,
        username: user.username,
      });

    //instert into DB
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({ success: false, message: "Login failed" });
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
