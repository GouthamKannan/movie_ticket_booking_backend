const express = require("express");
const userController = require("../controller/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();
const JWT_SIGNING_KEY = process.env.JWT_SIGNING_KEY;

router.post("/signup", async (req, res) => {
  const { username, password, emailId, roles } = req.body;
  if (!username || !password || !emailId || !roles) {
    return res.json({
      success: false,
      message: "username and password is required",
    });
  }
  try {
    users = await userController.getOneUser(emailId);
    if (users.length) {
      return res
        .status(200)
        .json({ success: false, message: "Given email already exists" });
    }
    const hashOfPassword = await bcrypt.hash(password, 10);
    await userController.create(username, emailId, hashOfPassword, roles);
    const token = jwt.sign(emailId, JWT_SIGNING_KEY);
    res.clearCookie("session_id");
    res.cookie("session_id", token);
    return res
      .status(200)
      .json({ success: true, message: "user signed up successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error in creating the data :: ${error.message}`,
    });
  }
});

router.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  if (!emailId || !password) {
    return res.json({
      success: false,
      message: "password and email is required",
    });
  }
  try {
    const userDetails = await userController.getOneUser(emailId);
    if (userDetails.length == 1) {
      try {
        var result = await bcrypt.compareSync(password, userDetails[0].password)
        if (!result) {
            return res.status(401).json({ success: false, message: "Invalid password"});
        }
      } catch (error) {
        return res.status(401).json({ success: false, message: error.message });
      }
      const token = jwt.sign(userDetails[0].emailId, JWT_SIGNING_KEY);
      res.clearCookie("session_id");
      res.cookie("session_id", token);
      return res.status(200).json({
        success: true,
        message: "Logged in sucessfully",
        username: userDetails[0].username,
        role: userDetails[0].roles,
      });
    } else {
      return res.status(401).json({ success: false, message: "Invalid user" });
    }
  } catch (error) {
    console.error("Error in logging in :: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Error in logging in" });
  }
});

router.get("/logout", async (req, res) => {
  res.clearCookie("session_id");
  return res
    .status(200)
    .json({ success: true, message: "Logged out sucessfully" });
});

module.exports = router;
