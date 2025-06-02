import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "../api/axios";
import { useToast } from "../context/ToastContext";
import { jwtDecode } from "jwt-decode";

interface Transaction {
  id: number;
  accountId: number;
  categoryId: number;
  amount: number;
  date: string;
  type: string;
}

interface Account {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  type: string;
}

const Transactions: React.FC = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<Transaction, "id">>({
    accountId: 0,
    categoryId: 0,
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    type: "Debit",
  });
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchData = async () => {
    const [txRes, accRes, catRes] = await Promise.all([
      axios.get("/transaction"),
      axios.get("/account"),
      axios.get("/category"),
    ]);
    setTransactions(txRes.data);
    setAccounts(accRes.data);
    setCategories(catRes.data);
  };

  const checkUserRole = () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decoded: any = jwtDecode(token);
      setIsAdmin(decoded?.role === "Admin");
    } catch (e) {
      console.error("Token decode error:", e);
    }
  };

  useEffect(() => {
    fetchData();
    checkUserRole();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/transaction/${id}`);
      toast("Transaction deleted", "success");
      fetchData();
    } catch (err) {
      toast("Failed to delete", "error");
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post("/transaction", form);
      toast("Transaction added", "success");
      setOpen(false);
      fetchData();
    } catch (err) {
      toast("Failed to add transaction", "error");
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Transactions
      </Typography>

      {isAdmin && (
        <Box mb={2}>
          <Button variant="contained" onClick={() => setOpen(true)}>
            {"Add Category"}
          </Button>
        </Box>
      )}

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Account ID</TableCell>
              <TableCell>Category ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{tx.amount}</TableCell>
                <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                <TableCell>{tx.type}</TableCell>
                <TableCell>{tx.accountId}</TableCell>
                <TableCell>{tx.categoryId}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDelete(tx.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Add Transaction</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Amount"
            fullWidth
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: +e.target.value })}
          />
          <TextField
            margin="normal"
            label="Date"
            fullWidth
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <TextField
            margin="normal"
            select
            label="Type"
            fullWidth
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <MenuItem value="Credit">Credit</MenuItem>
            <MenuItem value="Debit">Debit</MenuItem>
          </TextField>
          <TextField
            margin="normal"
            select
            label="Account"
            fullWidth
            value={form.accountId}
            onChange={(e) => setForm({ ...form, accountId: +e.target.value })}
          >
            {accounts.map((a) => (
              <MenuItem key={a.id} value={a.id}>
                {a.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="normal"
            select
            label="Category"
            fullWidth
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: +e.target.value })}
          >
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name} ({c.type})
              </MenuItem>
            ))}
          </TextField>
          <Button
            sx={{ mt: 2 }}
            fullWidth
            variant="contained"
            onClick={handleCreate}
          >
            Create
          </Button>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Transactions;
