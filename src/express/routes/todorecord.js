/**
 * chatgpt cr：
这段代码是一个基于 Node.js 和 Sequelize 的 REST API，用于管理 todo 任务记录。主要实现了以下功能：

获取所有记录
根据 id 获取单条记录
根据日期获取所有记录
根据日期范围获取所有记录
创建记录
更新记录
删除记录
代码本身比较简洁和易读，但是还有一些可以改进的地方：

在控制器中使用 try-catch 来捕获和处理错误，以避免未处理的异常导致程序崩溃。
在返回响应时，可以使用更具体的状态码和错误消息来表示具体的错误类型，以帮助客户端更好地处理错误。例如，可以使用 422 状态码来表示客户端提交的数据验证错误。
在更新和删除记录时，可以检查是否找到了匹配的记录，并在未找到时返回 404 错误，而不是返回 200 成功状态码，这样可以更好地表示操作的结果。
可以使用 Sequelize 的事务来确保操作的原子性，以避免在多个并发请求同时修改同一记录时出现数据不一致的问题。
可以使用 Joi 等数据验证库来验证客户端提交的数据，以确保数据的完整性和正确性。
 */
const { Sequelize, Op } = require("sequelize");
const { models } = require("../../sequelize");
const { getIdParam, getDateParam, getPeriodParam } = require("../helpers");

async function getAll(req, res) {
  const todorecords = await models.todorecord.findAll();
  res.status(200).json(todorecords);
}

/**
 * Get a single record by id
 * @param {*} req 
 * @param {*} res 
 */
async function getById(req, res) {
  const id = getIdParam(req);
  const record = await models.todorecord.findByPk(id);
  if (record) {
    res.status(200).json(record);
  } else {
    res.status(404).send("404 - Not found");
  }
}

/**
 * Get all records at the same date
 * @param {*} req 
 * @param {*} res 
 */
async function getAllByDate(req, res) {
  const date = getDateParam(req);
  const records = await models.todorecord.findAll({
    where: {
      date: date
    }
  });
  if (records) {
    res.status(200).json(records);
  } else {
    res.status(404).send("404 - Not found");
  }
}

/**
 * Get all records during the periodefrom "from" date to "to" date
 * @param {*} req 
 * @param {*} res 
 */
async function getAllByPeriod(req, res) {
  const { from, to } = getPeriodParam(req);
  const records = await models.todorecord.findAll({
    where: {
      [Op.and]: [
        {date: {[Op.gte]: from}},
        {date: {[Op.lt]: to}}
      ]
    }
  });
  if (records) {
    res.status(200).json(records);
  } else {
    res.status(404).send("404 - Not found");
  }
}

async function create(req, res) {
  if (req.body.id) {
    res
      .status(400)
      .send(`Bad request: ID should not be provided, since it is determined automatically by the database.`);
  } else {
    await models.todorecord.create(req.body);
    res.status(201).end();
  }
}

async function update(req, res) {
  const id = getIdParam(req);

  // We only accept an UPDATE request if the `:id` param matches the body `id`
  if (req.body.id === id) {
    const [rows] = await models.todorecord.update(req.body, {
      where: {
        id: id,
      },
    });
    if (rows > 0) {
      res.status(200).end();
    } else {
      res.status(404).end();
    }
  } else {
    res.status(400).send(`Bad request: param ID (${id}) does not match body ID (${req.body.id}).`);
  }
}

async function remove(req, res) {
  const id = getIdParam(req);
  const rows = await models.todorecord.destroy({
    where: {
      id: id,
    },
  });
  if (rows > 0) {
    res.status(200).end();
  } else {
    res.status(404).end();
  }
}

module.exports = {
  getAll,
  getById,
  getAllByDate,
  getAllByPeriod,
  create,
  update,
  remove,
};
