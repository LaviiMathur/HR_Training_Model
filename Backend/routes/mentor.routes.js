import express from "express";
import { createProject } from "../controllers/mentor.controller.js";

const mentorRoute = express.Router();

// Create New Intern Route
mentorRoute.post("/createProject", createProject);

export default mentorRoute;
