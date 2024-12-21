import Carousel from "./Carousel";
import React from "react";

// src/components/Testimonials.js

const testimonials = [
  {
    quote:
      "This trip planner made my vacation so smooth and stress-free. Highly recommended!",
    name: "John Doe",
    role: "Travel Enthusiast",
  },
  {
    quote:
      "I loved how personalized my itinerary was! The AI suggestions were spot-on.",
    name: "Jane Smith",
    role: "Frequent Traveler",
  },
  {
    quote:
      "Budget optimization was a game-changer for me. I saved so much while traveling!",
    name: "Carlos Rivera",
    role: "Backpacker",
  },
  {
    quote:
      "The local cuisine recommendations made me fall in love with the culture.",
    name: "Emily Wong",
    role: "Food Blogger",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-blue-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          What <span className="text-blue-500">Our Users</span> Say
        </h2>
        <Carousel items={testimonials} />
      </div>
    </section>
  );
};

export default Testimonials;
