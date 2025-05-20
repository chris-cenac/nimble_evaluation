// HomePage.tsx
import { useState, createRef, useEffect } from "react";
import {
  Grid,
  TextField,
  Typography,
  Button,
  Box,
  Pagination,
  useTheme,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import GitHubIcon from "@mui/icons-material/GitHub";
import ApiIcon from "@mui/icons-material/Api";
import PatientCard from "../components/PatientCard";
import PatientModal from "../components/PatientModal";
import AuthModal from "../components/AuthModal";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { type Patient } from "../types/patient";

export default function HomePage() {
  const theme = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const [user, setUser] = useState<{
    id: number;
    username: string;
    email: string;
  } | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (isAuthenticated) {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } else {
      setUser(null);
    }
  }, [isAuthenticated]);

  const { data: patientsData = { data: [], total: 0, lastPage: 1 } } = useQuery(
    {
      queryKey: ["patients", searchTerm, page],
      queryFn: () =>
        api
          .get("/patients", { params: { q: searchTerm, page } })
          .then((res) => res.data),
    }
  );

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        {/* Left side - attribution */}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          Made with <FavoriteIcon sx={{ fontSize: 16, color: "error.main" }} />{" "}
          by Chris Cenac
        </Typography>

        {/* Right side - avatar + menu */}
        {isAuthenticated && user && (
          <Box>
            <IconButton onClick={handleAvatarClick}>
              <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                {user.username.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem dense>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {user.username}
                </Typography>
              </MenuItem>
              <MenuItem dense>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </MenuItem>
              <MenuItem
                component="a"
                href="https://github.com/chris-cenac/nimble_evaluation"
                target="_blank"
              >
                <GitHubIcon sx={{ mr: 1 }} fontSize="small" />
                GitHub
              </MenuItem>
              <MenuItem
                component="a"
                href="http://0.0.0.0:8080/docs"
                target="_blank"
              >
                <ApiIcon sx={{ mr: 1 }} fontSize="small" />
                API Docs
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Typography variant="body2" color="error">
                  Logout
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Box>

      <Typography
        variant="h3"
        gutterBottom
        color="primary"
        sx={{
          fontWeight: 700,
          [theme.breakpoints.down("md")]: { fontSize: "2rem" },
          [theme.breakpoints.down("sm")]: { fontSize: "1.5rem" },
        }}
      >
        Patient Records System
      </Typography>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          gap: 2,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search patients (name, allergies, DOB, blood type...)"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          sx={{
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
          }}
        />

        <Button
          variant="contained"
          color={isAuthenticated ? "secondary" : "primary"}
          onClick={() => {
            if (isAuthenticated) {
              setSelectedPatient(null);
              setModalOpen(true);
            } else {
              setAuthModalOpen(true);
            }
          }}
          sx={{
            flexShrink: 0,
            fontWeight: 600,
            py: 1.5,
            whiteSpace: "nowrap",
          }}
        >
          {isAuthenticated ? "Add Patient" : "Login to Add Patients"}
        </Button>
      </Box>
      <Typography
        variant="subtitle1"
        sx={{
          mb: 2,
          color: "text.secondary",
          fontStyle: "italic",
        }}
      >
        Showing {patientsData.data.length} of {patientsData.total} patients
      </Typography>
      <TransitionGroup container spacing={2} component={Grid}>
        {patientsData.data.map((patient: Patient) => {
          const nodeRef = createRef();
          return (
            <CSSTransition
              key={patient.id}
              nodeRef={nodeRef}
              timeout={300}
              classNames="card"
              unmountOnExit
            >
              <Grid
                // ref={nodeRef}
                size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}
                sx={{ display: "flex" }}
              >
                <PatientCard
                  patient={patient}
                  onClick={() => {
                    setSelectedPatient(patient);
                    setModalOpen(true);
                  }}
                />
              </Grid>
            </CSSTransition>
          );
        })}
      </TransitionGroup>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 4,
          py: 3,
          bgcolor: "background.paper",
          borderRadius: theme.shape.borderRadius,
        }}
      >
        <Pagination
          count={patientsData.lastPage}
          page={page}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
          sx={{
            "& .MuiPaginationItem-root": {
              fontWeight: 600,
            },
          }}
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
