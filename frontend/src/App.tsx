import { Box, Container, CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import HomePage from "./pages/HomePage";
import { AuthProvider } from "./contexts/AuthContext";
import theme from "./theme/theme";
import "./index.css";

const queryClient = new QueryClient();

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CssBaseline />
          <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
              <HomePage />
            </Box>
          </Container>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
