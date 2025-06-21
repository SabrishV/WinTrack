import React, { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  icon, 
  children, 
  className = '' 
}) => {
  return (
    <div className={`bg-gray-800 rounded-lg shadow-lg overflow-hidden ${className}`}>
      <div className="px-4 py-3 border-b border-gray-700 flex items-center">
        {icon && <div className="mr-2">{icon}</div>}
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}; 