import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Header() {
 const { darkMode, toggleDarkMode } = useTheme();
  return (
   <header className="w-full bg-white dark:bg-dark p-5 shadow-md flex justify-between items-center transition-all duration-300 ease-in-out">
     <Link to="/" className="flex items-center gap-2">
       <svg 
         className="w-8 h-8 text-green-500 transition-colors duration-300" 
         viewBox="0 0 24 24" 
         fill="currentColor"
       >
         <path d="M12 2L2 8l10 6 10-6-10-6zM2 15l10 6 10-6M2 19l10 6 10-6"/>
       </svg>
       <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent transition-all duration-500 ease-in-out">
         TravelGenius
       </span>
     </Link>
     <div className="flex items-center gap-4">
       <button
         onClick={toggleDarkMode}
         className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 transition-all duration-500 ease-in-out hover:scale-110"
       >
         {darkMode ? '🌞' : '🌙'}
       </button>
       <nav>{/* Your existing nav items */}</nav>
     </div>
   </header>
 );
}
