#!/usr/bin/env python3
import time
import random
import json
import sys
import os

# Try importing paho-mqtt
try:
    import paho.mqtt.client as mqtt
except ImportError:
    print("\n[!] Lỗi: Không tìm thấy thư viện 'paho-mqtt'.")
    print("    Vui lòng cài đặt bằng lệnh: pip install paho-mqtt\n")
    sys.exit(1)

# Check for OpenCV, Ultralytics (YOLOv8), and EasyOCR
HAS_CV2 = False
HAS_YOLO = False
HAS_EASYOCR = False

try:
    import cv2
    HAS_CV2 = True
except ImportError:
    pass

try:
    from ultralytics import YOLO
    HAS_YOLO = True
except ImportError:
    pass

try:
    import easyocr
    HAS_EASYOCR = True
except ImportError:
    pass

# MQTT Broker Details
MQTT_BROKER = "broker.emqx.io"
MQTT_PORT = 1883
TOPIC_GATE = "smartpark3d/5ed8f481/gate"

# Mock data for license plates fallback
MOCK_PLATES = [
    "30A-123.45", "30F-987.65", "51G-888.88", "43B-555.22",
    "36A-333.66", "75A-099.99", "29D-777.11", "99A-456.78",
    "17B-999.00", "88A-111.11", "14A-222.33", "37A-789.01"
]

# ANSI Terminal Colors
GREEN = "\033[92m"
RED = "\033[91m"
BLUE = "\033[94m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
RESET = "\033[0m"

def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        print(f"\n{GREEN}[✓] YOLOv8 Node đã kết nối MQTT Broker '{MQTT_BROKER}'!{RESET}")
        print(f"    Topic phát nhận diện: {BLUE}{TOPIC_GATE}{RESET}")
        print("    --------------------------------------------------")
    else:
        print(f"{RED}[✗] Kết nối Broker thất bại: {rc}{RESET}")

def download_sample_video(video_path):
    """
    Downloads a sample vehicle detection video from Intel IoT Devkit
    if no local video file is present.
    """
    url = "https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/car-detection.mp4"
    print(f"{YELLOW}[i] Không tìm thấy video '{video_path}'. Đang tự động tải video mẫu từ Intel IoT Devkit...{RESET}")
    try:
        import urllib.request
        urllib.request.urlretrieve(url, video_path)
        print(f"{GREEN}[✓] Tải video thành công! Lưu tại: {video_path}{RESET}")
        return True
    except Exception as e:
        print(f"{RED}[✗] Không thể tải video mẫu: {e}. Sẽ chạy ở chế độ giả lập.{RESET}")
        return False

def run_mock_cv2_window(client):
    """
    Renders a simulated camera view using pure OpenCV drawings.
    This simulates drawing YOLO bounding boxes and recognition lines 
    in case the user doesn't have a real video or ultralytics installed.
    """
    import numpy as np
    
    print(f"{YELLOW}[i] Đang khởi chạy mô phỏng camera giám sát cổng (Mock CV2 Mode)...{RESET}")
    print("    Nhấn 'q' tại cửa sổ OpenCV để thoát.")
    
    # Create blank dark gray frame
    width, height = 640, 480
    frame_base = np.zeros((height, width, 3), dtype=np.uint8)
    frame_base[:] = (30, 41, 59) # Slate background
    
    # Draw static layout (Lane borders, gate line)
    cv2.line(frame_base, (150, 0), (150, height), (75, 85, 99), 2)
    cv2.line(frame_base, (490, 0), (490, height), (75, 85, 99), 2)
    # Entry Gate Line (Green)
    cv2.line(frame_base, (150, 240), (490, 240), (16, 185, 129), 3) 
    
    last_trigger_time = 0
    gate_events = []
    
    while True:
        frame = frame_base.copy()
        current_time = time.time()
        
        # Add labels
        cv2.putText(frame, "AI GATE MONITOR - SIMULATOR", (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (248, 250, 252), 2)
        cv2.putText(frame, "MQTT Broker: Online", (20, 70), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (16, 185, 129), 1)
        cv2.putText(frame, "GATE LINE (YOLOv8 TRIGGER)", (165, 230), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (16, 185, 129), 1)
        
        # Check if we should trigger a new mock car crossing
        if current_time - last_trigger_time > 12: # Every 12 seconds
            last_trigger_time = current_time
            event_type = "entry" if random.random() > 0.4 else "exit"
            plate = random.choice(MOCK_PLATES)
            
            # Send message over MQTT
            payload = {
                "type": event_type,
                "licensePlate": plate,
                "timestamp": new_timestamp()
            }
            client.publish(TOPIC_GATE, json.dumps(payload), qos=1)
            
            # Add to local visualization stack
            gate_events.append({
                "type": event_type,
                "plate": plate,
                "y": 240,
                "color": (16, 185, 129) if event_type == "entry" else (244, 63, 94),
                "created": current_time
            })
            
            print(f"[{time.strftime('%H:%M:%S')}] {CYAN}📷 YOLOv8: Phát hiện xe {event_type} - Biển số: {plate}{RESET}")
            
        # Draw and animate crossing cars
        for event in list(gate_events):
            age = current_time - event["created"]
            if age > 3:
                gate_events.remove(event)
                continue
                
            # Draw mock car bounding box
            box_y = int(event["y"] + (age - 1.5) * 80) # animate moving down/up
            cv2.rectangle(frame, (220, box_y - 40), (420, box_y + 40), event["color"], 2)
            cv2.rectangle(frame, (220, box_y - 40), (320, box_y - 20), event["color"], -1)
            cv2.putText(frame, "CAR 98%", (225, box_y - 25), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)
            
            # Draw License Plate bounding box
            cv2.rectangle(frame, (290, box_y + 10), (350, box_y + 25), (255, 255, 255), -1)
            cv2.putText(frame, event["plate"], (292, box_y + 22), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 0, 0), 1)
            
            # Draw success trigger circle
            cv2.circle(frame, (320, 240), 12, (255, 255, 255), -1)
            cv2.putText(frame, "OK", (312, 244), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 128, 0), 1)

        # Show frame
        cv2.imshow("SmartPark 3D - AI Gate Pipeline", frame)
        if cv2.waitKey(30) & 0xFF == ord('q'):
            break

    cv2.destroyAllWindows()

