const mongoose = require("mongoose");

//The 'mongoose.set("strictQuery", true)' method removes mongoose depreciation warnings. Change 'true' to 'false' to bring them back.
const connectDB = (url) => {
  return mongoose.set("strictQuery", true).connect(url);
};

module.exports = connectDB;
