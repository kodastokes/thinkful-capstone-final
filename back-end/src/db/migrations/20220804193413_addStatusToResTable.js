exports.up = function (knex) {
  return knex.schema.table("reservations", (table) => {
    table.string("status").notNull().defaultTo("booked");
  });
};

exports.down = function (knex) {
  return knex.schema.table("reservations", (table) => {
    table.dropColumn("status");
  });
};
