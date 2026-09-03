import React from 'react';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';
import { useApp } from '../context/useApp';

const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className={`toast-container toast-${toast.type || 'success'}`}>
      <div className="toast-icon">
        {toast.type === 'info' ? (
          <Info size={18} />
        ) : toast.type === 'error' ? (
          <AlertCircle size={18} />
        ) : (
          <CheckCircle2 size={18} />
        )}
      </div>
      <span className="toast-message">{toast.message}</span>
    </div>
  );
};

export default Toast;
