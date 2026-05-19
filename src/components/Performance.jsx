import React from 'react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, RadialBarChart, RadialBar,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';

const latencyData = [
  { time: '08:00', value: 0.85 }, { time: '09:00', value: 0.72 },
  { time: '10:00', value: 0.68 }, { time: '11:00', value: 0.91 },
  { time: '12:00', value: 0.55 }, { time: '13:00', value: 0.63 },
  { time: '14:00', value: 0.78 }, { time: '15:00', value: 0.59 },
  { time: '16:00', value: 0.82 }, { time: '17:00', value: 0.70 },
];

const uptimeData = [
  { day: 'T2', value: 99.8 }, { day: 'T3', value: 99.5 },
  { day: 'T4', value: 99.9 }, { day: 'T5', value: 98.7 },
  { day: 'T6', value: 99.6 }, { day: 'T7', value: 99.4 },
  { day: 'CN', value: 99.7 },
];

const costData = [
  { name: 'SmartPark', cost: 2.5, fill: '#0ea5e9' },
  { name: 'Giải pháp A', cost: 12, fill: '#1a1a2e' },
  { name: 'Giải pháp B', cost: 18, fill: '#1a1a2e' },
  { name: 'Giải pháp C', cost: 25, fill: '#1a1a2e' },
];

const accuracyData = [
  { name: 'mAP@0.5', value: 92.3, fill: '#10b981' },
];

const CustomTooltip = ({ active, payload, label, prefix = '', suffix = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-cyber-dark/95 backdrop-blur border border-white/10 rounded-lg px-3 py-2 shadow-xl text-xs">
        <p className="text-gray-400 mb-1">{label}</p>
        <p className="text-white font-bold">
          {prefix}{payload[0].value}{suffix}
        </p>
      </div>
    );
  }
  return null;
};

const StatCard = ({ icon, value, label, desc, color, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.5, delay }}
    className="bg-gradient-to-br from-cyber-light/20 to-transparent border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
  >
    <div className="text-center mb-4">
      <div className={`w-10 h-10 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-3 ${color}`}>
        {icon}
      </div>
      <h4 className={`text-2xl font-heading font-black mb-1 ${color}`}>
        {value}
      </h4>
      <p className="font-medium text-white text-sm mb-1">{label}</p>
      <p className="text-xs text-gray-500">{desc}</p>
    </div>
    {children && <div className="mt-2">{children}</div>}
  </motion.div>
);

const Performance = () => {
  return (
    <section id="stats" className="py-20 relative border-y border-white/10">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Hiệu Năng <span className="text-cyber-blue">Hệ Thống</span>
          </h2>
          <p className="text-gray-400">
            Dữ liệu đo lường thực tế từ quá trình vận hành và thử nghiệm hệ thống.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            icon={<span className="text-neon-orange font-mono font-bold text-xs">&lt;1s</span>}
            value="&lt; 1s"
            label="Độ Trễ Hệ Thống"
            desc="Từ lúc xe vào đến khi cập nhật Dashboard"
            color="text-neon-orange"
            delay={0}
          >
            <ResponsiveContainer width="100%" height={80}>
              <AreaChart data={latencyData}>
                <defs>
                  <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} fill="url(#latencyGrad)" dot={false} isAnimationActive={true} animationBegin={0} />
                <Tooltip content={<CustomTooltip suffix="s" />} />
              </AreaChart>
            </ResponsiveContainer>
          </StatCard>

          <StatCard
            icon={<span className="text-neon-green font-mono font-bold text-xs">%</span>}
            value="92.3%"
            label="Độ Chính Xác YOLOv8"
            desc="mAP@0.5 nhận dạng phương tiện"
            color="text-neon-green"
            delay={0.1}
          >
              <ResponsiveContainer width="100%" height={80}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="80%" barSize={10} data={accuracyData} startAngle={90} endAngle={-270}>
                  <RadialBar dataKey="value" cornerRadius={6} />
                  <Tooltip content={<CustomTooltip suffix="%" />} />
                </RadialBarChart>
              </ResponsiveContainer>
          </StatCard>

          <StatCard
            icon={<span className="text-cyber-blue font-mono font-bold text-xs">đ</span>}
            value="2,5tr"
            label="VNĐ / Cụm 12 Chỗ"
            desc="Tiết kiệm 70-80% so với thương mại"
            color="text-cyber-blue"
            delay={0.2}
          >
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={costData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" hide />
                <Bar dataKey="cost" radius={[0, 4, 4, 0]} animationBegin={200} />
                <Tooltip content={<CustomTooltip suffix="tr" />} />
              </BarChart>
            </ResponsiveContainer>
          </StatCard>

          <StatCard
            icon={<span className="text-accent-violet font-mono font-bold text-xs">↑</span>}
            value="99.3%"
            label="Uptime Vận Hành"
            desc="Độ ổn định cao trong thử nghiệm"
            color="text-accent-violet"
            delay={0.3}
          >
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={uptimeData}>
                <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={false} isAnimationActive={true} animationBegin={300} />
                <Tooltip content={<CustomTooltip suffix="%" />} />
              </LineChart>
            </ResponsiveContainer>
          </StatCard>
        </div>
      </div>
    </section>
  );
};

export default Performance;
