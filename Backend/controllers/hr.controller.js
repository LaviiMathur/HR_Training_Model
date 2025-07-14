import { ObjectId } from "mongodb";
import connectDB from "../Database/db.js";
//Create new intern
export async function createIntern(req, res) {
  try {
    const {
      firstName,
      lastName,
      age,
      mobile,
      address,
      email,
      department,
      university,
      startDate,
    } = req.body;

    //verify all fields prrovided
    if (
      !firstName ||
      !lastName ||
      !age ||
      !mobile ||
      !address ||
      !email ||
      !department ||
      !university ||
      !startDate
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const db = await connectDB();
    const interns = db.collection("interns");
    //check if intern already exists
    const intern = await interns.findOne({ firstName, lastName });
    if (intern)
      return res
        .status(409)
        .json({ success: false, message: "Intern already exists" });
    //instert new intern in DB
    const result = await interns.insertOne({
      firstName,
      lastName,
      age: parseInt(age, 10),
      mobile: parseInt(mobile, 10),
      address,
      email,
      department,
      university,
      startDate,
      status: "notAssigned",
    });
    return res.status(201).json({
      message: "Intern created sucessfully",
      internId: result.insertedId,
      intern: firstName + " " + lastName,
    });
  } catch (error) {
    console.error("Itern creation failed:", error);
    return res
      .status(500)
      .json({ success: false, message: "Intern creation failed" });
  }
}
//Update  intern
export async function updateIntern(req, res) {
  try {
    const { age, mobile, address, department, email, university } = req.body;
    //verify all fields prrovided
    if (!age || !mobile || !address || !department || !email || !university) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const db = await connectDB();
    const interns = db.collection("interns");
    //check if intern already exists
    const intern = await interns.findOne({ firstName, lastName });
    if (!intern)
      return res
        .status(404)
        .json({ success: false, message: "Intern does not exist" });

    //instert updated intern in DB
    await interns.updateOne(
      { _id: intern._id },
      {
        $set: {
          age: parseInt(age, 10),
          mobile: parseInt(mobile, 10),
          address,
          department,
          email,
          university,
          status: intern.status,
        },
      }
    );
    return res.status(200).json({
      message: "Intern updated sucessfully",
      internId: intern._id,
      intern: intern.firstName + " " + intern.lastName,
    });
  } catch (error) {
    console.error("Itern creation failed:", error);
    return res
      .status(500)
      .json({ success: false, message: "Intern creation failed" });
  }
}
//Fetch all interns' details
export async function fetchiInterns(req, res) {
  try {
    const db = await connectDB();
    const internList = await db.collection("interns").find().toArray();
    return res.status(200).json({
      message: "Intern list fetched successfully",
      data: internList,
    });
  } catch (error) {
    console.error("Mentor fetch failed:", error);
    return res
      .status(500)
      .json({ success: false, message: "Mentor fetch failed" });
  }
}

//Fetch list of mentors
export async function fetchMentors(req, res) {
  try {
    const db = await connectDB();
    const mentors = await db
      .collection("users")
      .find({ role: "mentor" })
      .toArray();
    const mentorList = mentors.map((mentor) => mentor.username);
    return res.status(200).json({
      message: "Mentor list fetched successfully",
      data: mentorList,
    });
  } catch (error) {
    console.error("Mentor fetch failed:", error);
    return res
      .status(500)
      .json({ success: false, message: "Mentor fetch failed" });
  }
}

//assign mentor to intern
export async function assignMentor(req, res) {
  try {
    const { intern, mentor, sender } = req.body;

    const db = await connectDB();
    const interns = db.collection("interns");
    const mentors = db.collection("users");

    //check if intern and mentor exist
    const internId = new ObjectId(intern);
    const hrId = new ObjectId(sender);
    const internDoc = await interns.findOne({ _id: internId });
    const mentorDoc = await mentors.findOne({
      username: mentor,
      role: "mentor",
    });

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
    //check if intern already has a mentor
    if (internDoc.mentorId) {
      return res
        .status(409)
        .json({ success: false, message: "Intern already has a mentor" });
    }
    //create notification for mentor
    const notifications = db.collection("notifications");
    const notification = {
      receiver: mentorDoc._id,
      sender: hrId,
      internId: internId,
      internName: internDoc.firstName + " " + internDoc.lastName,
      message: `You have been assigned as a mentor to ${internDoc.firstName} ${internDoc.lastName}.`,
      marked: false,
      createdAt: new Date(),
    };

    await interns.updateOne(
      { _id: internDoc._id },
      { $set: { status: "pending" } }
    );
    await notifications.insertOne(notification);
    return res.status(200).json({
      success: true,
      message: "Mentor Notified",
    });
  } catch (error) {
    console.error("Mentor assignment failed:", error);
    return res
      .status(500)
      .json({ success: false, message: "Mentor assignment failed" });
  }
}
