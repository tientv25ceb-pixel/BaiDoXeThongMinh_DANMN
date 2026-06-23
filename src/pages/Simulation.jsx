import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import mqtt from 'mqtt';
import { ArrowLeft, Clock, Activity, ShieldAlert, Play, Pause, RefreshCw } from 'lucide-react';
import ParkingLot3D from '../components/ParkingLot3D';

// Predefined vibrant car colors for occupied spots
const CAR_COLORS = [
  '#3b82f6', // Indigo Blue
  '#ef4444', // Tomato Red
  '#f59e0b', // Amber Gold
  '#10b981', // Emerald Green
  '#8b5cf6', // Purple Rain
  '#ec4899', // Hot Pink
  '#06b6d4', // Cyan Wave
  '#9ca3af', // Metallic Silver
];

// Helper to get random item from array
const getRandomColor = () => CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)];

// MQTT Configuration
const MQTT_BROKER = 'wss://broker.emqx.io:8084/mqtt';
const TOPIC_PREFIX = 'smartpark3d/5ed8f481';
const TOPIC_SLOTS = `${TOPIC_PREFIX}/slots`;
const TOPIC_GATE = `${TOPIC_PREFIX}/gate`;
const TOPIC_ALARM = `${TOPIC_PREFIX}/alarm`;

const DAYS = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];

