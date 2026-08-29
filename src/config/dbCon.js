const mongoose = require("mongoose");
const dbCon = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL);
    if (connection) {
      console.log("MongoDB connected successfully!");
    } else {
      console.log("MongoDB is not connected");
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = dbCon;
