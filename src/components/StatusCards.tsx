import React, { useState, useEffect } from 'react';
import { formatDistanceToNow, differenceInMinutes } from 'date-fns';
import { SignalIcon, Battery0Icon, Battery50Icon, Battery100Icon, ComputerDesktopIcon, ClockIcon } from '@heroicons/react/24/outline';
import { DashboardCard } from './DashboardCard';

interface StatusCardsProps {
  isOnline: boolean;
  lastLogTime: Date | null;
  battery: number | string;
  activeApp: string;
  windowTitle: string;
  idleTimeSecs: number;
  sessionStartTime?: string;
}

export const StatusCards: React.FC<StatusCardsProps> = ({
  isOnline,
  lastLogTime,
  battery,
  activeApp,
  windowTitle,
  idleTimeSecs,
  sessionStartTime
}) => {
  const [countdown, setCountdown] = useState(60);
  
  useEffect(() => {
    // Reset countdown when lastLogTime changes
    setCountdown(60);
    
    // Set up interval to decrement countdown
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);
    
    // Clean up interval on unmount or when lastLogTime changes
    return () => clearInterval(interval);
  }, [lastLogTime]);

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getActiveTime = () => {
    if (!sessionStartTime) return 0;
    const start = new Date(sessionStartTime);
    const now = new Date();
    return differenceInMinutes(now, start);
  };

  const activeTime = getActiveTime();
  const idleTimeMinutes = Math.floor(idleTimeSecs / 60);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <DashboardCard 
        title="Device Status" 
        icon={<SignalIcon className={`h-5 w-5 ${isOnline ? 'text-green-500' : 'text-red-500'}`} />}
      >
        <div className="flex flex-col">
          <div className={`inline-block px-2 py-1 rounded text-sm font-medium w-fit ${isOnline ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </div>
          {lastLogTime && (
            <p className="mt-2 text-sm text-gray-400">
              Last update: {formatDistanceToNow(lastLogTime)} ago
            </p>
          )}
          <div className="mt-2 flex items-center">
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${countdown > 30 ? 'bg-green-500' : countdown > 10 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                style={{ width: `${(countdown / 60) * 100}%` }}
              ></div>
            </div>
            <span className="ml-2 text-xs font-medium text-gray-300">{countdown}s</span>
          </div>
        </div>
      </DashboardCard>

      <DashboardCard 
        title="Battery" 
        icon={
          typeof battery === 'number' ? (
            battery <= 20 ? (
              <Battery0Icon className="h-5 w-5 text-red-500" />
            ) : battery <= 60 ? (
              <Battery50Icon className="h-5 w-5 text-yellow-500" />
            ) : (
              <Battery100Icon className="h-5 w-5 text-green-500" />
            )
          ) : (
            <Battery100Icon className="h-5 w-5 text-gray-500" />
          )
        }
      >
        <div className="flex items-center">
          <div className="relative w-16 h-16">
            <svg className={`w-full h-full ${
              typeof battery === 'number' 
                ? battery <= 20 
                  ? 'text-red-500' 
                  : battery <= 60 
                    ? 'text-yellow-500' 
                    : 'text-green-500'
                : 'text-gray-500'
            }`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M23 13H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="5" y="6" width="14" height="12" rx="1" fill="currentColor" fillOpacity="0.2"/>
              <rect x="5" y="6" width={`${typeof battery === 'number' ? (battery * 0.14) : 0}`} height="12" rx="1" fill="currentColor"/>
            </svg>
          </div>
          <div className="ml-4">
            <p className={`text-2xl font-bold ${
              typeof battery === 'number'
                ? battery <= 20
                  ? 'text-red-500'
                  : battery <= 60
                    ? 'text-yellow-500'
                    : 'text-green-500'
                : 'text-gray-500'
            }`}>{battery}%</p>
            <p className="text-sm text-gray-400">Battery Level</p>
          </div>
        </div>
      </DashboardCard>

      <DashboardCard 
        title="Active Window" 
        icon={<ComputerDesktopIcon className="h-5 w-5 text-purple-400" />}
      >
        <div>
          <p className="font-medium text-white">{activeApp}</p>
          <p className="text-sm text-gray-400 mt-1 truncate">{windowTitle}</p>
        </div>
      </DashboardCard>

      <DashboardCard 
        title="Time Status" 
        icon={<ClockIcon className="h-5 w-5 text-blue-400" />}
      >
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Active Time:</span>
            <span className="text-lg font-medium text-white">{formatTime(activeTime)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Idle Time:</span>
            <span className="text-lg font-medium text-white">{formatTime(idleTimeMinutes)}</span>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-400">
              {idleTimeSecs > 300 ? 'User is currently idle' : 'User is currently active'}
            </p>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}; 