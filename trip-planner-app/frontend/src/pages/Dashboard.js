import Header from "../components/Header";
import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        {/* Dashboard content */}
      </main>
    </div>
  );
}
