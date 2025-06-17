import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  FileText,
  User,
  Building2,
  Home,
  Car,
  Phone,
  MessageSquare,
  DollarSign,
  Briefcase,
  ChevronLeft
} from 'lucide-react';

const menuItems = [
  { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
  { path: '/ocorrencia', icon: FileText, label: 'Ocorrência' },
  { path: '/cpf', icon: User, label: 'CPF' },
  { path: '/cnpj', icon: Building2, label: 'CNPJ' },
  { path: '/imoveis', icon: Home, label: 'Imóveis' },
  { path: '/veiculos', icon: Car, label: 'Veículos' },
  { path: '/telefones', icon: Phone, label: 'Telefones' },
  { path: '/redes-sociais', icon: MessageSquare, label: 'Redes Sociais' },
  { path: '/financeiro', icon: DollarSign, label: 'Financeiro' },
  { path: '/empresarial', icon: Briefcase, label: 'Empresarial' }
];

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  toggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  isCollapsed, 
  toggleSidebar, 
  toggleCollapse 
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:relative top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 z-50
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}
          w-64
        `}
      >
        {/* Sidebar Header - Desktop Only */}
        <div className="hidden lg:flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {!isCollapsed && (
            <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Menu Principal</span>
          )}
          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft 
              className={`w-4 h-4 text-gray-600 dark:text-gray-300 transition-transform duration-300 ${
                isCollapsed ? 'rotate-180' : ''
              }`} 
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => {
                    // Close mobile menu when item is clicked
                    if (window.innerWidth < 1024) {
                      toggleSidebar();
                    }
                  }}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 border-r-2 border-blue-700 dark:border-blue-300'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  
                  {/* Label - Hidden when collapsed on desktop */}
                  <span 
                    className={`font-medium transition-all duration-300 ${
                      isCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 hidden lg:block">
                      {item.label}
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className={`absolute bottom-4 left-4 right-4 ${isCollapsed ? 'lg:hidden' : ''}`}>
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            <p>Mapa Inteligência</p>
            <p>v1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;