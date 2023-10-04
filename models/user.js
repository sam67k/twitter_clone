("use strict");
const moment = require("moment");
const ApiError = require("../utils/apiError");

const table = "users";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(table, {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  });

  User.beforeCreate((user) => {
    user.dataValues.createdAt = moment().unix();
    user.dataValues.updatedAt = moment().unix();
  });

  User.beforeUpdate((user) => {
    user.dataValues.updatedAt = moment().unix();
  });

  User.associate = (models) => {
    User.hasMany(models.Tweets, {
      as: "tweets",
      foreignKey: "fk_creator_id",
    });

    User.hasMany(models.TweetLikes, {
      as: "tweetLikes",
      foreignKey: "fk_user_id",
    });

    User.hasMany(models.UserFollowers, {
      as: "followers",
      foreignKey: "fk_followed_id",
    });

    User.hasMany(models.UserFollowers, {
      as: "followed",
      foreignKey: "fk_follower_id",
    });
  };

  User.usernameExists = async (username, transaction) => {
    const user = await User.findOne({
      where: { username },
      transaction,
    });

    return user ? true : false;
  };

  User.emailExists = async (email, transaction) => {
    const user = await User.findOne({
      where: { email },
      transaction,
    });

    return user ? true : false;
  };

  User.getOne = async (userId, transaction) => {
    const user = await User.findOne({
      where: { id: userId },
      transaction,
    });

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    return user;
  };

  return User;
};
