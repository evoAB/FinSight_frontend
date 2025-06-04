import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Categories from "./pages/Categories";
import Navbar from "./components/Navbar";
import Accounts from "./pages/Accounts";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Outlet />
            </>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="categories" element={<Categories />} />
          <Route path="accounts" element={<Accounts />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
