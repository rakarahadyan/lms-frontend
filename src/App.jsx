import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./auth/Login";
import RegisterPage from "./auth/Register";
import Dashboard from "./dashboard/index";
import Modul from "./modul/index";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/modul" element={<Modul />} />
      </Routes>
    </Router>
  );
}

export default App;
