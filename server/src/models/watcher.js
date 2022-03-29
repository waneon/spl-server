const Sequelize = require('sequelize');

module.exports = (sequelize) => sequelize.define(
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
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING,
    },
    phone: {
      type: Sequelize.STRING,
    },
  },
  {
    tableName: 'watcher',
    createdAt: false,
  },
);
