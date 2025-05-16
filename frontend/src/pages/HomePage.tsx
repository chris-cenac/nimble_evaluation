// HomePage.tsx
import { useState, useRef, createRef } from "react";
import {
  Grid,
  TextField,
  Typography,
  Button,
  Box,
  Pagination,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import PatientCard from "../components/PatientCard";
import PatientModal from "../components/PatientModal";
import AuthModal from "../components/AuthModal";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { type Patient } from "../types/patient";

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const {
    data: patientsData = { data: [], total: 0, lastPage: 1 },
    isLoading,
  } = useQuery({
    queryKey: ["patients", searchTerm, page],
    queryFn: () =>
      api
        .get("/patients", { params: { q: searchTerm, page } })
        .then((res) => res.data),
  });

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Patient Records System
      </Typography>

      <Box sx={{ mb: 4, display: "flex", gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search patients (name, allergies, DOB, blood type...)"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />

        <Button
          variant="contained"
          onClick={() => {
            if (isAuthenticated) {
              setSelectedPatient(null);
              setModalOpen(true);
            } else {
              setAuthModalOpen(true);
            }
          }}
        >
          {isAuthenticated ? "Add Patient" : "Login to Add Patients"}
        </Button>
      </Box>

      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Showing {patientsData.data.length} of {patientsData.total} patients
      </Typography>

      <TransitionGroup component={Grid} container spacing={3}>
        {patientsData.data.map((patient: Patient) => {
          const nodeRef = createRef(); // Changed to createRef()
          return (
            <CSSTransition
              key={patient.id}
              nodeRef={nodeRef}
              timeout={300}
              classNames="card"
              unmountOnExit
            >
              <div ref={nodeRef}>
                <Grid item xs={12} sm={6} md={4}>
                  <PatientCard
                    patient={patient}
                    onClick={() => {
                      setSelectedPatient(patient);
                      setModalOpen(true);
                    }}
                  />
                </Grid>
              </div>
            </CSSTransition>
          );
        })}
      </TransitionGroup>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={patientsData.lastPage}
          page={page}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>

      <PatientModal
        open={modalOpen}
        patient={selectedPatient}
        onClose={() => setModalOpen(false)}
      />

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setAuthModalOpen(false);
          if (isAuthenticated) setModalOpen(true);
        }}
      />
    </>
  );
}
