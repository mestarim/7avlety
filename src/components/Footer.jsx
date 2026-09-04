import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useApp } from '../context/useApp';

const Footer = () => {
  const { settings, t, language } = useApp();

  return (
    <footer id="contact" className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h4 style={{ fontSize: '24px' }}>
              7avelty <span style={{ fontWeight: '400', fontSize: '16px' }}>| حفلتي</span>
            </h4>
            <p className="text-muted" style={{ lineHeight: '1.6', marginBottom: '20px' }}>
              {t('footer.slogan', settings.platformSlogan || 'المنصة الموريتانية الأولى لحجز أرقى قاعات الأفراح والمناسبات وكل ما تحتاجه لجعل مناسبتك استثنائية.')}
            </p>
            <div style={{ display: 'flex', gap: '15px', color: 'var(--text-muted)' }}>
              <a href="#" className="text-primary">{language === 'ar' ? 'فيسبوك' : 'Facebook'}</a>
              <a href={`https://wa.me/${(settings.whatsapp || '22246000000').replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-primary">{language === 'ar' ? 'واتساب' : 'WhatsApp'}</a>
              <a href="#" className="text-primary">{language === 'ar' ? 'إنستغرام' : 'Instagram'}</a>
            </div>
          </div>
          
          <div className="footer-col">
            <h4>{t('footer.quickLinks', 'روابط سريعة')}</h4>
            <ul className="footer-links">
              <li><a href="#">{t('nav.home', 'الرئيسية')}</a></li>
              <li><a href="#packages">{t('nav.packages', 'باقات الأعراس')}</a></li>
              <li><a href="#featured">{t('nav.listings', 'جميع الخدمات')}</a></li>
              <li><a href="#">{language === 'ar' ? 'الشروط والأحكام' : (language === 'fr' ? 'Conditions d’utilisation' : 'Terms of Service')}</a></li>
              <li><a href="#">{language === 'ar' ? 'سياسة الخصوصية' : (language === 'fr' ? 'Politique de confidentialité' : 'Privacy Policy')}</a></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4>{language === 'ar' ? 'خدماتنا في موريتانيا' : (language === 'fr' ? 'Nos services en Mauritanie' : 'Our Services in Mauritania')}</h4>
            <ul className="footer-links">
              <li><a href="#featured">{t('categories.halls', 'قاعات الأفراح الفاخرة')}</a></li>
              <li><a href="#featured">{t('categories.hotels', 'حجز الفنادق والمؤتمرات')}</a></li>
              <li><a href="#featured">{t('categories.cars', 'سيارات ومواكب الزفاف')}</a></li>
              <li><a href="#featured">{t('categories.sound', 'معدات وهندسة الصوت')}</a></li>
              <li><a href="#featured">{t('categories.hospitality', 'هدايا وضيافة تقليدية')}</a></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4>{t('footer.contactInfo', 'تواصل معنا')}</h4>
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
          <p>{t('footer.copyright', 'جميع الحقوق محفوظة لـ حفلتي | 7avelty')} &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
