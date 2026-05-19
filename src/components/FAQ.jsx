import React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const faqs = [
  {
    q: 'Hệ thống có cần kết nối Internet liên tục không?',
    a: 'Không. Hệ thống xử lý AI tại biên (Edge AI) trên Raspberry Pi, chỉ cần Internet khi đồng bộ dữ liệu lên Dashboard. Nếu mất mạng, hệ thống vẫn hoạt động và tự động đồng bộ khi có kết nối trở lại.',
  },
  {
    q: 'Chi phí triển khai thực tế là bao nhiêu?',
    a: 'Chỉ từ 2.5 triệu VNĐ cho một cụm 12 chỗ đỗ, bao gồm ESP32-CAM, cảm biến PIR và Raspberry Pi. So với các giải pháp thương mại khác (12-25 triệu), chi phí tiết kiệm đến 80%.',
  },
  {
    q: 'Độ chính xác nhận diện biển số có cao không?',
    a: 'Mô hình YOLOv8n đạt mAP@0.5 là 92.3% cho nhận dạng phương tiện. OCR đọc biển số đạt 87.3% trong điều kiện ánh sáng tốt. Độ chính xác có thể cải thiện thêm với dữ liệu huấn luyện bổ sung.',
  },
  {
    q: 'Có thể mở rộng hệ thống cho bãi đỗ lớn hơn không?',
    a: 'Hoàn toàn có thể. Kiến trúc hệ thống được thiết kế theo mô hình phân tán, mỗi cụm 12 chỗ hoạt động độc lập. Bạn chỉ cần thêm cụm mới và kết nối về cùng một Dashboard trung tâm.',
  },
  {
    q: 'Thời gian triển khai một cụm mất bao lâu?',
    a: 'Trung bình 1-2 ngày cho một cụm 12 chỗ, bao gồm lắp đặt phần cứng, cấu hình và hiệu chỉnh AI. Với các bãi đỗ có sẵn cơ sở hạ tầng, thời gian có thể rút ngắn còn nửa ngày.',
  },
  {
    q: 'Hệ thống có hỗ trợ xe máy không?',
    a: 'Có. YOLOv8 được huấn luyện trên nhiều loại phương tiện bao gồm ô tô, xe máy và xe tải. Hệ thống tự động phân loại và đếm số lượng từng loại phương tiện.',
  },
];

const Item = ({ faq, index }) => {
  const [open, setOpen] = React.useState(false);
  const contentRef = React.useRef(null);
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`border border-white/10 rounded-xl overflow-hidden transition-all duration-300 ${
        open ? 'border-cyber-blue/30 bg-cyber-blue/5' : 'hover:border-white/20'
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
        aria-expanded={open}
      >
        <span className="font-heading font-medium text-white text-sm md:text-base">{faq.q}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0 text-gray-500"
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div ref={contentRef} className="px-6 pb-4">
          <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const FAQ = () => {
  return (
    <section id="faq" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Câu Hỏi <span className="text-cyber-blue">Thường Gặp</span>
          </h2>
          <p className="text-gray-400">Giải đáp những thắc mắc phổ biến về hệ thống.</p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <Item key={i} faq={faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
