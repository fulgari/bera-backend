const devConfig = {
  host: "127.0.0.1",
  user: "root",
  password: "panzijun",
  db: "testdb",
  dialect: "mysql",
  port: 3306,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

const prodConfig = {
  host: "db4free.net",
  user: "beraroot",
  password: "panzijun",
  db: "bera_auth_db",
  dialect: "mysql",
  port: 3306,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
}

module.exports = process.env.NODE_ENV === "development" ? devConfig : prodConfig;