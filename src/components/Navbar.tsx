import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast("Logged out", "info");
    navigate("/login");
  };

  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" component="div">
          FinSight
        </Typography>
        <Box display="flex" gap={2}>
          <Button color="inherit" component={Link} to="/">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/accounts">
            Accounts
          </Button>
          <Button color="inherit" component={Link} to="/transactions">
            Transactions
          </Button>
          <Button color="inherit" component={Link} to="/categories">
            Categories
          </Button>
          {isLoggedIn ? (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            Admin Login
          </Button>
        )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
