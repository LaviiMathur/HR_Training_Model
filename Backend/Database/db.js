import Dotenv from "dotenv";
import { MongoClient } from "mongodb";
Dotenv.config();
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
export default async function connectDB() {
  try {
    await client.connect();
    console.log("Database connection succesfull");
    return client.db();
  } catch (error) {
    console.error("Connection failed:", error);
    process.exit(1);
  }
}
