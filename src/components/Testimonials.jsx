import React from 'react';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    quote: 'Hệ thống hoạt động ổn định, độ chính xác nhận diện biển số cao. Là giải pháp phù hợp cho các bãi đỗ xe vừa và nhỏ tại Đà Nẵng.',
    author: 'ThS. Phan Thị Quỳnh Hương',
    role: 'Giảng viên hướng dẫn - VKU',
    rating: 5,
  },
  {
    quote: 'Tích hợp AI và IoT cho phép xử lý ngay tại biên, giảm tải băng thông và phản hồi gần như tức thời. Một hướng tiếp cận rất hiện đại.',
    author: 'TS. Nguyễn Văn A',
    role: 'Chuyên gia AI - ĐH Bách Khoa Đà Nẵng',
    rating: 5,
  },
  {
    quote: 'Chi phí triển khai chỉ 2.5 triệu cho một cụm 12 chỗ, quá rẻ so với các giải pháp thương mại đang có trên thị trường.',
    author: 'Trần Văn Tiền',
    role: 'Thành viên nhóm phát triển',
    rating: 5,
  },
];

const Testimonials = () => {
  const [current, setCurrent] = React.useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-blue/5 to-transparent pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Phản Hồi <span className="text-cyber-blue">Đánh Giá</span>
          </h2>
          <p className="text-gray-400">Những nhận xét từ giảng viên và đối tác về hệ thống.</p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="relative min-h-[260px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="bg-gradient-to-br from-cyber-light/20 to-transparent border border-white/10 rounded-2xl p-8 md:p-10 text-center"
              >
                <Quote size={36} className="mx-auto mb-6 text-cyber-blue/30" />
                <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-6 italic">
                  "{testimonials[current].quote}"
                </p>
                <div className="flex items-center justify-center gap-1 mb-4">
                  {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                    <Star key={i} size={16} className="fill-neon-orange text-neon-orange" />
                  ))}
                </div>
                <p className="font-heading font-bold text-white">{testimonials[current].author}</p>
                <p className="text-sm text-gray-500">{testimonials[current].role}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all duration-200"
              aria-label="Đánh giá trước"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === current ? 'bg-cyber-blue w-6' : 'bg-gray-600 hover:bg-gray-400'
                  }`}
                  aria-label={`Đánh giá ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all duration-200"
              aria-label="Đánh giá sau"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
