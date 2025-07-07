export default async function createProjectCollection(db) {
  try {
    const collections = await db
      .listCollections({ name: "projects" })
      .toArray();
    if (collections.length > 0) {
      console.log("ℹ️ 'projects' collection already exists");
      return;
    }

    await db.createCollection("projects", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["name", "mentorId", "description", "status"],
          properties: {
            name: {
              bsonType: "string",
              description: "Project name",
            },
            description: {
              bsonType: "string",
              description: "Project details",
            },

            status: {
              bsonType: "string",
              enum: ["ongoing", "completed"],
              description: "Project status",
            },
            mentorId: {
              bsonType: "objectId",
              description: "Reference to mentor user _id",
            },
            internIds: {
              bsonType: "array",
              items: { bsonType: "objectId" },
              description: "List of intern IDs assigned ",
            },
          },
        },
      },
      validationLevel: "strict",
      validationAction: "error",
    });

    console.log("✅ 'projects' collection created ");
  } catch (error) {
    console.error("❌ Error creating 'projects' collection:", error.message);
    throw error;
  }
}
