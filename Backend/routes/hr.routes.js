import express from "express";
import { createIntern } from "../controllers/hr.controller.js";

const hrRoute = express.Router();

// Create New Intern Route
hrRoute.post("/createIntern", createIntern);


export default hrRoute;
