module.exports = {
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
