// src/theme/theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3F51B5", // --primary-100
      light: "#757de8", // --primary-200
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#2196F3", // --accent-100
      dark: "#003f8f", // --accent-200
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#e57373",
    },
    warning: {
      main: "#ffb74d",
    },
    success: {
      main: "#3FC996",
    },
    info: {
      main: "#757de8", // Using primary-200
    },
    background: {
      default: "#FFFFFF", // --bg-100
      paper: "#f5f5f5", // --bg-200
    },
    text: {
      primary: "#333333", // --text-100
      secondary: "#5c5c5c", // --text-200
    },
    action: {
      active: "#3F51B5", // Using primary-100
      hover: "#f5f5f5", // Using bg-200
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
      color: "#333333",
      letterSpacing: "-0.02em",
    },
    h2: {
      fontWeight: 600,
      color: "#3F51B5", // Using primary-100
      letterSpacing: "-0.01em",
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
          transition: "all 0.2s ease-in-out",
        },
        contained: {
          boxShadow: "0px 2px 4px rgba(63, 81, 181, 0.15)",
          "&:hover": {
            boxShadow: "0px 4px 8px rgba(63, 81, 181, 0.25)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#3F51B5", // --primary-100
          boxShadow: "0px 2px 8px rgba(51, 51, 51, 0.1)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(51, 51, 51, 0.1)",
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#cccccc", // --bg-300
          margin: "16px 0",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme;
