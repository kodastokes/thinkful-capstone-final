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

function hasResID(req, res, next) {
  const reservation = req.body.data.reservation_id;
  if (reservation) {
    return next();
  }
  next({
    status: 400,
    message: "reservation_id required",
  });
}

async function tableExists(req, res, next) {
  const table_id = req.params.table_id;
  const table = await service.readTable(table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({
    status: 404,
    message: `table_id ${table_id} does not exist`,
  });
}

async function reservationExists(req, res, next) {
  const reservation = await service.readReservation(
    req.body.data.reservation_id
  );
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `reservation_id ${req.body.data.reservation_id} does not exist`,
  });
}

function tableOpen(req, res, next) {
  const table = res.locals.table;
  if (!table.reservation_id) {
    return next();
  }
  next({
    status: 400,
    message: `table_id is occupied`,
  });
}

async function hasEnoughSeats(req, res, next) {
  const { reservation, table } = res.locals;
  if (reservation.people > table.capacity) {
    next({
      status: 400,
      message: "table capacity is smaller than reservation size",
    });
  }
  return next();
}

async function reservationSeated(req, res, next) {
  const seated = await service.readTableByRes(req.body.data.reservation_id);
  if (!seated) {
    return next();
  }
  next({
    status: 400,
    message: "reservation_id is already seated",
  });
}

async function updateSeatRes(req, res) {
  const { reservation, table } = res.locals;
  const data = await service.updateSeatRes(
    reservation.reservation_id,
    table.table_id
  );
  res.json({ data });
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
  updateSeat: [
    hasData,
    hasResID,
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(reservationExists),
    tableOpen,
    asyncErrorBoundary(hasEnoughSeats),
    asyncErrorBoundary(reservationSeated),
    asyncErrorBoundary(updateSeatRes),
  ],
};
