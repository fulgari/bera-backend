/**
 * @ Author: pzij
 * @ Create Time: 2023-07-31 23:21:12
 * @ Modified by: pzij
 * @ Modified time: 2023-11-09 00:42:08
 * @ Description: unified entry of routes
 */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { makeHandlerAwareOfAsyncErrors } = require('./utils')
const { retrieveAuthMw, loginInRequiredMw, userRoute } = require('../auth/index.js');
const initShareDB = require('../sharedb/server');

const routes = {
  users: require('./routes/users.js'),
  kanban: require('./routes/kanban.js'),
  todorecord: require('./routes/todorecord.js')
  // orchestras: require("./routes/orchestras"),
  // Add more routes here...
  // items: require('./routes/items'),
};

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:9004',
    'http://127.0.0.1:9004',
    'http://localhost:80',
    'http://127.0.0.1:80',
    'http://localhost',
    'http://127.0.0.1',
    /** prod */
    'https://bera-frontend.vercel.app',
    'https://bera-frontend-pzij.vercel.app'
  ]
};
app.use(cors());
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());

/** auth */
app.use(retrieveAuthMw);

// We provide a root route just as an example
app.get('/', (req, res) => {
  res.send(`
  <h2>Hello, Sequelize + Express!</h2>
  <p>Make sure you have executed <b>npm run setup-example-db</b> once to have a populated example database. Otherwise, you will get <i>'no such table'</i> errors.</p>
  <p>Try some routes, such as <a href='/api/users'>/api/users</a> or <a href='/api/orchestras?includeInstruments'>/api/orchestras?includeInstruments</a>!</p>
  <p>To experiment with POST/PUT/DELETE requests, use a tool for creating HTTP requests such as <a href='https://github.com/jakubroztocil/httpie#readme'>HTTPie</a>, <a href='https://www.postman.com/downloads/'>Postman</a>, or even <a href='https://en.wikipedia.org/wiki/CURL'>the curl command</a>, or write some JS code for it with <a href='https://github.com/sindresorhus/got#readme'>got</a>, <a href='https://github.com/sindresorhus/ky#readme'>ky</a> or <a href='https://github.com/axios/axios#readme'>axios</a>.</p>
`);
});

userRoute(app);

// We define the standard REST APIs for each route (if they exist).
for (const [routeName, routeController] of Object.entries(routes)) {
  if (routeName === 'todorecord') break

  // get http://localhost:9001/api/todorecord/
  if (routeController.getAll) {
    app.get(`/api/${routeName}`, loginInRequiredMw, makeHandlerAwareOfAsyncErrors(routeController.getAll));
  }
  // get http://localhost:9001/api/todorecord/1
  if (routeController.getById) {
    app.get(`/api/${routeName}/:id`, loginInRequiredMw, makeHandlerAwareOfAsyncErrors(routeController.getById));
  }
  // get http://localhost:9001/api/todorecord/date/2022-12-02
  if (routeController.getAllByDate) {
    app.get(`/api/${routeName}/date/:date`, loginInRequiredMw, makeHandlerAwareOfAsyncErrors(routeController.getAllByDate));
  }
  // get http://localhost:9001/api/todorecord/period/2022-12-01/2022-12-03
  if (routeController.getAllByPeriod) {
    app.get(`/api/${routeName}/period/:from/:to`, loginInRequiredMw, makeHandlerAwareOfAsyncErrors(routeController.getAllByPeriod));
  }
  // post http://localhost:9001/api/todorecord/
  if (routeController.create) {
    app.post(`/api/${routeName}`, loginInRequiredMw, makeHandlerAwareOfAsyncErrors(routeController.create));
  }
  // put http://localhost:9001/api/todorecord/1
  if (routeController.update) {
    app.put(`/api/${routeName}/:id`, loginInRequiredMw, makeHandlerAwareOfAsyncErrors(routeController.update));
  }
  // delete http://localhost:9001/api/todorecord/1
  if (routeController.remove) {
    app.delete(`/api/${routeName}/:id`, loginInRequiredMw, makeHandlerAwareOfAsyncErrors(routeController.remove));
  }
}

initShareDB(app)

module.exports = app;
