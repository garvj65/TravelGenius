import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import Testimonials from "../components/Testimonials";
import TripFeatures from "../components/TripFeatures";
import { SignInButton, SignUpButton, useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  const { isSignedIn } = useAuth();

  return (
    <div>
      <header className="w-full bg-white p-5 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">TravelGenius</h1>
        <nav>
          {!isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <button className="mr-5 text-blue-500 hover:underline">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="text-green-500 hover:underline">Sign Up</button>
              </SignUpButton>
            </>
          ) : (
            <Link to="/dashboard" className="text-green-500 hover:underline">Dashboard</Link>
          )}
        </nav>
      </header>
      <HeroSection />
      <TripFeatures />
      {/* Add other sections like AI-powered trip, footer, etc., here */}
      <Testimonials />
      <Footer />
    </div>
  );
}
