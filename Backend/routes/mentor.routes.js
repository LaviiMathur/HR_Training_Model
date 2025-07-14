import express from "express";
import {
  acceptIntern,
  createProject,
  rejectIntern,
  updateProject,
} from "../controllers/mentor.controller.js";

const mentorRoute = express.Router();

// Create New Intern Route
mentorRoute.post("/createProject", createProject);
mentorRoute.patch("/updateProject", updateProject);
mentorRoute.post("/acceptIntern", acceptIntern);
mentorRoute.post("/rejectIntern", rejectIntern);

export default mentorRoute;
