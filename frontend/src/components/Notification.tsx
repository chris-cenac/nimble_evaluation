// components/Notification.tsx
import { Snackbar, Alert } from "@mui/material";
import { useNotification } from "../contexts/NotificationContext";

export const Notification = () => {
  const { notification, showNotification } = useNotification();

  const handleClose = () => {
    showNotification("", "info"); // Clear notification
  };

  return (
    <Snackbar
      open={!!notification?.message}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{ marginTop: "64px" }} // Adjust if you have an AppBar
    >
      <Alert
        onClose={handleClose}
        severity={notification?.type || "info"}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {notification?.message}
      </Alert>
    </Snackbar>
  );
};
