const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { omit } = require("lodash");
const CONFIG = require("../config/config");

exports.signup = async function (req, res, next) {
  try {
    // Get user input
    const { email, password, firstName, lastName, phoneNumber } = req.body;

    // Validate user input
    if (!(email || password || firstName || lastName || phoneNumber)) {
      return res
        .status(400)
        .json({ status: "fail", message: "All input is required" });
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email: email });

    if (oldUser) {
      return res
        .status(409)
        .json({ status: "fail", message: "User already exists" });
    }

    const user = await User.create(req.body);
    res
      .status(201)
      // omit the password and password confirm
      .json(omit(user.toObject(), ["password"]));
  } catch (err) {
    next(err);
  }
};

exports.login = async function (req, res, next) {
  try {
    // Get user input
    const { phoneNumber, password } = req.body;

    // Validate user input
    if (!(phoneNumber && password)) {
      return res
        .status(400)
        .json({ status: "fail", message: "All input is required" });
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email: email });

    const validPassword = await user.comparePassword(password);
    if (validPassword) {
      // Create token
      const token = jwt.sign({ id: user._id, email: email }, CONFIG.TOKEN_KEY, {
        expiresIn: "2h",
      });
      // save user token
      user.token = token;
      res.status(200).json({ token: token });
    } else {
      return res.status(400).json({
        status: "fail",
        message: "Incorrect password",
      });
    }
  } catch (err) {
    next(err);
  }
};
