require("dotenv").config();
const mongoose = require("mongoose");

const connection = async () => {
  try {
    const resp = await mongoose.connect(`${process.env.MONGODB_URL}`);
    console.log("Database is connect 🌱");
    
  } catch (error) {
    console.log("Database disconnected");
    await mongoose.disconnect();
    process.exit(1);
  }
};

module.exports = connection;
