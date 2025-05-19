import { useState } from "react";
import { Dialog, TextField, Button, Box, Typography } from "@mui/material";
import { authAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function AuthModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [isLogin, setIsLogin] = useState(true);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    username: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (
        !isLogin &&
        credentials.password !== credentials.password_confirmation
      ) {
        throw new Error("Passwords do not match");
      }

      const response = isLogin
        ? await authAPI.login({
            email: credentials.email,
            password: credentials.password,
          })
        : await authAPI.register(credentials);

      if (!response.data?.token?.token || !response.data?.user?.id) {
        throw new Error("Authentication failed - invalid response format");
      }

      localStorage.setItem("token", response.data.token.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      login(response.data.token.token, response.data.user);
      onClose();
    } catch (err: any) {
      let errorMessage = "Authentication failed";

      if (err.message.includes("Passwords do not match")) {
        errorMessage = err.message;
      } else if (err.response?.data) {
        errorMessage = err.response.data.message || err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box component="form" onSubmit={handleAuth} p={4}>
        <Typography variant="h6" mb={2}>
          {isLogin ? "Login" : "Register"}
        </Typography>

        {error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}

        {!isLogin && (
          <TextField
            fullWidth
            label="Username"
            value={credentials.username}
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
            margin="normal"
            required
          />
        )}

        <TextField
          fullWidth
          type="email"
          label="Email"
          value={credentials.email}
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
          margin="normal"
          required
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          margin="normal"
          required
        />
        {!isLogin && (
          <TextField
            fullWidth
            type="password"
            label="Confirm Password"
            value={credentials.password_confirmation}
            onChange={(e) =>
              setCredentials({
                ...credentials,
                password_confirmation: e.target.value,
              })
            }
            error={
              !isLogin &&
              credentials.password !== credentials.password_confirmation
            }
            helperText={
              !isLogin &&
              credentials.password !== credentials.password_confirmation
                ? "Passwords do not match"
                : ""
            }
            margin="normal"
            required
          />
        )}

        <Box mt={3} display="flex" justifyContent="space-between">
          <Button
            type="button" // Crucial fix
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Need an account? Register"
              : "Already have an account? Login"}
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {isLogin
              ? loading
                ? "Logging in..."
                : "Login"
              : loading
              ? "Registering..."
              : "Register"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
