const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

function hasData(req, res, next) {
  if (req.body.data) {
    return next();
  }
  next({
    status: 400,
    message: "Body must have a data property.",
  });
}

function hasTableName(req, res, next) {
  const name = req.body.data.table_name;
  if (name) {
    return next();
  }
  next({
    status: 400,
    message: "table_name property required",
  });
}

function hasValidTableName(req, res, next) {
  const tableName = req.body.data.table_name;
  if (tableName.length >= 2) {
    return next();
  }
  next({
    status: 400,
    message: "table_name must be longer than 2 characters.",
  });
}

function hasValidCapacity(req, res, next) {
  const { data: { capacity } = {} } = req.body;
  if (capacity > 0 && typeof capacity === "number") {
    return next();
  }
  next({
    status: 400,
    message: "Table must have capacity for at least one person",
  });
}

async function create(req, res) {
  const newTable = req.body.data;
  const data = await service.create(newTable);
  res.status(201).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasData,
    hasTableName,
    hasValidTableName,
    hasValidCapacity,
    asyncErrorBoundary(create),
  ],
};
