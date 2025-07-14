import express from "express";
import {
  assignMentor,
  createIntern,
  fetchiInterns,
  fetchMentors,
} from "../controllers/hr.controller.js";

const hrRoute = express.Router();

// Create New Intern Route
hrRoute.post("/createIntern", createIntern);
hrRoute.get("/fetchMentors", fetchMentors);
hrRoute.get("/fetchInterns", fetchiInterns);
hrRoute.post("/assignMentor", assignMentor);

export default hrRoute;
