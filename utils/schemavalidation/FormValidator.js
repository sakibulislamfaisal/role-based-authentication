const validate = require("mongoose-validator");

const nameValidator = [
  validate({
    validator: "isEmpty",
    message: "Please Provide your username!",
  }),
  validate({
    validator: "isLength",
    arguments: [3, 20],
    message: "Name should be between {ARGS[0]} and {ARGS[1]} characters",
  }),
  validate({
    validator: "isAlphanumeric",
    passIfEmpty: true,
    message: "Name should be alphanumeric characters only!",
  }),
];

const emailValidator = [
  validate({
    validator: "isEmpty",
    message: "Please Provide your Email!",
  }),
  validate({
    validator: "isEmail",
    message: "Please Provide a valid email address!",
  }),
  validate({
    validator: "matches",
    arguments: /^[a-zA-Z\-]+$/i,
    message: "Invalid Email Address!",
  }),
];

const passwordValidator = [
  validate({
    validator: "isEmpty",
    message: "Please Provide your Password!",
  }),
  validate({
    validator: "isLength",
    arguments: [6, 20],
    message: "Name should be between {ARGS[0]} and {ARGS[1]} characters",
  }),
];

const confirmPasswordValidator = [
  validate({
    validator: "isEmpty",
    message: "Please Provide your confirm Password!",
  }),
  validate({
    validator: "equals",
    message: "Confirm Password Must Be Matched!",
  }),
];

module.exports = {
  nameValidator,
  emailValidator,
  passwordValidator,
  confirmPasswordValidator,
};
