"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Patient extends Model {
  static get fillable() {
    return [
      "first_name",
      "last_name",
      "date_of_birth",
      "gender",
      "email",
      "blood_type",
      "height",
      "weight",
      "medical_history",
      "allergies",
    ];
  }
  static get table() {
    return "patients";
  }
  static get dates() {
    return super.dates.concat(["date_of_birth"]);
  }

  castDates(field, value) {
    if (field === "date_of_birth") {
      // Convert database string to JS Date object
      const [day, month, year] = value.split("/");
      return new Date(year, month - 1, day);
    }
    return super.castDates(field, value);
  }
}

module.exports = Patient;
