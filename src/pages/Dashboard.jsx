import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Car, Clock, Activity, LogIn, LogOut, Circle } from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const DAYS = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];

const TIMELINE = [
  { second: 0, occupied: 5 }, { second: 27, occupied: 6 }, { second: 33, occupied: 6 },
  { second: 42, occupied: 7 }, { second: 51, occupied: 7 }, { second: 77, occupied: 6 },
  { second: 80, occupied: 6 }, { second: 90, occupied: 5 }, { second: 104, occupied: 5 },
];

const ACTIVITY_EVENTS = [
  { at: 27, plate: '43A-123.45', type: 'Ô tô', action: 'Vào' },
  { at: 42, plate: '75C-111.22', type: 'Ô tô', action: 'Vào' },
  { at: 77, plate: '92B-678.90', type: 'Xe máy', action: 'Ra' },
  { at: 90, plate: '29E-456.78', type: 'Xe tải', action: 'Ra' },
];

const getSlotState = (count) =>
  Array.from({ length: 12 }, (_, i) => ({ id: i + 1, occupied: i < count }));

const HOURS_DATA = [
  { hour: '08:00', value: 5 }, { hour: '09:00', value: 7 },
  { hour: '10:00', value: 10 }, { hour: '11:00', value: 9 },
  { hour: '12:00', value: 8 }, { hour: '13:00', value: 6 },
  { hour: '14:00', value: 7 }, { hour: '15:00', value: 8 },
];

