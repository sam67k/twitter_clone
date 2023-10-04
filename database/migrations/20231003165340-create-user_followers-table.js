"use strict";

const table = "user_followers";
const uniqueConstraint = "user_followers_unique";

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
      fk_followed_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      fk_follower_id: {
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
      fields: ["fk_followed_id", "fk_follower_id", "archived"],
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable(table);
  },
};
