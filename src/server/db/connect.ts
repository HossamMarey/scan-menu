import mongoose from 'mongoose';

/**
 * MongoDB connection helper using Mongoose
 * Implements connection pooling and handles reconnection logic
 */

// Global connection cache to prevent multiple connections in development
declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB database
 * Uses connection caching to prevent multiple connections in serverless environments
 */
export async function connectToDatabase(): Promise<mongoose.Connection> {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Return existing promise if connection is in progress
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable mongoose buffering
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
    };

    // Get MongoDB URI from environment variables
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error(
        'MONGODB_URI environment variable is not defined. Please add it to your .env.local file.'
      );
    }

    cached.promise = mongoose.connect(mongoUri, opts).then(mongoose => {
      console.log('✅ Connected to MongoDB');
      return mongoose.connection;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB connection error:', e);
    throw e;
  }

  return cached.conn;
}

/**
 * Disconnect from MongoDB database
 * Useful for cleanup in tests or when shutting down the application
 */
export async function disconnectFromDatabase(): Promise<void> {
  if (cached.conn) {
    await cached.conn.close();
    cached.conn = null;
    cached.promise = null;
    console.log('🔌 Disconnected from MongoDB');
  }
}
