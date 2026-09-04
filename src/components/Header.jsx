import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CalendarDays, 
  Heart, 
  Calculator, 
  Sun, 
  Moon, 
  Sparkles,
  CalendarCheck2
} from 'lucide-react';
import { useApp } from '../context/useApp';

const Header = () => {
  const { 
    setCurrentView, 
    listings, 
    setBookingModalItem,
    wishlist,
    setIsWishlistOpen,
    setIsBudgetCalculatorOpen,
    theme,
    toggleTheme,
    requestAdminAccess,
    setIsTrackerModalOpen,
    language,
    changeLanguage,
    t
  } = useApp();

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const handleQuickBook = () => {
    if (listings.length > 0) {
      setBookingModalItem(listings[0]);
    }
  };

  const languagesList = [
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' }
  ];

  const currentLangObj = languagesList.find((l) => l.code === language) || languagesList[0];

  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo" onClick={() => setCurrentView('client')} style={{ cursor: 'pointer' }}>
          7avelty <span style={{ color: 'var(--text-light)', fontSize: '18px', fontWeight: '400' }}>| حفلتي</span>
        </div>
        
        <nav className="nav-links">
          <a href="#" className="nav-link">{t('nav.home', 'الرئيسية')}</a>
          <a href="#categories" className="nav-link">{t('nav.categories', 'التصنيفات')}</a>
          <a href="#packages" className="nav-link package-nav-link">
            <Sparkles size={14} className="text-primary" /> {t('nav.packages', 'باقات الأعراس')}
          </a>
          <a href="#featured" className="nav-link">{t('nav.listings', 'العروض والخدمات')}</a>
          <a href="#contact" className="nav-link">{t('nav.contact', 'اتصل بنا')}</a>
        </nav>

        <div className="header-actions-row">
          {/* Language Selector Dropdown */}
          <div className="lang-switcher-wrapper" style={{ position: 'relative' }}>
            <button
              type="button"
              className="btn-icon-round lang-header-btn"
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              title="تغيير اللغة / Changer de langue / Change Language"
              aria-label="تغيير اللغة"
            >
              <span className="lang-flag">{currentLangObj.flag}</span>
            </button>

            {isLangMenuOpen && (
              <div className="lang-dropdown-menu">
                {languagesList.map((langItem) => (
                  <button
                    key={langItem.code}
                    type="button"
                    className={`lang-option-btn ${language === langItem.code ? 'active' : ''}`}
                    onClick={() => {
                      changeLanguage(langItem.code);
                      setIsLangMenuOpen(false);
                    }}
                  >
                    <span className="option-flag">{langItem.flag}</span>
                    <span className="option-name">{langItem.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Switcher */}
          <button 
            className="btn-icon-round"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'التبديل إلى المظهر الفاتح' : 'التبديل إلى المظهر الليلي'}
            aria-label="تبديل الثيم"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Wishlist Button */}
          <button 
            className="btn-icon-round wishlist-header-btn"
            onClick={() => setIsWishlistOpen(true)}
            title="قائمة الخدمات المفضلة"
            aria-label="المفضلة"
          >
            <Heart size={18} fill={wishlist.length > 0 ? '#ef4444' : 'none'} color={wishlist.length > 0 ? '#ef4444' : 'currentColor'} />
            {wishlist.length > 0 && (
              <span className="header-badge-count">{wishlist.length}</span>
            )}
          </button>

          {/* Client Booking Tracker Button */}
          <button
            className="btn btn-outline tracker-header-btn"
            onClick={() => setIsTrackerModalOpen(true)}
            title={t('nav.trackBooking', 'تتبع حجزي')}
          >
            <CalendarCheck2 size={15} className="text-primary" />
            <span>{t('nav.trackBooking', 'تتبع حجزي')}</span>
          </button>

          {/* Budget Calculator Trigger */}
          <button
            className="btn btn-outline budget-calc-header-btn"
            onClick={() => setIsBudgetCalculatorOpen(true)}
            title={t('nav.budgetCalculator', 'حاسبة الميزانية')}
          >
            <Calculator size={15} className="text-primary" />
            <span>{t('nav.budgetCalculator', 'حاسبة الميزانية')}</span>
          </button>

          {/* Admin Dashboard Switcher with PIN Security */}
          <button
            className="btn btn-outline admin-header-btn"
            onClick={requestAdminAccess}
            title={t('nav.adminPanel', 'لوحة الأدمن')}
          >
            <ShieldCheck size={15} className="text-primary" />
            <span>{t('nav.adminPanel', 'لوحة الأدمن')}</span>
          </button>

          {/* Quick Book Button */}
          <button
            className="btn btn-primary quick-book-btn"
            onClick={handleQuickBook}
          >
            <CalendarDays size={15} />
            <span>{t('nav.quickBook', 'حجز مناسبة')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
