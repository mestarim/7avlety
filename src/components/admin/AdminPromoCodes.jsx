import React, { useState } from 'react';
import { Tag, Plus, Trash2, CheckCircle2, Search, Percent } from 'lucide-react';
import { useApp } from '../../context/useApp';

const AdminPromoCodes = () => {
  const { promoCodes, addPromoCode, deletePromoCode, togglePromoCodeStatus, settings } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    description: '',
    minBookingAmount: 100000
  });

  const filteredPromos = promoCodes.filter(
    (p) =>
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      alert('يرجى كتابة رمز الكوبون');
      return;
    }

    addPromoCode({
      code: formData.code,
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      description: formData.description || `خصم ${formData.discountValue}${formData.discountType === 'percentage' ? '%' : ' أوقية'}`,
      minBookingAmount: Number(formData.minBookingAmount) || 0
    });

    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: 10,
      description: '',
      minBookingAmount: 100000
    });
    setShowAddModal(false);
  };

  const totalUsages = promoCodes.reduce((sum, p) => sum + (p.usageCount || 0), 0);
  const activeCount = promoCodes.filter((p) => p.active).length;

  return (
    <div className="admin-promos-page">
      <div className="admin-page-header">
        <div>
          <h2>إدارة كوبونات الخصم والعروض</h2>
          <p className="text-muted">إنشاء وتفعيل أكواد الخصم للزبائن لتنشيط الحجوزات والمبيعات</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> إضافة كوبون جديد
        </button>
      </div>

      {/* Quick Stats */}
      <div className="admin-overview-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon-wrap text-primary">
            <Tag size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">إجمالي الكوبونات</span>
            <strong className="stat-val">{promoCodes.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap text-success">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">الكوبونات النشطة</span>
            <strong className="stat-val">{activeCount}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap text-info">
            <Percent size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">إجمالي مرات الاستخدام</span>
            <strong className="stat-val">{totalUsages} حجز</strong>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="admin-filters-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="ابحث برمز الكوبون أو الوصف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>رمز الكوبون</th>
              <th>الوصف</th>
              <th>قيمة الخصم</th>
              <th>الحد الأدنى للطلب</th>
              <th>مرات الاستخدام</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredPromos.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '30px' }} className="text-muted">
                  لا توجد كوبونات مطابقة
                </td>
              </tr>
            ) : (
              filteredPromos.map((promo) => (
                <tr key={promo.id}>
                  <td>
                    <span className="promo-code-badge">
                      <Tag size={13} /> {promo.code}
                    </span>
                  </td>
                  <td>{promo.description}</td>
                  <td>
                    <strong className="text-primary">
                      {promo.discountType === 'percentage'
                        ? `${promo.discountValue}%`
                        : `${promo.discountValue.toLocaleString()} ${settings.currency}`}
                    </strong>
                  </td>
                  <td>
                    {promo.minBookingAmount
                      ? `${promo.minBookingAmount.toLocaleString()} ${settings.currency}`
                      : 'بدون حد'}
                  </td>
                  <td>
                    <span className="usage-pill">{promo.usageCount || 0} مرة</span>
                  </td>
                  <td>
                    <button
                      className={`status-toggle-btn ${promo.active ? 'active' : 'inactive'}`}
                      onClick={() => togglePromoCodeStatus(promo.id)}
                      title="اضغط للتبديل"
                    >
                      {promo.active ? 'نشط ومفعل ✅' : 'معطل ⏸️'}
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn-action-danger"
                      onClick={() => {
                        if (window.confirm(`هل أنت متأكد من حذف الكوبون ${promo.code}؟`)) {
                          deletePromoCode(promo.id);
                        }
                      }}
                      title="حذف الكوبون"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal to Add New Coupon */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content modal-form-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-form-header">
              <h3>إضافة كوبون خصم جديد</h3>
              <p className="text-muted">أدخل تفاصيل الكود ونسبة أو قيمة الخصم</p>
            </div>

            <form onSubmit={handleCreate} className="admin-edit-form">
              <div className="form-group">
                <label>رمز الكوبون (بالإنجليزية):</label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: AROSS2026 أو MAURITANIA"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  style={{ textTransform: 'uppercase', letterSpacing: '1px' }}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>نوع الخصم:</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  >
                    <option value="percentage">نسبة مئوية (%)</option>
                    <option value="fixed">مبلغ ثابت ({settings.currency})</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>قيمة الخصم:</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder={formData.discountType === 'percentage' ? 'مثلاً: 15' : 'مثلاً: 50000'}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>الحد الأدنى لمبلغ الحجز ({settings.currency}):</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0 إذا كان متاحاً لأي حجز"
                  value={formData.minBookingAmount}
                  onChange={(e) => setFormData({ ...formData, minBookingAmount: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>الوصف التوضيحي:</label>
                <input
                  type="text"
                  placeholder="مثال: خصم خاص لحجوزات العرسان الجدد"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="modal-actions-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary">
                  حفظ ونشر الكوبون
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPromoCodes;
