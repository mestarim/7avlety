import React from 'react';
import { useApp } from '../../context/useApp';

const AdminCategories = () => {
  const { categories, listings } = useApp();

  const getListingCountForCat = (catTitle) => {
    return listings.filter((l) => {
      if (catTitle.includes('قاعات') && (l.badge?.includes('قاعة') || l.title.includes('قاعة'))) return true;
      if (catTitle.includes('فنادق') && (l.title.includes('فندق') || l.badge?.includes('الأكثر طلباً'))) return true;
      if (catTitle.includes('صوت') && (l.badge?.includes('معدات') || l.title.includes('صوت'))) return true;
      if (catTitle.includes('سيارات') && (l.badge?.includes('سيارة') || l.title.includes('سيارة') || l.title.includes('رويس'))) return true;
      if (catTitle.includes('أواني') && (l.badge?.includes('ضيافة') || l.title.includes('أواني'))) return true;
      if (catTitle.includes('هدايا') && (l.badge?.includes('هدايا') || l.title.includes('هدايا') || l.title.includes('سلة'))) return true;
      return false;
    }).length;
  };

  return (
    <div className="admin-categories">
      <div className="admin-page-header">
        <div>
          <h2>أقسام وتصنيفات المنصة</h2>
          <p className="text-muted">نظرة على أقسام الخدمات المتاحة للزوار وتوزيع العروض عليها</p>
        </div>
      </div>

      <div className="admin-cat-grid">
        {categories.map((cat) => {
          const count = getListingCountForCat(cat.title);
          return (
            <div key={cat.id} className="admin-cat-card">
              <div className="admin-cat-icon">
                {cat.icon}
              </div>
              <div className="admin-cat-info">
                <h3>{cat.title}</h3>
                <span className="text-muted">القسم النشط #{cat.id}</span>
                <div className="admin-cat-count text-primary">
                  {count} {count === 1 ? 'خدمة معروضة' : 'خدمات معروضة'}
                </div>
              </div>
              <span className="active-pill">مفعّل للزوار ✅</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminCategories;
