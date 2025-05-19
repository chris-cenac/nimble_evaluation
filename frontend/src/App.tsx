import { Box, Container, CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import HomePage from "./pages/HomePage";
import { AuthProvider } from "./contexts/AuthContext";
import theme from "./theme/theme";
import { NotificationProvider } from "./contexts/NotificationContext";
import { Notification } from "./components/Notification";
import { useEffect } from "react";
import { injectNotification } from "./services/api";
import { useNotification } from "./contexts/NotificationContext";

import "./index.css";

const queryClient = new QueryClient();

function NotificationInjector() {
  const { showNotification } = useNotification();

  useEffect(() => {
    injectNotification(showNotification);
  }, [showNotification]);

  return null;
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <AuthProvider>
            <CssBaseline />
            <NotificationInjector />
            <Container maxWidth="lg">
              <Box sx={{ my: 4 }}>
                <HomePage />
              </Box>
            </Container>
            <Notification />
          </AuthProvider>
        </NotificationProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
