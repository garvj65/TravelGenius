import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import JourneyDetail from "./components/JourneyDetail";
import React from "react";
import Signup from "./pages/Signup";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ChatInterface } from "./components/ChatInterface";
import { ConversationHistory } from "./components/ConversationHistory";
import { CreateTripForm } from "./components/CreateTripForm";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { TripDetails } from "./components/TripDetails";
import { LocaleProvider } from "./context/LocaleContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Login } from "./pages/Login";

//import { Navigation } from "./components/Navigation";


function App() {
  return (
      <LocaleProvider>
        <ThemeProvider>
          <BrowserRouter>
            <div>
              
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route
                    path="/journey/:journeyId"
                    element={
                      <ProtectedRoute>
                        <JourneyDetail />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/create-trip/form"
                    element={
                      <ProtectedRoute>
                        <CreateTripForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/create-trip/:tripId"
                    element={
                      <ProtectedRoute>
                        <TripDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/create-trip/chat"
                    element={
                      <ProtectedRoute>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-2">
                            <ChatInterface />
                          </div>
                          <div className="md:col-span-1">
                            <ConversationHistory />
                          </div>
                        </div>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/trips/:tripId/chat"
                    element={
                      <ProtectedRoute>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-2">
                            <ChatInterface />
                          </div>
                          <div className="md:col-span-1">
                            <TripDetails />
                          </div>
                        </div>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </ThemeProvider>
      </LocaleProvider>
  );
}

export default App;
