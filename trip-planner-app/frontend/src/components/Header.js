import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Header() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState('INR');
  const [currentLanguage, setCurrentLanguage] = useState('US');

  const currencies = ['INR', 'USD', 'EUR', 'GBP', 'JPY'];
  const languages = [
    { code: 'US', label: 'English (US)' },
    { code: 'UK', label: 'English (UK)' },
    { code: 'ES', label: 'Español' },
    { code: 'FR', label: 'Français' },
    { code: 'DE', label: 'Deutsch' }
  ];

  return (
    <header className="w-full bg-white dark:bg-gray-800 shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <svg 
            className="w-8 h-8 text-green-500" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M12 2L2 8l10 6 10-6-10-6zM2 15l10 6 10-6M2 19l10 6 10-6"/>
          </svg>
          <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            TravelGenius
          </span>
        </Link>

        {/* Currency and Language Selector */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowLanguageModal(true)}
            className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span>{currentCurrency}</span>
            <span>|</span>
            <span>{currentLanguage}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
          >
            {darkMode ? '🌞' : '🌙'}
          </button>

          {/* Menu Button */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Language and Currency Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Select Currency and Language</h3>
            
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Currency</h4>
              <div className="grid grid-cols-3 gap-2">
                {currencies.map(currency => (
                  <button
                    key={currency}
                    onClick={() => {
                      setCurrentCurrency(currency);
                      setShowLanguageModal(false);
                    }}
                    className={`p-2 rounded ${
                      currentCurrency === currency 
                        ? 'bg-blue-500 text-white' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {currency}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Language</h4>
              <div className="grid grid-cols-1 gap-2">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setCurrentLanguage(lang.code);
                      setShowLanguageModal(false);
                    }}
                    className={`p-2 rounded text-left ${
                      currentLanguage === lang.code 
                        ? 'bg-blue-500 text-white' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowLanguageModal(false)}
              className="mt-6 w-full py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Menu Dropdown */}
      {showMenu && (
        <div className="absolute right-4 top-16 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-40">
          <Link to="/login" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            Login
          </Link>
          <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            Settings
          </Link>
          <Link to="/chats" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            My Chats
          </Link>
          <Link to="/subscription" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            Manage Subscription
          </Link>
          <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
          <Link to="/about" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            About
          </Link>
          <Link to="/contact" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            Contact
          </Link>
          <Link to="/terms" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            Terms of service
          </Link>
        </div>
      )}
    </header>
  );
}
