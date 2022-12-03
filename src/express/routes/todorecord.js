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
    await models.todorecord.update(req.body, {
      where: {
        id: id,
      },
    });
    res.status(200).end();
  } else {
    res.status(400).send(`Bad request: param ID (${id}) does not match body ID (${req.body.id}).`);
  }
}

async function remove(req, res) {
  const id = getIdParam(req);
  await models.todorecord.destroy({
    where: {
      id: id,
    },
  });
  res.status(200).end();
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
