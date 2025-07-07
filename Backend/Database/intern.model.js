export default async function createInternCollection(db) {
  try {
    const collections = await db.listCollections({ name: "interns" }).toArray();
    if (collections.length > 0) {
      console.log("ℹ️ 'interns' collection already exists");
      return;
    }

    await db.createCollection("interns", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["firstName", "secondName","age","address","mobile","status"],
          properties: {
            firstName: {
              bsonType: "string",
              description: "Intern's first name",
            },
            secondName: {
              bsonType: "string",
              description: "Intern's second name",
            },
            age: {
              bsonType: "number",
              description: "Intern's age",
            },
            mobile: {
              bsonType: "number",
              description: "Intern's phone number",
            },
            address: {
              bsonType: "string",
              description: "Intern's address",
            },
            status: {
              bsonType: "string",
              enum: ["accepted", "pending", "rejected"],
              description: "Mentor Assignment status",
            },
            mentorId: {
              bsonType: "objectId",
              description: "Reference to mentor user _id",
            },
            projectIds: {
              bsonType: "array",
              items: { bsonType: "objectId" },
              description: "List of project IDs assigned to the intern",
            },
          },
        },
      },
      validationLevel: "strict",
      validationAction: "error",
    });

    console.log("✅ 'interns' collection created ");
  } catch (error) {
    console.error("❌ Error creating 'interns' collection:", error.message);
    throw error;
  }
}
