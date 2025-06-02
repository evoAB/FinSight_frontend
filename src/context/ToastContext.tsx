import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastContextType {
  toast: (message: string, severity?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<ToastType>("info");

  const toast = (msg: string, type: ToastType = "info") => {
    setMessage(msg);
    setSeverity(type);
    setOpen(true);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={() => setOpen(false)} severity={severity} variant="filled" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};