const Simulation = () => {
  const [time, setTime] = useState(new Date());

  // Initialize slots state (12 positions: 4 Left, 4 Right, 4 Bottom)
  const [slots, setSlots] = useState(() => {
    const labels = [
      'L1', 'L2', 'L3', 'L4', // Left
      'R1', 'R2', 'R3', 'R4', // Right
      'B1', 'B2', 'B3', 'B4', // Bottom
    ];
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      label: labels[i],
      status: i % 3 === 0 ? 'occupied' : 'empty', // Pre-fill some slots for nice initial display
      carColor: getRandomColor(),
    }));
  });

  // Alarm states (Fire Alarm, Full Parking Alarm)
  const [alarmState, setAlarmState] = useState({
    fire: false,
    full: false,
  });

  // Gate License Plate History Logs
  const [historyLogs, setHistoryLogs] = useState([]);

  // Toast Notification state
  const [toast, setToast] = useState(null);

  // Simulation mode active state (local simulator) - Default to true to auto-start
  const [isSimulating, setIsSimulating] = useState(true);
  
  // Connection status
  const [mqttStatus, setMqttStatus] = useState('connecting');

  // Key state used to force re-render the 3D Canvas and reset the camera angle/controls
  const [canvasKey, setCanvasKey] = useState(0);

  // MQTT Client Reference
  const mqttClientRef = useRef(null);

  // Trigger temporary Toast popup
  const triggerToast = (message) => {
    setToast(message);
    // Clear toast after 4 seconds
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Clock tick effect
  useEffect(() => {
    const tick = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  // Connect to MQTT Broker
  useEffect(() => {
    console.log('Connecting to MQTT Broker:', MQTT_BROKER);
    const client = mqtt.connect(MQTT_BROKER, {
      clientId: `smartpark3d_web_${Math.random().toString(16).substr(2, 8)}`,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 2000,
    });

    client.on('connect', () => {
      console.log('Connected to MQTT successfully!');
      setMqttStatus('connected');
      
      // Subscribe to topics
      client.subscribe([TOPIC_SLOTS, TOPIC_GATE, TOPIC_ALARM], (err) => {
        if (!err) {
          console.log('Subscribed to topics:', [TOPIC_SLOTS, TOPIC_GATE, TOPIC_ALARM]);
        } else {
          console.error('Subscription error:', err);
        }
      });
    });

    client.on('message', (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        console.log(`Received MQTT [${topic}]:`, payload);

        if (topic === TOPIC_SLOTS) {
          // Update parking slot state
          const { slotId, status, carColor } = payload;
          if (slotId !== undefined && slotId >= 0 && slotId < 12) {
            setSlots((prevSlots) =>
              prevSlots.map((slot) => {
                if (slot.id === slotId) {
                  return {
                    ...slot,
                    status: status === 'occupied' ? 'occupied' : 'empty',
                    carColor: carColor || slot.carColor,
                  };
                }
                return slot;
              })
            );
            
            // Notify via toast
            const label = slots[slotId]?.label || `Slot ${slotId + 1}`;
            triggerToast(
              status === 'occupied' 
                ? `📥 Cảm biến báo: Xe vừa đỗ vào ô ${label}!` 
                : `📤 Cảm biến báo: Ô đỗ ${label} đã trống!`
            );
          }
        } else if (topic === TOPIC_GATE) {
          // AI Gate recognition log
          const { type, licensePlate, timestamp } = payload;
          const newLog = {
            id: Date.now() + Math.random(),
            type: type === 'entry' ? 'entry' : 'exit',
            licensePlate: licensePlate || 'CHƯA RÕ',
            time: timestamp ? new Date(timestamp).toLocaleTimeString() : new Date().toLocaleTimeString(),
          };

          // Append to log history (newest first)
          setHistoryLogs((prev) => [newLog, ...prev].slice(0, 15));

          // Trigger toast
          triggerToast(
            type === 'entry'
              ? `🚘 YOLOv8: Xe vào cổng - Biển số: ${newLog.licensePlate}`
              : `🚙 YOLOv8: Xe ra cổng - Biển số: ${newLog.licensePlate}`
          );
        } else if (topic === TOPIC_ALARM) {
          // Alarm controls (Fire Alarm, Full Parking)
          const { type, active } = payload;
          setAlarmState((prev) => {
            const nextAlarm = { ...prev, [type]: active };
            
            if (type === 'fire') {
              if (active) {
                triggerToast('🚨 HỆ THỐNG CẢNH BÁO: BÁO ĐỘNG HỎA HOẠN KÍCH HOẠT!');
              } else {
                triggerToast('✅ Đã tắt báo động hỏa hoạn. Bãi đỗ xe an toàn.');
              }
            }
            return nextAlarm;
          });
        }
      } catch (err) {
        console.error('Failed to parse MQTT message payload:', err);
      }
    });

    client.on('error', (err) => {
      console.error('MQTT connection error:', err);
      setMqttStatus('error');
    });

    client.on('close', () => {
      console.warn('MQTT Connection closed.');
      setMqttStatus('disconnected');
    });

    mqttClientRef.current = client;

    return () => {
      if (client) client.end();
    };
  }, []);

  // Auto simulation interval effect (local simulation fallback)
  useEffect(() => {
    let intervalId;
    if (isSimulating) {
      intervalId = setInterval(() => {
        // Pick a random slot to toggle
        const randomIndex = Math.floor(Math.random() * 12);
        const slot = slots[randomIndex];
        const nextStatus = slot.status === 'empty' ? 'occupied' : 'empty';
        const payload = {
          slotId: randomIndex,
          status: nextStatus,
          carColor: nextStatus === 'occupied' ? getRandomColor() : slot.carColor,
        };

        const randomPlates = ['29A-123.45', '30F-987.65', '51G-888.88', '43B-555.22', '36A-333.66', '75A-099.99'];
        const plate = randomPlates[Math.floor(Math.random() * randomPlates.length)];
        const gatePayload = {
          type: nextStatus === 'occupied' ? 'entry' : 'exit',
          licensePlate: plate,
          timestamp: new Date().toISOString(),
        };

        // Publish to MQTT to simulate actual IoT sensor dispatch
        if (mqttClientRef.current && mqttClientRef.current.connected) {
          mqttClientRef.current.publish(TOPIC_SLOTS, JSON.stringify(payload), { qos: 1 });
          // Simulates vehicle entering/exiting the gate at logical times
          setTimeout(() => {
            if (mqttClientRef.current && mqttClientRef.current.connected) {
              mqttClientRef.current.publish(TOPIC_GATE, JSON.stringify(gatePayload), { qos: 1 });
            }
          }, nextStatus === 'occupied' ? 0 : 1500);
        } else {
          // Fallback to local state update if MQTT is disconnected
          handleToggleSlot(randomIndex);
          
          // Local gate event fallback
          setTimeout(() => {
            const newLog = {
              id: Date.now() + Math.random(),
              type: nextStatus === 'occupied' ? 'entry' : 'exit',
              licensePlate: plate,
              time: new Date().toLocaleTimeString(),
            };
            setHistoryLogs((prev) => [newLog, ...prev].slice(0, 15));
            triggerToast(
              newLog.type === 'entry'
                ? `🚘 Auto YOLOv8: Xe vào cổng - Biển số: ${plate}`
                : `🚙 Auto YOLOv8: Xe ra cổng - Biển số: ${plate}`
            );
          }, nextStatus === 'occupied' ? 0 : 1200);
        }
      }, 3500);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isSimulating, slots]);

  // Toggle single slot status (Updates state and publishes to MQTT)
  const handleToggleSlot = (id) => {
    const slot = slots.find((s) => s.id === id);
    if (!slot) return;

    const nextStatus = slot.status === 'empty' ? 'occupied' : 'empty';
    const payload = {
      slotId: id,
      status: nextStatus,
      carColor: nextStatus === 'occupied' ? getRandomColor() : slot.carColor,
    };

    if (mqttClientRef.current && mqttClientRef.current.connected) {
      mqttClientRef.current.publish(TOPIC_SLOTS, JSON.stringify(payload), { qos: 1 });
    } else {
      // Local fallback
      setSlots((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: nextStatus, carColor: payload.carColor } : s))
      );
    }
  };

  // Change specific car color
  const handleChangeCarColor = (id, color) => {
    const slot = slots.find((s) => s.id === id);
    if (!slot) return;

    const payload = {
      slotId: id,
      status: 'occupied',
      carColor: color,
    };

    if (mqttClientRef.current && mqttClientRef.current.connected) {
      mqttClientRef.current.publish(TOPIC_SLOTS, JSON.stringify(payload), { qos: 1 });
    } else {
      // Local fallback
      setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, carColor: color } : s)));
    }
  };

  // Quick Action: Fill all slots with cars
  const handleFillAll = () => {
    slots.forEach((slot) => {
      if (slot.status === 'empty') {
        const payload = {
          slotId: slot.id,
          status: 'occupied',
          carColor: getRandomColor(),
        };
        if (mqttClientRef.current && mqttClientRef.current.connected) {
          mqttClientRef.current.publish(TOPIC_SLOTS, JSON.stringify(payload));
        }
      }
    });
    // Local fallback update for instant responsiveness
    setSlots((prev) =>
      prev.map((s) => ({ ...s, status: 'occupied', carColor: s.status === 'empty' ? getRandomColor() : s.carColor }))
    );
  };

  // Quick Action: Clear all spots
  const handleClearAll = () => {
    slots.forEach((slot) => {
      if (slot.status === 'occupied') {
        const payload = {
          slotId: slot.id,
          status: 'empty',
        };
        if (mqttClientRef.current && mqttClientRef.current.connected) {
          mqttClientRef.current.publish(TOPIC_SLOTS, JSON.stringify(payload));
        }
      }
    });
    // Local fallback update
    setSlots((prev) => prev.map((s) => ({ ...s, status: 'empty' })));
  };

  // Quick Action: Randomize spot occupancy states
  const handleRandomize = () => {
    slots.forEach((slot) => {
      const nextStatus = Math.random() > 0.5 ? 'occupied' : 'empty';
      const payload = {
        slotId: slot.id,
        status: nextStatus,
        carColor: nextStatus === 'occupied' ? getRandomColor() : slot.carColor,
      };
      if (mqttClientRef.current && mqttClientRef.current.connected) {
        mqttClientRef.current.publish(TOPIC_SLOTS, JSON.stringify(payload));
      }
    });
  };

  // Toggle fire alarm state (broadcasts via MQTT)
  const handleToggleFireAlarm = () => {
    const nextActive = !alarmState.fire;
    const payload = { type: 'fire', active: nextActive };
    
    if (mqttClientRef.current && mqttClientRef.current.connected) {
      mqttClientRef.current.publish(TOPIC_ALARM, JSON.stringify(payload), { qos: 1, retain: true });
    } else {
      // Local fallback
      setAlarmState((prev) => ({ ...prev, fire: nextActive }));
      triggerToast(nextActive ? '🚨 BÁO ĐỘNG HỎA HOẠN KÍCH HOẠT!' : '✅ Đã tắt báo động hỏa hoạn.');
    }
  };

  // Toggle full alarm state (broadcasts via MQTT)
  const handleToggleFullAlarm = () => {
    const nextActive = !alarmState.full;
    const payload = { type: 'full', active: nextActive };
    
    if (mqttClientRef.current && mqttClientRef.current.connected) {
      mqttClientRef.current.publish(TOPIC_ALARM, JSON.stringify(payload), { qos: 1, retain: true });
    } else {
      // Local fallback
      setAlarmState((prev) => ({ ...prev, full: nextActive }));
    }
  };

  // Generate Mock YOLOv8 plate recognition event (simulate local trigger)
  const handleTriggerMockGate = (type) => {
    const plates = ['29A-123.45', '30F-987.65', '51G-888.88', '43B-555.22', '36A-333.66', '75A-099.99'];
    const randomPlate = plates[Math.floor(Math.random() * plates.length)];
    const payload = {
      type: type, // 'entry' | 'exit'
      licensePlate: randomPlate,
      timestamp: new Date().toISOString(),
    };

    if (mqttClientRef.current && mqttClientRef.current.connected) {
      mqttClientRef.current.publish(TOPIC_GATE, JSON.stringify(payload), { qos: 1 });
    } else {
      // Local fallback trigger
      const newLog = {
        id: Date.now(),
        type: type,
        licensePlate: randomPlate,
        time: new Date().toLocaleTimeString(),
      };
      setHistoryLogs((prev) => [newLog, ...prev].slice(0, 15));
      triggerToast(
        type === 'entry'
          ? `🚘 Mock YOLOv8: Xe vào cổng - Biển số: ${randomPlate}`
          : `🚙 Mock YOLOv8: Xe ra cổng - Biển số: ${randomPlate}`
      );
    }
  };

  // Trigger camera view reset
  const handleResetCamera = () => {
    setCanvasKey((prev) => prev + 1);
  };

  // Stats calculation
  const totalSlots = slots.length;
  const occupiedCount = slots.filter((s) => s.status === 'occupied').length;
  const emptyCount = totalSlots - occupiedCount;
  const occupancyRate = Math.round((occupiedCount / totalSlots) * 100);

  const h = time.getHours().toString().padStart(2, '0');
  const m = time.getMinutes().toString().padStart(2, '0');
  const s = time.getSeconds().toString().padStart(2, '0');

  return (
    <div className={`min-h-screen bg-cyber-dark text-white flex flex-col ${alarmState.fire ? 'fire-alarm-active' : ''}`}>
      {/* Emergency flashing banner */}
      {alarmState.fire && (
        <div className="emergency-banner" id="fire-alarm-banner">
          ⚠️ Cảnh Báo Nguy Hiểm: Phát Hiện Báo Động Hỏa Hoạn Tại Bãi Xe! Sơ Tán Khẩn Cấp! ⚠️
        </div>
      )}

      {/* Full parking warning banner */}
      {alarmState.full && (
        <div className="full-alarm-banner" id="full-alarm-banner">
          🚫 THÔNG BÁO: BÃI ĐỖ XE ĐÃ ĐẦY VỊ TRÍ - VUI LÒNG KHÔNG ĐI VÀO 🚫
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-50 bg-cyber-dark/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-cyber-blue transition-colors text-sm font-medium">
              <ArrowLeft size={18} />
              Về SmartPark
            </Link>
            <Link to="/dashboard" className="flex items-center gap-1.5 text-gray-400 hover:text-cyber-blue transition-colors text-sm font-medium">
              <Activity size={16} />
              Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="flex items-center gap-2 text-lg font-mono font-bold text-white tracking-wider">
                <Clock size={16} className="text-cyber-blue" />
                {h}:{m}:{s}
              </div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                {DAYS[time.getDay()]}, {time.getDate().toString().padStart(2, '0')}/{(time.getMonth() + 1).toString().padStart(2, '0')}/{time.getFullYear()}
              </p>
            </div>
            
            {/* MQTT Connection Status Tag */}
            <span 
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-white/10"
              style={{ 
                borderColor: mqttStatus === 'connected' ? 'var(--success-border)' : 'var(--danger-border)',
                backgroundColor: mqttStatus === 'connected' ? 'var(--success-bg)' : 'var(--danger-bg)',
                color: mqttStatus === 'connected' ? 'var(--success)' : 'var(--danger)',
              }}
            >
              <span className={`w-2 h-2 rounded-full ${mqttStatus === 'connected' ? 'bg-success animate-pulse' : 'bg-danger'}`} 
                style={{ backgroundColor: mqttStatus === 'connected' ? 'var(--success)' : 'var(--danger)' }}
              />
              IoT Broker: {mqttStatus === 'connected' ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="app-container">
        {/* Left Side: Control Dashboard Panel */}
        <section className="panel" aria-label="Bảng điều khiển trạng thái">
          <h2 className="panel-title">📊 Trạng Thái Bãi Đỗ</h2>
          
          {/* Statistical summary cards */}
          <div className="stat-grid">
            <div className="stat-card">
              <span className="stat-label">Tổng vị trí</span>
              <span className="stat-value">{totalSlots}</span>
            </div>
            <div className="stat-card empty">
              <span className="stat-label">Đang Trống</span>
              <span className="stat-value">{emptyCount}</span>
            </div>
            <div className="stat-card occupied">
              <span className="stat-label">Đang Đỗ</span>
              <span className="stat-value">{occupiedCount}</span>
            </div>
            <div className="stat-card" style={{ borderColor: alarmState.full ? 'var(--danger)' : 'var(--border-card)' }}>
              <span className="stat-label">Lấp Đầy</span>
              <span className="stat-value" style={{ color: alarmState.full ? 'var(--danger)' : 'var(--text-primary)' }}>
                {occupancyRate}%
              </span>
            </div>
          </div>

          {/* Quick simulation / layout actions */}
          <div className="action-group" style={{ marginBottom: '10px' }}>
            <button id="fill-all-btn" className="btn btn-primary" onClick={handleFillAll}>
              Đỗ tất cả
            </button>
            <button id="clear-all-btn" className="btn" onClick={handleClearAll}>
              Giải phóng
            </button>
            <button id="random-btn" className="btn" onClick={handleRandomize}>
              Ngẫu nhiên
            </button>
          </div>

          {/* Main Simulation Control Button */}
          <button 
            id="simulation-main-btn" 
            className={`btn ${isSimulating ? 'btn-active' : 'btn-primary'}`}
            style={{ 
              width: '100%', 
              padding: '12.5px', 
              fontSize: '13px',
              fontWeight: '700',
              borderRadius: '10px',
              border: isSimulating ? '1px solid var(--success-border)' : '1px solid var(--accent)',
              background: isSimulating ? 'var(--success-bg)' : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: isSimulating ? 'var(--success)' : '#ffffff',
              boxShadow: isSimulating ? '0 0 15px rgba(16, 185, 129, 0.2)' : '0 4px 12px rgba(2, 132, 199, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: '10px'
            }}
            onClick={() => setIsSimulating(!isSimulating)}
          >
            {isSimulating ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
                ⏹️ DỪNG MÔ PHỎNG TỰ ĐỘNG
              </>
            ) : (
              <>
                ▶️ BẮT ĐẦU MÔ PHỎNG TỰ ĐỘNG
              </>
            )}
          </button>

          {/* Auto Simulation Mode Toggle Switch */}
          <div className="simulation-panel" style={{ borderTop: '1px dashed rgba(255, 255, 255, 0.08)', paddingTop: '10px' }}>
            <div className="simulation-control">
              <span className="simulation-label flex items-center gap-1.5">
                {isSimulating ? <Play size={14} className="text-neon-green" /> : <Pause size={14} className="text-gray-400" />}
                Trạng thái hoạt động
              </span>
              <label className="switch" htmlFor="sim-toggle-checkbox">
                <input
                  id="sim-toggle-checkbox"
                  type="checkbox"
                  checked={isSimulating}
                  onChange={(e) => setIsSimulating(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          {/* Interactive slots grid (3 rows x 4 columns) */}
          <h2 className="panel-title" style={{ marginTop: '5px' }}>🚗 Quản Lý Vị Trí Chi Tiết</h2>
          <div className="slots-grid-container">
            {/* Row 1: Cánh Trái (L1 - L4) */}
            <div className="slots-grid-row">
              <div className="slots-row-header">
                <span>Cánh Trái (Left Row)</span>
                <span>Vị trí 1 - 4</span>
              </div>
              <div className="slots-row-grid">
                {slots.slice(0, 4).map((slot) => {
                  const isOccupied = slot.status === 'occupied';
                  return (
                    <div
                      id={`slot-card-${slot.id}`}
                      key={slot.id}
                      className={`slot-card ${slot.status}`}
                      style={{
                        borderColor: isOccupied ? `${slot.carColor}a0` : 'var(--success-border)',
                        boxShadow: isOccupied ? `0 0 8px ${slot.carColor}33` : 'none',
                      }}
                      onClick={() => handleToggleSlot(slot.id)}
                      title={`Click để chuyển trạng thái Vị trí ${slot.id + 1} (${slot.label})`}
                    >
                      {isOccupied && (
                        <div
                          className="slot-card-color-dot"
                          style={{ backgroundColor: slot.carColor }}
                          onClick={(e) => {
                            e.stopPropagation();
                            const currentIndex = CAR_COLORS.indexOf(slot.carColor);
                            const nextIndex = (currentIndex + 1) % CAR_COLORS.length;
                            handleChangeCarColor(slot.id, CAR_COLORS[nextIndex]);
                          }}
                          title="Click để đổi màu xe"
                        />
                      )}
                      <span className="slot-card-label">{slot.label}</span>
                      <span className="slot-card-status">{isOccupied ? '🚗' : '🅿️'}</span>
                      <span className={`slot-card-badge ${slot.status}`}>
                        {isOccupied ? 'Có xe' : 'Trống'}
                      </span>
                      <span className="slot-card-number">#{String(slot.id + 1).padStart(2, '0')}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Row 2: Cánh Phải (R1 - R4) */}
            <div className="slots-grid-row">
              <div className="slots-row-header">
                <span>Cánh Phải (Right Row)</span>
                <span>Vị trí 5 - 8</span>
              </div>
              <div className="slots-row-grid">
                {slots.slice(4, 8).map((slot) => {
                  const isOccupied = slot.status === 'occupied';
                  return (
                    <div
                      id={`slot-card-${slot.id}`}
                      key={slot.id}
                      className={`slot-card ${slot.status}`}
                      style={{
                        borderColor: isOccupied ? `${slot.carColor}a0` : 'var(--success-border)',
                        boxShadow: isOccupied ? `0 0 8px ${slot.carColor}33` : 'none',
                      }}
                      onClick={() => handleToggleSlot(slot.id)}
                      title={`Click để chuyển trạng thái Vị trí ${slot.id + 1} (${slot.label})`}
                    >
                      {isOccupied && (
                        <div
                          className="slot-card-color-dot"
                          style={{ backgroundColor: slot.carColor }}
                          onClick={(e) => {
                            e.stopPropagation();
                            const currentIndex = CAR_COLORS.indexOf(slot.carColor);
                            const nextIndex = (currentIndex + 1) % CAR_COLORS.length;
                            handleChangeCarColor(slot.id, CAR_COLORS[nextIndex]);
                          }}
                          title="Click để đổi màu xe"
                        />
                      )}
                      <span className="slot-card-label">{slot.label}</span>
                      <span className="slot-card-status">{isOccupied ? '🚗' : '🅿️'}</span>
                      <span className={`slot-card-badge ${slot.status}`}>
                        {isOccupied ? 'Có xe' : 'Trống'}
                      </span>
                      <span className="slot-card-number">#{String(slot.id + 1).padStart(2, '0')}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Row 3: Hàng Dưới (B1 - B4) */}
            <div className="slots-grid-row">
              <div className="slots-row-header">
                <span>Hàng Dưới (Bottom Row)</span>
                <span>Vị trí 9 - 12</span>
              </div>
              <div className="slots-row-grid">
                {slots.slice(8, 12).map((slot) => {
                  const isOccupied = slot.status === 'occupied';
                  return (
                    <div
                      id={`slot-card-${slot.id}`}
                      key={slot.id}
                      className={`slot-card ${slot.status}`}
                      style={{
                        borderColor: isOccupied ? `${slot.carColor}a0` : 'var(--success-border)',
                        boxShadow: isOccupied ? `0 0 8px ${slot.carColor}33` : 'none',
                      }}
                      onClick={() => handleToggleSlot(slot.id)}
                      title={`Click để chuyển trạng thái Vị trí ${slot.id + 1} (${slot.label})`}
                    >
                      {isOccupied && (
                        <div
                          className="slot-card-color-dot"
                          style={{ backgroundColor: slot.carColor }}
                          onClick={(e) => {
                            e.stopPropagation();
                            const currentIndex = CAR_COLORS.indexOf(slot.carColor);
                            const nextIndex = (currentIndex + 1) % CAR_COLORS.length;
                            handleChangeCarColor(slot.id, CAR_COLORS[nextIndex]);
                          }}
                          title="Click để đổi màu xe"
                        />
                      )}
                      <span className="slot-card-label">{slot.label}</span>
                      <span className="slot-card-status">{isOccupied ? '🚗' : '🅿️'}</span>
                      <span className={`slot-card-badge ${slot.status}`}>
                        {isOccupied ? 'Có xe' : 'Trống'}
                      </span>
                      <span className="slot-card-number">#{String(slot.id + 1).padStart(2, '0')}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Right Side Column: 3D Visualization Viewport & Admin System Control */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flexGrow: 1 }}>
          
          {/* 3D Simulation Viewport Card */}
          <section className="panel-3d" aria-label="Khung nhìn mô phỏng 3D">
            {/* Canvas Floating Info */}
            <div className="canvas-header">
              <span className="canvas-title">Khung Nhìn 3D Bãi Đỗ Xe (Chữ U)</span>
              <span className="canvas-subtitle">Cảm biến LED hồng ngoại & AI Camera</span>
            </div>

            {/* Canvas Action Controls */}
            <div className="canvas-controls">
              <button
                id="reset-cam-btn-viewport"
                className="canvas-btn"
                onClick={handleResetCamera}
                title="Đặt lại camera (Bird-Eye View)"
              >
                <RefreshCw size={18} />
              </button>
            </div>

            {/* 3D ParkingLot Simulation Canvas */}
            <ParkingLot3D 
              key={canvasKey} 
              slots={slots} 
              onToggleSlot={handleToggleSlot} 
              alarmState={alarmState}
            />
          </section>

          {/* Bottom Grid: Admin Emergency Panel & YOLOv8 License Plate History Logs */}
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
            
            {/* Admin Emergency controls card */}
            <section className="panel admin-card" aria-label="Góc Admin hệ thống">
              <h2 className="panel-title" style={{ borderColor: 'rgba(56, 189, 248, 0.3)' }}>
                <ShieldAlert size={18} className="text-cyber-blue" /> Admin Emergency
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '5px' }}>
                <button 
                  id="admin-fire-btn" 
                  className={`btn btn-danger ${alarmState.fire ? 'active' : ''}`}
                  onClick={handleToggleFireAlarm}
                >
                  {alarmState.fire ? '🔥 TẮT BÁO CHÁY KHẨN CẤP' : '🚨 KÍCH HOẠT BÁO CHÁY'}
                </button>

                <button 
                  id="admin-full-btn" 
                  className={`btn btn-warning ${alarmState.full ? 'active' : ''}`}
                  onClick={handleToggleFullAlarm}
                >
                  {alarmState.full ? '⚠️ HUỶ BÁO ĐẦY BÃI' : '⚠️ BÁO ĐẦY BÃI XE'}
                </button>
              </div>

              {/* Simulation triggers */}
              <div style={{ borderTop: '1px dashed rgba(56, 189, 248, 0.2)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  GIẢ LẬP CAMERA CỔNG (YOLOv8 & OCR)
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn" onClick={() => handleTriggerMockGate('entry')} style={{ fontSize: '11px', padding: '8px 10px' }}>
                    📥 Xe vào cổng
                  </button>
                  <button className="btn" onClick={() => handleTriggerMockGate('exit')} style={{ fontSize: '11px', padding: '8px 10px' }}>
                    📤 Xe ra cổng
                  </button>
                </div>
              </div>
            </section>

            {/* YOLOv8 OCR Recognition Feed */}
            <section className="panel" style={{ flexGrow: 1 }} aria-label="Nhật ký nhận diện biển số xe">
              <h2 className="panel-title">
                📷 Nhật Ký Nhận Diện Biển Số Xe (YOLOv8 & OCR)
              </h2>
              
              <div className="history-feed" style={{ marginTop: '5px' }}>
                {historyLogs.length === 0 ? (
                  <div className="history-empty">Chưa ghi nhận sự kiện xe ra vào nào ở cổng...</div>
                ) : (
                  historyLogs.map((log) => (
                    <div key={log.id} className={`history-item ${log.type}`}>
                      <div className="history-item-left">
                        <span className="history-plate">{log.licensePlate}</span>
                        <span className={`history-type-badge ${log.type}`}>
                          {log.type === 'entry' ? 'Lối vào' : 'Lối ra'}
                        </span>
                      </div>
                      <span className="history-time">{log.time}</span>
                    </div>
                  ))
                )}
              </div>
            </section>

          </div>

        </div>
      </div>

      {/* Floating Toast Alerts */}
      {toast && (
        <div className="toast-notification">
          <span>{toast}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-white/10 text-center text-sm text-gray-500">
        <p>Mô phỏng 3D tạo bởi <strong>Antigravity AI</strong> | Sử dụng React Three Fiber & Three.js</p>
      </footer>
    </div>
  );
};

export default Simulation;
