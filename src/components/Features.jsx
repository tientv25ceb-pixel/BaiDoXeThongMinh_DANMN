import React from 'react';
import { Camera, LayoutDashboard, BellRing, Database, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <Camera size={28} />,
    title: 'Nhận diện phương tiện & Biển số',
    desc: 'Sử dụng thuật toán YOLOv8 để phát hiện xe và EasyOCR để tự động đọc biển số với độ chính xác cao.',
    color: 'text-cyber-blue',
    bg: 'bg-cyber-blue/5',
    border: 'border-cyber-blue/20',
    hoverBorder: 'group-hover:border-cyber-blue/50',
    glowColor: 'rgba(14,165,233,0.2)',
    span: 'lg:col-span-2',
  },
  {
    icon: <LayoutDashboard size={28} />,
    title: 'Giám sát thời gian thực',
    desc: 'Cập nhật trạng thái chỗ đỗ (trống/có xe) liên tục thông qua Web Dashboard với giao diện trực quan.',
    color: 'text-neon-green',
    bg: 'bg-neon-green/5',
    border: 'border-neon-green/20',
    hoverBorder: 'group-hover:border-neon-green/50',
    glowColor: 'rgba(16,185,129,0.2)',
    span: '',
  },
  {
    icon: <BellRing size={28} />,
    title: 'Cảnh báo thông minh',
    desc: 'Gửi push notification ngay khi bãi đỗ đầy trên 90%, xe đỗ quá giờ hoặc có thiết bị mất kết nối.',
    color: 'text-neon-orange',
    bg: 'bg-neon-orange/5',
    border: 'border-neon-orange/20',
    hoverBorder: 'group-hover:border-neon-orange/50',
    glowColor: 'rgba(245,158,11,0.2)',
    span: '',
  },
  {
    icon: <Database size={28} />,
    title: 'Lưu trữ & Thống kê',
    desc: 'Lưu ảnh thumbnail của xe, biển số nhận diện và phân tích lưu lượng giao thông theo biểu đồ chi tiết.',
    color: 'text-accent-violet',
    bg: 'bg-accent-violet/5',
    border: 'border-accent-violet/20',
    hoverBorder: 'group-hover:border-accent-violet/50',
    glowColor: 'rgba(139,92,246,0.2)',
    span: 'lg:col-span-2',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const Features = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-blue/5 via-transparent to-transparent pointer-events-none"></div>
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Tính Năng <span className="text-cyber-blue">Nổi Bật</span>
          </h2>
          <p className="text-gray-400">
            Trải nghiệm bộ công cụ mạnh mẽ được thiết kế để tối ưu hóa quy trình quản lý và vận hành bãi đỗ xe.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[1fr]"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`group bg-gradient-to-br from-cyber-light/20 to-transparent border ${feature.border} ${feature.hoverBorder} ${feature.span} rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] cursor-pointer relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <ArrowUpRight size={16} className="text-gray-500 absolute top-4 right-4" />
              </div>
              <div
                className={`w-14 h-14 rounded-xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_20px] group-hover:animate-pulse`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-heading font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
