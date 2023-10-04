("use strict");
const moment = require("moment");
const ApiError = require("../utils/apiError");
const { getOffset } = require("../utils/pagination");

const table = "tweets";

module.exports = (sequelize, DataTypes) => {
  const Models = sequelize.models;
  const Tweet = sequelize.define(
    table,
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        unique: true,
      },
      fk_creator_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      archived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      defaultScope: {
        where: {
          archived: false,
        },
      },
    }
  );

  Tweet.beforeCreate((tweet) => {
    tweet.dataValues.createdAt = moment().unix();
    tweet.dataValues.updatedAt = moment().unix();
  });

  Tweet.beforeUpdate((tweet) => {
    tweet.dataValues.updatedAt = moment().unix();
  });

  Tweet.associate = (models) => {
    Tweet.hasMany(models.TweetLikes, {
      as: "tweetLikes",
      foreignKey: "fk_tweet_id",
    });

    Tweet.belongsTo(models.Users, {
      as: "user",
      foreignKey: "fk_creator_id",
    });
  };

  Tweet.structurizeTweets = (tweets) => {
    const structuredTweets = tweets.map((tweet) => {
      return {
        id: tweet.id,
        content: tweet.content,
        creatorId: tweet.fk_creator_id,
        tweetLikesCount: tweet.tweetLikes.length,
      };
    });

    return structuredTweets;
  };

  Tweet.structurizeTweet = (tweet) => {
    console.log(tweet);
    const structuredTweet = {
      id: tweet.id,
      content: tweet.content,
      creatorId: tweet.fk_creator_id,
      tweetLikesCount: tweet.tweetLikes.length,
    };

    return structuredTweet;
  };

  Tweet.getOne = async (creatorId, tweetId) => {
    const tweet = await Tweet.findOne({
      attributes: ["id", "content", "fk_creator_id"],
      include: [
        {
          model: Models.tweet_likes,
          as: "tweetLikes",
          attributes: ["id", "fk_user_id"],
          required: false,
        },
      ],
      where: {
        id: Number(tweetId),
        fk_creator_id: creatorId,
      },
    });

    if (!tweet) {
      throw new ApiError(404, "Tweet not found for User.");
    }

    return tweet;
  };

  Tweet.getAll = async (creatorId, page, limit) => {
    const { count, rows: tweets } = await Tweet.findAndCountAll({
      attributes: ["id", "content", "fk_creator_id"],
      include: [
        {
          model: Models.tweet_likes,
          as: "tweetLikes",
          attributes: ["id", "fk_user_id"],
          required: false,
        },
      ],
      where: {
        fk_creator_id: creatorId,
      },
      offset: getOffset(page, limit),
      limit: limit,
    });

    return { count, tweets };
  };

  return Tweet;
};
