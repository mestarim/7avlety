import React from 'react';
import { useApp } from '../context/useApp';

const Categories = () => {
  const { categories, filterCategory, setFilterCategory } = useApp();

  const handleCategoryClick = (catTitle) => {
    setFilterCategory(catTitle);
    const el = document.getElementById('featured');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="categories" className="section bg-darker">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">تصفح خدماتنا</h2>
          <p className="text-muted">اختر القسم الذي تبحث عنه لعرض أفضل الخيارات المتاحة في موريتانيا</p>
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
                  {cat.icon}
                </div>
                <h3 className="category-title">{cat.title}</h3>
                <span className="category-action-text text-primary">تصفح العروض ←</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
