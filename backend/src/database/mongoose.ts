
import mongoose from "mongoose";
import { env } from "../config/env.js";

export async function connectDatabase(): Promise<void> {
  try {
    const connection = await mongoose.connect(env.MONGODB_URI, {
      dbName:
        env.MONGODB_DB_NAME ??
        (env.NODE_ENV === "test" ? "sogairway_test" : "SOGAIRWAY"),
      serverSelectionTimeoutMS: 10_000,
    });

    console.log("MongoDB connected successfully!");
    console.log(`Database name: ${connection.connection.name}`);
    console.log(`MongoDB host: ${connection.connection.host}`);
  } catch (error: unknown) {
    console.error("Failed to connect to MongoDB.");

    if (error instanceof Error) {
      console.error(error.message);
    }

    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected successfully.");
  } catch (error: unknown) {
    console.error("Failed to disconnect from MongoDB.");

    if (error instanceof Error) {
      console.error(error.message);
    }

    throw error;
  }
}
