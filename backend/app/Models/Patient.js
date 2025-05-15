"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Patient extends Model {
  static get table() {
    return "patients";
  }
}

module.exports = Patient;
