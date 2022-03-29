const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  'root',
  process.env.DB_ROOT_PASSWORD,
  {
    host: 'mysql',
    dialect: 'mysql',
    define: {
      charset: 'utf8',
      collation: 'utf8_unicode_ci',
    },
  },
);

// vehicle
const vehicle = require('./vehicle.js')(sequelize);

// person
const person = require('./person.js')(sequelize);

// memo
const memo = require('./memo.js')(sequelize);

// watcher
const watcher = require('./watcher.js')(sequelize);

module.exports = {
  sequelize,
  vehicle,
  person,
  memo,
  watcher,
};
