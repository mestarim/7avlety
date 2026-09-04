import React, { useState } from 'react';
import { Search, MapPin, Sparkles, Filter, Calculator } from 'lucide-react';
import { useApp } from '../context/useApp';

const HeroSection = () => {
  const { 
    setFilterCategory, 
    setFilterCity, 
    setFilterKeyword,
    setIsBudgetCalculatorOpen,
    t
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
            <Sparkles size={16} className="text-primary" /> {t('hero.badge', 'المنصة الرائدة لحجوزات المناسبات في موريتانيا')}
          </div>
          <h1 className="hero-title">{t('hero.title', 'لحظاتك السعيدة تبدأ من هنا')}</h1>
          <p className="hero-subtitle">
            {t('hero.subtitle', 'احجز أفضل قاعات الأفراح، الفنادق، السيارات الملكية، ومعدات الضيافة لمناسبتك القادمة في نواكشوط ومختلف المدن بأفضل الأسعار الموثوقة.')}
          </p>

          {/* Quick Action CTAs */}
          <div className="hero-quick-ctas">
            <button 
              className="btn btn-outline hero-cta-btn"
              onClick={() => setIsBudgetCalculatorOpen(true)}
            >
              <Calculator size={18} className="text-primary" />
              <span>{t('hero.budgetBtn', 'حاسبة ميزانية الحفل الذكية')}</span>
            </button>
            <button 
              className="btn btn-primary hero-cta-btn"
              onClick={scrollToPackages}
            >
              <Sparkles size={18} />
              <span>{t('hero.packagesBtn', 'باقات الأعراس المتكاملة (وفر حتى 750,000 UM)')}</span>
            </button>
          </div>
          
          <div className="search-box">
            <div className="search-input-group">
              <label><Search size={16} /> {t('hero.searchLabel', 'ماذا تبحث عن؟')}</label>
              <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
                <option value="">{t('hero.allServices', 'جميع الخدمات')}</option>
                <option value="قاعات الأفراح">{t('categories.halls', 'قاعات أفراح')}</option>
                <option value="الفنادق والمؤتمرات">{t('categories.hotels', 'فنادق ومؤتمرات')}</option>
                <option value="معدات صوت ودي جي">{t('categories.sound', 'مكبرات صوت ومعدات دي جي')}</option>
                <option value="سيارات زفاف">{t('categories.cars', 'سيارات زفاف')}</option>
                <option value="أواني ومعدات ضيافة">{t('categories.hospitality', 'أواني ومعدات ضيافة')}</option>
                <option value="الهدايا والسلال">{t('categories.gifts', 'هدايا وسلال')}</option>
                <option value="تصوير وتوثيق">{t('categories.photography', 'تصوير وتوثيق')}</option>
              </select>
            </div>
            
            <div className="search-input-group">
              <label><MapPin size={16} /> {t('hero.cityLabel', 'المدينة')}</label>
              <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                <option value="">{t('hero.allCities', 'جميع المدن')}</option>
                <option value="نواكشوط">نواكشوط (Nouakchott)</option>
                <option value="نواذيبو">نواذيبو (Nouadhibou)</option>
                <option value="روصو">روصو (Rosso)</option>
                <option value="كيفه">كيفه (Kiffa)</option>
              </select>
            </div>
            
            <div className="search-input-group">
              <label><Filter size={16} /> {t('common.search', 'بحث بالكلمة')}</label>
              <input
                type="text"
                placeholder={t('hero.keywordPlaceholder', 'اسم القاعة أو الخدمة...')}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            
            <button
              className="btn btn-primary search-submit-btn"
              onClick={handleSearch}
            >
              {t('hero.searchAction', 'ابحث الآن')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
