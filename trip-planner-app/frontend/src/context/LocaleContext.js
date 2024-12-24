import React, { createContext, useContext, useEffect, useState } from "react";
import { translations } from "../translations";

const LocaleContext = createContext();

export function LocaleProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [currentCurrency, setCurrentCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch exchange rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/USD`
        );
        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const convertCurrency = (amount, fromCurrency = 'USD') => {
    if (!exchangeRates[fromCurrency] || !exchangeRates[currentCurrency]) {
      return amount;
    }
    
    // Convert to USD first (base currency)
    const inUSD = amount / exchangeRates[fromCurrency];
    // Then convert to target currency
    return inUSD * exchangeRates[currentCurrency];
  };

  const languages = [
    { code: 'en', label: 'English (US)', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
    { code: 'zh', label: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', label: 'Japanese', flag: '🇯🇵' },
    { code: 'ar', label: 'Arabic', flag: '🇸🇦' },
    { code: 'ru', label: 'Russian', flag: '🇷🇺' },
    { code: 'pt', label: 'Portuguese', flag: '🇵🇹' },
    { code: 'nl', label: 'Dutch', flag: '🇳🇱' },
    { code: 'hi', label: 'Hindi', flag: '🇮🇳' },
    { code: 'he', label: 'Hebrew', flag: '🇮🇱' },
    { code: 'bg', label: 'Bulgarian', flag: '🇧🇬' }
  ];

  const currencies = [
    { code: 'USD', symbol: '$', label: 'US Dollar' },
    { code: 'EUR', symbol: '€', label: 'Euro' },
    { code: 'GBP', symbol: '£', label: 'British Pound' },
    { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
    { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
    { code: 'CNY', symbol: '¥', label: 'Chinese Yuan' },
    { code: 'AED', symbol: 'د.إ', label: 'UAE Dirham' },
    { code: 'RUB', symbol: '₽', label: 'Russian Ruble' }
  ];

  const changeLanguage = (code) => {
    setCurrentLanguage(code);
    // You could also store this in localStorage or your database
    localStorage.setItem('preferredLanguage', code);
  };

  const changeCurrency = (code) => {
    setCurrentCurrency(code);
    localStorage.setItem('preferredCurrency', code);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(currentLanguage, {
      style: 'currency',
      currency: currentCurrency
    }).format(amount);
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  return (
    <LocaleContext.Provider value={{
      currentLanguage,
      currentCurrency,
      languages,
      currencies,
      changeLanguage,
      changeCurrency,
      formatCurrency,
      convertCurrency,
      t,
      loading
    }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
} 