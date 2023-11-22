const ShareDB = require('sharedb');
const express = require('express');
const mysqlDB = require('./sharedb-mysql');
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

ShareDB.types.register(json0); // 内置的 json0 不支持 li 操作在数组中插入 objects，只能插入 string
ShareDB.types.defaultType = (json0);

function initShareDbWss (app) {
  // Start ShareDB
  const backend = new ShareDB({ db: mysqlDB(shareDbOptions) });

  // Create a WebSocket server
  // const app = express();
  app.use(express.static('static'));

  const wss = new WebSocket.Server({ noServer: true });

  // Connect any incoming WebSocket connection with ShareDB
  wss.on('connection', function (ws) {
    const stream = new WebSocketJSONStream(ws);
    backend.listen(stream);
  });

  // Create initial documents
  const connection = backend.connect();

  const initDoc = () => {
    const doc = connection.get('todorecords', TEST_DOC_ID);
    doc.fetch(errWrap(() => {
      if (!doc.data) {
        const data = []
        doc.create(data)
      }
    }))
  }
  initDoc();

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
          const data = [obj]
          doc.create(data, errWrap(() => {
            res.status(200).send(doc.data)
          }))
        } else {
          const { data } = doc;
          const idx = data.length;
          const obj = {
            id: idx,
            ...req.body
          };
          const addOp = [{ p: [idx], li: obj }]
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
      const originIdx = data?.findIndex((item) => item?.id === id)
      const originObj = data?.[originIdx];
      successCb?.(doc, originIdx, originObj);
    }))
  }

  const updateTodo = (req, res) => {
    findTodo(req, res, (doc, originIdx, originObj) => {
      const obj = req.body;
      const op = [{ p: [originIdx], ld: originObj, li: obj }]
      doc.submitOp(op, {}, errWrap(() => {
        res.status(200).send(doc.data);
      }))
    })
  }

  const deleteTodo = (req, res) => {
    findTodo(req, res, (doc, originIdx, originObj) => {
      const op = [{ p: [originIdx], ld: originObj }]
      doc.submitOp(op, {}, errWrap(() => {
        res.status(200).send(doc.data);
      }))
    })
  }

  app.get('/api/todorecord', loginInRequiredMw, makeHandlerAwareOfAsyncErrors(queryTodo));
  app.post('/api/todorecord', loginInRequiredMw, makeHandlerAwareOfAsyncErrors(createTodo));
  app.put('/api/todorecord', loginInRequiredMw, makeHandlerAwareOfAsyncErrors(updateTodo));
  app.delete('/api/todorecord', loginInRequiredMw, makeHandlerAwareOfAsyncErrors(deleteTodo));

  return {
    wss
  }
}

module.exports = initShareDbWss
