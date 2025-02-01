import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import JourneySection from "../components/JourneySection";
import TripFeatures from "../components/TripFeatures";

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <HeroSection className="p-5 pb-10"/>
      <JourneySection />
      <TripFeatures />
      <Footer />
    </div>
  );
}
