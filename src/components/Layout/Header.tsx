import React, { useEffect, useState } from 'react';
import { Menu, X, User, LogOut, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const { user, logout } = useAuthStore();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };

  return (
    <header className="bg-gray-800 text-white h-16 flex items-center justify-between px-4 lg:px-6 shadow-lg relative z-50">
      <div className="flex items-center">
        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-md hover:bg-gray-700 transition-colors"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        <h1 className="text-xl font-bold text-white ml-4">MAPA INTELIGÊNCIA</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-md hover:bg-gray-700 transition-colors"
          aria-label="Alternar tema"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <div className="hidden sm:flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span className="text-sm font-medium">{user?.name}</span>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline text-sm">Sair</span>
        </button>
      </div>
    </header>
  );
};

export default Header;