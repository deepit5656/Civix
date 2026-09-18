const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('bufferCommands', false);

let cachedConnection = null;
let lastAttemptTime = 0;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  // Don't retry more than once every 5 seconds if connection failed
  const now = Date.now();
  if (cachedConnection && (now - lastAttemptTime < 5000)) {
    try {
      await cachedConnection;
      if (mongoose.connection.readyState === 1) return;
    } catch (_) {}
  }

  const primaryUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  const isVercel = Boolean(process.env.VERCEL || process.env.NOW_REGION);

  if (!primaryUri && isVercel) {
    console.error('❌ MONGO_URI is missing in Vercel Environment Variables!');
    return;
  }

  const uriToUse = primaryUri || 'mongodb://127.0.0.1:27017/civix';
  const timeoutMs = isVercel && !primaryUri ? 500 : 10000;

  lastAttemptTime = now;
  cachedConnection = (async () => {
    try {
      console.log('🔄 Connecting to MongoDB...');
      const conn = await mongoose.connect(uriToUse, {
        serverSelectionTimeoutMS: timeoutMs,
      });
      console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
      console.warn('⚠️ Primary MongoDB Connection Warning:', err.message);
      if (!isVercel && uriToUse !== 'mongodb://127.0.0.1:27017/civix') {
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
  })();

  await cachedConnection;
};

module.exports = connectDB;

