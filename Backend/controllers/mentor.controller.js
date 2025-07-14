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
//Accept the intern
export async function acceptIntern(req, res) {
  try {
    const { mentor, intern, noti } = req.body;
    const db = await connectDB();
    const mentorId = new ObjectId(mentor);
    const internId = new ObjectId(intern);
    const notiId = new ObjectId(noti);
    const interns = db.collection("interns");
    const mentors = db.collection("users");
    const internDoc = await interns.findOne({ _id: internId });
    const mentorDoc = await mentors.findOne({ _id: mentorId });
    if (!internDoc) {
      return res
        .status(404)
        .json({ success: false, message: "Intern does not exist" });
    }

    if (!mentorDoc) {
      return res
        .status(404)
        .json({ success: false, message: "Mentor does not exist" });
    }
    const notifications = db.collection("notifications");
    await notifications.deleteOne({ _id: notiId });
    //update mentor in DB
    await interns.updateOne(
      { _id: internId },
      {
        $set: {
          mentorId: mentorDoc._id,
          mentor: mentorDoc.username,
          status: "accepted",
        },
      }
    );
    return res.status(200).json({
      message: "Mentor assigned successfully",
      internId: internId,
      intern: internDoc.firstName + " " + internDoc.lastName,
      mentor: mentor,
    });
  } catch (error) {
    console.error(error);
  }
}
//Reject the intern
export async function rejectIntern(req, res) {
  try {
    const { sender, receiver, intern, remarks, noti } = req.body;
    const db = await connectDB();
    const hrId = new ObjectId(receiver);
    const mentorId = new ObjectId(sender);
    const internId = new ObjectId(intern);
    const notiId = new ObjectId(noti);
    const interns = db.collection("interns");
    const hr = db.collection("users");
    const internDoc = await interns.findOne({ _id: internId });
    const hrDoc = await hr.findOne({ _id: hrId });
 
    if (!internDoc) {
      return res
        .status(404)
        .json({ success: false, message: "Intern does not exist" });
    }

    if (!remarks) {
      return res
        .status(404)
        .json({ success: false, message: "remarks are required" });
    }
    //create notification for mentor
    const notifications = db.collection("notifications");
    const notification = {
      receiver: hrId,
      sender: mentorId,
      internId: internId,
      internName: internDoc.firstName + " " + internDoc.lastName,
      message: `Sorry I cannot accept ${
        internDoc.firstName + " " + internDoc.lastName
      }. Here are my remarks:${remarks}`,
      marked: false,
      createdAt: new Date(),
    };
    await notifications.deleteOne({ _id: notiId });
    await notifications.insertOne(notification);
    return res.status(200).json({
      success: true,
      message: "HR Notified",
    });
  } catch (error) {
    console.error(error);
  }
}
