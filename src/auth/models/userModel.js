/**
 * WIP
 * Ref: https://medium.com/loginradius/nodejs-and-mongodb-application-authentication-by-jwt-f1dc2e96baf5
 */
'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
/**
 * User Schema
 */
const UserSchema = new Schema({
  fullName: {
    type: String,
    trim: true,
    required: false
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true
  },
  hash_password: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
});
UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.hash_password);
};
mongoose.model('User', UserSchema);
