import React, { createContext, useContext, useState, ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastContextType {
  showToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex items-center justify-between p-3.5 rounded-xl border shadow-lg transition-all transform animate-in slide-in-from-bottom-2 duration-200 text-xs font-medium',
              toast.type === 'success' && 'bg-emerald-500 text-white border-emerald-600',
              toast.type === 'error' && 'bg-red-500 text-white border-red-600',
              toast.type === 'info' && 'bg-slate-900 text-white border-slate-800 dark:bg-slate-100 dark:text-slate-900'
            )}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' && <CheckCircle className="h-4 w-4 shrink-0" />}
              {toast.type === 'error' && <AlertTriangle className="h-4 w-4 shrink-0" />}
              {toast.type === 'info' && <Info className="h-4 w-4 shrink-0" />}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:opacity-70 transition-opacity"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast должен использоваться внутри ToastProvider');
  }
  return context;
}