import mongoose from 'mongoose';

// Define a type for the cached mongoose connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Define the type for the global object
declare global {
  var mongoose: MongooseCache | undefined;
}

// Check if the MongoDB URI exists
if (!process.env.MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable'
  );
}

// Cache the mongoose connection to avoid multiple connections in development
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

// Initialize the cached mongoose connection if it doesn't exist yet
if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI as string, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase; 