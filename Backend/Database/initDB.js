import connectDB from "./db.js";
import createUserCollection from "./user.model.js";
// import { createHRCollection } from "./hr.model.js";
// import { createAssignmentCollection } from "./assignment.model.js";

export async function initDB() {
  const db = await connectDB();
  await createUserCollection(db);
  //   await createHRCollection(db);
}
