import React, { Suspense } from 'react';
import { motion } from 'framer-motion';

import ErrorBoundary from '../components/ErrorBoundary';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProblemSolution from '../components/ProblemSolution';
import Features from '../components/Features';
import TechArchitecture from '../components/TechArchitecture';
import Performance from '../components/Performance';
import Team from '../components/Team';
import Footer from '../components/Footer';
import CustomCursor from '../components/CustomCursor';
import ScrollProgress from '../components/ScrollProgress';
import BackToTop from '../components/BackToTop';
import SectionDivider from '../components/SectionDivider';

const Testimonials = React.lazy(() => import('../components/Testimonials'));
const FAQ = React.lazy(() => import('../components/FAQ'));
const Contact = React.lazy(() => import('../components/Contact'));

const LazySection = ({ title, children }) => (
  <Suspense fallback={<div className="py-20 text-center text-gray-600"><div className="animate-pulse">Đang tải...</div></div>}>
    <ErrorBoundary fallbackTitle={`Không thể tải ${title}`} fallbackMessage="Vui lòng thử lại sau.">
      {children}
    </ErrorBoundary>
  </Suspense>
);

const Landing = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-cyber-dark text-white"
    >
      <ScrollProgress />
      <CustomCursor />
      <Header />
      <main>
        <Hero />
        <SectionDivider />
        <ProblemSolution />
        <SectionDivider />
        <Features />
        <SectionDivider />
        <TechArchitecture />
        <SectionDivider />
        <Performance />
        <SectionDivider />
        <Team />
        <SectionDivider />
        <LazySection title="Testimonials"><Testimonials /></LazySection>
        <SectionDivider />
        <LazySection title="FAQ"><FAQ /></LazySection>
        <SectionDivider />
        <LazySection title="Contact"><Contact /></LazySection>
      </main>
      <Footer />
      <BackToTop />
    </motion.div>
  );
};

export default Landing;
