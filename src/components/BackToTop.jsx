import React from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

const BackToTop = () => {
  const [visible, setVisible] = React.useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setVisible(latest > 300);
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
      transition={{ duration: 0.3 }}
      onClick={scrollToTop}
      aria-label="Lên đầu trang"
      className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue flex items-center justify-center hover:bg-cyber-blue/20 hover:border-cyber-blue/60 transition-all duration-300 shadow-lg shadow-cyber-blue/10"
    >
      <ChevronUp size={22} />
    </motion.button>
  );
};

export default BackToTop;
