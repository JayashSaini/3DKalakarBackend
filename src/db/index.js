const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI;

module.exports = async function connectDB() {
  try {
    const res = await mongoose.connect(MONGODB_URI);
    console.log("🌏 MongoDB Connection Successful", res.connection.host);
  } catch (error) {
    console.log("MongoDB Connection Failed" + error);
    process.exit(1);
  }
};
