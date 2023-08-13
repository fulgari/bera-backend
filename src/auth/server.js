'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonwebtoken = require('jsonwebtoken');
require('./initMongo');

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
