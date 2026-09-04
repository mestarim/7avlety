import React from 'react';
import { useApp } from '../context/useApp';
import { getCategoryIcon } from '../data/mockData';

const Categories = () => {
  const { categories, filterCategory, setFilterCategory, t } = useApp();

  const handleCategoryClick = (catTitle) => {
    if (catTitle.includes('بكجات') || catTitle.includes('باقات') || catTitle.toLowerCase().includes('pack')) {
      const pkgEl = document.getElementById('packages');
      if (pkgEl) {
        pkgEl.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    setFilterCategory(catTitle);
    const el = document.getElementById('featured');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getTranslatedCatTitle = (title) => {
    switch (title) {
      case 'قاعات الأفراح': return t('categories.halls', title);
      case 'الفنادق والمؤتمرات': return t('categories.hotels', title);
      case 'معدات صوت ودي جي': return t('categories.sound', title);
      case 'سيارات زفاف': return t('categories.cars', title);
      case 'أواني ومعدات ضيافة': return t('categories.hospitality', title);
      case 'الهدايا والسلال': return t('categories.gifts', title);
      case 'تصوير وتوثيق': return t('categories.photography', title);
      case 'بكجات متكاملة': return t('categories.allInclusive', title);
      default: return title;
    }
  };

  return (
    <section id="categories" className="section bg-darker">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t('categories.title', 'تصفح خدماتنا')}</h2>
          <p className="text-muted">{t('categories.subtitle', 'اختر القسم الذي تبحث عنه لعرض أفضل الخيارات المتاحة في موريتانيا')}</p>
        </div>
        
        <div className="categories-grid">
          {categories.map((cat) => {
            const isSelected = filterCategory === cat.title;
            return (
              <div
                key={cat.id}
                className={`category-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleCategoryClick(cat.title)}
              >
                <div className="category-icon">
                  {getCategoryIcon(cat.iconName)}
                </div>
                <h3 className="category-title">{getTranslatedCatTitle(cat.title)}</h3>
                <span className="category-action-text text-primary">{t('categories.browseOffers', 'تصفح العروض ←')}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
