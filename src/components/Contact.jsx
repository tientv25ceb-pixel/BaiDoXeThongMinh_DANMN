import React from 'react';
import { Send, Mail, Phone, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', email: '', phone: '', message: '' });
  const timerRef = React.useRef(null);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    timerRef.current = setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', message: '' });
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-cyber-blue/5 via-transparent to-transparent pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Liên Hệ <span className="text-cyber-blue">Với Chúng Tôi</span>
          </h2>
          <p className="text-gray-400">Đăng ký tư vấn hoặc gửi câu hỏi cho nhóm phát triển.</p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-heading font-bold text-white mb-6">Thông tin liên hệ</h3>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-cyber-blue/10 flex items-center justify-center text-cyber-blue shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a href="mailto:contact@smartpark.vku" className="text-white hover:text-cyber-blue transition-colors">contact@smartpark.vku</a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-neon-green/10 flex items-center justify-center text-neon-green shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Điện thoại</p>
                  <a href="tel:+840123456789" className="text-white hover:text-cyber-blue transition-colors">+84 (0) 123 456 789</a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-accent-violet/10 flex items-center justify-center text-accent-violet shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Địa chỉ</p>
                  <p className="text-white">Trường Đại học VKU, Đà Nẵng</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-neon-green/10 to-transparent border border-neon-green/20 rounded-2xl p-10 text-center"
              >
                <CheckCircle2 size={48} className="mx-auto mb-4 text-neon-green" />
                <h4 className="text-xl font-heading font-bold text-white mb-2">Đã gửi thành công!</h4>
                <p className="text-gray-400 text-sm">Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Họ và tên"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-transparent border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyber-blue/50 focus:ring-1 focus:ring-cyber-blue/30 transition-all duration-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-transparent border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyber-blue/50 focus:ring-1 focus:ring-cyber-blue/30 transition-all duration-200"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Số điện thoại"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-transparent border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyber-blue/50 focus:ring-1 focus:ring-cyber-blue/30 transition-all duration-200"
                  />
                </div>
                <div>
                  <textarea
                    name="message"
                    placeholder="Nội dung tin nhắn"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-transparent border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyber-blue/50 focus:ring-1 focus:ring-cyber-blue/30 transition-all duration-200 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-cyber-blue text-white font-bold rounded-xl hover:bg-cyber-blue/90 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Send size={20} />
                  )}
                  {loading ? 'Đang gửi...' : 'Gửi tin nhắn'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
