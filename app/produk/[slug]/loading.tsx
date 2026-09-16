import React from 'react';

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Gambar skeleton */}
        <div className="lg:col-span-6">
          <div className="aspect-square w-full animate-pulse rounded-3xl bg-stone-200 dark:bg-stone-800" />
        </div>

        {/* Info skeleton */}
        <div className="space-y-6 lg:col-span-6">
          <div className="h-4 w-32 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
          <div className="h-8 w-40 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
          <div className="space-y-2 pt-4">
            <div className="h-4 w-full animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
            <div className="h-4 w-4/6 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
          </div>
          <div className="h-14 w-full animate-pulse rounded-2xl bg-stone-200 dark:bg-stone-800 pt-6" />
        </div>
      </div>
    </div>
  );
}
