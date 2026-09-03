import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useApp } from '../context/useApp';

const WhatsAppFloatingBtn = () => {
  const { settings } = useApp();

  const handleClick = () => {
    const text = encodeURIComponent('مرحباً منصة حفلتي، أود الاستفسار بخصوص خدمات وحجوزات المناسبات في موريتانيا.');
    const phone = (settings.whatsapp || '22246000000').replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <button
      className="whatsapp-float-btn"
      onClick={handleClick}
      title="تواصل معنا عبر واتساب"
      aria-label="تواصل واتساب"
    >
      <MessageCircle size={26} />
      <span className="whatsapp-tooltip">تواصل معنا واتساب</span>
    </button>
  );
};

export default WhatsAppFloatingBtn;
