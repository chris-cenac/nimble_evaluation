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
      "phone",
      "address",
      "city",
      "state",
      "zip_code",
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
}

module.exports = Patient;
