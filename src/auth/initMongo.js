const env = require('dotenv').config().parsed;
const mongoose = require('mongoose');
const option = {
  socketTimeoutMS: 30000
};
const mongoURI = process.env.MONGODB_URI;
const uri = mongoURI || `mongodb+srv://${env.AUTH_DB_USERNAME}:${env.AUTH_DB_PASSWORD}@bera-auth-db.bedrsfr.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(uri, option).then(function () {
  // connected successfully
  console.log('Connect to mongo successfully')
}, function (err) {
  // err handle
  console.log('Can not connect to mongo!', err)
});
