/**
 * @ Author: pzij
 * @ Create Time: 2023-08-12 20:09:10
 * @ Modified by: pzij
 * @ Modified time: 2023-08-15 01:15:48
 * @ Description: middleware callbacks that are used in express/app.js
 */
require('./models/userModel');
const userRoute = require('./route/userRoute');
const { loginRequired } = require('./controllers/userController');
const jsonwebtoken = require('jsonwebtoken');
const dotenv = require('dotenv').config().parsed;
require('./initMongo');

const retrieveAuthMw = function (req, res, next) {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], dotenv.JWT_SECRET, function (err, decode) {
      if (err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
}

const loginInRequiredMw = loginRequired;

module.exports = {
  retrieveAuthMw,
  loginInRequiredMw,
  userRoute
}
