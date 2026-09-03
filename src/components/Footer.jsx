import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useApp } from '../context/useApp';

const Footer = () => {
  const { settings } = useApp();

  return (
    <footer id="contact" className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h4 style={{ fontSize: '24px' }}>
              7avelty <span style={{ fontWeight: '400', fontSize: '16px' }}>| حفلتي</span>
            </h4>
            <p className="text-muted" style={{ lineHeight: '1.6', marginBottom: '20px' }}>
              {settings.platformSlogan || 'المنصة الموريتانية الأولى لحجز أرقى قاعات الأفراح والمناسبات وكل ما تحتاجه لجعل مناسبتك استثنائية.'}
            </p>
            <div style={{ display: 'flex', gap: '15px', color: 'var(--text-muted)' }}>
              <a href="#" className="text-primary">فيسبوك</a>
              <a href={`https://wa.me/${(settings.whatsapp || '22246000000').replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-primary">واتساب</a>
              <a href="#" className="text-primary">إنستغرام</a>
            </div>
          </div>
          
          <div className="footer-col">
            <h4>روابط سريعة</h4>
            <ul className="footer-links">
              <li><a href="#">الرئيسية</a></li>
              <li><a href="#packages">باقات الأعراس الشاملة</a></li>
              <li><a href="#featured">جميع الخدمات والقاعات</a></li>
              <li><a href="#">الشروط والأحكام</a></li>
              <li><a href="#">سياسة الخصوصية</a></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4>خدماتنا في موريتانيا</h4>
            <ul className="footer-links">
              <li><a href="#featured">قاعات الأفراح الفاخرة</a></li>
              <li><a href="#featured">حجز الفنادق والمؤتمرات</a></li>
              <li><a href="#featured">سيارات ومواكب الزفاف</a></li>
              <li><a href="#featured">معدات وهندسة الصوت</a></li>
              <li><a href="#featured">هدايا وضيافة تقليدية</a></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4>تواصل معنا</h4>
            <ul className="footer-links">
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                <MapPin size={16} className="text-primary" /> {settings.location || 'نواكشوط، تفرغ زينة، موريتانيا'}
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                <Phone size={16} className="text-primary" /> 
                <a href={`tel:${settings.phone}`} style={{ color: 'inherit' }}>{settings.phone || '+222 46 00 00 00'}</a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                <Mail size={16} className="text-primary" /> 
                <a href={`mailto:${settings.email}`} style={{ color: 'inherit' }}>{settings.email || 'contact@7avelty.mr'}</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} {settings.platformName || 'منصة حفلتي'}.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
