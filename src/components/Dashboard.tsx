import { useSystemLogs } from '../hooks/useSystemLogs';
import { Header } from './Header';
import { StatusCards } from './StatusCards';
import { AppUsageCharts } from './AppUsageCharts';
import { RunningApps } from './RunningApps';
import { Sessions } from './Sessions';
import { GameModeCard } from './GameModeCard';
import { useState, useEffect, useMemo } from 'react';
import { differenceInMinutes } from 'date-fns';
import { Session, SystemLog } from '../types';

export const Dashboard = () => {
  const { logs, sessions, isOnline, lastLogTime } = useSystemLogs();
  const latestLog = logs[0];
  const [gamePlayingTime, setGamePlayingTime] = useState<number>(0);

  // Calculate current session start time using the same logic as Sessions component
  const currentSessionStartTime = useMemo(() => {
    if (!logs.length) return undefined;
    
    const INACTIVITY_THRESHOLD_MINUTES = 15;
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
    
    // Sort by start time (newest first) and take the most recent session
    const mostRecentSession = result
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())[0];
    
    return mostRecentSession?.startTime;
  }, [logs]);

  const getAppUsageData = () => {
    if (!latestLog?.app_usage_times) return [];
    return Object.entries(latestLog.app_usage_times)
      .map(([name, time]) => ({
        name,
        time: Math.round(time / 60), // Convert to minutes
      }))
      .sort((a, b) => b.time - a.time); // Sort by usage time descending
  };

  // Extract game name from event
  const getGameName = () => {
    if (!latestLog?.event) return '';
    
    if (latestLog.event.startsWith('game_mode_activated')) {
      // Extract game name from event string (e.g., "game_mode_activated SUPERHOT.exe")
      const parts = latestLog.event.split(' ');
      if (parts.length > 1) {
        return parts.slice(1).join(' '); // Join in case game name has spaces
      }
    }
    
    return latestLog.game_name || '';
  };

  // Check if game mode is active
  const isGameModeActive = latestLog?.event?.startsWith('game_mode_activated') || latestLog?.game_mode_active === true;
  const gameName = getGameName();

  // Calculate playing time
  useEffect(() => {
    if (!isGameModeActive || !gameName) {
      setGamePlayingTime(0);
      return;
    }

    // Find the game mode activated log
    const gameModeActivatedLog = logs.find(log => 
      log.event?.startsWith('game_mode_activated') && 
      log.event.includes(gameName)
    );

    if (!gameModeActivatedLog) {
      setGamePlayingTime(0);
      return;
    }

    const activatedTime = new Date(gameModeActivatedLog.timestamp).getTime();
    
    // Find the game mode deactivated log (if exists)
    const gameModeDeactivatedLog = logs.find(log => 
      log.event?.startsWith('game_mode_deactivated') && 
      log.event.includes(gameName)
    );

    // Update playing time every second
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const endTime = gameModeDeactivatedLog 
        ? new Date(gameModeDeactivatedLog.timestamp).getTime() 
        : now;
      
      const playingTimeMs = endTime - activatedTime;
      const playingTimeMins = Math.floor(playingTimeMs / (1000 * 60));
      
      setGamePlayingTime(playingTimeMins);
    }, 1000);

    return () => clearInterval(interval);
  }, [logs, isGameModeActive, gameName]);

  return (
    <div className="min-h-screen bg-black">
      <Header 
        isOnline={isOnline} 
        lastLogTime={lastLogTime} 
        battery={latestLog?.battery || 0} 
        activeApp={latestLog?.active_app || ''} 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <StatusCards 
          isOnline={isOnline}
          lastLogTime={lastLogTime}
          battery={latestLog?.battery || 0}
          activeApp={latestLog?.active_app || ''}
          windowTitle={latestLog?.window_title || ''}
          idleTimeSecs={latestLog?.idle_time_secs || 0}
          sessionStartTime={currentSessionStartTime}
        />

        {!isGameModeActive && (
          <AppUsageCharts appUsageData={getAppUsageData()} />
        )}

        {latestLog?.apps && (
          <RunningApps apps={latestLog.apps} />
        )}
        
        <GameModeCard 
          gameModeActive={isGameModeActive}
          gameName={gameName}
          gamePlayingTime={gamePlayingTime}
        />

        <Sessions sessions={sessions} logs={logs} />
      </main>
    </div>
  );
}; 