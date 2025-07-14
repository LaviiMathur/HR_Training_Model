export default async function createNotificationCollection(db) {
  try {
    const collections = await db
      .listCollections({ name: "notifications" })
      .toArray();
    if (collections.length > 0) {
      console.log("ℹ️ 'notifications' collection already exists");
      // await db.collection("notifications").drop();
      return;
    }

    await db.createCollection("notifications", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: [
            "internId",
            "internName",
            "message",
            "marked",
            "receiver",
            "sender",
          ],
          properties: {
            receiver: {
              bsonType: "objectId",
              description: "must be an objectId and is required",
            },
            sender: {
              bsonType: "objectId",
              description: "must be an objectId and is required",
            },
            internId: {
              bsonType: "objectId",
              description: "must be an objectId and is required",
            },
            internName: {
              bsonType: "string",
              description: "must be a string and is required",
            },
            message: {
              bsonType: "string",
              description: "must be a string and is required",
            },
            marked: {
              bsonType: "bool",
              description: "must be a boolean and is required",
            },
            createdAt: {
              bsonType: "date",
              description: "must be a date",
            },
          },
        },
      },
    });

    console.log("✅ 'notifications' collection created");
    return;
  } catch (error) {
    console.error("Error creating notifications collection:", error);
    throw error;
  }
}
