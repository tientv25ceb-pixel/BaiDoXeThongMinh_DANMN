#!/usr/bin/env python3
import time
import random
import json
import sys

# Try importing paho-mqtt, print helpful error if not installed
try:
    import paho.mqtt.client as mqtt
except ImportError:
    print("\n[!] Lỗi: Không tìm thấy thư viện 'paho-mqtt'.")
    print("    Vui lòng cài đặt bằng lệnh: pip install paho-mqtt")
    print("    (Hoặc chạy trong môi trường ảo pip install paho-mqtt)\n")
    sys.exit(1)

# MQTT Broker Details
MQTT_BROKER = "broker.emqx.io"
MQTT_PORT = 1883
TOPIC_SLOTS = "smartpark3d/5ed8f481/slots"

# Predefined colors to match the frontend
CAR_COLORS = [
    "#3b82f6",  # Blue
    "#ef4444",  # Red
    "#f59e0b",  # Gold
    "#10b981",  # Green
    "#8b5cf6",  # Purple
    "#ec4899",  # Pink
    "#06b6d4",  # Cyan
    "#9ca3af"   # Silver
]

# Track simulated state locally
slots_state = ["empty"] * 12
slots_labels = [
    "L1", "L2", "L3", "L4",
    "R1", "R2", "R3", "R4",
    "B1", "B2", "B3", "B4"
]

# ANSI Terminal Color Helpers
GREEN = "\033[92m"
RED = "\033[91m"
BLUE = "\033[94m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
RESET = "\033[0m"

def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        print(f"\n{GREEN}[✓] Đã kết nối MQTT Broker '{MQTT_BROKER}' thành công!{RESET}")
        print(f"    Topic phát cảm biến: {BLUE}{TOPIC_SLOTS}{RESET}")
        print("    --------------------------------------------------")
        print(f"    * {YELLOW}CHẾ ĐỘ TỰ ĐỘNG CHẠY{RESET}: Mỗi 6 giây sẽ giả lập xe vào/ra ngẫu nhiên.")
        print(f"    * {YELLOW}CHẾ ĐỘ THỦ CÔNG{RESET}: Nhấn Ctrl+C bất kỳ lúc nào để thoát.\n")
    else:
        print(f"{RED}[✗] Kết nối thất bại. Mã lỗi: {rc}{RESET}")

def main():
    # Setup client
    # Support both old and new paho-mqtt API versions
    try:
        client = mqtt.Client(callback_api_version=mqtt.CallbackAPIVersion.VERSION2)
    except AttributeError:
        # Fallback for paho-mqtt < 2.0.0
        client = mqtt.Client()

    client.on_connect = on_connect

    print(f"{CYAN}[~] Đang kết nối tới MQTT Broker {MQTT_BROKER}:{MQTT_PORT}...{RESET}")
    try:
        client.connect(MQTT_BROKER, MQTT_PORT, 60)
    except Exception as e:
        print(f"{RED}[✗] Không thể kết nối tới Broker: {e}{RESET}")
        sys.exit(1)

    # Start network loop in background
    client.loop_start()

    try:
        while True:
            # 1. Pick a random slot to toggle
            slot_id = random.randint(0, 11)
            label = slots_labels[slot_id]
            current_status = slots_state[slot_id]
            
            # Toggle state
            next_status = "occupied" if current_status == "empty" else "empty"
            slots_state[slot_id] = next_status
            
            # Assign color
            color = random.choice(CAR_COLORS) if next_status == "occupied" else "#3b82f6"

            # Create payload
            payload = {
                "slotId": slot_id,
                "status": next_status,
                "carColor": color
            }

            # Log to console
            time_str = time.strftime("%H:%M:%S")
            if next_status == "occupied":
                print(f"[{time_str}] {RED}📥 GIẢ LẬP ESP32: Xe đỗ vào ô {label} (#{slot_id + 1}) - Màu: {color}{RESET}")
            else:
                print(f"[{time_str}] {GREEN}📤 GIẢ LẬP ESP32: Ô đỗ {label} (#{slot_id + 1}) đã rời đi (Trống){RESET}")

            # Publish payload
            client.publish(TOPIC_SLOTS, json.dumps(payload), qos=1)

            # Wait 6 seconds
            time.sleep(6)

    except KeyboardInterrupt:
        print(f"\n{YELLOW}[!] Đang tắt thiết bị cảm biến ảo (Virtual ESP32)...{RESET}")
    finally:
        client.loop_stop()
        client.disconnect()
        print(f"{GREEN}[✓] Đã ngắt kết nối an toàn. Tạm biệt!{RESET}")

if __name__ == "__main__":
    main()
