export default async function createUserCollection(db) {
  try {
    const collections = await db.listCollections({ name: "users" }).toArray();
    // Check if 'users' collection already exists
    if (collections.length > 0) {
      console.log("ℹ️ 'users' collection already exists");
      return;
    }

    // Create with schema validation
    await db.createCollection("users", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["username", "password", "role"],
          properties: {
            username: {
              bsonType: "string",
              description: "User name - required",
            },
            password: {
              bsonType: "string",
              description: "Password (hashed)",
            },
            role: {
              bsonType: "string",
              enum: ["hr", "mentor"],
              description: "Role: HR or Mentor",
            },
          },
        },
      },
      validationLevel: "strict",
      validationAction: "error",
    });

    console.log("✅ 'users' collection created with schema validation");
  } catch (error) {
    console.error("❌ Error creating 'users' collection:", error.message);
    throw error;
  }
}
