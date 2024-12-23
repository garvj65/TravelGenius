import React from "react";

// src/components/Footer.js

export default function Footer() {
  return (
    <footer className="bg-gray-800 dark:bg-gray-950 text-gray-300 py-8 transition-all duration-300 ease-in-out">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4 transition-colors duration-300">
              TravelGenius
            </h3>
            <p className="text-gray-400 dark:text-gray-500 transition-colors duration-300">
              Your AI-powered travel companion
            </p>
          </div>
          <div>
            <h4 className="text-white text-lg font-bold mb-4 transition-colors duration-300">
              Quick Links
            </h4>
            <div className="space-y-2">
              <button className="block text-gray-400 dark:text-gray-500 hover:text-white transition-all duration-300">
                About Us
              </button>
              <button className="block text-gray-400 dark:text-gray-500 hover:text-white transition-all duration-300">
                Contact
              </button>
              <button className="block text-gray-400 dark:text-gray-500 hover:text-white transition-all duration-300">
                Privacy Policy
              </button>
            </div>
          </div>
          <div>
            <h4 className="text-white text-lg font-bold mb-4 transition-colors duration-300">
              Follow Us
            </h4>
            <div className="flex space-x-4">
              <button className="text-gray-400 dark:text-gray-500 hover:text-white transition-all duration-300">
                <i className="fab fa-facebook"></i>
              </button>
              <button className="text-gray-400 dark:text-gray-500 hover:text-white transition-all duration-300">
                <i className="fab fa-twitter"></i>
              </button>
              <button className="text-gray-400 dark:text-gray-500 hover:text-white transition-all duration-300">
                <i className="fab fa-instagram"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
