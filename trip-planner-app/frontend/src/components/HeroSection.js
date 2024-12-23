import { SignUpButton, useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  const { isSignedIn } = useAuth();

  return (
    <main className="mt-10 text-center px-4 transition-all duration-300 ease-in-out">
      <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white transition-colors duration-300">
        Your Next Journey, Optimized
      </h2>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 transition-colors duration-300">
        Build, personalize, and optimize your itineraries with our free AI trip planner.
      </p>
      {isSignedIn ? (
        <Link to="/dashboard">
          <button className="mt-6 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded transition-all duration-300 ease-in-out transform hover:scale-105">
            Create a New Trip
          </button>
        </Link>
      ) : (
        <SignUpButton mode="modal">
          <button className="mt-6 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded transition-all duration-300 ease-in-out transform hover:scale-105">
            Get Started
          </button>
        </SignUpButton>
      )}
    </main>
  );
} 