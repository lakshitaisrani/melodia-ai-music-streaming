import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container overlay */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map(t => (
          <div 
            key={t.id}
            className="flex items-center justify-between px-5 py-3.5 rounded-2xl border border-white/10 bg-surface/90 backdrop-blur-md shadow-2xl text-white text-sm font-bold animate-in slide-in-from-right-5 fade-in duration-300 pointer-events-auto"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-primary text-base font-extrabold">✓</span>
              <span>{t.message}</span>
            </div>
            <button 
              onClick={() => removeToast(t.id)} 
              className="ml-5 text-xs font-mono text-on-surface-variant hover:text-white transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
export default ToastContext;
