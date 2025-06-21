export interface SystemLog {
  timestamp: string;
  boot_time: string;
  battery: number | string;
  active_app: string;
  window_title: string;
  idle_time_secs: number;
  apps: string[];
  resumed_from_sleep: boolean;
  app_usage_times: { [key: string]: number };
  event?: 'shutdown' | 'game_mode_activated' | 'game_mode_deactivated' | string;
  game_mode_active?: boolean;
  game_name?: string;
}

export interface Session {
  id: string;
  startTime: string;
  endTime?: string;
  logs: SystemLog[];
  isActive: boolean;
} 