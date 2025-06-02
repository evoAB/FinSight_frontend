import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
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
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "../api/axios";
import { jwtDecode } from "jwt-decode";
import Toast from "../components/Toast";

interface Category {
  id: number;
  name: string;
  type: "Credit" | "Debit";
}

interface FormCategory {
  name: string;
  type: "Credit" | "Debit";
}

const Categories: React.FC = () => {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormCategory>({ name: "", type: "Credit" });

  const [isAdmin, setIsAdmin] = useState(false);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToastMsg(msg);
    setToastType(type);
    setToastOpen(true);
  };

  const fetchCategories = async () => {
    const res = await axios.get("/category");
    setCategories(res.data);
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
    fetchCategories();
    checkUserRole();
  }, []);

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`/category/${editId}`, form);
        showToast("Category updated successfully");
      } else {
        await axios.post("/category", form);
        showToast("Category created successfully");
      }
      setOpen(false);
      setEditId(null);
      setForm({ name: "", type: "Credit" });
      fetchCategories();
    } catch (err) {
      showToast("Something went wrong", "error");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/category/${id}`);
      showToast("Category deleted", "success");
      fetchCategories();
    } catch {
      showToast("Failed to delete", "error");
    }
  };

  const handleEdit = (category: Category) => {
    setForm({ name: category.name, type: category.type });
    setEditId(category.id);
    setOpen(true);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Categories
      </Typography>

      {isAdmin && (
        <Box mb={2}>
          <Button variant="contained" onClick={() => setOpen(true)}>
            {"Add Category"}
          </Button>
        </Box>
      )}

      <Card elevation={3}>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Type</strong>
                </TableCell>
                {isAdmin && (
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>{cat.type}</TableCell>
                  {isAdmin && (
                    <TableCell>
                      <IconButton
                        onClick={() => handleEdit(cat)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(cat.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{editId ? "Edit" : "Add"} Category</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Name"
            fullWidth
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            margin="normal"
            select
            label="Type"
            fullWidth
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value as "Credit" | "Debit" })
            }
          >
            <MenuItem value="Credit">Credit</MenuItem>
            <MenuItem value="Debit">Debit</MenuItem>
          </TextField>

          <Button
            sx={{ mt: 2 }}
            fullWidth
            variant="contained"
            onClick={handleSubmit}
          >
            {editId ? "Update" : "Create"}
          </Button>
        </DialogContent>
      </Dialog>
      <Toast
        open={toastOpen}
        message={toastMsg}
        severity={toastType}
        onClose={() => setToastOpen(false)}
      />
    </Container>
  );
};

export default Categories;
