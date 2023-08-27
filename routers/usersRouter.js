const express = require("express");
const userControllers = require("../controller/userControllers");
const authController = require("../controller/authController");

const router = express.Router();

router.route("/signup").post(authController.signUp);
router.route("/login").post(authController.logIn);

router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword/:token").patch(authController.resetPassword);
router
  .route("/updatePassword")
  .patch(authController.protect, authController.updatePassword);
router
  .route("/updateUser")
  .patch(authController.protect, userControllers.updateUser);
router
  .route("/deleteUser")
  .delete(
    authController.protect,
    authController.restrict("admin"),
    userControllers.deleteUser,
  );
router.route("/").get(authController.protect, userControllers.getAllUsers);
router.route("/:id").get(authController.protect, userControllers.getUser);

module.exports = router;
