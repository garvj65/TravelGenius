import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLocale } from "../context/LocaleContext";
import { useTheme } from "../context/ThemeContext";

export default function Header() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const {
    currentLanguage,
    currentCurrency,
    languages,
    currencies,
    changeLanguage,
    changeCurrency
  } = useLocale();
  const [activeTab, setActiveTab] = useState('currency'); // 'currency' or 'language'

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
            <span>{currencies.find(c => c.code === currentCurrency)?.symbol}</span>
            <span>|</span>
            <span>{languages.find(l => l.code === currentLanguage)?.flag}</span>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[400px]">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('currency')}
                className={`flex-1 py-3 text-sm font-medium ${
                  activeTab === 'currency'
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                Currency
              </button>
              <button
                onClick={() => setActiveTab('language')}
                className={`flex-1 py-3 text-sm font-medium ${
                  activeTab === 'language'
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                Language
              </button>
            </div>

            {/* Content */}
            <div className="p-4 max-h-[400px] overflow-y-auto">
              {activeTab === 'currency' ? (
                <div className="grid grid-cols-2 gap-3">
                  {currencies.map(currency => (
                    <button
                      key={currency.code}
                      onClick={() => changeCurrency(currency.code)}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg transition-colors
                        ${currentCurrency === currency.code
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }
                      `}
                    >
                      <span className="text-lg font-medium">{currency.symbol}</span>
                      <div className="text-left">
                        <div className="text-sm font-medium">{currency.code}</div>
                        <div className="text-xs opacity-75">{currency.label}</div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {languages.map(language => (
                    <button
                      key={language.code}
                      onClick={() => changeLanguage(language.code)}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg w-full transition-colors
                        ${currentLanguage === language.code
                          ? 'bg-blue-500 text-white'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      <span className="text-2xl">{language.flag}</span>
                      <span className="font-medium">{language.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex justify-end">
              <button
                onClick={() => setShowLanguageModal(false)}
                className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
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
