"use strict";

const Patient = use("App/Models/Patient");

class PatientController {
  async index({ response }) {
    const patients = await Patient.all();
    return response.json(patients);
  }

  async store({ request, response }) {
    const data = request.only([
      "first_name",
      "last_name",
      "date_of_birth",
      "gender",
      "medical_history",
      "allergies",
    ]);
    const patient = await Patient.create(data);
    return response.status(201).json(patient);
  }

  async show({ params, response }) {
    const patient = await Patient.find(params.id);
    return response.json(patient);
  }

  async update({ params, request, response }) {
    const patient = await Patient.find(params.id);
    const data = request.only([
      "first_name",
      "last_name",
      "date_of_birth",
      "gender",
      "medical_history",
      "allergies",
    ]); // Same fields as store()
    patient.merge(data);
    await patient.save();
    return response.json(patient);
  }

  async destroy({ params, response }) {
    const patient = await Patient.find(params.id);
    await patient.delete();
    return response.status(204).json(null);
  }
}

module.exports = PatientController;
