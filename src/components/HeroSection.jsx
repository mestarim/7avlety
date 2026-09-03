import React, { useState } from 'react';
import { Search, MapPin, Sparkles, Filter, Calculator } from 'lucide-react';
import { useApp } from '../context/useApp';

const HeroSection = () => {
  const { 
    setFilterCategory, 
    setFilterCity, 
    setFilterKeyword,
    setIsBudgetCalculatorOpen 
  } = useApp();

  const [selectedService, setSelectedService] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [keyword, setKeyword] = useState('');

  const handleSearch = () => {
    if (selectedService) {
      setFilterCategory(selectedService);
    } else {
      setFilterCategory('all');
    }

    if (selectedCity) {
      setFilterCity(selectedCity);
    } else {
      setFilterCity('all');
    }

    setFilterKeyword(keyword);

    const el = document.getElementById('featured');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPackages = () => {
    const el = document.getElementById('packages');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero">
      <div className="hero-bg"></div>
      <div className="hero-overlay"></div>
      
      <div className="container" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <div className="hero-content">
          <div className="hero-badge-pill">
            <Sparkles size={16} className="text-primary" /> المنصة الرائدة لحجوزات المناسبات في موريتانيا
          </div>
          <h1 className="hero-title">لحظاتك السعيدة تبدأ من هنا</h1>
          <p className="hero-subtitle">
            احجز أفضل قاعات الأفراح، الفنادق، السيارات الملكية، ومعدات الضيافة لمناسبتك القادمة في نواكشوط ومختلف المدن بأفضل الأسعار الموثوقة.
          </p>

          {/* Quick Action CTAs */}
          <div className="hero-quick-ctas">
            <button 
              className="btn btn-outline hero-cta-btn"
              onClick={() => setIsBudgetCalculatorOpen(true)}
            >
              <Calculator size={18} className="text-primary" />
              <span>حاسبة ميزانية الحفل الذكية</span>
            </button>
            <button 
              className="btn btn-primary hero-cta-btn"
              onClick={scrollToPackages}
            >
              <Sparkles size={18} />
              <span>باقات الأعراس المتكاملة (وفر حتى 750,000 UM)</span>
            </button>
          </div>
          
          <div className="search-box">
            <div className="search-input-group">
              <label><Search size={16} /> ماذا تبحث عن؟</label>
              <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
                <option value="">جميع الخدمات</option>
                <option value="قاعات الأفراح">قاعات أفراح</option>
                <option value="الفنادق والمؤتمرات">فنادق ومؤتمرات</option>
                <option value="معدات صوت ودي جي">مكبرات صوت ومعدات دي جي</option>
                <option value="سيارات زفاف">سيارات زفاف</option>
                <option value="أواني ومعدات ضيافة">أواني ومعدات ضيافة</option>
                <option value="الهدايا والسلال">هدايا وسلال</option>
                <option value="تصوير وتوثيق">تصوير وتوثيق</option>
              </select>
            </div>
            
            <div className="search-input-group">
              <label><MapPin size={16} /> المدينة</label>
              <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                <option value="">جميع المدن</option>
                <option value="نواكشوط">نواكشوط</option>
                <option value="نواذيبو">نواذيبو</option>
                <option value="روصو">روصو</option>
                <option value="كيفه">كيفه</option>
              </select>
            </div>
            
            <div className="search-input-group">
              <label><Filter size={16} /> كلمة مفتاحية (اختياري)</label>
              <input
                type="text"
                placeholder="اسم القاعة أو الخدمة..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            
            <button
              className="btn btn-primary search-submit-btn"
              onClick={handleSearch}
            >
              ابحث الآن
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
