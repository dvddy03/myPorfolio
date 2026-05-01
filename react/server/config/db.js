import mongoose from "mongoose";

let connectionPromise;

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/myportfolio";
    mongoose.set("strictQuery", true);
    connectionPromise = mongoose.connect(mongoUri);
  }

  return connectionPromise;
}

export default connectToDatabase;
