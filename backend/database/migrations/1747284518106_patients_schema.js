"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class PatientsSchema extends Schema {
  up() {
    this.create("patients", (table) => {
      table.increments("id").primary();
      table.string("first_name", 80).notNullable();
      table.string("last_name", 80).notNullable();
      table.date("date_of_birth").notNullable();
      table.enum("gender", ["male", "female", "other"]).notNullable();

      // Add these new columns
      table.string("email", 254);
      table.string("phone", 20);
      table.string("address", 255);
      table.string("city", 80);
      table.string("state", 2); // Assuming 2-letter state codes
      table.string("zip_code", 10);
      table.enum("blood_type", [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
      ]);
      table.integer("height"); // in cm
      table.integer("weight"); // in kg
      table.text("medical_history");
      table.string("allergies", 255);

      table.timestamps();
    });
  }

  down() {
    this.drop("patients");
  }
}
module.exports = PatientsSchema;
