import React from 'react';

export function LoadingSpinner({ text = 'Loading records...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="relative w-10 h-10">
        <div className="w-10 h-10 rounded-full border-2 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">
          +
        </div>
      </div>
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 animate-pulse">{text}</p>
    </div>
  );
}
