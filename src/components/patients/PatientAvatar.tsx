import React from 'react';
import { getBloodGroupColor } from '../../lib/utils';

export interface PatientAvatarProps {
  name: string;
  bloodGroup?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
}

export function PatientAvatar({ name, bloodGroup = 'O+', size = 'md', showBadge = false }: PatientAvatarProps) {
  const initials = (name || 'Unknown')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  };

  const colorClass = getBloodGroupColor(bloodGroup);

  return (
    <div className="relative inline-flex items-center justify-center flex-shrink-0">
      <div
        className={`flex items-center justify-center rounded-2xl font-bold shadow-xs select-none transition-transform ${sizeClasses[size]} ${colorClass}`}
      >
        {initials}
      </div>
      {showBadge && bloodGroup && (
        <span className="absolute -bottom-1 -right-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 border border-white dark:border-slate-900 shadow-xs">
          {bloodGroup}
        </span>
      )}
    </div>
  );
}
