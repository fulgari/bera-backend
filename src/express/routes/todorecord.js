const { models } = require("../../sequelize");
const { getIdParam, getDateParam } = require("../helpers");

async function getAll(req, res) {
  const todorecords = await models.todorecord.findAll();
  res.status(200).json(todorecords);
}

async function getById(req, res) {
  const id = getIdParam(req);
  const todorecord = await models.todorecord.findByPk(id);
  if (todorecord) {
    res.status(200).json(todorecord);
  } else {
    res.status(404).send("404 - Not found");
  }
}

async function getAllByDate(req, res) {
  const date = getDateParam(req);
  const todorecord = await models.todorecord.findAll({
    where: {
      date: date
    }
  });
  if (todorecord) {
    res.status(200).json(todorecord);
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
  create,
  update,
  remove,
};
