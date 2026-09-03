import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { useApp } from '../context/useApp';

const PWAInstallPrompt = () => {
  const { settings } = useApp();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (settings?.enablePwaBanner === false) return;

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after 3 seconds if not dismissed
      const dismissed = localStorage.getItem('7avelty_pwa_dismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, [settings?.enablePwaBanner]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('لتثبيت التطبيق على جهازك، افتح قائمة المتصفح (⋮) واختر "إضافة إلى الشاشة الرئيسية" أو "تثبيت التطبيق"');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('7avelty_pwa_dismissed', 'true');
  };

  if (settings?.enablePwaBanner === false || isInstalled || !showPrompt) return null;

  return (
    <div className="pwa-install-banner">
      <div className="pwa-install-content">
        <div className="pwa-icon-box">
          <Smartphone size={24} className="text-primary" />
        </div>
        <div className="pwa-text">
          <strong>تثبيت تطبيق حفلتي (PWA)</strong>
          <span>استمتع بتجربة أسرع وسهولة الوصول وحجز المناسبات من شاشتك الرئيسية مباشرة</span>
        </div>
      </div>
      <div className="pwa-actions">
        <button onClick={handleInstallClick} className="btn btn-primary pwa-btn">
          <Download size={16} /> تثبيت الآن
        </button>
        <button onClick={handleDismiss} className="pwa-close-btn" title="إغلاق">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
