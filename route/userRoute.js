const express = require("express");

const router = express.Router();
const userController = require("../controller/userController");
const checkLogin = require("../middleware/checkLogin");

//Route Handle
router.post("/signup", userController.createUser);
router.post("/login", userController.login);
router.get(
  "/users",
  // checkLogin,
  // userController.restricted,
  userController.getAllUsers
);
router.get("/:id", userController.singleUser);
router.get("/email/:email", checkLogin, userController.getUserByEmail);
router.delete("/:id", checkLogin, userController.deleteUser);
router.put("/:id", checkLogin, userController.updateUser);
// router.post(
//   "/update-profile",
//   upload.single("profileImage"),
//   userController.updateUserProfile
// );

module.exports = router;

//form data name in the single name
