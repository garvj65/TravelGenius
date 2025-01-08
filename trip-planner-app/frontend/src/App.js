import  ChatInterface  from "./components/ChatInterface";
import CreateTripForms from "./pages/CreateTripForms";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import JourneyDetail from "./components/JourneyDetail";
import React from "react";
import Signup from "./pages/Signup";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LocaleProvider } from "./context/LocaleContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Login } from "./pages/Login";

function App() {
  return (
    <LocaleProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/journey/:journeyId" element={<JourneyDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-trip/form" element={<CreateTripForms />} />
            <Route path="/create-trip/chat" element={<ChatInterface />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </LocaleProvider>
  );
}

export default App;
