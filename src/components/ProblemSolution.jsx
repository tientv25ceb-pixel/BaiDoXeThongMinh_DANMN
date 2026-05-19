import React from 'react';
import { AlertTriangle, ShieldCheck, Zap, Activity, XCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ProblemSolution = () => {
  return (
    <section id="problem-solution" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Từ Vấn Đề Thực Tế Đến <span className="text-cyber-blue">Giải Pháp Đột Phá</span>
          </h2>
          <p className="text-gray-400">
            Hệ thống bãi đỗ xe truyền thống đang bộc lộ nhiều hạn chế trước tốc độ đô thị hóa nhanh chóng.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="bg-gradient-to-br from-cyber-light/20 to-transparent border border-red-500/20 rounded-2xl p-8 relative overflow-hidden group hover:border-red-500/40 transition-all duration-300 cursor-pointer hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-all"></div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-2xl font-heading font-bold text-white">Thực Trạng Khó Khăn</h3>
            </div>

            <ul className="space-y-4">
              {[
                'Ùn tắc giao thông cục bộ tại các điểm gửi xe giờ cao điểm.',
                'Thiếu hụt không gian đỗ xe tại các đô thị lớn.',
                'Hệ thống quản lý thủ công (ghi vé giấy, quẹt thẻ) bộc lộ nhiều điểm yếu: tốc độ chậm, sai sót ghi chép.',
                'Khó khăn trong việc thống kê và quản lý doanh thu.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-400">
                  <XCircle size={18} className="text-red-500/70 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
            className="bg-gradient-to-br from-cyber-light/20 to-transparent border border-cyber-blue/20 rounded-2xl p-8 relative overflow-hidden group hover:border-cyber-blue/50 transition-all duration-300 cursor-pointer box-glow hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-blue/10 rounded-full blur-2xl group-hover:bg-cyber-blue/20 transition-all"></div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-cyber-blue/10 flex items-center justify-center text-cyber-blue">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-2xl font-heading font-bold text-white">Giải Pháp Của Chúng Tôi</h3>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                'Tích hợp AIoT tại biên (Edge AI) xử lý hình ảnh trực tiếp qua camera, thay thế hoàn toàn việc kiểm soát thủ công.',
                'Mô hình Deep Learning nhận diện biển số và phương tiện trong chớp mắt.',
                'Đồng bộ dữ liệu thời gian thực lên Cloud/Dashboard.',
                'Tối ưu hóa không gian và cảnh báo thông minh tự động.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300">
                  <CheckCircle2 size={18} className="text-cyber-blue mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between p-4 bg-cyber-dark/50 rounded-xl border border-white/10">
              <div className="flex items-center gap-2">
                <Activity size={20} className="text-neon-green" />
                <span className="text-sm font-medium">Trạng thái hệ thống</span>
              </div>
              <span className="text-xs px-3 py-1 bg-neon-green/10 text-neon-green rounded-full border border-neon-green/20">
                <Zap size={12} className="inline mr-1 -mt-0.5" />Tự động hóa 100%
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
