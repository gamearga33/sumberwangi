import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white p-0 shadow-sm animate-pulse dark:border-stone-800 dark:bg-stone-900">
      <div className="aspect-square w-full bg-stone-200 dark:bg-stone-800" />
      <div className="flex flex-1 flex-col p-5 space-y-3">
        <div className="h-5 w-3/4 rounded bg-stone-200 dark:bg-stone-800" />
        <div className="space-y-1.5">
          <div className="h-3 w-full rounded bg-stone-200 dark:bg-stone-800" />
          <div className="h-3 w-4/5 rounded bg-stone-200 dark:bg-stone-800" />
        </div>
        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
          <div className="h-4 w-12 rounded bg-stone-200 dark:bg-stone-800" />
          <div className="h-6 w-24 rounded bg-stone-200 dark:bg-stone-800" />
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="h-8 rounded-xl bg-stone-200 dark:bg-stone-800" />
          <div className="h-8 rounded-xl bg-stone-200 dark:bg-stone-800" />
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
