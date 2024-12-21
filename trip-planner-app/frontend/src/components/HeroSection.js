import { SignUpButton, useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  const { isSignedIn } = useAuth();

  return (
    <main className="mt-10 text-center">
      <h2 className="text-3xl font-extrabold">Your Next Journey, Optimized</h2>
      <p className="mt-4 text-lg">
        Build, personalize, and optimize your itineraries with our free AI trip planner.
      </p>
      {isSignedIn ? (
        <Link to="/dashboard">
          <button className="mt-6 px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600">
            Create a New Trip
          </button>
        </Link>
      ) : (
        <SignUpButton mode="modal">
          <button className="mt-6 px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600">
            Get Started
          </button>
        </SignUpButton>
      )}
    </main>
  );
} 