import { Card, CardContent, Typography } from "@mui/material";
import { type Patient } from "../types/patient";
export default function PatientCard({
  patient,
  onClick,
}: {
  patient: Patient;
  onClick: () => void;
}) {
  return (
    <Card sx={{ cursor: "pointer", height: "100%" }} onClick={onClick}>
      <CardContent>
        <Typography variant="h6">
          {patient.first_name} {patient.last_name}
        </Typography>
        <Typography color="text.secondary">
          DOB: {new Date(patient.date_of_birth).toLocaleDateString()}
        </Typography>
        {patient.blood_type && (
          <Typography color="text.secondary">
            Blood Type: {patient.blood_type}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
