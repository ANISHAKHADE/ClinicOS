import React from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none p-2">
      {toasts.map((toast) => {
        const icons = {
          success: CheckCircle,
          error: AlertCircle,
          warning: AlertTriangle,
          info: Info,
        };
        const Icon = icons[toast.type];

        const styles = {
          success:
            'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/20',
          error:
            'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/20',
          warning:
            'bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-600/20',
          info:
            'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20',
        };

        return (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-sm font-semibold animate-in slide-in-from-top-3 fade-in duration-200',
              styles[toast.type]
            )}
          >
            <div className="flex items-center gap-2.5">
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/20 transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
