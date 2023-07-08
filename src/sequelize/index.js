const mysql2 = require("mysql2");
const { Sequelize } = require("sequelize");
const { applyExtraSetup } = require("./extra-setup");
const dbConfig = require("../database/mysql-example-database/config/db.config");

// In a real app, you should keep the database connection URL as an environment variable.
// But for this example, we will just use a local SQLite database.
// const sequelize = new Sequelize(process.env.DB_CONNECTION_URL);

/**
 * Using sqlite
 */
// const sequelize = new Sequelize({
//   dialect: "sqlite",
//   storage: "sqlite-example-database/example-db.sqlite",
//   logQueryParameters: true,
//   benchmark: true,
// });

/**
 * Using mysql
 */
const options = {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
};
if (options.dialect === 'mysql') {
  options.dialectModule = mysql2;
}
const sequelize = new Sequelize(dbConfig.db, dbConfig.user, dbConfig.password, );

const modelDefiners = [
  require("./models/user.model"),
  require("./models/kanban.model"),
  require("./models/todorecord.model"),
  // require('./models/instrument.model'),
  // require('./models/orchestra.model'),
  // Add more models here...
  // require('./models/item'),
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

// We execute any extra setup after the models are defined, such as adding associations.
applyExtraSetup(sequelize);

// We export the sequelize connection instance to be used around our app.
module.exports = sequelize;
