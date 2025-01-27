const express = require("express");
const profileRouter = express.Router();

const { validateEditProfileData } = require("../utils/validation");
const { userAuth } = require("../middlewares/auth");


profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(404).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/edit", async(req, res) => {
  try {
    if(!validateEditProfileData(req)) {
     throw new Error("Invalid profile")
    }
    
    const loggedInUser = req.user
    console.log(loggedInUser);

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]))

    await loggedInUser.save();

    console.log(loggedInUser);
    res.send(`${loggedInUser.firstName}, your profile update successfully`)

  } catch (err) {
    res.status(404).send("ERROR: " + err.message);
  }
})

module.exports = profileRouter;
