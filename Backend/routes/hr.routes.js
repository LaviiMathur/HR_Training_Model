import express from "express";
import { createIntern, fetchMentors } from "../controllers/hr.controller.js";

const hrRoute = express.Router();

// Create New Intern Route
hrRoute.post("/createIntern", createIntern);
hrRoute.get("/fetchMentors", fetchMentors);

export default hrRoute;
