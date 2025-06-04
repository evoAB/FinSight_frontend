import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Box,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "../api/axios";
import { useToast } from "../context/ToastContext";

interface Account {
  id: number;
  accountNumber: string;
  name: string;
  riskScore: number;
}

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    accountNumber: "",
    name: "",
    riskScore: 0,
  });
  const { toast } = useToast();

  const token = localStorage.getItem("token");
  const isAdmin = !!token;

  const fetchAccounts = async () => {
    try {
      const res = await axios.get("/account");
      setAccounts(res.data);
    } catch (err) {
      toast("Failed to fetch accounts", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`/account/${editId}`, form);
        toast("Account updated", "success");
      } else {
        await axios.post("/account", form);
        toast("Account added", "success");
      }
      setForm({ accountNumber: "", name: "", riskScore: 0 });
      setEditId(null);
      setOpen(false);
      fetchAccounts();
    } catch {
      toast("Operation failed", "error");
    }
  };

  const handleEdit = (account: Account) => {
    setForm({ accountNumber: account.accountNumber, name: account.name, riskScore: account.riskScore });
    setEditId(account.id);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/account/${id}`);
      toast("Account deleted", "success");
      fetchAccounts();
    } catch {
      toast("Delete failed", "error");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Accounts
      </Typography>

      {isAdmin && (
        <Box mb={2}>
          <Button variant="contained" onClick={() => setOpen(true)}>
            Add Account
          </Button>
        </Box>
      )}

      <Paper sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Account Number</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Risk Score</TableCell>
              {isAdmin && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>{account.accountNumber}</TableCell>
                <TableCell>{account.name}</TableCell>
                <TableCell>{account.riskScore.toFixed(2)}</TableCell>
                {isAdmin && (
                  <TableCell>
                    <IconButton onClick={() => handleEdit(account)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(account.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editId ? "Edit Account" : "Add Account"}</DialogTitle>
        <DialogContent>
          <TextField
            label="AccountNumber"
            fullWidth
            sx={{ mt: 2 }}
            value={form.accountNumber}
            onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
          />
          <TextField
            label="Name"
            fullWidth
            sx={{ mt: 2 }}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="Risk Score"
            fullWidth
            sx={{ mt: 2 }}
            type="number"
            value={form.riskScore}
            onChange={(e) =>
              setForm({ ...form, riskScore: parseFloat(e.target.value) })
            }
            inputProps={{ step: "0.01", min: 0, max: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editId ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Accounts;
