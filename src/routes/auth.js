const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");

const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/signup", async (req, res) => {
  //  Validation of  Data
  try {
    validateSignUpData(req);

    // Encrypt the password
    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    // Creating a new instance of user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    // return a promise
    await user.save();
    res.send("User created successfully...");
  } catch (err) {
    res.status(404).send("ERROR: " + err.message);
  }
});
router.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("INVALID CREDENTIALS.");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // Create a jwt Token
      const token = await user.getJWT();

      // Add the token to cookie and send the response
      res.cookie("token", token);
      res.send("logged in successfull....");
    } else {
      throw new Error("INVALID CREDENTIALS.");
    }
  } catch (err) {
    res.status(404).send("ERROR: " + err.message);
  }
});

router.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
    res.send("Logged out successfull....");
})

module.exports = router;