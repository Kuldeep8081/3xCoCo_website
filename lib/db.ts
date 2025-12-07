// lib/db.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Define the shape of our cache object
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Attach / reuse a cache on globalThis
const globalWithMongoose = globalThis as typeof globalThis & {
  _mongooseCache?: MongooseCache;
};

const cached: MongooseCache = globalWithMongoose._mongooseCache || {
  conn: null,
  promise: null,
};

globalWithMongoose._mongooseCache = cached;

export default async function connectDB() {
  if (cached.conn) {
    // Already connected
    return cached.conn;
  }

  if (!cached.promise) {
    // Create the connection promise once
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }

  // Wait for connection
  cached.conn = await cached.promise;
  return cached.conn;
}
