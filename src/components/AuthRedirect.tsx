import React from "react";
import { Navigate } from "react-router-dom";

const AuthRedirect: React.FC = () => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default AuthRedirect;
