import React, { useState } from 'react';
import { ClockIcon, ComputerDesktopIcon, Battery100Icon, SignalIcon, Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { auth } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  isOnline: boolean;
  lastLogTime: Date | null;
  battery: number | string;
  activeApp: string;
}

export const Header: React.FC<HeaderProps> = ({ isOnline, lastLogTime, battery, activeApp }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser } = useAuth();

  const formatTime = (date: Date) => {
    return format(date, 'MMM d, yyyy hh:mm:ss a');
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-white">Sab's WinTrack Dashboard</h1>
            </div>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-300">
                <SignalIcon className={`h-5 w-5 mr-1 ${isOnline ? 'text-green-500' : 'text-red-500'}`} />
                <span>{isOnline ? 'Online' : 'Offline'}</span>
              </div>
              
              {lastLogTime && (
                <div className="flex items-center text-sm text-gray-300">
                  <ClockIcon className="h-5 w-5 mr-1 text-blue-400" />
                  <span>Last update: {formatTime(lastLogTime)}</span>
                </div>
              )}
              
              <div className="flex items-center text-sm text-gray-300">
                <Battery100Icon className="h-5 w-5 mr-1 text-yellow-400" />
                <span>{battery}%</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-300">
                <ComputerDesktopIcon className="h-5 w-5 mr-1 text-purple-400" />
                <span className="truncate max-w-xs">{activeApp}</span>
              </div>

              {currentUser && (
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1 text-red-400" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-300 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <div className="flex items-center px-3 py-2 text-sm text-gray-300">
              <SignalIcon className={`h-5 w-5 mr-2 ${isOnline ? 'text-green-500' : 'text-red-500'}`} />
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </div>
            
            {lastLogTime && (
              <div className="flex items-center px-3 py-2 text-sm text-gray-300">
                <ClockIcon className="h-5 w-5 mr-2 text-blue-400" />
                <span>Last update: {formatTime(lastLogTime)}</span>
              </div>
            )}
            
            <div className="flex items-center px-3 py-2 text-sm text-gray-300">
              <Battery100Icon className="h-5 w-5 mr-2 text-yellow-400" />
              <span>{battery}%</span>
            </div>
            
            <div className="flex items-center px-3 py-2 text-sm text-gray-300">
              <ComputerDesktopIcon className="h-5 w-5 mr-2 text-purple-400" />
              <span className="truncate">{activeApp}</span>
            </div>

            {currentUser && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2 text-red-400" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}; 