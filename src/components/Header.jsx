import React from 'react';
import { CircleParking, Menu, X, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Trang chủ', href: '#', section: 'hero' },
  { label: 'Tính năng', href: '#features', section: 'features' },
  { label: 'Kiến trúc', href: '#architecture', section: 'architecture' },
  { label: 'Thống kê', href: '#stats', section: 'stats' },
  { label: 'Liên hệ', href: '#contact', section: 'contact' },
];

const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState('hero');
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 50);
  });

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id || 'hero');
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    const observeSections = () => {
      document.querySelectorAll('section[id]').forEach((el) => observer.observe(el));
    };

    observeSections();

    const mutationObserver = new MutationObserver(observeSections);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  const handleClick = (e, href) => {
    if (href === '#') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-4 left-4 right-4 z-50 max-w-7xl mx-auto"
    >
      <motion.div
        animate={{
          backgroundColor: scrolled
            ? 'rgba(7, 7, 13, 0.9)'
            : 'rgba(7, 7, 13, 0.6)',
          boxShadow: scrolled
            ? '0 8px 32px rgba(0,0,0,0.5)'
            : '0 8px 32px rgba(0,0,0,0.2)',
        }}
        transition={{ duration: 0.3 }}
        className="backdrop-blur-xl rounded-2xl border border-white/10 px-6 h-16 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyber-blue/10 border border-cyber-blue/50 flex items-center justify-center text-cyber-blue">
            <CircleParking size={20} />
          </div>
          <div>
            <h1 className="font-heading font-bold text-lg tracking-tight text-white">
              Smart<span className="text-cyber-blue">Park</span>
            </h1>
            <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em] font-medium">Smart System</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = item.section === activeSection;
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive ? 'text-cyber-blue' : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 bg-cyber-blue/5 rounded-lg border border-cyber-blue/20"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
          <Link
            to="/dashboard"
            className="ml-3 flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue hover:bg-cyber-blue/20 transition-all duration-200"
          >
            <BarChart2 size={16} />
            Dashboard
          </Link>
        </nav>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
          aria-label={isOpen ? 'Đóng menu' : 'Mở menu'}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-2 bg-cyber-dark/95 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden"
          >
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleClick(e, item.href)}
              className={`block px-5 py-3 text-sm font-medium transition-colors ${
                item.section === activeSection
                  ? 'text-cyber-blue bg-cyber-blue/5'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </a>
          ))}
          <Link
            to="/dashboard"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-cyber-blue bg-cyber-blue/5 border-t border-white/10"
          >
            <BarChart2 size={16} />
            Dashboard
          </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
