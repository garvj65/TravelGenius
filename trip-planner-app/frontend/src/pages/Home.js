import Footer from "../components/Footer";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import JourneySection from "../components/JourneySection";
import TripFeatures from "../components/TripFeatures";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <Header />
      <HeroSection className="p-5 pb-10"/>
      <JourneySection />
      <TripFeatures />
      <Footer />
    </div>
  );
}
