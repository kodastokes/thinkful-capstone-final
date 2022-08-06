/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const { date, currentDate, mobile_number } = req.query;
  if (date) {
    const data = await service.listByDate(date);
    res.json({ data });
  } else if (currentDate) {
    const data = await service.listByDate(currentDate);
    res.json({ data });
  } else if (mobile_number) {
    const data = await service.listByPhone(mobile_number);
    res.json({ data });
  } else {
    const data = await service.list();
    res.json({ data });
  }
}

function hasData(req, res, next) {
  if (req.body.data) {
    return next();
  }
  next({
    status: 400,
    message: "Body must have data property.",
  });
}

function hasFirstName(req, res, next) {
  const name = req.body.data.first_name;
  if (name) {
    return next();
  }
  next({
    status: 400,
    message: "first_name property required.",
  });
}

function hasLastName(req, res, next) {
  const name = req.body.data.last_name;
  if (name) {
    return next();
  }
  next({
    status: 400,
    message: "last_name property required.",
  });
}

function hasMobileNumber(req, res, next) {
  const phone = req.body.data.mobile_number;
  if (phone) {
    return next();
  }
  next({
    status: 400,
    message: "mobile_number property required.",
  });
}

function hasReservationDate(req, res, next) {
  const date = req.body.data.reservation_date;
  if (date) {
    return next();
  }
  next({
    status: 400,
    message: "reservation_date property required.",
  });
}

function hasValidDate(req, res, next) {
  const date = req.body.data.reservation_date;
  const valid = Date.parse(date);
  if (valid) {
    return next();
  }
  next({
    status: 400,
    message: "reservation_date must be valid date.",
  });
}

function hasValidStatus(req, res, next) {
  const status = req.body.data.status;
  if (status !== "seated" && status !== "finished") {
    return next();
  }
  next({
    status: 400,
    message: "status cannot be seated or finished.",
  });
}

function isNotTuesday(req, res, next) {
  const date = req.body.data.reservation_date;
  const weekday = new Date(date).getUTCDay();
  if (weekday !== 2) {
    return next();
  }
  next({
    status: 400,
    message: "Restaurant is closed on Tuesdays.",
  });
}

function hasReservationTime(req, res, next) {
  const time = req.body.data.reservation_time;
  if (time && typeof time === "string") {
    return next();
  }
  next({
    status: 400,
    message: "valid reservation_time property required.",
  });
}

function hasValidTime(req, res, next) {
  const time = req.body.data.reservation_time;
  const first = "10:30";
  const last = "21:30";
  if (time >= first && time <= last) {
    return next();
  }
  next({
    status: 400,
    message: "Reservation time must be made between 10:30 AM and 9:30 PM.",
  });
}

function isNotInPast(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const reservation = new Date(
    `${reservation_date} ${reservation_time}`
  ).valueOf();
  const today = new Date();
  if (reservation > today) {
    return next();
  }
  next({
    status: 400,
    message: "Reservation must be made in the future.",
  });
}

function hasPeople(req, res, next) {
  const { data: { people } = {} } = req.body;
  if (people > 0 && typeof people === "number") {
    return next();
  }
  next({
    status: 400,
    message: "Reservation must include valid number of people.",
  });
}

async function create(req, res) {
  const reservation = req.body.data;
  const data = await service.create(reservation);
  res.status(201).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasData,
    hasFirstName,
    hasLastName,
    hasMobileNumber,
    hasReservationDate,
    hasValidDate,
    hasValidStatus,
    isNotTuesday,
    hasReservationTime,
    hasValidTime,
    isNotInPast,
    hasPeople,
    asyncErrorBoundary(create),
  ],
};
