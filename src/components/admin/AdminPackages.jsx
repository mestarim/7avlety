import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Edit3, 
  Trash2, 
  Star, 
  Check, 
  X, 
  Tag
} from 'lucide-react';
import { useApp } from '../../context/useApp';

const AdminPackages = () => {
  const { packages, addPackage, updatePackage, deletePackage, settings } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  const initialForm = {
    title: '',
    subtitle: '',
    originalPrice: '',
    packagePrice: '',
    discountBadge: '',
    rating: 5.0,
    popular: false,
    image: '',
    itemsIncludedText: ''
  };

  const [formData, setFormData] = useState(initialForm);

  const handleOpenAdd = () => {
    setEditingPackage(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      title: pkg.title || '',
      subtitle: pkg.subtitle || '',
      originalPrice: pkg.originalPrice || '',
      packagePrice: pkg.packagePrice || '',
      discountBadge: pkg.discountBadge || '',
      rating: pkg.rating || 5.0,
      popular: Boolean(pkg.popular),
      image: pkg.image || '',
      itemsIncludedText: Array.isArray(pkg.itemsIncluded) ? pkg.itemsIncluded.join('\n') : ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (pkg) => {
    if (window.confirm(`هل أنت متأكد من حذف باقة "${pkg.title}" نهائياً؟`)) {
      deletePackage(pkg.id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.packagePrice) {
      alert('يرجى كتابة عنوان الباقة وسعرها');
      return;
    }

    const items = formData.itemsIncludedText
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const payload = {
      title: formData.title,
      subtitle: formData.subtitle,
      originalPrice: Number(formData.originalPrice) || Number(formData.packagePrice),
      packagePrice: Number(formData.packagePrice),
      discountBadge: formData.discountBadge,
      rating: Number(formData.rating) || 5.0,
      popular: Boolean(formData.popular),
      image: formData.image || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop',
      itemsIncluded: items
    };

    if (editingPackage) {
      updatePackage(editingPackage.id, payload);
    } else {
      addPackage(payload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="admin-page-container">
      <div className="admin-header-row">
        <div>
          <h2 className="admin-page-title">إدارة باقات الأعراس الشاملة</h2>
          <p className="admin-page-subtitle">
            التحكم في البكجات المتكاملة، الأسعار، العروض الترويجية، والخدمات المشمولة في كل باقة
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> إضافة باقة جديدة
        </button>
      </div>

      {/* Packages Grid */}
      <div className="admin-packages-grid">
        {packages.map((pkg) => (
          <div key={pkg.id} className={`admin-package-card ${pkg.popular ? 'popular-card' : ''}`}>
            {pkg.popular && (
              <div className="admin-popular-ribbon">
                <Sparkles size={12} /> الأكثر طلباً
              </div>
            )}

            <div className="admin-package-img-wrap">
              <img src={pkg.image} alt={pkg.title} className="admin-package-img" />
              <div className="admin-package-rating">
                <Star size={14} fill="#f59e0b" color="#f59e0b" />
                <span>{pkg.rating}</span>
              </div>
            </div>

            <div className="admin-package-card-body">
              <h3 className="admin-pkg-title">{pkg.title}</h3>
              <p className="admin-pkg-subtitle">{pkg.subtitle}</p>

              <div className="admin-pkg-prices">
                <div className="pkg-price-now">
                  {Number(pkg.packagePrice).toLocaleString()} {settings.currency}
                </div>
                {pkg.originalPrice && pkg.originalPrice > pkg.packagePrice && (
                  <div className="pkg-price-old">
                    {Number(pkg.originalPrice).toLocaleString()} {settings.currency}
                  </div>
                )}
              </div>

              {pkg.savings > 0 && (
                <div className="admin-savings-badge">
                  <Tag size={12} /> وفر {Number(pkg.savings).toLocaleString()} {settings.currency}
                </div>
              )}

              <div className="admin-pkg-items-summary">
                <strong>الخدمات المشمولة ({pkg.itemsIncluded?.length || 0}):</strong>
                <ul>
                  {(pkg.itemsIncluded || []).slice(0, 3).map((item, idx) => (
                    <li key={idx}><Check size={12} className="text-primary" /> {item}</li>
                  ))}
                  {(pkg.itemsIncluded?.length || 0) > 3 && (
                    <li className="text-muted">+ {pkg.itemsIncluded.length - 3} خدمات إضافية أخرى</li>
                  )}
                </ul>
              </div>

              <div className="admin-card-actions">
                <button 
                  className="btn btn-outline btn-sm"
                  onClick={() => handleOpenEdit(pkg)}
                >
                  <Edit3 size={15} /> تعديل
                </button>
                <button 
                  className="btn btn-outline btn-sm text-danger"
                  onClick={() => handleDelete(pkg)}
                >
                  <Trash2 size={15} /> حذف
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Package Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content admin-package-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingPackage ? 'تعديل باقة العرس' : 'إضافة باقة عرس متكاملة جديدة'}
              </h3>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-package-form">
              <div className="form-group">
                <label>اسم وعنوان الباقة *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: البكج الملكي الفاخر"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>الوصف الموجز للباقة</label>
                <input
                  type="text"
                  placeholder="مثال: كل ما تحتاجه لليلة العمر بفخامة متكاملة"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>السعر بعد الخصم (سعر الباقة) *</label>
                  <input
                    type="number"
                    required
                    placeholder="3450000"
                    value={formData.packagePrice}
                    onChange={(e) => setFormData({ ...formData, packagePrice: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>السعر الأصلي المنفصل</label>
                  <input
                    type="number"
                    placeholder="4200000"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>شارة الخصم (اختياري)</label>
                  <input
                    type="text"
                    placeholder="مثال: وفر 750,000 أوقية"
                    value={formData.discountBadge}
                    onChange={(e) => setFormData({ ...formData, discountBadge: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>التقييم (1 - 5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>رابط صورة الغلاف</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>
                  الخدمات والمزايا المشمولة (اكتب كل خدمة في سطر منفصل)
                </label>
                <textarea
                  rows="5"
                  placeholder="حجز قاعة فندقية 5 نجوم&#10;عشاء بوفيه مفتوح وضيافة فاخرة&#10;سيارة رولز رويس فانتوم مع سائق&#10;طقم دي جي وصوتيات وهندسة صوت"
                  value={formData.itemsIncludedText}
                  onChange={(e) => setFormData({ ...formData, itemsIncludedText: e.target.value })}
                ></textarea>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.popular}
                    onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                  />
                  <span>تمييز كباقة رئيسية "الأكثر طلباً" 🌟</span>
                </label>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPackage ? 'حفظ التعديلات' : 'إضافة الباقة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPackages;
