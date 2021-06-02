const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });
const userSchema = require("../model/userSchema");
const User = new mongoose.model("User", userSchema);
const signupValidation = require("../utils/validation/signup");
const loginValidation = require("../utils/validation/login");
const serverError = require("../utils/errorHandle/error");
const router = express.Router();

//photo upload middleware
var multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

// image path
// limit: 5mb
// filter : png, jpeg,jpg

//POST A USER

const createUser = async (req, res) => {
  //Check whether data is valid or invalid
  const validate = signupValidation(req.body);
  //console.log(validation);

  //show error message in this object
  const errors = {};
  try {
    if (!validate.isValid) {
      res.status(400).json(validate.errors);
    } else {
      const {
        username,
        email,
        password,
        role,
        profileImage,
        confirmPassword,
      } = req.body;
      //check whether email or exist or not
      // console.log({ ...req.body });

      const userExists = await User.findOne({ email: email });
      if (userExists) {
        errors.email = "Email Already Exist!";
        return res.json({ message: errors.email });
      }
      const newUser = new User({
        username,
        email,
        password,
        role: role || "user",
        profileImage,
      });
      const accessToken = jwt.sign(
        {
          userId: newUser._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.jwtExpire }
      );
      newUser.accessToken = accessToken;
      bcrypt.genSalt(10, (err, salted) => {
        if (!err) {
          bcrypt.hash(newUser.password, salted, (err, hash) => {
            newUser.password = hash;
            newUser.save().then((result) => {
              res.status(201).json({
                result,
                accessToken: `Bearer ${accessToken}`,
                message: "Signup was successful!",
              });
            });
          });
        } else {
          res.status(500).json({
            message: "Signup failed!!",
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Signup failed!",
    });
  }
};

//Login a user with email and password
const login = async (req, res) => {
  try {
    const validate = loginValidation(req.body);
    if (!validate.isValid) {
      res.status(400).json(validate.errors);
    } else {
      const { email, password, role } = req.body;
      User.findOne({ email })
        .then((user) => {
          if (!user) {
            return res.json({ status: "fail", email: "This email not found!" });
          }
          bcrypt.compare(password, user.password, (err, data) => {
            if (!err) {
              if (data) {
                const payload = {
                  userId: user._id,
                  email: user.email,
                  username: user.username,
                  password: user.password,
                  role: user.role,
                };
                const token = jwt.sign(payload, process.env.JWT_SECRET, {
                  expiresIn: process.env.jwtExpire,
                });

                return res.status(200).json({
                  result: {
                    userId: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                  },
                  access_token: `Bearer ${token}`,
                  status: "success",
                  message: "Login is successful!",
                });
              }
              return res.json({
                status: "fail",
                passMsg: "Password does not match",
              });
            }
          });
        })
        .catch((err) => serverError(res, err));
    }
  } catch (err) {
    res.status(401).json({
      error: "Authentication failed!",
    });
  }
};

//GET ALL USER
const getAllUsers = async (req, res) => {
  // console.log(req.user);
  try {
    const user = await User.find({}).select("-password");
    if (user && user.length > 0) {
      res.status(200).json({
        message: "Success",
        length: user.length,
        result: user,
      });
    } else {
      res.status(404).json({
        message: "Data not found!",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "There was a server side error!",
    });
  }
};

//FIND SINGLE USER BY ID
const singleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    //select (-password => means that is not show when data is accessed from database);
    res.status(200).json({
      status: "success",
      result: user,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Error",
    });
  }
};

//FIND BY EMAIL
const getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select(
      "-password"
    );
    res.status(200).json({
      status: "success",
      result: user,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "There was a server side error!",
    });
  }
};

//DELETE A USER
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      result: user,
      message: "User has been deleted successfully!",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "There was a server side error!",
    });
  }
};

//UPDATE USER
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.file.path,
      req.body,
      { new: true, runValidators: true },
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.status(200).json({
            status: "success",
            message: "User has been updated successfully!",
            result,
          });
        }
      }
    );
  } catch (err) {
    res.status(500).json({
      message: "There was a server side error!",
    });
  }
};

//UPDATE USER
const updateUserProfile = async (req, res) => {
  const id = req.body.user_id;
  const profilePic = req.file.path;
  User.findById(id, function (err, data) {
    if (data) {
      res.status(200).json({
        status: "success",
        message: "User has been updated successfully!",
        profilePic,
        data,
      });
    } else {
      res.status(404).json({
        message: "User does not exist",
      });
    }
  });
};

const restricted = (req, res, next) => {
  const { role } = req.user;
  console.log("your role is " + role);
  if (role !== "admin") {
    res.status(401).json({
      status: "fail to access Data",
      message: "You do not have permission to this action",
      error:
        "Admin can perform this operation only!! No user is allowed to perform this action!!",
    });
  } else if (role === "admin") {
    next();
  }
};

module.exports = {
  createUser,
  getAllUsers,
  singleUser,
  getUserByEmail,
  deleteUser,
  updateUser,
  login,
  restricted,
};
