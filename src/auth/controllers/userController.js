'use strict';
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = mongoose.model('User');
const dotenv = require('dotenv').config().parsed;

exports.register = function (req, res) {
  const newUser = new User(req.body);
  newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
  newUser.save().then(user => {
    user.hash_password = undefined;
    return res.json(user);
  }).catch((err) => {
    return res.status(400).send({
      message: err
    });
  });
};

exports.sign_in = function (req, res) {
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (!user || !user.comparePassword(req.body.password)) {
      return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
    }
    return res.json({ token: jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id }, dotenv.JWT_SECRET) });
  }).catch(err => {
    throw err;
  });
};

exports.loginRequired = function (req, res, next) {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized user!!' });
  }
};

exports.profile = function (req, res, next) {
  if (req.user) {
    res.send(req.user);
    next();
  } else {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
