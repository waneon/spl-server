const Sequelize = require('sequelize');

module.exports = (sequelize) => sequelize.define(
  'memo',
  {
    key: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    memo: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'memo',
    createdAt: false,
  },
);
