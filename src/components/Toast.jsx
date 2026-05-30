import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg, dur) => showToast(msg, 'success', dur),
    error: (msg, dur) => showToast(msg, 'error', dur),
    info: (msg, dur) => showToast(msg, 'info', dur),
    warning: (msg, dur) => showToast(msg, 'warning', dur),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 left-4 right-4 sm:top-5 sm:right-5 sm:left-auto z-50 flex flex-col space-y-3 sm:max-w-md pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onClose }) => {
  const { message, type, duration } = toast;

  const styles = {
    success: {
      bg: 'bg-teal-50/95 dark:bg-teal-950/90 border-teal-200 dark:border-teal-900/60 text-teal-800 dark:text-teal-200 backdrop-blur-sm',
      icon: <CheckCircle2 className="w-5 h-5 text-teal-500 dark:text-teal-400" />,
      bar: 'bg-teal-500 dark:bg-teal-400',
    },
    error: {
      bg: 'bg-rose-50/95 dark:bg-rose-950/90 border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 backdrop-blur-sm',
      icon: <AlertCircle className="w-5 h-5 text-rose-500 dark:text-rose-400" />,
      bar: 'bg-rose-500 dark:bg-rose-400',
    },
    warning: {
      bg: 'bg-amber-50/95 dark:bg-amber-950/90 border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-200 backdrop-blur-sm',
      icon: <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400" />,
      bar: 'bg-amber-500 dark:bg-amber-400',
    },
    info: {
      bg: 'bg-sky-50/95 dark:bg-sky-950/90 border-sky-200 dark:border-sky-900/60 text-sky-800 dark:text-sky-200 backdrop-blur-sm',
      icon: <Info className="w-5 h-5 text-sky-500 dark:text-sky-400" />,
      bar: 'bg-sky-500 dark:bg-sky-400',
    },
  }[type] || styles.success;

  return (
    <div
      role="alert"
      className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border shadow-lg ${styles.bg} transition-all duration-300 transform translate-y-0 animate-slide-in relative overflow-hidden`}
      style={{
        animation: 'toastSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
    >
      <div className="flex items-center space-x-3 pr-2">
        <div className="shrink-0">{styles.icon}</div>
        <p className="text-sm font-medium leading-tight">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="shrink-0 p-1 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-350 cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Modern countdown progress bar */}
      <div
        className={`absolute bottom-0 left-0 h-1 ${styles.bar}`}
        style={{
          animation: `toastProgress ${duration}ms linear forwards`,
          width: '100%'
        }}
      />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes toastSlideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes toastProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}} />
    </div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
};
