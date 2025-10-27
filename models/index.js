'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];

// Safe startup debug: show which DB parameters are being used (without the password).
try {
  const cfg = {
    username: config.username,
    database: config.database,
    host: config.host,
    port: config.port,
    dialect: config.dialect
  };
  // Only log in non-production to avoid noisy logs in deployed environments.
  if ((process.env.NODE_ENV || 'development') !== 'production') {
    console.log('Sequelize config (no password):', cfg);
  }
} catch (e) {
  console.log('Could not print DB config for debugging:', e.message);
}
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
