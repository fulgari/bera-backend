'use strict';
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  User = require('./models/userModel'),
  bodyParser = require('body-parser'),
  jsonwebtoken = require("jsonwebtoken"),
  env = require('dotenv').config().parsed;
const mongoose = require('mongoose');
const option = {
    socketTimeoutMS: 30000,
    // keepAlive: true,
    // reconnectTries: 30000
};
const mongoURI = process.env.MONGODB_URI;
const uri = mongoURI || `mongodb+srv://${env.AUTH_DB_USERNAME}:${env.AUTH_DB_PASSWORD}@bera-auth-db.bedrsfr.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(uri, option).then(function(){
    //connected successfully
    console.log("Connect to mongo successfully")
}, function(err) {
    //err handle
    console.log("Can not connect to mongo!", err)
});


// const { MongoClient, ServerApiVersion } = require('mongodb');

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode) {
      if (err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});
var routes = require('./route/userRoute');
routes(app);
app.use(function(req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' })
});
app.listen(port);
console.log(' RESTful API server started on: ' + port);
module.exports = app;