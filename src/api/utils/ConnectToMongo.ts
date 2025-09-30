import mongoose from "mongoose";

export const connectToMongoDB = async () => {
  const uri =
    process.env.NODE_ENV === "test"
      ? process.env.MONGO_URI_test
      : process.env.MONGO_URI;

  if (!uri) {
    throw new Error("❌ Mongo URI not set");
  }

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");
  }
};

export const disconnectFromMongoDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};
