const express = require("express");
const router = express.Router({ mergeParams: true });

const controller = require("../controllers/tweet");
const {
  tweet: { validateTweet },
} = require("./validations");

router.get("/", controller.getAll);
router.post("/", validateTweet, controller.create);
router.get("/:tweetId", controller.getOne);
router.put("/:tweetId", controller.delete);
router.post("/:tweetId/like", controller.like);

module.exports = router;
