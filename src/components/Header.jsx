import React from 'react';
import { 
  ShieldCheck, 
  CalendarDays, 
  Heart, 
  Calculator, 
  Sun, 
  Moon, 
  Sparkles 
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
    toggleTheme
  } = useApp();

  const handleQuickBook = () => {
    if (listings.length > 0) {
      setBookingModalItem(listings[0]);
    }
  };

  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo" onClick={() => setCurrentView('client')} style={{ cursor: 'pointer' }}>
          7avelty <span style={{ color: 'var(--text-light)', fontSize: '18px', fontWeight: '400' }}>| حفلتي</span>
        </div>
        
        <nav className="nav-links">
          <a href="#" className="nav-link">الرئيسية</a>
          <a href="#categories" className="nav-link">التصنيفات</a>
          <a href="#packages" className="nav-link package-nav-link">
            <Sparkles size={14} className="text-primary" /> باقات الأعراس
          </a>
          <a href="#featured" className="nav-link">العروض والخدمات</a>
          <a href="#contact" className="nav-link">اتصل بنا</a>
        </nav>

        <div className="header-actions-row">
          {/* Theme Switcher */}
          <button 
            className="btn-icon-round"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'التبديل إلى المظهر الفاتح اللؤلؤي' : 'التبديل إلى المظهر الليلي الذهبي'}
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

          {/* Budget Calculator Trigger */}
          <button
            className="btn btn-outline budget-calc-header-btn"
            onClick={() => setIsBudgetCalculatorOpen(true)}
            title="حاسبة ميزانية الحفل الذكية"
          >
            <Calculator size={15} className="text-primary" />
            <span>حاسبة الميزانية</span>
          </button>

          {/* Admin Dashboard Switcher Button */}
          <button
            className="btn btn-outline admin-header-btn"
            onClick={() => setCurrentView('admin')}
            title="الدخول إلى لوحة تحكم الأدمن"
          >
            <ShieldCheck size={15} className="text-primary" />
            <span>لوحة الأدمن</span>
          </button>

          {/* Quick Book Button */}
          <button
            className="btn btn-primary quick-book-btn"
            onClick={handleQuickBook}
          >
            <CalendarDays size={15} />
            <span>حجز مناسبة</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
