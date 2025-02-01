import ChatBot from "./components/ChatBot";
import CreateTripForms from "./pages/CreateTripForms";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Home from "./pages/Home";
import JourneyDetail from "./components/JourneyDetail";
import React from "react";
import Signup from "./pages/Signup";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedPage } from "./components/ProtectedPage";
import { AuthProvider } from "./context/AuthContext";
import { LocaleProvider } from "./context/LocaleContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Login } from "./pages/Login";

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  if (!clerkPubKey) {
    throw new Error("Missing Clerk Publishable Key");
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <AuthProvider>
        <LocaleProvider>
          <ThemeProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-gray-100">
                <Header />
                <main className="">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/journey/:journeyId" element={<JourneyDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedPage>
                          <Dashboard />
                        </ProtectedPage>
                      }
                    />
                    <Route path="/create-trip/form" element={<CreateTripForms />} />
                    <Route
                      path="/create-trip/chat"
                      element={
                        <ProtectedPage>
                          <ChatBot />
                        </ProtectedPage>
                      }
                    />
                  </Routes>
                </main>
              </div>
            </BrowserRouter>
          </ThemeProvider>
        </LocaleProvider>
      </AuthProvider>
    </ClerkProvider>
  );
}

export default App;
