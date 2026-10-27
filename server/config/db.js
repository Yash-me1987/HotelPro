const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hotelpro';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout if local mongod is not present
    });

    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    
    // Clean up any legacy conflicting indexes
    try {
      await conn.connection.collection('bookings').dropIndex('bookingCode_1');
      console.log('[Database] Dropped legacy bookingCode_1 index');
    } catch (e) {
      // index already dropped or not present
    }

    return conn;
  } catch (error) {
    console.warn(`[Database Notice] MongoDB connection could not be established (${error.message}).`);
    console.warn(`[Database Notice] Running in Standalone Resilient Mode. In-memory data store will handle requests seamlessly.`);
    isConnected = false;
    return null;
  }
};

const getDBStatus = () => ({
  connected: isConnected,
  readyState: mongoose.connection.readyState,
  host: mongoose.connection.host || 'Offline / In-Memory Mock Fallback',
});

module.exports = { connectDB, getDBStatus };
