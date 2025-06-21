<p align="center">
  <img src="https://github.com/user-attachments/assets/577bf363-35bf-4afd-933a-ac5e29d54408" alt="WinTrack Logo" width="200"/>
</p>

# WinTrack

WinTrack is a Windows application monitoring tool that tracks user activity, application usage, and system status, then logs this data to Firebase for analysis. And shows it on a clean and modern user interface in a website built on React Vite and Tailwind CSS

---

## 🚀 Features

- **Active Window Tracking**: Monitors currently active windows and applications  
- **Application Usage Time**: Tracks how long each application is used  
- **System Status Monitoring**: Records system information including:
  - Battery percentage  
  - System uptime (boot time)  
  - Idle time detection  
  - Sleep/wake events  
  - Running applications  
- **Persistent Background Operation**: Runs as a system tray application with minimal UI  
- **Shutdown Event Handling**: Captures system shutdown events  
- **Cloud Integration**: Automatically uploads data to Firebase in real-time  

---

## Dashboard UI 
![dashboard4](https://github.com/user-attachments/assets/2e692d15-0bf5-4828-a2d2-1ed68316bd89)
![dashboard2](https://github.com/user-attachments/assets/ad6a1886-f4b9-4f62-9329-77f3e28062e3)
![dashboard3](https://github.com/user-attachments/assets/af4f2750-e284-46ed-9269-b63b356b6b25)

## Data Structure
WinTrack logs the following data to Firebase:

- Timestamp
- System boot time
- Battery percentage
- Active application name
- Active window title
- System idle time (in seconds)
- List of running user applications
- Sleep/wake status
- Application usage times (in seconds)

## Requirements
- Windows 10+ operating system
- Python 3.6+
- Internet connection for Firebase data upload
- Firebase project with Firestore database

## Installation
1. Clone this repository or download the source code
2. Install required dependencies:
```
pip install psutil pillow pystray pywin32 
firebase-admin
```
3. Set up Firebase:
   - Create a Firebase project at Firebase Console
   - Set up a Firestore database
   - Generate a service account key (Project settings → Service accounts → Generate new private key)
   - Save the JSON key file in the project directory
   - Update the credential path in wintrack.py if needed
  
## Privacy Considerations
This application collects detailed information about system usage. Please ensure you have appropriate permissions when deploying in shared or managed environments.

## License
[https://github.com/SabrishV/WinTrack/blob/main/LICENSE]
