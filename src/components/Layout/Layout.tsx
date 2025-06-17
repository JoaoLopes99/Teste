import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false); // Close mobile menu on desktop
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load collapsed state from localStorage
  useEffect(() => {
    const savedCollapsedState = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsedState) {
      setIsSidebarCollapsed(JSON.parse(savedCollapsedState));
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCollapse = () => {
    const newCollapsedState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newCollapsedState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newCollapsedState));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isOpen={isSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
          toggleCollapse={toggleCollapse}
        />
        
        <main 
          className={`
            flex-1 overflow-auto transition-all duration-300 ease-in-out
            ${isSidebarCollapsed ? 'lg:ml-0' : 'lg:ml-0'}
            text-gray-900 dark:text-gray-100
          `}
        >
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;