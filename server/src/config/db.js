const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers([
  '8.8.8.8',
  '8.8.4.4',
]);

const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required');
  }

  try {
    cachedConnection = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "main",
    });
    console.log('MongoDB connected');
    return cachedConnection;
  } catch (err) {
    cachedConnection = null;
    console.error('DB connection failed:', err.message);
    throw err;
  }
};

module.exports = connectDB;
