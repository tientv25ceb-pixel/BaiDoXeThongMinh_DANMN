import React from 'react';
import { Github, FileText, Mail, Car, ChevronUp } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#040408] border-t border-white/5 pt-16 pb-8">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-blue/30 to-transparent"></div>
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyber-blue/10 border border-cyber-blue/30 flex items-center justify-center text-cyber-blue">
                <Car size={20} />
              </div>
              <h2 className="font-heading font-bold text-xl tracking-tight text-white">
                Smart<span className="text-cyber-blue">Park</span>
              </h2>
            </div>
            <p className="text-gray-500 text-sm max-w-sm mb-6 leading-relaxed">
              Giải pháp tự động hóa quản lý bãi đỗ xe thông minh bằng Deep Learning & Edge AI. Dự án khoa học của nhóm sinh viên 25CE - VKU.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-cyber-blue hover:border-cyber-blue/30 hover:bg-cyber-blue/10 transition-all duration-200" aria-label="GitHub">
                <Github size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-neon-green hover:border-neon-green/30 hover:bg-neon-green/10 transition-all duration-200" aria-label="Email">
                <Mail size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-accent-violet hover:border-accent-violet/30 hover:bg-accent-violet/10 transition-all duration-200" aria-label="Poster">
                <FileText size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold text-white mb-4">Tài Nguyên</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-500 hover:text-cyber-blue text-sm flex items-center gap-2 transition-colors duration-200">
                  <Github size={16} /> Mã Nguồn (GitHub)
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-cyber-blue text-sm flex items-center gap-2 transition-colors duration-200">
                  <FileText size={16} /> Poster Dự Án
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-cyber-blue text-sm flex items-center gap-2 transition-colors duration-200">
                  <FileText size={16} /> Báo Cáo Khoa Học
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-white mb-4">Liên Hệ</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:contact@smartpark.vku" className="text-gray-500 hover:text-cyber-blue text-sm flex items-center gap-2 transition-colors duration-200">
                  <Mail size={16} /> contact@smartpark.vku
                </a>
              </li>
              <li>
                <button
                  onClick={scrollToTop}
                  className="text-gray-500 hover:text-cyber-blue text-sm flex items-center gap-2 transition-colors duration-200"
                >
                  <ChevronUp size={16} /> Lên đầu trang
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-600">
          <p>© {year} SmartPark VKU Team. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Đồ án môn học & Nghiên cứu khoa học</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
