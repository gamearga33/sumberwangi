import React from 'react';
import { ProductGridSkeleton } from '@/components/LoadingSkeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-4">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-stone-200 dark:bg-stone-800" />
        <div className="h-4 w-96 animate-pulse rounded-lg bg-stone-200 dark:bg-stone-800" />
        <div className="flex gap-2 pt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 w-24 animate-pulse rounded-xl bg-stone-200 dark:bg-stone-800" />
          ))}
        </div>
      </div>
      <ProductGridSkeleton count={8} />
    </div>
  );
}
