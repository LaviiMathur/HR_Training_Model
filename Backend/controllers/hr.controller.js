import connectDB from "../Database/db.js";
//Create new intern
export async function createIntern(req, res) {
  try {
    const { firstName, secondName, age, mobile, address } = req.body;

    //verify all fields prrovided
    if (!firstName || !secondName || !age || !mobile || !address) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const db = await connectDB();
    const interns = db.collection("interns");
    //check if intern already exists
    const intern = await interns.findOne({ firstName, secondName });
    if (intern)
      return res
        .status(409)
        .json({ success: false, message: "Intern already exists" });
    //instert new intern in DB
    const result = await interns.insertOne({
      firstName,
      secondName,
      age: parseInt(age, 10),
      mobile: parseInt(mobile, 10),
      address,
      status: "pending",
    });
    return res.status(201).json({
      message: "Intern created sucessfully",
      internId: result.insertedId,
      intern: firstName + " " + secondName,
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
    const { age, mobile, address } = req.body;
    //verify all fields prrovided
    if (!age || !mobile || !address) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const db = await connectDB();
    const interns = db.collection("interns");
    //check if intern already exists
    const intern = await interns.findOne({ firstName, secondName });
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
          status: intern.status,
        },
      }
    );
    return res.status(200).json({
      message: "Intern updated sucessfully",
      internId: intern._id,
      intern: intern.firstName + " " + intern.secondName,
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