const Dashboard = () => {
  const [time, setTime] = useState(new Date());
  const [slots, setSlots] = useState(() => getSlotState(5));
  const [stats, setStats] = useState({ total: 5, free: 7, entered: 42, exited: 35 });
  const [activityLog, setActivityLog] = useState([]);
  const videoRef = useRef(null);

  useEffect(() => {
    const tick = setInterval(() => setTime(new Date()), 1000);
    const sync = setInterval(() => {
      const t = videoRef.current?.currentTime ?? 0;
      let entry = TIMELINE[0];
      for (let i = TIMELINE.length - 1; i >= 0; i--) {
        if (t >= TIMELINE[i].second) { entry = TIMELINE[i]; break; }
      }
      setSlots(getSlotState(entry.occupied));
      setStats({ total: entry.occupied, free: 12 - entry.occupied, entered: Math.floor(42 + t / 2.5), exited: Math.floor(35 + t / 3.5) });
      setActivityLog(ACTIVITY_EVENTS.filter(e => t >= e.at).reverse());
    }, 1000);
    return () => { clearInterval(tick); clearInterval(sync); };
  }, []);

  const pieData = [
    { name: 'Ô tô', value: 65 }, { name: 'Xe máy', value: 25 }, { name: 'Xe tải', value: 10 },
  ];
  const PIE_COLORS = ['#0ea5e9', '#10b981', '#f59e0b'];

  const fmt = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const h = time.getHours().toString().padStart(2, '0');
  const m = time.getMinutes().toString().padStart(2, '0');
  const s = time.getSeconds().toString().padStart(2, '0');

  return (
    <div className="min-h-screen bg-cyber-dark text-white">
      <div className="sticky top-0 z-50 bg-cyber-dark/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-cyber-blue transition-colors text-sm font-medium">
            <ArrowLeft size={18} />
            Về SmartPark
          </Link>
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
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <span className="text-neon-green font-mono">LIVE</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <Car size={20} />, value: stats.total, label: 'Xe trong bãi', color: 'text-cyber-blue', bg: 'bg-cyber-blue/10', border: 'border-cyber-blue/20' },
            { icon: <Circle size={20} />, value: stats.free, label: 'Chỗ trống', color: 'text-neon-green', bg: 'bg-neon-green/10', border: 'border-neon-green/20' },
            { icon: <LogIn size={20} />, value: stats.entered, label: 'Đã vào hôm nay', color: 'text-accent-violet', bg: 'bg-accent-violet/10', border: 'border-accent-violet/20' },
            { icon: <LogOut size={20} />, value: stats.exited, label: 'Đã ra hôm nay', color: 'text-neon-orange', bg: 'bg-neon-orange/10', border: 'border-neon-orange/20' },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`bg-gradient-to-br from-cyber-light/20 to-transparent border ${card.border} rounded-xl p-5`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500 font-medium">{card.label}</span>
                <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center ${card.color}`}>
                  {card.icon}
                </div>
              </div>
              <p className={`text-3xl font-heading font-bold ${card.color}`}>{card.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-gradient-to-br from-cyber-light/20 to-transparent border border-white/10 rounded-xl p-6">
            <h3 className="font-heading font-bold text-white mb-4 flex items-center gap-2">
              <Activity size={18} className="text-cyber-blue" /> Sơ đồ bãi đỗ
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {slots.map((slot) => (
                <motion.div
                  key={slot.id}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 0.3 }}
                  className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-300 ${
                    slot.occupied
                      ? 'bg-red-500/10 border-red-500/40 text-red-400'
                      : 'bg-neon-green/10 border-neon-green/40 text-neon-green'
                  }`}
                >
                  <span className="text-xs font-mono font-bold">{slot.id.toString().padStart(2, '0')}</span>
                  <span className="text-[9px] mt-0.5">{slot.occupied ? 'Có xe' : 'Trống'}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-gradient-to-br from-cyber-light/20 to-transparent border border-white/10 rounded-xl p-6">
            <h3 className="font-heading font-bold text-white mb-3 flex items-center gap-2">
              <Activity size={18} className="text-cyber-blue" /> Camera
            </h3>
            <div className="relative aspect-video bg-black/50 rounded-lg overflow-hidden border border-white/10 mb-3">
              <video
                ref={videoRef}
                autoPlay loop muted playsInline
                className="absolute inset-0 w-full h-full object-cover"
                src="/BaiDoXeAIThongMinh/videos/demo.mp4"
              />
              <div className="absolute inset-0">
                <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyber-blue/50 to-transparent animate-scan" />
                <div className="absolute top-2 left-2 flex items-center gap-2 text-[9px] text-cyber-blue/60 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                  CAM-01
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
              <span>YOLOv8 · Real-time · 30 FPS</span>
              <span className="text-cyber-blue/60">ANPR · Nhận diện biển số</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-cyber-light/20 to-transparent border border-white/10 rounded-xl p-6">
            <h3 className="font-heading font-bold text-white mb-4 text-sm">Hoạt động gần đây</h3>
            <div className="space-y-2">
              {activityLog.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.action === 'Vào' ? 'bg-neon-green' : 'bg-gray-500'}`} />
                    <div>
                      <p className="text-sm font-mono font-bold text-white">{item.plate}</p>
                      <p className="text-[10px] text-gray-500">{item.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-300 font-medium">{fmt(item.at)}</p>
                    <p className={`text-[10px] font-medium ${item.action === 'Vào' ? 'text-neon-green' : 'text-gray-400'}`}>
                      {item.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-cyber-light/20 to-transparent border border-white/10 rounded-xl p-6">
              <h3 className="font-heading font-bold text-white mb-4 text-sm">Lưu lượng xe theo giờ</h3>
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={HOURS_DATA}>
                  <defs>
                    <linearGradient id="hGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} fill="url(#hGrad)" dot={false} />
                  <Tooltip contentStyle={{ background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gradient-to-br from-cyber-light/20 to-transparent border border-white/10 rounded-xl p-6">
              <h3 className="font-heading font-bold text-white mb-4 text-sm">Phân loại phương tiện</h3>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width={120} height={120}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value" paddingAngle={3}>
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {pieData.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                      <span className="text-gray-400">{item.name}</span>
                      <span className="text-white font-bold">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
