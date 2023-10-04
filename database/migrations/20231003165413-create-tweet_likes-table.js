"use strict";

const table = "tweet_likes";
const uniqueConstraint = "tweet_likes_unique";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(table, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        unique: true,
      },
      fk_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      fk_tweet_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      archived: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
    });
    await queryInterface.addConstraint(table, {
      type: "unique",
      name: uniqueConstraint,
      fields: ["fk_user_id", "fk_tweet_id", "archived"],
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable(table);
  },
};
