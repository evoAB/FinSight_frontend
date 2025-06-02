import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Box,
  Divider,
} from "@mui/material";
import axios from "../api/axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartOutlineIcon from "@mui/icons-material/PieChartOutline";

interface Account {
  id: number;
  name: string;
  riskScore: number;
}

interface MonthlySummary {
  month: string;
  type: string;
  total: number;
}

interface CategorySummary {
  category: string;
  type: string;
  total: number;
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F"];

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [topAccounts, setTopAccounts] = useState<Account[]>([]);
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary[]>([]);
  const [categorySummary, setCategorySummary] = useState<CategorySummary[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountsRes, monthlyRes, categoryRes] = await Promise.all([
          axios.get("/analytics/top-risky-accounts?count=5"),
          axios.get("/analytics/monthly-expense-summary"),
          axios.get("/analytics/category-summary"),
        ]);

        setTopAccounts(accountsRes.data);
        setMonthlySummary(monthlyRes.data);
        setCategorySummary(categoryRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Finance Dashboard
      </Typography>
      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={3}>
        {/* Top Risky Accounts */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography
                variant="h6"
                fontWeight="medium"
                gutterBottom
                display="flex"
                alignItems="center"
                gap={1}
              >
                <WarningAmberOutlinedIcon color="error" />
                Top Risky Accounts
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Risk Score</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>{account.name}</TableCell>
                      <TableCell>{account.riskScore.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Summary */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography
                variant="h6"
                fontWeight="medium"
                gutterBottom
                display="flex"
                alignItems="center"
                gap={1}
              >
                <BarChartIcon color="primary" />
                Monthly Summary
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlySummary}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" name="Total" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Summary */}
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Typography
                variant="h6"
                fontWeight="medium"
                gutterBottom
                display="flex"
                alignItems="center"
                gap={1}
              >
                <PieChartOutlineIcon color="secondary" />
                Category Summary
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categorySummary}
                    dataKey="total"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label
                  >
                    {categorySummary.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
