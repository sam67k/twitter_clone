("use strict");
const moment = require("moment");
const ApiError = require("../utils/apiError");

const table = "tweet_likes";

module.exports = (sequelize, DataTypes) => {
  const TweetLike = sequelize.define(
    table,
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        unique: true,
      },
      fk_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fk_tweet_id: {
        type: DataTypes.INTEGER,
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

  TweetLike.beforeCreate((tweetLike) => {
    tweetLike.dataValues.createdAt = moment().unix();
    tweetLike.dataValues.updatedAt = moment().unix();
  });

  TweetLike.beforeUpdate((tweetLike) => {
    tweetLike.dataValues.updatedAt = moment().unix();
  });

  TweetLike.associate = (models) => {
    TweetLike.belongsTo(models.Users, {
      as: "user",
      foreignKey: "fk_user_id",
    });

    TweetLike.belongsTo(models.Tweets, {
      as: "tweet",
      foreignKey: "fk_tweet_id",
    });
  };

  TweetLike.isLiked = async (userId, tweetId) => {
    const isLiked = await TweetLike.findOne({
      where: {
        fk_user_id: Number(userId),
        fk_tweet_id: Number(tweetId),
      },
    });

    if (isLiked) {
      throw new ApiError(400, "Tweet already liked");
    }
  };

  return TweetLike;
};
