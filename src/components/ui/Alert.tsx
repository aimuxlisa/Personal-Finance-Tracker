import React, { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'destructive';
  title?: string;
}

export function Alert({
  className,
  variant = 'info',
  title,
  children,
  ...props
}: AlertProps) {
  const variants = {
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-300',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-300',
    warning: 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-300',
    destructive: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/40 dark:border-red-900 dark:text-red-300',
  };

  const icons = {
    info: <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />,
    warning: <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />,
    destructive: <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />,
  };

  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-xl border text-xs leading-relaxed transition-all',
        variants[variant],
        className
      )}
      {...props}
    >
      {icons[variant]}
      <div className="space-y-1">
        {title && <h5 className="font-medium text-sm leading-none">{title}</h5>}
        <div>{children}</div>
      </div>
    </div>
  );
}