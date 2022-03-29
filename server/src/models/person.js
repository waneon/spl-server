const Sequelize = require('sequelize');

module.exports = (sequelize) => sequelize.define(
  'person',
  {
    key: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    which: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    dept: {
      type: Sequelize.STRING,
    },
    note: {
      type: Sequelize.STRING,
    },
    goto: {
      type: Sequelize.STRING,
    },
    date: {
      type: Sequelize.STRING,
    },
  },
  {
    tableName: 'person',
    createdAt: false,
  },
);
