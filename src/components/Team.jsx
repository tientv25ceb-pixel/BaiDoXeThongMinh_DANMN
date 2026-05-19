import React from 'react';
import { Award, Github, Linkedin, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const students = [
  { name: 'Hoàng Nguyên Phong', role: 'Sinh viên 25CE', initials: 'HP', color: '#0ea5e9' },
  { name: 'Trần Văn Tiền', role: 'Sinh viên 25CE', initials: 'TT', color: '#10b981' },
  { name: 'Lương Văn Lượng', role: 'Sinh viên 25CE', initials: 'LL', color: '#f59e0b' },
  { name: 'Văn Minh Nhật', role: 'Sinh viên 25CE', initials: 'VN', color: '#8b5cf6' },
];

const Team = () => {
  return (
    <section id="team" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-cyber-blue/5 via-transparent to-transparent pointer-events-none"></div>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Đội Ngũ <span className="text-cyber-blue">Phát Triển</span>
          </h2>
          <p className="text-gray-400">
            Dự án là sản phẩm tâm huyết của các sinh viên ngành Công nghệ kỹ thuật máy tính (VKU).
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto mb-16"
        >
          <div className="bg-gradient-to-br from-cyber-light/20 to-transparent border border-neon-orange/20 p-6 rounded-2xl text-center relative overflow-hidden group hover:border-neon-orange/40 transition-all duration-300 cursor-pointer hover:-translate-y-1">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-neon-orange to-transparent opacity-60"></div>
            <div className="w-20 h-20 mx-auto rounded-full bg-neon-orange/10 flex items-center justify-center mb-4 text-neon-orange">
              <Award size={32} />
            </div>
            <p className="text-xs text-neon-orange font-bold uppercase tracking-[0.2em] mb-1">Giảng viên hướng dẫn</p>
            <h3 className="text-xl font-heading font-bold text-white mb-2">ThS. Phan Thị Quỳnh Hương</h3>
            <p className="text-sm text-gray-400">Định hướng khoa học & Cố vấn chuyên môn</p>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {students.map((student, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gradient-to-br from-cyber-light/20 to-transparent border border-white/10 p-6 rounded-2xl text-center hover:-translate-y-2 transition-all duration-300 hover:border-white/30 group cursor-pointer"
            >
              <div
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 text-white font-heading font-bold text-lg transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_25px]"
                style={{
                  backgroundColor: student.color,
                  boxShadow: `0 0 0px ${student.color}30`,
                }}
              >
                {student.initials}
              </div>
              <h4 className="text-lg font-heading font-bold text-white mb-1">{student.name}</h4>
              <p className="text-xs text-cyber-blue mb-4 font-medium">{student.role}</p>
              <div className="flex items-center justify-center gap-3">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white transition-all duration-200 p-1.5 rounded-lg hover:bg-white/5 hover:scale-110"
                  aria-label={`GitHub của ${student.name}`}
                >
                  <Github size={18} />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-cyber-blue transition-all duration-200 p-1.5 rounded-lg hover:bg-white/5 hover:scale-110"
                  aria-label={`LinkedIn của ${student.name}`}
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-neon-green transition-all duration-200 p-1.5 rounded-lg hover:bg-white/5 hover:scale-110"
                  aria-label={`Portfolio của ${student.name}`}
                >
                  <ExternalLink size={18} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
