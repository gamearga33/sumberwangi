import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col animate-pulse bg-[#141414] border border-[#262420] p-4">
      <div className="aspect-square w-full bg-[#1e1d1a]" />
      <div className="pt-3 space-y-2">
        <div className="h-3 w-16 bg-[#262420]" />
        <div className="h-4 w-3/4 bg-[#262420]" />
        <div className="pt-3 border-t border-[#262420] flex justify-between items-center">
          <div className="h-4 w-20 bg-[#262420]" />
          <div className="h-4 w-12 bg-[#262420]" />
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};
