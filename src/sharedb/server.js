const http = require('http');
const ShareDB = require('sharedb');
const express = require('express');
const ShareDBMysqlMemory = require('./sharedb-mysql');
const WebSocketJSONStream = require('@teamwork/websocket-json-stream');
const WebSocket = require('ws');
const dbConfig = require('../database/mysql-example-database/config/db.config');
const { makeHandlerAwareOfAsyncErrors } = require('../express/utils')
const { loginInRequiredMw } = require('../../src/auth');
const { TEST_DOC_ID } = require('./constants');
const { errWrap } = require('./utils');
const json0 = require('ot-json0').type;

const shareDbOptions = {
  db: { host: dbConfig.host, user: dbConfig.user, password: dbConfig.password, database: dbConfig.db, connectionLimit: dbConfig.pool.max }, ops_table: 'ops', snapshots_table: 'snapshots', debug: true
}

ShareDB.types.register(json0); // json0 不支持 li 操作在数组中插入 objects，只能插入 string
ShareDB.types.defaultType = (json0);

function initShareDB (app) {
  // Start ShareDB
  const backend = new ShareDB({ db: new ShareDBMysqlMemory(shareDbOptions) });

  // Create a WebSocket server
  // const app = express();
  app.use(express.static('static'));

  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });

  // Connect any incoming WebSocket connection with ShareDB
  wss.on('connection', function (ws) {
    const stream = new WebSocketJSONStream(ws);
    backend.listen(stream);
  });

  // Create initial documents
  const connection = backend.connect();

  // middlewares
  const queryTodo = (req, res) => {
    const doc = connection.get('todorecords', TEST_DOC_ID);
    doc.fetch(errWrap(() => {
      res.status(200).send(doc.data)
    }))
  }

  const createTodo = (req, res) => {
    if (req.body.id) {
      res
        .status(400)
        .send('Bad request: ID should not be provided, since it is determined automatically by the database.');
    } else {
      const doc = connection.get('todorecords', TEST_DOC_ID);
      doc.fetch(errWrap(() => {
        if (!doc.data) {
          const obj = {
            id: 0,
            ...req.body
          };
          req.body = obj;
          const data = {
            doc_content: [obj]
          }
          doc.create(data, errWrap(() => {
            res.status(200).send(doc.data)
          }))
        } else {
          const { data } = doc;
          const idx = data.doc_content.length;
          const obj = {
            id: idx,
            ...req.body
          };
          const addOp = [{ p: ['doc_content', idx], li: obj }]
          doc.submitOp(addOp, {}, errWrap(() => {
            res.status(200).send(doc.data)
          }))
        }
      }))
    }
  }

  const findTodo = (req, res, successCb) => {
    const doc = connection.get('todorecords', TEST_DOC_ID);
    doc.fetch(errWrap(() => {
      const id = req.body?.id;
      const { data } = doc
      if (!id) {
        res
          .status(400)
          .send(`Bad request: invalid ID ${id}`);
        return;
      }
      const originIdx = data.doc_content?.findIndex((item) => item?.id === id)
      const originObj = data.doc_content?.[originIdx];
      successCb?.(doc, originIdx, originObj);
    }))
  }

  const updateTodo = (req, res) => {
    findTodo(req, res, (doc, originIdx, originObj) => {
      const obj = req.body;
      const op = [{ p: ['doc_content', originIdx], ld: originObj, li: obj }]
      doc.submitOp(op, {}, errWrap(() => {
        res.status(200).send(doc.data);
      }))
    })
  }

  const deleteTodo = (req, res) => {
    findTodo(req, res, (doc, originIdx, originObj) => {
      const op = [{ p: ['doc_content', originIdx], ld: originObj }]
      doc.submitOp(op, {}, errWrap(() => {
        res.status(200).send(doc.data);
      }))
    })
  }

  app.get('/api/todorecord', loginInRequiredMw, makeHandlerAwareOfAsyncErrors(queryTodo));
  app.post('/api/todorecord', loginInRequiredMw, makeHandlerAwareOfAsyncErrors(createTodo));
  app.put('/api/todorecord', loginInRequiredMw, makeHandlerAwareOfAsyncErrors(updateTodo));
  app.delete('/api/todorecord', loginInRequiredMw, makeHandlerAwareOfAsyncErrors(deleteTodo));
}

module.exports = initShareDB
