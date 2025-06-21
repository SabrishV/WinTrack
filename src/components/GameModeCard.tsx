import React from 'react';
import { RocketLaunchIcon } from '@heroicons/react/24/outline';
import { DashboardCard } from './DashboardCard';

interface GameModeCardProps {
  gameModeActive: boolean;
  gameName?: string;
  gamePlayingTime: number;
}

export const GameModeCard: React.FC<GameModeCardProps> = ({
  gameModeActive,
  gameName,
  gamePlayingTime
}) => {
  const formatPlayingTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <DashboardCard 
      title="Game Mode" 
      icon={<RocketLaunchIcon className={`h-5 w-5 ${gameModeActive ? 'text-green-500' : 'text-gray-500'}`} />}
    >
      <div className="flex items-center">
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${gameModeActive ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
          {gameModeActive ? 'Active' : 'Inactive'}
        </div>
        <p className="ml-3 text-sm text-gray-400">
          {gameModeActive ? 'Performance mode enabled' : 'Normal mode'}
        </p>
      </div>
      {gameModeActive && gameName && (
        <>
          <div className="text-sm font-medium truncate mt-2">{gameName}</div>
          <div className="text-sm text-gray-400">
            Playing time: {formatPlayingTime(gamePlayingTime)}
          </div>
        </>
      )}
    </DashboardCard>
  );
}; 