def new_timestamp():
    return time.strftime("%Y-%m-%dT%H:%M:%S") + "+07:00"

def main():
    # Setup MQTT client
    try:
        client = mqtt.Client(callback_api_version=mqtt.CallbackAPIVersion.VERSION2)
    except AttributeError:
        client = mqtt.Client()

    client.on_connect = on_connect

    print(f"{CYAN}[~] Đang kết nối MQTT Broker {MQTT_BROKER}:{MQTT_PORT}...{RESET}")
    try:
        client.connect(MQTT_BROKER, MQTT_PORT, 60)
    except Exception as e:
        print(f"{RED}[✗] Kết nối Broker thất bại: {e}{RESET}")
        sys.exit(1)

    client.loop_start()

    # Determine execution mode: Real YOLO vs Mock Simulation
    video_path = "parking_gate.mp4"
    model_path = "yolov8n.pt"
    
    # Try downloading the video if it is missing
    if HAS_CV2 and not os.path.exists(video_path):
        download_sample_video(video_path)

    use_real_yolo = HAS_CV2 and HAS_YOLO and os.path.exists(video_path)

    if use_real_yolo:
        print(f"{GREEN}[✓] Phát hiện môi trường YOLO & Video. Đang nạp mô hình {model_path}...{RESET}")
        try:
            model = YOLO(model_path)
            cap = cv2.VideoCapture(video_path)
            
            # Initialize OCR reader if available
            ocr_reader = None
            if HAS_EASYOCR:
                print(f"{GREEN}[✓] Phát hiện EasyOCR. Khởi tạo bộ OCR nhận diện biển số thật...{RESET}")
                try:
                    ocr_reader = easyocr.Reader(['en'], gpu=False)
                except Exception as ocr_init_err:
                    print(f"{YELLOW}[!] Lỗi nạp EasyOCR: {ocr_init_err}. Sẽ sử dụng Mock OCR.{RESET}")
            
            # Line coordinates for trigger line crossing (centered in frame)
            line_y = 300 
            already_crossed = set()
            
            print(f"{GREEN}[✓] Đang chạy YOLOv8 Object Detection trên video '{video_path}'...{RESET}")
            print("    Nhấn 'q' tại cửa sổ hiển thị để thoát.")
            
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    # Loop video
                    cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                    already_crossed.clear()
                    continue
                    
                # Run YOLOv8 on frame (detecting 'car', 'truck', 'motorcycle' - class 2, 7, 3 in COCO)
                results = model.track(frame, persist=True, classes=[2, 3, 7], verbose=False)
                
                if results[0].boxes and results[0].boxes.id is not None:
                    boxes = results[0].boxes.xyxy.cpu().numpy()
                    ids = results[0].boxes.id.cpu().numpy().astype(int)
                    
                    for box, obj_id in zip(boxes, ids):
                        x1, y1, x2, y2 = box
                        cy = int((y1 + y2) / 2) # Center Y
                        
                        # Draw bounding box
                        cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (16, 185, 129), 2)
                        cv2.putText(frame, f"ID: {obj_id} Car", (int(x1), int(y1) - 5), 
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (16, 185, 129), 2)
                                    
                        # Check if vehicle crossed the trigger line (crossing y = 300)
                        if obj_id not in already_crossed and abs(cy - line_y) < 15:
                            already_crossed.add(obj_id)
                            
                            # Determine entry/exit based on random for demo
                            event_type = "entry" if random.random() > 0.35 else "exit"
                            
                            # Attempt real license plate OCR
                            plate = ""
                            if ocr_reader is not None:
                                try:
                                    h, w = frame.shape[:2]
                                    cx1, cy1, cx2, cy2 = int(x1), int(y1), int(x2), int(y2)
                                    cx1, cy1 = max(0, cx1), max(0, cy1)
                                    cx2, cy2 = min(w, cx2), min(h, cy2)
                                    
                                    # Crop bottom 40% of the car box where plates are located
                                    car_h = cy2 - cy1
                                    plate_area = frame[int(cy1 + car_h*0.5):cy2, cx1:cx2]
                                    
                                    # OCR reader
                                    ocr_results = ocr_reader.readtext(plate_area)
                                    for ocr_box, ocr_text, ocr_prob in ocr_results:
                                        # Clean text
                                        clean_text = "".join([c.upper() for c in ocr_text if c.isalnum() or c == '-'])
                                        if len(clean_text) > 4:
                                            plate = clean_text
                                            break
                                except Exception as ocr_err:
                                    print(f"OCR Error: {ocr_err}")

                            # Fallback to Mock Plate if OCR failed or empty
                            if not plate:
                                plate = random.choice(MOCK_PLATES)
                                print(f"[{time.strftime('%H:%M:%S')}] {YELLOW}[!] Nhận dạng OCR không đọc được chữ, tự động sinh biển số: {plate}{RESET}")
                            else:
                                print(f"[{time.strftime('%H:%M:%S')}] {GREEN}[✓] AI Nhận Diện Thành Công Biển Số Thật: {plate}{RESET}")
                            
                            # Publish to MQTT
                            payload = {
                                "type": event_type,
                                "licensePlate": plate,
                                "timestamp": new_timestamp()
                            }
                            client.publish(TOPIC_GATE, json.dumps(payload), qos=1)

                # Draw trigger line
                cv2.line(frame, (0, line_y), (frame.shape[1], line_y), (0, 0, 255), 2)
                cv2.putText(frame, "TRIGGER LINE (AI INFERENCE)", (20, line_y - 10), 
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)

                # Show frame
                cv2.imshow("SmartPark 3D - YOLOv8 Live Inference", frame)
                if cv2.waitKey(25) & 0xFF == ord('q'):
                    break
                    
            cap.release()
            cv2.destroyAllWindows()
            
        except Exception as e:
            print(f"{RED}[!] Lỗi chạy YOLOv8: {e}. Đang chuyển về chế độ giả lập...{RESET}")
            run_mock_cv2_window(client)
    else:
        # Fallback to Mock window if libraries/video not found
        if HAS_CV2:
            run_mock_cv2_window(client)
        else:
            # Command line simulation if CV2 is also missing
            print(f"{YELLOW}[i] Không có thư viện OpenCV hoặc GUI. Chạy mô phỏng qua Terminal...{RESET}")
            try:
                while True:
                    time.sleep(12)
                    event_type = "entry" if random.random() > 0.4 else "exit"
                    plate = random.choice(MOCK_PLATES)
                    payload = {
                        "type": event_type,
                        "licensePlate": plate,
                        "timestamp": new_timestamp()
                    }
                    client.publish(TOPIC_GATE, json.dumps(payload), qos=1)
                    print(f"[{time.strftime('%H:%M:%S')}] {CYAN}📷 (Terminal Mock) YOLOv8: Xe {event_type} - Biển số: {plate}{RESET}")
            except KeyboardInterrupt:
                pass

    client.loop_stop()
    client.disconnect()
    print(f"\n{GREEN}[✓] Đã ngắt kết nối an toàn. Kết thúc kịch bản YOLOv8.{RESET}")

if __name__ == "__main__":
    main()
