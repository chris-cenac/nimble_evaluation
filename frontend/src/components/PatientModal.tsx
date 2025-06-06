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
  IconButton,
  Typography,
  useTheme,
  styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientAPI } from "../services/api";
import { type PatientFormValues, type Patient } from "../types/patient";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    fontSize: theme.typography.body2.fontSize,
    [theme.breakpoints.up("md")]: {
      fontSize: theme.typography.body1.fontSize,
    },
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius,
    "& fieldset": {
      borderColor: theme.palette.primary.light,
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.secondary.main,
      borderWidth: 2,
    },
  },
}));

export default function PatientModal({
  open,
  patient,
  onClose,
}: {
  open: boolean;
  patient: Patient | null;
  onClose: () => void;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
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
    } else {
      setFormValues({
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

  const deleteMutation = useMutation({
    mutationFn: () => patientAPI.delete(patient?.id || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formValues);
  };

  const handleDelete = () => {
    if (patient?.id) {
      deleteMutation.mutate();
    }
  };
  const formatDateForInput = (dateString: string) => {
    return dateString.split(" ")[0];
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      slotProps={{
        paper: {
          elevation: 3,
          sx: {
            display: "flex",
            flexDirection: "column",
            height: isMobile ? "100%" : "max-content",
            overflow: "auto",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          position: "sticky",
          top: 0,
          zIndex: 1,
          py: { xs: 1.5, md: 2 },
          pr: { xs: 4, md: 6 },
          flexShrink: 0,
        }}
      >
        {patient ? "Edit Patient" : "New Patient"}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: theme.spacing(2),
            top: "50%",
            transform: "translateY(-50%)",
            color: "primary.contrastText",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent
          dividers
          sx={{
            p: 3,
            overflowY: "auto",
            height: isMobile ? "calc(100vh - (76px + 56px))" : "max-content",
            flex: 1,
            "&&": {
              padding: theme.spacing(3),
            },
          }}
        >
          <Grid container spacing={{ xs: 1, md: 2 }}>
            {/* Name Row */}
            <Grid size={6}>
              <StyledTextField
                fullWidth
                label="First Name"
                value={formValues.first_name}
                onChange={(e) =>
                  setFormValues({ ...formValues, first_name: e.target.value })
                }
                required
              />
            </Grid>
            <Grid size={6}>
              <StyledTextField
                fullWidth
                label="Last Name"
                value={formValues.last_name}
                onChange={(e) =>
                  setFormValues({ ...formValues, last_name: e.target.value })
                }
                required
              />
            </Grid>

            {/* Physical Attributes Row */}
            <Grid size={{ xs: 12, md: 6 }}>
              <StyledTextField
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
                InputProps={{
                  endAdornment: (
                    <Typography variant="body2" color="text.secondary">
                      cm
                    </Typography>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <StyledTextField
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
                InputProps={{
                  endAdornment: (
                    <Typography variant="body2" color="text.secondary">
                      kg
                    </Typography>
                  ),
                }}
              />
            </Grid>

            {/* Personal Details Row */}
            <Grid size={{ xs: 12, md: 4 }}>
              <StyledTextField
                fullWidth
                type="date"
                label="Date of Birth"
                InputLabelProps={{ shrink: true }}
                value={formatDateForInput(formValues.date_of_birth)}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    date_of_birth: e.target.value,
                  })
                }
                required
              />
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
              <StyledTextField
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
              </StyledTextField>
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
              <StyledTextField
                select
                fullWidth
                label="Blood Type"
                value={formValues.blood_type || ""}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    blood_type: e.target.value as string,
                  })
                }
              >
                {bloodTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </StyledTextField>
            </Grid>

            {/* Medical Information */}
            <Grid size={{ xs: 12, md: 6 }}>
              <StyledTextField
                fullWidth
                multiline
                minRows={4}
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

            {/* Allergies */}
            <Grid size={{ xs: 12, md: 6 }}>
              <StyledTextField
                fullWidth
                multiline
                minRows={3}
                label="Allergies"
                value={formValues.allergies}
                onChange={(e) =>
                  setFormValues({ ...formValues, allergies: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions
          sx={{
            px: { xs: 2, md: 3 },
            py: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            position: "sticky",
            bottom: 0,
            bgcolor: "background.paper",
            zIndex: 1,
            flexShrink: 0,
            display: "flex",
            flexDirection: { xs: "row", md: "row" },
            gap: { xs: 1, md: 2 },
          }}
        >
          {patient && (
            <Button
              onClick={handleDelete}
              color="error"
              variant="outlined"
              disabled={deleteMutation.isLoading}
              fullWidth={isMobile}
              sx={{
                order: { xs: 2, md: 0 },
                minWidth: 120,
                "&:hover": {
                  backgroundColor: theme.palette.error.light,
                  color: theme.palette.error.contrastText,
                },
              }}
            >
              {deleteMutation.isLoading ? "Deleting..." : "Delete Patient"}
            </Button>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={mutation.isLoading || deleteMutation.isLoading}
            sx={{
              px: 4,
              fontWeight: 600,
              flexShrink: 0,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            {mutation.isLoading
              ? patient
                ? "Saving..."
                : "Creating..."
              : patient
              ? "Save Changes"
              : "Create Patient"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
