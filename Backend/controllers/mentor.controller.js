import { ObjectId } from "mongodb";
import connectDB from "../Database/db.js";
//Create new Project
export async function createProject(req, res) {
  try {
    const { name, description, mentorId } = req.body;
 
    if (!name || !description || !mentorId) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const db = await connectDB();
    const projects = db.collection("projects");

    // Convert mentorId to ObjectId before comparing
    const mentorObjectId = new ObjectId(mentorId);

    // Check if project already exists
    const project = await projects.findOne({ name, mentorId: mentorObjectId });
    if (project) {
      return res
        .status(409)
        .json({ success: false, message: "Project already exists" });
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
//Update Project
export async function updateProject(req, res) {
  try {
    const { name, description, mentorId } = req.body;
    let { status } = req.body;

    if (!name || !description || !mentorId) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const db = await connectDB();
    const projects = db.collection("projects");

    // Convert mentorId to ObjectId before comparing
    const mentorObjectId = new ObjectId(mentorId);

    // Check if project already exists
    const project = await projects.findOne({ name, mentorId: mentorObjectId });
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project does not exist" });
    }
    //Check if project is completed
    if (project.status === "completed") {
      status = project.status;
      return res.status(409).json({
        success: "false",
        message: "Project already marked done",
      });
    }

    //insert updated project in DB
    await projects.updateOne(
      { _id: project._id },
      {
        $set: {
          name,
          mentorId: project.mentorId,
          description,
          status: status ?? project.status,
        },
      }
    );

    return res.status(200).json({
      message: "Project updated successfully",
      projectId: project._id,
    });
  } catch (error) {
    console.error("Project update failed:", error);
    return res.status(500).json({
      success: false,
      message: "Project update failed",
    });
  }
}
//Mark project as completed
export async function projectCompleted(req, res) {
  try {
    const { id } = req.params;

    const db = await connectDB();
    const projects = db.collection("projects");
    // Check if project already exists
    const project = await projects.findOne({ id });
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project does not exist" });
    }
    //update in DB
    await projects.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "completed" } }
    );
    return res.status(200).json({
      message: "Project marked as done",
      projectId: id,
    });
  } catch (error) {
    console.error("Failed to mark project as done:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to mark project as done" });
  }
}
