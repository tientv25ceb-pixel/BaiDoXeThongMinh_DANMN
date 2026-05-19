import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[9998] origin-left"
      style={{ scaleX }}
    >
      <div className="w-full h-full bg-gradient-to-r from-cyber-blue via-accent-violet to-neon-green" />
    </motion.div>
  );
};

export default ScrollProgress;
