const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://Faraz21:faraz21@namastenodejs.tnlmt.mongodb.net/devTinder"
  );
};
module.exports = connectDB;

