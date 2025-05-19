import { Card, CardContent, Typography, Avatar, Box } from "@mui/material";
import { type Patient } from "../types/patient";
import CakeIcon from "@mui/icons-material/Cake";
import ScaleIcon from "@mui/icons-material/Scale";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";

function calculateAge(dob: string) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

// PatientCard.tsx
export default function PatientCard({
  patient,
  onClick,
}: {
  patient: Patient;
  onClick: () => void;
}) {
  const genderIcon = {
    male: <MaleIcon fontSize="small" />,
    female: <FemaleIcon fontSize="small" />,
    other: <TransgenderIcon fontSize="small" />,
  }[patient.gender];

  return (
    <Card
      sx={{
        cursor: "pointer",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s",
        "&:hover": { transform: "scale(1.02)" },

        boxSizing: "border-box",
      }}
      onClick={onClick}
    >
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 56,
              height: 56,
              fontSize: "1.25rem",
            }}
          >
            {patient.first_name[0]}
            {patient.last_name[0]}
          </Avatar>
          <Typography sx={{ fontWeight: 600, maxWidth: "300px" }}>
            {patient.first_name} {patient.last_name}
          </Typography>
        </Box>

        <Box
          display="grid"
          gridTemplateColumns="repeat(2, 1fr)"
          gap={2}
          sx={{ mt: "auto" }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <CakeIcon color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {calculateAge(patient.date_of_birth)} years
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            {genderIcon}
            <Typography variant="body2" color="text.secondary">
              {patient.gender}
            </Typography>
          </Box>

          {patient.weight && (
            <Box display="flex" alignItems="center" gap={1}>
              <ScaleIcon color="action" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {patient.weight} kg
              </Typography>
            </Box>
          )}

          {patient.blood_type && (
            <Box display="flex" alignItems="center" gap={1}>
              <BloodtypeIcon color="action" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {patient.blood_type}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
