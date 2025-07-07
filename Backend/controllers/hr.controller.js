import connectDB from "../Database/db.js";
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
      age,
      mobile,
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
