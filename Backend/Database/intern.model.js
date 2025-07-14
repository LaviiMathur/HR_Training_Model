export default async function createInternCollection(db) {
  try {
    const collections = await db.listCollections({ name: "interns" }).toArray();
    if (collections.length > 0) {
      console.log("ℹ️ 'interns' collection already exists");
      // await db.collection("interns").drop();

      return;
    }

    await db.createCollection("interns", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: [
            "firstName",
            "lastName",
            "age",
            "address",
            "mobile",
            "status",
            "email",
            "department",
            "university",
            "startDate",
          ],
          properties: {
            firstName: {
              bsonType: "string",
              description: "Intern's first name",
            },
            lastName: {
              bsonType: "string",
              description: "Intern's last name",
            },
            age: {
              bsonType: "number",
              description: "Intern's age",
            },
            email: {
              bsonType: "string",
              description: "Intern's email address",
            },
            department: {
              bsonType: "string",
              description: "Intern's  department",
            },
            university: {
              bsonType: "string",
              description: "Intern's university",
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
              enum: ["accepted", "pending", "notAssigned"],
              description: "Mentor Assignment status",
            },
            mentor: {
              bsonType: "string",
              description: "Mentor assigned to the intern",
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
            startDate: {
              bsonType: "string",
              description: "Intern's start date",
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
