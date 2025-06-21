# WinTrack
WinTrack is a Windows application monitoring tool that tracks user activity, application usage, and system status, then logs this data to Firebase for analysis.

## Features
- Active Window Tracking : Monitors currently active windows and applications
- Application Usage Time : Tracks how long each application is used
- System Status Monitoring : Records system information including:
  - Battery percentage
  - System uptime (boot time)
  - Idle time detection
  - Sleep/wake events
  - Running applications
- Persistent Background Operation : Runs as a system tray application with minimal UI
- Shutdown Event Handling : Captures system shutdown events
- Cloud Integration : Automatically uploads data to Firebase in real-time
