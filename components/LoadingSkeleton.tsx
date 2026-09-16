import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="aspect-square w-full bg-[#f0eee6]" />
      <div className="pt-3 space-y-2">
        <div className="h-3 w-16 bg-[#f0eee6]" />
        <div className="h-4 w-3/4 bg-[#f0eee6]" />
        <div className="pt-2 border-t border-[#e8e6df] flex justify-between items-center">
          <div className="h-4 w-20 bg-[#f0eee6]" />
          <div className="h-3 w-12 bg-[#f0eee6]" />
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};
