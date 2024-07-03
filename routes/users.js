const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

router.post(
  "/signup",
  [
    check("name", "Name is required").not().isEmpty(),
    check("mobile", "Please include a valid mobile number").isMobilePhone(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
  ],
  userController.signup
);

router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  userController.login
);

router.put("/:id", auth, userController.updateUser);

router.delete("/:id", auth, userController.deleteUser);

router.get("/", userController.getUsers);

router.get("/search/:name", auth, userController.searchUsersByName);

router.put("/follow/:id", auth, userController.followUser);

router.put("/unfollow/:id", auth, userController.unfollowUser);

router.get("/profile", auth, userController.getUserProfile);

module.exports = router;
