("use strict");
const moment = require("moment");

const table = "user_followers";

module.exports = (sequelize, DataTypes) => {
  const UserFollower = sequelize.define(
    table,
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        unique: true,
      },
      fk_followed_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fk_follower_id: {
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

  UserFollower.beforeCreate((userFollower) => {
    userFollower.dataValues.createdAt = moment().unix();
    userFollower.dataValues.updatedAt = moment().unix();
  });

  UserFollower.beforeUpdate((userFollower) => {
    userFollower.dataValues.updatedAt = moment().unix();
  });

  UserFollower.associate = (models) => {
    UserFollower.belongsTo(models.Users, {
      as: "follower",
      foreignKey: "fk_followed_id",
    });

    UserFollower.belongsTo(models.Users, {
      as: "followed",
      foreignKey: "fk_follower_id",
    });
  };

  UserFollower.getUserFollowerIds = async (userId, transaction) => {
    let userFollowerIds = await UserFollower.findAll({
      attributes: ["fk_follower_id"],
      where: {
        fk_followed_id: Number(userId),
      },
      transaction,
    });

    return userFollowerIds.map(
      (userFollowerId) => userFollowerId.fk_follower_id
    );
  };

  UserFollower.getUserFollowedIds = async (userId, transaction) => {
    let userFollowedIds = await UserFollower.findAll({
      attributes: ["fk_followed_id"],
      where: {
        fk_follower_id: Number(userId),
      },
      transaction,
    });

    return userFollowedIds.map(
      (userFollowedId) => userFollowedId.fk_followed_id
    );
  };

  UserFollower.getCreatorIds = async (userId) => {
    let creatorIds = [];

    creatorIds = await UserFollower.getUserFollowedIds(userId);

    creatorIds = [...creatorIds, Number(userId)];

    return creatorIds;
  };

  return UserFollower;
};
