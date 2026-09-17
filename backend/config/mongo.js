const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('bufferCommands', false);

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/civix';

  try {
    console.log('🔄 Connecting to MongoDB...');
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.warn('⚠️ Primary MongoDB Connection Warning:', err.message);
    if (primaryUri !== 'mongodb://127.0.0.1:27017/civix') {
      try {
        console.log('🔄 Trying local MongoDB (mongodb://127.0.0.1:27017/civix)...');
        const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/civix', {
          serverSelectionTimeoutMS: 2000,
        });
        console.log(`✅ Local MongoDB connected: ${localConn.connection.host}`);
      } catch (localErr) {
        console.warn('⚠️ Local MongoDB unreachable.');
      }
    }
  }
};

module.exports = connectDB;
