import React, { useState } from 'react';
import { ShieldCheck, Lock, X, KeyRound, AlertCircle } from 'lucide-react';
import { useApp } from '../context/useApp';

const AdminLoginModal = () => {
  const { 
    isAdminLoginModalOpen, 
    setIsAdminLoginModalOpen, 
    loginAdmin,
    language 
  } = useApp();

  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAdminLoginModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const res = loginAdmin(pin);
    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      setPin('');
    }
  };

  const handleKeypadPress = (val) => {
    if (pin.length < 8) {
      setPin((prev) => prev + val);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
    setErrorMsg('');
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAdminLoginModalOpen(false)}>
      <div className="modal-content admin-login-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="admin-login-header">
          <div className="admin-login-icon-ring">
            <Lock size={32} className="text-primary" />
          </div>
          <button 
            className="modal-close-btn" 
            onClick={() => setIsAdminLoginModalOpen(false)}
            aria-label="إغلاق"
          >
            <X size={20} />
          </button>
        </div>

        <div className="admin-login-body">
          <h3 className="admin-login-title">
            {language === 'ar' ? 'الدخول إلى لوحة تحكم الإدارة' : (language === 'fr' ? 'Accès à l’administration' : 'Admin Control Panel Access')}
          </h3>
          <p className="admin-login-desc">
            {language === 'ar' ? 'يرجى إدخال الرمز السري (PIN) الخاص بمدير منصة حفلتي للمتابعة' : (language === 'fr' ? 'Veuillez saisir votre code PIN administrateur pour continuer' : 'Please enter your administrator PIN to continue')}
          </p>

          {errorMsg && (
            <div className="admin-login-error">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="admin-pin-display-wrapper">
              <input
                type="password"
                className="admin-pin-input"
                maxLength="8"
                autoFocus
                placeholder="••••"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setErrorMsg('');
                }}
              />
              <KeyRound size={20} className="pin-input-icon" />
            </div>

            {/* Quick Numeric Keypad */}
            <div className="admin-num-keypad">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  className="keypad-btn"
                  onClick={() => handleKeypadPress(num.toString())}
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                className="keypad-btn keypad-func-btn"
                onClick={handleClear}
                title="مسح"
              >
                C
              </button>
              <button
                key={0}
                type="button"
                className="keypad-btn"
                onClick={() => handleKeypadPress('0')}
              >
                0
              </button>
              <button
                type="button"
                className="keypad-btn keypad-func-btn"
                onClick={handleBackspace}
                title="تراجع"
              >
                ⌫
              </button>
            </div>

            <div className="admin-login-actions">
              <button type="submit" className="btn btn-primary w-full admin-submit-btn">
                <ShieldCheck size={18} /> {language === 'ar' ? 'فتح لوحة الإدارة' : (language === 'fr' ? 'Accéder à l’administration' : 'Access Admin Dashboard')}
              </button>
            </div>
          </form>

          <div className="admin-login-hint">
            {language === 'ar' 
              ? <>💡 الرمز السري الافتراضي للنظام هو: <strong>7777</strong> (يمكنك تغييره من الإعدادات لاحقاً)</>
              : (language === 'fr'
                ? <>💡 Le code PIN par défaut est : <strong>7777</strong> (modifiable dans les paramètres)</>
                : <>💡 Default system PIN is: <strong>7777</strong> (can be changed in settings)</>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginModal;
