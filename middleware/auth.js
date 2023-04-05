const jwt = require("jsonwebtoken");

const CONFIG = require("../config/config");

exports.verifyToken = (req, res, next) => {
  try {
    // check for token in header
    if (req.headers.authorization === undefined) {
      return res.status(500).json({
        status: "failed",
        message: "Server Error",
      });
      //   add error handling in the future
    }
    // get the token
    const token = req.headers.authorization.split(" ")[1];

    // verify token with token key
    const decoded = jwt.verify(token, CONFIG.TOKEN_KEY);
    // get user info from the decoded token
    req.user = decoded;
  } catch (err) {
    next(err);
  }
  return next();
};
