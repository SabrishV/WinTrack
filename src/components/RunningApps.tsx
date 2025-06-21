import React from 'react';
import { ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { DashboardCard } from './DashboardCard';

interface RunningAppsProps {
  apps: string[];
}

export const RunningApps: React.FC<RunningAppsProps> = ({ apps }) => {
  return (
    <DashboardCard 
      title="Running Applications" 
      icon={<ComputerDesktopIcon className="h-5 w-5 text-green-400" />}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {apps.map((app, index) => (
          <div 
            key={index} 
            className="bg-gray-700 p-3 rounded-md shadow-sm hover:bg-gray-600 transition-colors duration-200 flex items-center"
          >
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mr-2">
              <span className="text-xs font-bold">{app.charAt(0).toUpperCase()}</span>
            </div>
            <span className="text-sm truncate">{app}</span>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}; 