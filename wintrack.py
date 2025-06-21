import os
import time
import datetime
import psutil
import threading
import getpass
import socket
import win32gui
import win32process
import win32con
import win32api
import firebase_admin
from firebase_admin import credentials, firestore
from pystray import Icon, MenuItem as item
from PIL import Image, ImageDraw

# Initialize Firebase
cred = credentials.Certificate("wintrack.json")  # <-- Replace this
firebase_admin.initialize_app(cred)
db = firestore.client()

# Tray Icon Setup
def create_icon():
    def exit_app(icon, item):
        icon.stop()
        os._exit(0)

    # Create a black background image
    img = Image.new('RGB', (64, 64), (0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Define the bars (you can modify the values to change the chart)
    bar_width = 10
    bar_spacing = 5
    bars = [30, 45, 20, 60, 50]  # heights of the bars
    bar_colors = [(0, 255, 0), (0, 0, 255)]  # Green and Blue for bars

    # Draw bars as vertical lines (Green and Blue)
    for i, bar_height in enumerate(bars):
        x = i * (bar_width + bar_spacing) + 5
        color = bar_colors[i % 2]
        draw.rectangle([x, 64 - bar_height, x + bar_width, 64], fill=color)

    icon = Icon("Logger", img, menu=(item("Exit", exit_app),))
    icon.run()

# Internet check
def is_connected():
    try:
        socket.create_connection(("8.8.8.8", 53), timeout=3)
        return True
    except OSError:
        return False

# Get system uptime
def get_boot_time():
    boot = datetime.datetime.fromtimestamp(psutil.boot_time())
    return boot.strftime("%Y-%m-%d %H:%M:%S")

# Get battery %
def get_battery():
    battery = psutil.sensors_battery()
    return battery.percent if battery else "N/A"

# Get active window and its title
def get_active_window_info():
    hwnd = win32gui.GetForegroundWindow()
    _, pid = win32process.GetWindowThreadProcessId(hwnd)
    window_title = win32gui.GetWindowText(hwnd)
    process_name = "Unknown"
    for proc in psutil.process_iter(['pid', 'name']):
        if proc.pid == pid:
            process_name = proc.name()
            break
    return process_name, window_title

# Get non-system running apps
def get_user_apps():
    current_pid = os.getpid()
    apps = set()
    for proc in psutil.process_iter(['pid', 'name', 'exe']):
        try:
            if proc.pid == current_pid:
                continue
            path = proc.info['exe']
            if path and not any(s in path.lower() for s in ['windows', 'microsoft', 'system32']):
                apps.add(proc.info['name'])
        except Exception:
            continue
    return sorted(apps)

# Idle time detection
def get_idle_time():
    last_input = win32api.GetLastInputInfo()
    millis = win32api.GetTickCount() - last_input
    return millis / 1000

# App usage tracking
app_usage_times = {}
current_app = None
last_switch_time = time.time()

def track_app_usage(active_app):
    global current_app, last_switch_time, app_usage_times
    now = time.time()
    if current_app:
        elapsed = now - last_switch_time
        app_usage_times[current_app] = app_usage_times.get(current_app, 0) + elapsed
    current_app = active_app
    last_switch_time = now

# Detect sleep/wake events
def is_system_resumed(last_tick):
    now = win32api.GetTickCount()
    if now < last_tick or (now - last_tick) > 60000:
        return True
    return False

# Handle shutdown event
def handle_shutdown_event(ctrl_type):
    if ctrl_type in [win32con.CTRL_SHUTDOWN_EVENT, win32con.CTRL_LOGOFF_EVENT]:
        shutdown_time = datetime.datetime.now().isoformat()
        try:
            db.collection("system_logs").add({
                "timestamp": shutdown_time,
                "event": "shutdown"
            })
        except Exception as e:
            print("Failed to log shutdown event:", e)
    return True

# Main logging function
def log_loop():
    global last_switch_time
    last_tick = win32api.GetTickCount()

    while True:
        if not is_connected():
            print("No internet connection. Pausing logging...")
            time.sleep(10)
            continue

        resumed = is_system_resumed(last_tick)
        last_tick = win32api.GetTickCount()

        boot_time = get_boot_time()
        battery = get_battery()
        active_app, window_title = get_active_window_info()
        idle_time = get_idle_time()
        user_apps = get_user_apps()

        track_app_usage(active_app)

        data = {
            "timestamp": datetime.datetime.now().isoformat(),
            "boot_time": boot_time,
            "battery": battery,
            "active_app": active_app,
            "window_title": window_title,
            "idle_time_secs": idle_time,
            "apps": user_apps,
            "resumed_from_sleep": resumed,
            "app_usage_times": {k: round(v, 2) for k, v in app_usage_times.items()}
        }

        print("Logging:", data)
        try:
            db.collection("system_logs").add(data)
        except Exception as e:
            print("Failed to log data to Firebase:", e)

        time.sleep(60)

if __name__ == "__main__":
    win32api.SetConsoleCtrlHandler(handle_shutdown_event, True)
    threading.Thread(target=log_loop, daemon=True).start()
    create_icon()
