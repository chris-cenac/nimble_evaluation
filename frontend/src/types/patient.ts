export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: "male" | "female" | "other";
  weight?: number;
  height?: number;
  blood_type?: string;
  medical_history?: string;
  allergies?: string;
  created_at: string;
  updated_at: string;
}

export type PatientFormValues = Omit<
  Patient,
  "id" | "created_at" | "updated_at"
>;
