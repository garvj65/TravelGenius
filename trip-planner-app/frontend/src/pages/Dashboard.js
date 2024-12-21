import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold p-8">Dashboard</h1>
      {/* Dashboard content will go here */}
    </div>
  );
}
