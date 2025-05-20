"use strict";

const Patient = use("App/Models/Patient");

class PatientController {
  async index({ request, response }) {
    const searchTerm = request.input("q", "").trim();
    const page = request.input("page", 1);
    const perPage = request.input("perPage", 10);
    const query = Patient.query();

    if (searchTerm) {
      // split on spaces for multi-term search
      const terms = searchTerm.split(/\s+/);

      query.where((builder) => {
        terms.forEach((term) => {
          // 1) Full-date match?
          const fullDate = this.parseDate(term);
          if (fullDate) {
            return builder.orWhere("date_of_birth", fullDate);
          }

          // 2) Year-only? (4 digits)
          if (/^\d{4}$/.test(term)) {
            return builder.orWhereRaw("EXTRACT(YEAR FROM date_of_birth) = ?", [
              term,
            ]);
          }

          // 3) Numeric month or day?
          if (/^\d{1,2}$/.test(term)) {
            const num = parseInt(term, 10);
            // month match
            if (num >= 1 && num <= 12) {
              builder.orWhereRaw("EXTRACT(MONTH FROM date_of_birth) = ?", [
                num,
              ]);
            }
            // day match
            if (num >= 1 && num <= 31) {
              builder.orWhereRaw("EXTRACT(DAY FROM date_of_birth) = ?", [num]);
            }
            return;
          }

          // 4) Fallback: text fields (ILIKE for PG)
          builder.orWhere((qb) => {
            qb.orWhere("first_name", "ILIKE", `%${term}%`)
              .orWhere("last_name", "ILIKE", `%${term}%`)
              .orWhere("medical_history", "ILIKE", `%${term}%`)
              .orWhere("allergies", "ILIKE", `%${term}%`)
              .orWhere("blood_type", "ILIKE", `%${term}%`);
          });
        });
      });
    }

    const patients = await query.paginate(page, perPage);
    return response.json(patients);
  }

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
