import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  icon: LucideIcon;
  description?: string;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, icon: Icon, description, children }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {description && (
              <p className="text-gray-600 mt-1">{description}</p>
            )}
          </div>
        </div>
        {children && (
          <div className="flex items-center space-x-3">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;