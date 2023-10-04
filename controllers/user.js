const { UniqueConstraintError, Op } = require("sequelize");
const { Users, UserFollowers, Tweets } = require("../models");
const ApiError = require("../utils/apiError");
const {
  hashPassword,
  checkPasswordValidity,
} = require("../utils/hashPassword");
const { generateAccessToken } = require("../utils/accessToken");
const { getPreviousPage, getNextPage } = require("../utils/pagination");

module.exports = {
  username: async (req, res, next) => {
    try {
      const {
        query: { username },
      } = req;

      const usernameExists = await Users.usernameExists(username);

      res.send({
        status: 200,
        success: true,
        message: "Username fetched",
        data: { usernameExists },
      });
    } catch (err) {
      next(err);
    }
  },
  email: async (req, res, next) => {
    try {
      const {
        query: { email },
      } = req;

      const emailExists = await Users.usernameExists(email);

      res.send({
        status: 200,
        success: true,
        message: "Email fetched",
        data: { emailExists },
      });
    } catch (err) {
      next(err);
    }
  },
  signup: async (req, res, next) => {
    try {
      const {
        body: { username, fullname, email, password },
      } = req;

      const hashedPassword = hashPassword(password);

      await Users.create({
        username,
        fullname,
        email,
        password: hashedPassword,
      });

      res.send({
        status: 200,
        success: true,
        message: "User Created",
      });
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        let msg = err.errors[0].message;
        err.message = msg;
      }
      next(err);
    }
  },
  signin: async (req, res, next) => {
    try {
      const {
        query: { usernameOrEmail, password },
      } = req;

      let user = await Users.findOne({
        attributes: { exclude: ["updatedAt", "createdAt"] },
        where: {
          [Op.or]: {
            email: usernameOrEmail.toString(),
            username: usernameOrEmail.toString(),
          },
        },
      });

      if (!user) {
        throw new ApiError(404, "User not found.");
      }

      checkPasswordValidity(password, user.password);

      const accessToken = generateAccessToken(user.id);

      user = { ...user.get({ plain: true }), accessToken, password: undefined };

      res.send({
        status: 200,
        success: true,
        message: "Users",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },
  profile: async (req, res, next) => {
    try {
      const {
        params: { profileId },
      } = req;

      const user = await Users.getOne(profileId);

      const userFollowers = await UserFollowers.getUserFollowerIds(profileId);
      const userFollowerd = await UserFollowers.getUserFollowedIds(profileId);

      const profile = {
        id: user.id,
        name: user.name,
        username: user.username,
        followerCount: userFollowers.length,
        followedCount: userFollowerd.length,
      };

      res.send({
        status: 200,
        success: true,
        message: "Profile fetched",
        data: { profile },
      });
    } catch (err) {
      next(err);
    }
  },
  tweets: async (req, res, next) => {
    try {
      const {
        params: { userId, profileId },
        query: { pageLimit, pageNumber },
      } = req;
      const limit = Number(pageLimit) || 10;
      const page = Number(pageNumber) || 1;

      if (userId !== profileId) {
        await Users.getOne(profileId);

        let userFollowed = [];

        userFollowed = await UserFollowers.getUserFollowedIds(userId);

        if (!userFollowed.includes(Number(profileId))) {
          throw new ApiError(400, "User not followed.");
        }
      }

      const { count, tweets } = await Tweets.getAll(
        userId !== profileId ? Number(profileId) : Number(userId),
        page,
        limit
      );

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
  follow: async (req, res, next) => {
    try {
      const {
        params: { userId, profileId },
      } = req;

      await Users.getOne(profileId);

      const isFollowed = await UserFollowers.findOne({
        where: {
          fk_follower_id: Number(userId),
          fk_followed_id: Number(profileId),
        },
      });

      if (isFollowed) {
        throw new ApiError(400, "User already followed");
      }

      await UserFollowers.create({
        fk_follower_id: Number(userId),
        fk_followed_id: Number(profileId),
      });

      res.send({
        status: 200,
        success: true,
        message: "User Followed",
      });
    } catch (err) {
      next(err);
    }
  },
};
