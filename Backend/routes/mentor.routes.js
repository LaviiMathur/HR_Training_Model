import express from "express";
import {
  createProject,
  updateProject,
} from "../controllers/mentor.controller.js";

const mentorRoute = express.Router();

// Create New Intern Route
mentorRoute.post("/createProject", createProject);
mentorRoute.patch("/updateProject", updateProject);

export default mentorRoute;
