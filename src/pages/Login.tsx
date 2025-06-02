import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const Login: React.FC = () => {
  const { toast } = useToast();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post<{ token: string }>("/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      toast("Login successful", "success");
      navigate("/dashboard");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Login failed. Please try again.";
      toast("Invalid username or password", "error");
      setError(msg);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={10} p={4} boxShadow={3} borderRadius={2}>
        <Typography variant="h5" align="center" gutterBottom>
          Login to Finance Dashboard
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <form onSubmit={handleLogin}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
