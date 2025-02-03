import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/" />;
  }

  return children;
} 