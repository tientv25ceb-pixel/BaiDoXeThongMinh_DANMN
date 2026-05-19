import React from 'react';

const SectionDivider = () => {
  return (
    <div className="relative h-24 overflow-hidden -my-12 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-blue/5 to-transparent" />
      <svg
        className="absolute bottom-0 w-full h-16 text-cyber-dark"
        viewBox="0 0 1440 64"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 32C240 64 480 0 720 32C960 64 1200 0 1440 32V64H0V32Z"
          fill="currentColor"
          opacity="0.03"
        />
      </svg>
    </div>
  );
};

export default SectionDivider;
