const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers([
  '8.8.8.8',
  '8.8.4.4',
]);

const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
        dbName: "main"
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;