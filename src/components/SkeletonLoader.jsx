import React from 'react';

const SkeletonBar = ({ className = '' }) => (
  <div className={`animate-pulse rounded bg-white/5 ${className}`} />
);

const SkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-cyber-dark p-6 space-y-6 pt-28">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <SkeletonBar className="w-10 h-10 rounded-lg" />
          <div className="space-y-2">
            <SkeletonBar className="w-32 h-5" />
            <SkeletonBar className="w-20 h-3" />
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <SkeletonBar className="w-48 h-6" />
            <SkeletonBar className="w-full h-16" />
            <SkeletonBar className="w-3/4 h-8" />
            <SkeletonBar className="w-full h-20" />
            <div className="flex gap-3">
              <SkeletonBar className="w-40 h-12 rounded-lg" />
              <SkeletonBar className="w-48 h-12 rounded-lg" />
            </div>
          </div>
          <SkeletonBar className="aspect-video rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
