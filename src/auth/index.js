/**
 * @ Author: pzij
 * @ Create Time: 2023-08-12 20:09:10
 * @ Modified by: pzij
 * @ Modified time: 2023-08-13 00:14:33
 * @ Description: middleware callbacks that are used in express/app.js
 */

const { loginRequired } = require('./controllers/userController');
const jsonwebtoken = require('jsonwebtoken');

const retrieveAuthMw = function (req, res, next) {
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
}

const loginInRequiredMw = loginRequired;

export {
  retrieveAuthMw,
  loginInRequiredMw
}
