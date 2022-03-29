const Sequelize = require('sequelize');

module.exports = (sequelize) => sequelize.define(
  'vehicle',
  {
    key: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    car_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    which: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
    },
    dept: {
      type: Sequelize.STRING,
    },
    note: {
      type: Sequelize.STRING,
    },
    date: {
      type: Sequelize.STRING,
    },
    time: {
      type: Sequelize.STRING,
    },
    distance: {
      type: Sequelize.INTEGER,
    },
    oil: {
      type: Sequelize.INTEGER,
    },
    hipass: {
      type: Sequelize.INTEGER,
    },
  },
  {
    tableName: 'vehicle',
    createdAt: false,
  },
);
