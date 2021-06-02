const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });
const checkLogin = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.split(" ")[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    console.log("from authorization : ", decode);
    next();
  } catch (err) {
    res.status(500).json({
      message: "You have to login to access this page!",
    });
    next();
  }
};

module.exports = checkLogin;
