import React, { useMemo } from 'react';
import { format, differenceInMinutes } from 'date-fns';
import { ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { DashboardCard } from './DashboardCard';
import { Session, SystemLog } from '../types';

interface SessionsProps {
  sessions: Session[];
  logs: SystemLog[];
}

export const Sessions: React.FC<SessionsProps> = ({ sessions, logs }) => {
  const formatTime = (timestamp: string) => {
    return format(new Date(timestamp), 'MMM dd, yyyy hh:mm:ss a');
  };

  const formatDuration = (startTime: string, endTime?: string) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const minutes = differenceInMinutes(end, start);
    
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }
  };

  // Group logs into activity sessions based on time gaps
  const activitySessions = useMemo(() => {
    if (!logs.length) return [];
    
    const INACTIVITY_THRESHOLD_MINUTES = 15; // Consider 15+ minutes of no logs as inactivity
    const result: Session[] = [];
    
    // Sort logs by timestamp in ascending order (oldest first)
    const sortedLogs = [...logs].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    let sessionStartTime = sortedLogs[0].timestamp;
    let sessionLogs: SystemLog[] = [sortedLogs[0]];
    
    for (let i = 1; i < sortedLogs.length; i++) {
      const currentLog = sortedLogs[i];
      const previousLog = sortedLogs[i-1];
      
      const previousLogTime = new Date(previousLog.timestamp);
      const currentLogTime = new Date(currentLog.timestamp);
      const minutesDiff = differenceInMinutes(currentLogTime, previousLogTime);
      
      if (minutesDiff <= INACTIVITY_THRESHOLD_MINUTES) {
        // Add to current session
        sessionLogs.push(currentLog);
      } else {
        // End current session and start a new one
        result.push({
          id: sessionStartTime,
          startTime: sessionStartTime,
          endTime: previousLog.timestamp,
          logs: sessionLogs,
          isActive: false
        });
        
        // Start a new session
        sessionStartTime = currentLog.timestamp;
        sessionLogs = [currentLog];
      }
    }
    
    // Add the last session
    if (sessionLogs.length > 0) {
      result.push({
        id: sessionStartTime,
        startTime: sessionStartTime,
        endTime: new Date().toISOString(),
        logs: sessionLogs,
        isActive: false
      });
    }
    
    // Sort by start time (newest first) and take the last 5
    return result
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      .slice(0, 5);
  }, [logs]);

  // Use activity sessions if available, otherwise fall back to the original sessions
  const displaySessions = activitySessions.length > 0 ? activitySessions : sessions;

  return (
    <DashboardCard 
      title="Sessions" 
      icon={<ClockIcon className="h-5 w-5 text-blue-400" />}
    >
      <div className="space-y-4">
        {displaySessions.map((session) => (
          <div key={session.id} className="bg-gray-700 p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                {session.isActive ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-gray-500 mr-2" />
                )}
                <div>
                  <span className="font-medium text-white">Started: {formatTime(session.startTime)}</span>
                  {session.endTime && (
                    <span className="ml-4 text-gray-300">Ended: {formatTime(session.endTime)}</span>
                  )}
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${session.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-gray-200'}`}>
                {session.isActive ? 'Active' : 'Ended'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">
                  {session.logs.length} logs recorded
                </p>
                <p className="text-sm text-gray-400">
                  Duration: {formatDuration(session.startTime, session.endTime)}
                </p>
              </div>
              <div className="flex space-x-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}; 