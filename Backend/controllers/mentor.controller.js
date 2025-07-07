import { ObjectId } from "mongodb";
import connectDB from "../Database/db.js";
;

export async function createProject(req, res) {
  try {
    const { name, description, mentorId } = req.body;

    if (!name || !description || !mentorId) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const db = await connectDB();
    const projects = db.collection("projects");

    // Convert mentorId to ObjectId before comparing
    const mentorObjectId = new ObjectId(mentorId);

    // Check if project already exists
    const project = await projects.findOne({ name, mentorId: mentorObjectId });
    if (project) {
      return res.status(409).json({ success: false, message: "Project already exists" });
    }

    // Insert project
    const result = await projects.insertOne({
      name,
      mentorId: mentorObjectId,
      description,
      status: "ongoing",
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      projectId: result.insertedId,
    });

  } catch (error) {
    console.error("Project creation failed:", error);
    return res.status(500).json({
      success: false,
      message: "Project creation failed",
    });
  }
}
