import React from 'react';
import { Play, BarChart2, Clock, Target, DollarSign, CheckCircle2, LayoutGrid, Zap, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import ParticleBackground from './ParticleBackground';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const Hero = () => {
  const [showDemo, setShowDemo] = React.useState(false);

  return (
    <section className="relative min-h-screen pt-28 pb-20 flex items-center overflow-hidden">
      <ParticleBackground />

      <div className="absolute top-0 left-0 w-full h-full -z-[1]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-blue/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-violet/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue text-xs font-semibold uppercase tracking-wider mb-6">
              <Zap size={14} className="text-neon-orange" />
              Giải Pháp Đô Thị Thông Minh Dành Cho Tương Lai
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold leading-tight mb-6">
              Số Hóa Toàn Diện Bãi Đỗ Xe Với{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue to-neon-green">
                Trí Tuệ Nhân Tạo & IoT
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-gray-400 text-lg md:text-xl leading-relaxed mb-8">
              Hệ thống tự động nhận diện phương tiện và biển số thời gian thực bằng thuật toán Deep Learning (YOLOv8). Xử lý linh hoạt tại biên (Edge AI) kết hợp cùng vi điều khiển ESP32, mang lại trải nghiệm đỗ xe không chạm với độ trễ dưới 1 giây.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 mb-12">
              <button onClick={() => setShowDemo(true)} className="flex items-center gap-2 px-6 py-3.5 bg-cyber-blue text-white font-bold rounded-lg hover:bg-cyber-blue/90 transition-all duration-300 box-glow group">
                <Play size={20} className="fill-white group-hover:scale-110 transition-transform" />
                Xem Video Demo Thực Tế
              </button>
              <Link to="/dashboard" className="flex items-center gap-2 px-6 py-3.5 bg-transparent border border-white/20 text-gray-300 font-medium rounded-lg hover:bg-white/5 hover:text-white hover:border-white/40 transition-all duration-300">
                <BarChart2 size={20} className="text-cyber-blue" />
                Trải Nghiệm Web Dashboard
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock size={18} className="text-neon-orange" />
                <span><strong className="text-white">&lt; 1s</strong> Độ trễ thời gian thực</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Target size={18} className="text-neon-green" />
                <span><strong className="text-white">92.3%</strong> Độ chính xác mAP</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <DollarSign size={18} className="text-cyber-blue" />
                <span><strong className="text-white">-80%</strong> Chi phí so với thị trường</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="relative mt-10 lg:mt-0"
          >
            <div className="absolute inset-0 bg-cyber-blue/10 blur-3xl rounded-full"></div>

            <div className="relative bg-gradient-to-br from-cyber-light/50 to-cyber-dark/80 border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(14,165,233,0.1)] z-10 aspect-video">
              <video
                autoPlay loop muted playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-60"
                src="/BaiDoXeAIThongMinh/videos/hero.mp4"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-cyber-light/20 to-transparent">
                <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-blue/60 to-transparent animate-scan" />
                <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-cyber-blue/40 rounded-tl" />
                <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-cyber-blue/40 rounded-tr" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-cyber-blue/40 rounded-bl" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-cyber-blue/40 rounded-br" />
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-3 text-[10px] text-cyber-blue/60 font-mono">
                  <span className="animate-glow-pulse">● LIVE</span>
                  <span>FPS: 30</span>
                  <span className="hidden sm:inline">RES: 640×480</span>
                </div>

                <motion.div
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 0.4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-[20%] left-[28%] w-[34%] h-[30%] border-2 border-neon-green/60 bg-neon-green/5 rounded"
                >
                  <div className="absolute -top-5 left-[-2px] bg-neon-green text-white text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap">
                    Car 0.92
                  </div>
                </motion.div>

                <motion.div
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                  className="absolute top-[55%] right-[18%] w-[28%] h-[26%] border-2 border-neon-orange/60 bg-neon-orange/5 rounded"
                >
                  <div className="absolute -top-5 left-[-2px] bg-neon-orange text-white text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap">
                    Motorbike 0.88
                  </div>
                </motion.div>

                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                  className="absolute top-[62%] left-[10%] w-[20%] h-[24%] border-2 border-cyber-blue/50 bg-cyber-blue/5 rounded"
                >
                  <div className="absolute -top-5 left-[-2px] bg-cyber-blue/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap">
                    Truck 0.85
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1, ease: 'easeOut' }}
              className="absolute -left-8 md:-left-12 top-1/4 bg-cyber-dark/90 backdrop-blur border border-white/10 p-3 rounded-xl shadow-lg z-20 animate-float flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center text-neon-green">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Biển số nhận diện</p>
                <p className="text-sm font-mono font-bold text-white tracking-wider">43A-123.45 <span className="text-neon-green ml-1 text-xs">OK</span></p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.2, ease: 'easeOut' }}
              className="absolute -right-4 md:-right-8 bottom-1/4 bg-cyber-dark/90 backdrop-blur border border-white/10 p-3 rounded-xl shadow-lg z-20 animate-float-delayed flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-cyber-blue/20 flex items-center justify-center text-cyber-blue">
                <LayoutGrid size={16} />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Trạng thái bãi đỗ</p>
                <p className="text-sm font-bold text-white">Trống <span className="text-cyber-blue">5/12</span> chỗ</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {showDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDemo(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border border-white/10"
            >
              <video
                autoPlay controls playsInline
                className="w-full h-full object-cover"
                src="/BaiDoXeAIThongMinh/videos/demo.mp4"
              />
              <button
                onClick={() => setShowDemo(false)}
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                aria-label="Đóng video"
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
