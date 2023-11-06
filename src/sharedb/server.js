const http = require('http');
const ShareDB = require('sharedb');
const express = require('express');
const ShareDBMysqlMemory = require('./sharedb-mysql');
const WebSocketJSONStream = require('@teamwork/websocket-json-stream');
const WebSocket = require('ws');
const dbConfig = require('../database/mysql-example-database/config/db.config');

const shareDbOptions = {
  db: { host: 'localhost', user: dbConfig.user, password: dbConfig.password, database: dbConfig.db, connectionLimit: dbConfig.pool.max }, ops_table: 'ops', snapshots_table: 'snapshots', debug: false
}

// Start ShareDB
const share = new ShareDB({ db: new ShareDBMysqlMemory(shareDbOptions) });

// Create a WebSocket server
const app = express();
app.use(express.static('static'));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
server.listen(8080);
console.log('Listening on http://localhost:8080');

// Connect any incoming WebSocket connection with ShareDB
wss.on('connection', function (ws) {
  const stream = new WebSocketJSONStream(ws);
  share.listen(stream);
});

// Create initial documents
const connection = share.connect();
connection.createFetchQuery('kanbans', {}, {}, function (err, results) {
  if (err) {
    throw err;
  }

  if (results.length === 0) {
    const names = ['Ada Lovelace', 'Grace Hopper', 'Marie Curie',
      'Carl Friedrich Gauss', 'Nikola Tesla', 'Claude Shannon'];

    names.forEach(function (name, index) {
      const doc = connection.get('todorecords', '' + index);
      // const data = { name, score: Math.floor(Math.random() * 10) * 5 };
      const data = { id: '0', todorecords: [{ text: 'hello', done: false }] };
      doc.create(data);
    });
  }
});
