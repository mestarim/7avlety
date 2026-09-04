import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleClearCache = () => {
    try {
      localStorage.removeItem('7avelty_categories');
      localStorage.removeItem('7avelty_listings');
      localStorage.removeItem('7avelty_packages');
      localStorage.removeItem('7avelty_promocodes');
      localStorage.removeItem('7avelty_bookings');
      localStorage.removeItem('7avelty_settings');
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#0c0c0c',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'Cairo, system-ui, sans-serif',
          direction: 'rtl'
        }}>
          <div style={{
            maxWidth: '480px',
            width: '100%',
            backgroundColor: '#181818',
            border: '1.5px solid rgba(203, 161, 83, 0.3)',
            borderRadius: '20px',
            padding: '36px 28px',
            textAlign: 'center',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#ef4444'
            }}>
              <AlertTriangle size={32} />
            </div>

            <h2 style={{ fontSize: '22px', marginBottom: '10px', color: '#ffffff' }}>
              عذراً، حدث تعارض في البيانات المحفوظة
            </h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '24px' }}>
              تم استعادة واستقرار النظام. يمكنك إعادة تحميل الصفحة أو مسح الذاكرة المؤقتة لمتابعة التصفح بأمان.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '12px 22px',
                  borderRadius: '10px',
                  backgroundColor: '#cba153',
                  color: '#000',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px'
                }}
              >
                <RotateCcw size={16} /> إعادة تحميل الصفحة
              </button>

              <button
                onClick={this.handleClearCache}
                style={{
                  padding: '12px 22px',
                  borderRadius: '10px',
                  backgroundColor: 'transparent',
                  color: '#ffffff',
                  border: '1px solid #334155',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px'
                }}
              >
                <Home size={16} /> استعادة الصفحة الرئيسية
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
