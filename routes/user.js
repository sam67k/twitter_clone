const express = require("express");
const router = express.Router();

const controller = require("../controllers/user");
const tweetRouter = require("./tweet");
const isAuthenticatedUser = require("../middlewares/isAuthenticatedUser");
const {
  user: { validateUsername, validateEmail, validateSignin, validateSignup },
} = require("./validations");

router.use("/:userId/tweets", isAuthenticatedUser, tweetRouter);

router.get("/username", validateUsername, controller.username);
router.get("/email", validateEmail, controller.email);
router.get(
  "/:userId/profile/:profileId",
  isAuthenticatedUser,
  controller.profile
);
router.get(
  "/:userId/profile/:profileId/tweets",
  isAuthenticatedUser,
  controller.tweets
);
router.get("/signin", validateSignin, controller.signin);
router.post("/signup", validateSignup, controller.signup);
router.post(
  "/:userId/profile/:profileId/follow",
  isAuthenticatedUser,
  controller.follow
);

module.exports = router;
