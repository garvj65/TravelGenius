import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export function ProtectedPage({ children }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
} 