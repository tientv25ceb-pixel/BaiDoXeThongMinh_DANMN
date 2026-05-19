import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const SELECTORS = 'a, button, [role="button"], .cursor-pointer';

const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [hovering, setHovering] = useState(false);

  const springX = useSpring(cursorX, { stiffness: 500, damping: 28 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 28 });

  useEffect(() => {
    const move = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      if (e.target.closest(SELECTORS)) setHovering(true);
    };
    const handleMouseOut = (e) => {
      if (e.target.closest(SELECTORS)) setHovering(false);
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] hidden lg:block"
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      <motion.div
        animate={{
          scale: hovering ? 1.5 : 1,
          opacity: hovering ? 0.6 : 0.3,
        }}
        transition={{ duration: 0.3 }}
        className="w-8 h-8 rounded-full bg-cyber-blue"
        style={{
          boxShadow: '0 0 15px rgba(14,165,233,0.4), 0 0 40px rgba(14,165,233,0.2)',
          mixBlendMode: 'difference',
        }}
      />
    </motion.div>
  );
};

export default CustomCursor;
