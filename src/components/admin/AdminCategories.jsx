import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Search, 
  Building2, 
  Hotel, 
  Speaker, 
  Car, 
  Utensils, 
  Gift, 
  Camera, 
  Sparkles, 
  Music, 
  Users, 
  Heart,
  X
} from 'lucide-react';
import { useApp } from '../../context/useApp';
import { getCategoryIcon } from '../../data/mockData';

const AVAILABLE_ICONS = [
  { name: 'Building2', label: 'قاعة / مبنى', icon: <Building2 size={22} /> },
  { name: 'Hotel', label: 'فندق / ضيافة', icon: <Hotel size={22} /> },
  { name: 'Speaker', label: 'صوت ودي جي', icon: <Speaker size={22} /> },
  { name: 'Car', label: 'سيارة زفاف', icon: <Car size={22} /> },
  { name: 'Utensils', label: 'أواني وموائد', icon: <Utensils size={22} /> },
  { name: 'Gift', label: 'هدايا وبخور', icon: <Gift size={22} /> },
  { name: 'Camera', label: 'تصوير وتوثيق', icon: <Camera size={22} /> },
  { name: 'Music', label: 'موسيقى وفلكلور', icon: <Music size={22} /> },
  { name: 'Users', label: 'حضور وضيافة', icon: <Users size={22} /> },
  { name: 'Heart', label: 'عناية وجمال', icon: <Heart size={22} /> },
  { name: 'Sparkles', label: 'باقات وأفراح', icon: <Sparkles size={22} /> }
];

const AdminCategories = () => {
  const { categories, addCategory, updateCategory, deleteCategory, listings } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    iconName: 'Building2',
    description: ''
  });

  const getListingCountForCat = (catTitle) => {
    return listings.filter((l) => {
      if (l.category === catTitle) return true;
      if (catTitle.includes('قاعات') && (l.badge?.includes('قاعة') || l.title.includes('قاعة'))) return true;
      if (catTitle.includes('فنادق') && (l.title.includes('فندق') || l.badge?.includes('الأكثر طلباً'))) return true;
      if (catTitle.includes('صوت') && (l.badge?.includes('معدات') || l.title.includes('صوت'))) return true;
      if (catTitle.includes('سيارات') && (l.badge?.includes('سيارة') || l.title.includes('سيارة') || l.title.includes('رويس'))) return true;
      if (catTitle.includes('أواني') && (l.badge?.includes('ضيافة') || l.title.includes('أواني'))) return true;
      if (catTitle.includes('هدايا') && (l.badge?.includes('هدايا') || l.title.includes('هدايا') || l.title.includes('سلة'))) return true;
      if (catTitle.includes('تصوير') && (l.category?.includes('تصوير') || l.title.includes('تصوير'))) return true;
      return false;
    }).length;
  };

  const filteredCategories = categories.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      title: '',
      iconName: 'Building2',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      title: cat.title,
      iconName: cat.iconName || 'Sparkles',
      description: cat.description || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`هل أنت متأكد من حذف قسم "${title}"؟`)) {
      deleteCategory(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('يرجى إدخال اسم القسم');
      return;
    }

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        title: formData.title.trim(),
        iconName: formData.iconName,
        description: formData.description.trim()
      });
    } else {
      addCategory({
        title: formData.title.trim(),
        iconName: formData.iconName,
        description: formData.description.trim()
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="admin-categories">
      <div className="admin-page-header">
        <div>
          <h2>إدارة أقسام وتصنيفات المنصة</h2>
          <p className="text-muted">إضافة وتعديل وحذف أقسام الخدمات المتاحة للزوار في موريتانيا</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> إضافة قسم جديد
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-filters-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="ابحث في الأقسام والتصنيفات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="admin-cat-grid">
        {filteredCategories.map((cat) => {
          const count = getListingCountForCat(cat.title);
          return (
            <div key={cat.id} className="admin-cat-card">
              <div className="admin-cat-top-row">
                <div className="admin-cat-icon">
                  {cat.icon || getCategoryIcon(cat.iconName, 26)}
                </div>
                <div className="admin-cat-card-actions">
                  <button
                    className="action-btn-cat edit-btn"
                    onClick={() => handleOpenEdit(cat)}
                    title="تعديل بيانات القسم"
                  >
                    <Edit size={15} />
                  </button>
                  <button
                    className="action-btn-cat delete-btn"
                    onClick={() => handleDelete(cat.id, cat.title)}
                    title="حذف هذا القسم"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="admin-cat-info">
                <h3>{cat.title}</h3>
                {cat.description && (
                  <p className="cat-desc-preview text-muted">{cat.description}</p>
                )}
                <div className="admin-cat-count text-primary">
                  {count} {count === 1 ? 'خدمة معروضة' : 'خدمات معروضة'}
                </div>
              </div>
              <span className="active-pill">مفعّل للزوار ✅</span>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content modal-form-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-form-header">
              <h3>{editingCategory ? `تعديل قسم: ${editingCategory.title}` : 'إضافة قسم جديد'}</h3>
              <p className="text-muted">اختر اسم القسم والأيقونة المعبرة عنه</p>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-edit-form">
              <div className="form-group">
                <label>اسم القسم *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: فرق موسيقية وفلكلور أو كوافير وحناء"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>أيقونة القسم المعبرة:</label>
                <div className="icon-selector-grid">
                  {AVAILABLE_ICONS.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      className={`icon-choice-btn ${formData.iconName === item.name ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, iconName: item.name })}
                      title={item.label}
                    >
                      <span className="choice-icon">{item.icon}</span>
                      <span className="choice-name">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>وصف توضيحي للقسم (اختياري):</label>
                <input
                  type="text"
                  placeholder="وصف مختصر يظهر في التلميحات..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="modal-actions-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCategory ? 'حفظ التعديلات' : 'إضافة ونشر القسم'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
