import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function Navigation() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold">TravelGenius</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link to="/trips/new" className="text-gray-700 hover:text-gray-900">
                  New Trip
                </Link>
                <Link to="/chat" className="text-gray-700 hover:text-gray-900">
                  Chat
                </Link>
                <button
                  onClick={signOut}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-gray-900">
                  Login
                </Link>
                <Link to="/signup" className="text-gray-700 hover:text-gray-900">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 