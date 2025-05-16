import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Grid,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientAPI } from "../services/api";
import { type PatientFormValues, type Patient } from "../types/patient";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function PatientModal({
  open,
  patient,
  onClose,
}: {
  open: boolean;
  patient?: Patient;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [formValues, setFormValues] = useState<PatientFormValues>({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "male",
    weight: undefined,
    height: undefined,
    blood_type: undefined,
    medical_history: "",
    allergies: "",
  });

  useEffect(() => {
    if (patient) {
      setFormValues({
        first_name: patient.first_name,
        last_name: patient.last_name,
        date_of_birth: patient.date_of_birth,
        gender: patient.gender,
        weight: patient.weight,
        height: patient.height,
        blood_type: patient.blood_type,
        medical_history: patient.medical_history,
        allergies: patient.allergies,
      });
    }
  }, [patient]);

  const mutation = useMutation({
    mutationFn: patient?.id
      ? (values: PatientFormValues) => patientAPI.update(patient.id, values)
      : patientAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formValues);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{patient ? "Edit Patient" : "New Patient"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={formValues.first_name}
                onChange={(e) =>
                  setFormValues({ ...formValues, first_name: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={formValues.last_name}
                onChange={(e) =>
                  setFormValues({ ...formValues, last_name: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date of Birth"
                InputLabelProps={{ shrink: true }}
                value={formValues.date_of_birth}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    date_of_birth: e.target.value,
                  })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Gender"
                value={formValues.gender}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    gender: e.target.value as any,
                  })
                }
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Weight (kg)"
                value={formValues.weight || ""}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    weight: Number(e.target.value),
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Height (cm)"
                value={formValues.height || ""}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    height: Number(e.target.value),
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Blood Type"
                value={formValues.blood_type || ""}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    blood_type: e.target.value as any,
                  })
                }
              >
                {bloodTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Medical History"
                value={formValues.medical_history}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    medical_history: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Allergies"
                value={formValues.allergies}
                onChange={(e) =>
                  setFormValues({ ...formValues, allergies: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={mutation.isLoading}
          >
            {patient ? "Update Patient" : "Create Patient"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
