import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function Layout({ children }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div>
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="font-bold">Trip Planner</div>
          {user && (
            <div className="flex items-center space-x-4">
              <span>{user.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}