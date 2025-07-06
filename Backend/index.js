import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"

import { initDB } from "./Database/initDB.js";
import authRoute from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // allows cookies
  })
);
app.use(errorHandler);

//Routes
app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
  res.send("Server running");
});

//starting up server
(async () => {
  try {
    await initDB();

    app.listen(PORT, () => {
      console.log(`Server is running on Port:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Startup failed:", error);
    process.exit(1);
  }
})();
