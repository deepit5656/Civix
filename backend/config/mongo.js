const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/civix';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('⚠️ MongoDB connection warning:', err.message);
    console.log('ℹ️ Server will remain running. Ensure MongoDB Atlas IP is whitelisted (0.0.0.0/0) or local MongoDB is running.');
  }
};

module.exports = connectDB;
