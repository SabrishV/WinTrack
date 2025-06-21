import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { SystemLog, Session } from '../types';

export const useSystemLogs = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [lastLogTime, setLastLogTime] = useState<Date | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'system_logs'), orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newLogs: SystemLog[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        newLogs.push({
          ...data,
          timestamp: data.timestamp,
        } as SystemLog);
      });

      setLogs(newLogs);
      
      if (newLogs.length > 0) {
        const latestLogTime = new Date(newLogs[0].timestamp);
        setLastLogTime(latestLogTime);
        
        // Check if device is online (within last 60 seconds)
        const now = new Date();
        setIsOnline(now.getTime() - latestLogTime.getTime() < 60000);
      }

      // Group logs into sessions
      const newSessions: Session[] = [];
      let currentSession: Session | null = null;

      newLogs.forEach((log) => {
        if (log.event === 'shutdown') {
          if (currentSession) {
            currentSession.endTime = log.timestamp;
            currentSession.isActive = false;
            newSessions.push(currentSession);
            currentSession = null;
          }
        } else if (!currentSession) {
          currentSession = {
            id: log.timestamp,
            startTime: log.timestamp,
            logs: [log],
            isActive: true,
          };
        } else {
          currentSession.logs.push(log);
        }
      });

      if (currentSession) {
        newSessions.push(currentSession);
      }

      setSessions(newSessions);
    });

    return () => unsubscribe();
  }, []);

  return {
    logs,
    sessions,
    isOnline,
    lastLogTime,
  };
}; 