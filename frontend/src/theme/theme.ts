// src/theme/theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#153554", // Navy blue - primary brand color
      dark: "#0f263a",
      light: "#1d4a7e",
      contrastText: "#F1F1EE",
    },
    secondary: {
      main: "#3FC996", // Teal green - secondary accent
      dark: "#2da374",
      light: "#5cd6a9",
      contrastText: "#153554",
    },
    error: {
      main: "#e57373", // Keeping standard error red for familiarity
    },
    warning: {
      main: "#ffb74d", // Standard warning orange
    },
    success: {
      main: "#3FC996", // Reusing the teal for success
    },
    info: {
      main: "#149DE4", // Bright blue for info
    },
    background: {
      default: "#F1F1EE", // Off-white background
      paper: "#ffffff", // Pure white for surfaces
    },
    text: {
      primary: "#153554", // Navy for primary text
      secondary: "#62C5D0", // Light blue for secondary
    },
    action: {
      active: "#3FC996", // Teal for active states
    },
  },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontWeight: 700,
      color: "#153554",
    },
    h2: {
      fontWeight: 600,
      color: "#149DE4",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "8px 16px",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#153554",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(21, 53, 84, 0.1)",
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme;
