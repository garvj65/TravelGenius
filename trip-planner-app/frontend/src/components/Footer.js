import React from "react";

// src/components/Footer.js

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h4 className="text-lg font-bold mb-4">TripPlanner AI</h4>
            <p>Your next journey, optimized.</p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul>
              <li className="mb-2">
                <a href="/" className="hover:underline">
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a href="/dashboard" className="hover:underline">
                  Dashboard
                </a>
              </li>
              <li className="mb-2">
                <a href="/about" className="hover:underline">
                  About
                </a>
              </li>
              <li className="mb-2">
                <a href="/contact" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <button className="hover:text-white">
                <i className="fab fa-facebook"></i>
              </button>
              <button className="hover:text-white">
                <i className="fab fa-twitter"></i>
              </button>
              <button className="hover:text-white">
                <i className="fab fa-instagram"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="text-center mt-8">
          <p className="text-sm">&copy; 2024 TripPlanner AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
