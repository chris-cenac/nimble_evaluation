"use strict";

const Patient = use("App/Models/Patient");
const { faker } = require("@faker-js/faker");

class PatientSeeder {
  async run() {
    const patients = [];
    const GENDERS = ["male", "female", "other"];

    // Generate 50 sample patients
    for (let i = 0; i < 50; i++) {
      const gender = faker.helpers.arrayElement(GENDERS);
      const firstName = faker.person.firstName(
        gender === "male" ? "male" : "female"
      );
      const lastName = faker.person.lastName();
      const birthDate = faker.date.birthdate({
        min: 18,
        max: 90,
        mode: "age",
      });

      patients.push({
        first_name: firstName,
        last_name: lastName,
        date_of_birth: birthDate.toISOString().split("T")[0],
        gender: gender,
        email: faker.internet.email({ firstName, lastName }),
        blood_type: faker.helpers.arrayElement([
          "A+",
          "A-",
          "B+",
          "B-",
          "AB+",
          "AB-",
          "O+",
          "O-",
        ]),
        height: faker.number.int({ min: 150, max: 200 }),
        weight: faker.number.int({ min: 45, max: 120 }),
        medical_history: faker.lorem.paragraphs(
          faker.number.int({ min: 1, max: 3 }),
          "\n\n"
        ),
        allergies: faker.helpers
          .arrayElements(
            ["Penicillin", "Pollen", "Dust", "Shellfish", "Latex"],
            { min: 1, max: 3 }
          )
          .join(", "),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    try {
      await Patient.createMany(patients);
      console.log(`✅ Successfully created ${patients.length} patients`);
    } catch (error) {
      console.error("❌ Error creating patients:", error);
    }
  }
}

module.exports = PatientSeeder;
