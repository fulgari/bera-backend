'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('./models/userModel');
const jsonwebtoken = require('jsonwebtoken');
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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function (err, decode) {
      if (err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});
const routes = require('./route/userRoute');
routes(app);
app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' })
});

module.exports = app;
