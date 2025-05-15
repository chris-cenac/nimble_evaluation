"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class PatientsSchema extends Schema {
  up() {
    this.create("patients", (table) => {
      table.increments("id").primary();
      table.string("first_name").notNullable();
      table.string("last_name").notNullable();
      table.date("date_of_birth").notNullable();
      table.enum("gender", ["male", "female", "other"]).notNullable();
      table.text("medical_history");
      table.text("allergies");
      table.timestamps();
    });
  }

  down() {
    this.drop("patients");
  }
}

module.exports = PatientsSchema;
