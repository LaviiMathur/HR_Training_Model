import connectDB from "./db.js";
import createUserCollection from "./user.model.js";
import createInternCollection from "./intern.model.js";
import createProjectCollection from "./project.model.js";
import createNotificationCollection from "./notification.model.js";

export async function initDB() {
  const db = await connectDB();
  await createUserCollection(db);
  await createInternCollection(db);
  await createProjectCollection(db);
  await createNotificationCollection(db);

}
