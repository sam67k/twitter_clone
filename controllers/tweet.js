const { UserFollowers, Tweets, TweetLikes } = require("../models");
const { getPreviousPage, getNextPage } = require("../utils/pagination");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const {
        params: { userId },
        query: { pageLimit, pageNumber },
      } = req;
      const limit = Number(pageLimit) || 10;
      const page = Number(pageNumber) || 1;

      const creatorIds = await UserFollowers.getCreatorIds(userId);

      const { count, tweets } = await Tweets.getAll(creatorIds, page, limit);

      const structuredTweets = Tweets.structurizeTweets(tweets);

      res.send({
        status: 200,
        success: true,
        message: "Tweets Fetched",
        data: {
          previousPage: getPreviousPage(page),
          currentPage: page,
          nextPage: getNextPage(page, limit, count),
          total: count,
          limit: limit,
          tweets: structuredTweets,
        },
      });
    } catch (err) {
      next(err);
    }
  },
  getOne: async (req, res, next) => {
    try {
      const {
        params: { userId, tweetId },
      } = req;

      const creatorIds = await UserFollowers.getCreatorIds(userId);

      const tweet = await Tweets.getOne(creatorIds, tweetId);

      const structuredTweet = Tweets.structurizeTweet(tweet);

      res.send({
        status: 200,
        success: true,
        message: "Tweet Fetched",
        data: { tweet: structuredTweet },
      });
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      const {
        params: { userId },
        body: { content },
      } = req;

      await Tweets.create({
        fk_creator_id: Number(userId),
        content,
      });

      res.send({
        status: 200,
        success: true,
        message: "Tweet Created",
      });
    } catch (err) {
      next(err);
    }
  },
  delete: async (req, res, next) => {
    try {
      const {
        params: { userId, tweetId },
      } = req;

      const tweet = await Tweets.getOne(userId, tweetId);

      await tweet.update({ archived: true });

      let tweetLikes = await TweetLikes.findAll({
        where: {
          fk_tweet_id: Number(tweetId),
        },
      });

      tweetLikes = tweetLikes.map((tweetLike) => ({
        ...tweetLike.get({ plain: true }),
        archived: true,
      }));

      await TweetLikes.bulkCreate(tweetLikes, {
        updateOnDuplicate: ["archived"],
      });

      res.send({
        status: 200,
        success: true,
        message: "Tweet Deleted",
      });
    } catch (err) {
      next(err);
    }
  },
  like: async (req, res, next) => {
    try {
      const {
        params: { userId, tweetId },
        body: { content },
      } = req;

      await TweetLikes.isLiked(userId, tweetId);

      const creatorIds = await UserFollowers.getCreatorIds(userId);

      await Tweets.getOne(creatorIds, tweetId);

      await TweetLikes.create({
        fk_user_id: Number(userId),
        fk_tweet_id: Number(tweetId),
        content,
      });

      res.send({
        status: 200,
        success: true,
        message: "Tweet Liked",
      });
    } catch (err) {
      next(err);
    }
  },
};
