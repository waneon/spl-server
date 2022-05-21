const Sequelize = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'watcher',
    {
      key: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      dept: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      note: {
        type: Sequelize.STRING,
      },
    },
    {
      tableName: 'watcher',
      createdAt: false,
      updatedAt: false,
    },
  );
