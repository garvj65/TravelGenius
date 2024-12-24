import CreateTripForms from "./pages/CreateTripForms";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import JourneyDetail from "./components/JourneyDetail";
import Login from "./pages/Login";
import React from "react";
import Signup from "./pages/Signup";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/journey/:journeyId" element={<JourneyDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-trip/form" element={<CreateTripForms />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
