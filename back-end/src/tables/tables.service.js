const { KnexTimeoutError } = require("knex");
const knex = require("../db/connection");

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function create(newTable) {
  return knex("tables")
    .insert({
      ...newTable,
      status: newTable.reservation_id ? "occupied" : "free",
    })
    .returning("*")
    .then((result) => result[0]);
}

function readTable(table_id) {
  return knex("tables as t").select("*").where({ table_id }).first();
}

function readReservation(reservation_id) {
  return knex("reservations as r")
    .select("*")
    .where({ reservation_id })
    .first();
}

function readTableByRes(reservation_id) {
  return knex("tables")
    .where({ reservation_id })
    .whereExists(knex.select("*").from("tables").where({ reservation_id }))
    .then((result) => result[0]);
}

async function updateSeatRes(reservation_id, table_id) {
  const trx = await knex.transaction();
  return trx("tables")
    .where({ table_id })
    .update(
      {
        reservation_id: reservation_id,
        status: "occupied",
      },
      "*"
    )
    .then(() =>
      trx("reservations").where({ reservation_id }).update({ status: "seated" })
    )
    .then(trx.commit)
    .catch(trx.rollback);
}

async function destroyTableRes(table_id, reservation_id) {
    const trx = await knex.transaction();
    return trx("tables")
      .where({ table_id })
      .update({
        reservation_id: null,
        status: "free",
      }, "*")
      .then(() => 
        trx("reservations")
        .where({ reservation_id })
        .update({ status: "finished" }, "*")
      )
      .then(trx.commit)
      .catch(trx.rollback)
  }

module.exports = {
  list,
  create,
  readTable,
  readReservation,
  readTableByRes,
  updateSeatRes,
  destroyTableRes
};
