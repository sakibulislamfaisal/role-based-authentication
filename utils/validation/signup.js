const validator = require("validator");

const signup = (data) => {
  const errors = {};

  if (!data.username) {
    errors.username = "Please Provide your username";
  } else if (!validator.isLength(data.username, { min: 3, max: 25 })) {
    errors.username = "username must be 3 to 25 Character";
  }
  if (!data.email) {
    errors.email = "Please Provide your Email";
  } else if (!validator.isEmail(data.email)) {
    errors.email = "Please Provide your Valid Email";
  }
  if (!data.password) {
    errors.password = "Please Provide your Password";
  } else if (!validator.isLength(data.password, { min: 6, max: 25 })) {
    errors.password = "Password  must be 6 to 25 Character";
  }
  if (!data.confirmPassword) {
    errors.confirmPassword = "Confirm Password must be required!";
  } else if (!validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = "Confirm Password must be Match!";
  }
  // if (!data.role) {
  //   errors.role = "Please Provide a Role!";
  // }
  // if (data.role !== "user" || data.role !== "admin") {
  //   errors.role = "Role must be (user or admin) value!";
  // }
  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

module.exports = signup;
