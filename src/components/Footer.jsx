import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h4 style={{fontSize: '24px'}}>7avelty <span style={{fontWeight: '400', fontSize: '16px'}}>| حفلتي</span></h4>
            <p className="text-muted" style={{lineHeight: '1.6', marginBottom: '20px'}}>
              المنصة الأولى لحجز أرقى قاعات الأفراح والمناسبات وكل ما تحتاجه لجعل يومك الخاص لا يُنسى.
            </p>
            <div style={{display: 'flex', gap: '15px', color: 'var(--text-muted)'}}>
              <a href="#" className="text-primary">فيسبوك</a>
              <a href="#" className="text-primary">تويتر</a>
              <a href="#" className="text-primary">إنستغرام</a>
            </div>
          </div>
          
          <div className="footer-col">
            <h4>روابط سريعة</h4>
            <ul className="footer-links">
              <li><a href="#">من نحن</a></li>
              <li><a href="#">الشروط والأحكام</a></li>
              <li><a href="#">سياسة الخصوصية</a></li>
              <li><a href="#">الأسئلة الشائعة</a></li>
              <li><a href="#">انضم كمزود خدمة</a></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4>خدماتنا</h4>
            <ul className="footer-links">
              <li><a href="#">قاعات الأفراح</a></li>
              <li><a href="#">حجز الفنادق</a></li>
              <li><a href="#">تأجير السيارات</a></li>
              <li><a href="#">المعدات الصوتية</a></li>
              <li><a href="#">مستلزمات الضيافة</a></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4>تواصل معنا</h4>
            <ul className="footer-links">
              <li style={{display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)'}}>
                <MapPin size={16} className="text-primary" /> نواكشوط، موريتانيا
              </li>
              <li style={{display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)'}}>
                <Phone size={16} className="text-primary" /> 920000000
              </li>
              <li style={{display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)'}}>
                <Mail size={16} className="text-primary" /> info@7avelty.com
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} منصة حفلتي.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
