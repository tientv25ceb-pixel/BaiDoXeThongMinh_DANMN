import React, { useState } from 'react';
import { Cpu, BrainCircuit, Server, MonitorSmartphone, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

const TechArchitecture = () => {
  const [activeLayer, setActiveLayer] = useState(null);

  const layers = [
    {
      id: 'hardware',
      title: 'Tầng Thiết bị (Hardware)',
      icon: <Cpu size={24} />,
      techs: ['ESP32-CAM', 'Cảm biến PIR', 'Đèn LED chỉ thị', 'Raspberry Pi'],
      color: 'border-neon-orange text-neon-orange bg-neon-orange/5',
      desc: 'Thu thập dữ liệu môi trường thực tế',
    },
    {
      id: 'ai',
      title: 'Tầng AI (Edge Processing)',
      icon: <BrainCircuit size={24} />,
      techs: ['YOLOv8n', 'EasyOCR', 'Python', 'OpenCV'],
      color: 'border-accent-violet text-accent-violet bg-accent-violet/5',
      desc: 'Nhận diện phương tiện & đọc biển số tại biên',
    },
    {
      id: 'backend',
      title: 'Tầng Backend & Database',
      icon: <Server size={24} />,
      techs: ['Node.js (Express)', 'MQTT (Mosquitto)', 'PostgreSQL 15', 'Redis 7'],
      color: 'border-neon-green text-neon-green bg-neon-green/5',
      desc: 'Xử lý logic, luân chuyển dòng dữ liệu và lưu trữ',
    },
    {
      id: 'frontend',
      title: 'Tầng Frontend Dashboard',
      icon: <MonitorSmartphone size={24} />,
      techs: ['React.js 18', 'Tailwind CSS', 'Recharts', 'Socket.IO Client'],
      color: 'border-cyber-blue text-cyber-blue bg-cyber-blue/5',
      desc: 'Giao diện trực quan, theo dõi thời gian thực',
    },
  ];

  return (
    <section id="architecture" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-96 bg-cyber-blue/5 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Kiến Trúc <span className="text-cyber-blue">Công Nghệ</span>
          </h2>
          <p className="text-gray-400">
            Hệ thống phân tầng rõ ràng, sử dụng các công nghệ hiện đại nhất để đảm bảo hiệu năng và khả năng mở rộng. Trỏ chuột vào từng tầng để xem chi tiết.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {layers.map((layer, index) => (
            <React.Fragment key={layer.id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`w-full md:w-3/4 relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                  activeLayer === layer.id
                    ? `scale-105 shadow-[0_0_30px_rgba(0,0,0,0.5)] ${layer.color}`
                    : 'border-white/10 bg-cyber-dark/50 hover:border-white/30 text-gray-400'
                }`}
                onMouseEnter={() => setActiveLayer(layer.id)}
                onMouseLeave={() => setActiveLayer(null)}
              >
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      activeLayer === layer.id ? layer.color : 'bg-cyber-light'
                    }`}
                  >
                    {layer.icon}
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h3 className={`text-xl font-heading font-bold mb-1 ${activeLayer === layer.id ? '' : 'text-white'}`}>
                      {layer.title}
                    </h3>
                    <p className={`text-sm mb-3 ${activeLayer === layer.id ? 'opacity-80' : 'text-gray-500'}`}>
                      {layer.desc}
                    </p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                      {layer.techs.map((tech, i) => (
                        <span
                          key={i}
                          className={`text-xs px-3 py-1 rounded-full border transition-all duration-300 ${
                            activeLayer === layer.id
                              ? 'border-current bg-current/10 font-medium'
                              : 'border-white/10 bg-white/5 text-gray-400'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {index < layers.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="py-2 text-cyber-blue/40"
                >
                  <ArrowDown size={24} />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechArchitecture;
