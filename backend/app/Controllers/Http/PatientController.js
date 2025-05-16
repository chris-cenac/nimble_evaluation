"use strict";

const Patient = use("App/Models/Patient");

class PatientController {
  async index({ request, response }) {
    const searchTerm = request.input("q");
    const page = request.input("page", 1);
    const perPage = request.input("perPage", 10);

    const query = Patient.query();

    if (searchTerm) {
      const searchTerms = searchTerm.toLowerCase().split(" ");

      query.where((builder) => {
        searchTerms.forEach((term) => {
          // Try to parse date formats
          const dateFormats = [
            /\d{4}-\d{2}-\d{2}/, // YYYY-MM-DD
            /\d{2}\/\d{2}\/\d{4}/, // MM/DD/YYYY
            /\d{4}\d{2}\d{2}/, // YYYYMMDD
          ];

          const isDate = dateFormats.some((format) => format.test(term));

          if (isDate) {
            // Convert term to YYYY-MM-DD format
            const formattedDate = this.parseDate(term);
            if (formattedDate) {
              builder.orWhere("date_of_birth", formattedDate);
            }
          } else {
            // Text search across multiple fields
            builder
              .orWhereRaw("LOWER(first_name) LIKE ?", [`%${term}%`])
              .orWhereRaw("LOWER(last_name) LIKE ?", [`%${term}%`])
              .orWhereRaw("LOWER(medical_history) LIKE ?", [`%${term}%`])
              .orWhereRaw("LOWER(allergies) LIKE ?", [`%${term}%`])
              .orWhereRaw("LOWER(blood_type) LIKE ?", [`%${term}%`]);
          }
        });
      });
    }

    const patients = await query.paginate(page, perPage);
    return response.json(patients);
  }

  // Helper function to parse different date formats
  parseDate(term) {
    try {
      // Try different date formats
      const formats = ["YYYY-MM-DD", "MM/DD/YYYY", "YYYYMMDD", "MM-DD-YYYY"];

      const date = DateTime.fromFormat(term, formats);
      return date.toFormat("yyyy-MM-dd");
    } catch (error) {
      return null;
    }
  }

  async store({ request, response }) {
    const data = request.only([
      "first_name",
      "last_name",
      "date_of_birth",
      "gender",
      "weight",
      "height",
      "blood_type",
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
    ]);
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
