const jwt = require("jsonwebtoken");
const User = require("../models/user");


const userAuth = async (req, res, next) => {
  // Read the token from the req cookies

  try {
    const { token } = req.cookies;
    if(!token) {
      throw new Error("Token is not provided.");
    }

    // Validate the token
    const decodeObj = await jwt.verify(token, "DEV@TINDER$18");

    // Find the user
    const { _id } = decodeObj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found.");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = { userAuth };
/* const adminAuth = (req, res, next) => {
  console.log("Admin auth is getting checked");

  const token = "xyz";
  const isAuthenticated = token === "xyz";
  if (!isAuthenticated) {
    res.status(401).send("Unauthorized Access.");
  } else {
    next();
  }
};

module.exports = {adminAuth}; */
