import React, { useState } from 'react';
import { 
  Tag, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Search, 
  Percent, 
  Edit3, 
  Copy, 
  Calendar, 
  Sparkles,
  Check
} from 'lucide-react';
import { useApp } from '../../context/useApp';

const AdminPromoCodes = () => {
  const { 
    promoCodes, 
    addPromoCode, 
    updatePromoCode, 
    deletePromoCode, 
    togglePromoCodeStatus, 
    settings,
    showToast
  } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 15,
    description: '',
    minBookingAmount: 0,
    expiry: ''
  });

  const filteredPromos = promoCodes.filter(
    (p) =>
      (p.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      alert('يرجى كتابة رمز الكوبون');
      return;
    }

    const val = Number(formData.discountValue) || 10;
    const isPct = formData.discountType === 'percentage';

    addPromoCode({
      code: formData.code.toUpperCase().trim(),
      discountType: formData.discountType,
      discountValue: val,
      discountPercent: isPct ? val : 0,
      description: formData.description || `خصم ${val}${isPct ? '%' : ' ' + settings.currency}`,
      minBookingAmount: Number(formData.minBookingAmount) || 0,
      expiry: formData.expiry || ''
    });

    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: 15,
      description: '',
      minBookingAmount: 0,
      expiry: ''
    });
    setShowAddModal(false);
  };

  const handleOpenEdit = (promo) => {
    setEditingPromo({
      id: promo.id,
      code: promo.code || '',
      discountType: promo.discountType || 'percentage',
      discountValue: promo.discountValue !== undefined ? promo.discountValue : (promo.discountPercent || 10),
      description: promo.description || '',
      minBookingAmount: promo.minBookingAmount || 0,
      expiry: promo.expiry || ''
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editingPromo.code.trim()) {
      alert('يرجى كتابة رمز الكوبون');
      return;
    }

    const val = Number(editingPromo.discountValue) || 10;
    const isPct = editingPromo.discountType === 'percentage';

    updatePromoCode(editingPromo.id, {
      code: editingPromo.code.toUpperCase().trim(),
      discountType: editingPromo.discountType,
      discountValue: val,
      discountPercent: isPct ? val : 0,
      description: editingPromo.description || `خصم ${val}${isPct ? '%' : ' ' + settings.currency}`,
      minBookingAmount: Number(editingPromo.minBookingAmount) || 0,
      expiry: editingPromo.expiry || ''
    });

    setEditingPromo(null);
  };

  const handleCopyCode = (code) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
      if (showToast) showToast(`تم نسخ الرمز ${code} للمشاركة! 📋`, 'info');
    }
  };

  const totalUsages = promoCodes.reduce((sum, p) => sum + (Number(p.usageCount) || 0), 0);
  const activeCount = promoCodes.filter((p) => p.active).length;

  return (
    <div className="admin-promos-page">
      <div className="admin-page-header">
        <div>
          <h2>إدارة كوبونات الخصم والعروض الترويجية</h2>
          <p className="text-muted">إنشاء، تعديل، وتفعيل أكواد الخصم للزبائن لتنشيط الحجوزات والمبيعات ومزامنتها لحظياً</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> إضافة كوبون أو عرض جديد
        </button>
      </div>

      {/* Quick Stats */}
      <div className="admin-overview-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon-wrap text-primary">
            <Tag size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">إجمالي الكوبونات والعروض</span>
            <strong className="stat-val">{promoCodes.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap text-success">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">الكوبونات النشطة والمتاحة</span>
            <strong className="stat-val">{activeCount}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap text-info">
            <Percent size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">مرات الاستفادة من الخصم</span>
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
            placeholder="ابحث برمز الكوبون أو وصف العرض..."
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
              <th>رمز الكوبون والعرض</th>
              <th>الوصف الترويجي</th>
              <th>قيمة الخصم</th>
              <th>الحد الأدنى للطلب</th>
              <th>تاريخ الصلاحية</th>
              <th>مرات الاستخدام</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredPromos.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '36px' }} className="text-muted">
                  لا توجد كوبونات أو عروض مطابقة للبحث
                </td>
              </tr>
            ) : (
              filteredPromos.map((promo) => {
                const discountVal = Number(promo.discountValue !== undefined ? promo.discountValue : (promo.discountPercent || 0));
                const isFixed = promo.discountType === 'fixed';
                const isExpired = promo.expiry && new Date(promo.expiry) < new Date(new Date().toISOString().split('T')[0]);

                return (
                  <tr key={promo.id}>
                    <td>
                      <div className="promo-code-display-wrap">
                        <span className="promo-code-badge">
                          <Tag size={13} /> {promo.code}
                        </span>
                        <button
                          type="button"
                          className="promo-copy-btn"
                          onClick={() => handleCopyCode(promo.code)}
                          title="نسخ الكود"
                        >
                          {copiedCode === promo.code ? <Check size={13} className="text-success" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </td>
                    <td>{promo.description || 'خصم مميز'}</td>
                    <td>
                      <strong className="text-primary font-bold">
                        {isFixed
                          ? `${discountVal.toLocaleString()} ${settings.currency}`
                          : `${discountVal}%`}
                      </strong>
                    </td>
                    <td>
                      {promo.minBookingAmount && Number(promo.minBookingAmount) > 0
                        ? `${Number(promo.minBookingAmount).toLocaleString()} ${settings.currency}`
                        : <span className="text-muted">بدون حد أدنى</span>}
                    </td>
                    <td>
                      {promo.expiry ? (
                        <span className={`promo-expiry-tag ${isExpired ? 'expired' : 'valid'}`}>
                          <Calendar size={12} /> {promo.expiry}
                          {isExpired && ' (منتهي)'}
                        </span>
                      ) : (
                        <span className="text-muted">مفتوح دائماً</span>
                      )}
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
                      <div className="promo-actions-group">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleOpenEdit(promo)}
                          title="تعديل الكوبون"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => {
                            if (window.confirm(`هل أنت متأكد من حذف الكوبون ${promo.code}؟`)) {
                              deletePromoCode(promo.id);
                            }
                          }}
                          title="حذف الكوبون"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal to Add New Coupon */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content modal-form-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-form-header">
              <div className="modal-header-icon-circle">
                <Sparkles size={20} className="text-primary" />
              </div>
              <div>
                <h3>إضافة كوبون خصم أو عرض جديد</h3>
                <p className="text-muted">أدخل تفاصيل الكود ونسبة أو قيمة الخصم وشروط استخدامه</p>
              </div>
            </div>

            <form onSubmit={handleCreate} className="admin-edit-form">
              <div className="form-group">
                <label>رمز الكوبون (بالإنجليزية وبدون مسافات): *</label>
                <div className="input-with-icon">
                  <input
                    type="text"
                    required
                    placeholder="مثلاً: AROSS2026 أو MAURITANIA"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/\s+/g, '') })}
                    style={{ textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 'bold' }}
                  />
                  <Tag size={16} className="input-inner-icon" />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>نوع الخصم:</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  >
                    <option value="percentage">نسبة مئوية (%)</option>
                    <option value="fixed">مبلغ مالي ثابت ({settings.currency})</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>قيمة الخصم: *</label>
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

              <div className="form-grid-2">
                <div className="form-group">
                  <label>الحد الأدنى لمبلغ الحجز ({settings.currency}):</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0 إذا كان متاحاً لأي حجز"
                    value={formData.minBookingAmount}
                    onChange={(e) => setFormData({ ...formData, minBookingAmount: e.target.value })}
                  />
                  <span className="field-hint">اتركه 0 إذا كان العرض متاحاً لجميع الحجوزات دون حد أدنى</span>
                </div>

                <div className="form-group">
                  <label>تاريخ انتهاء الصلاحية (اختياري):</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.expiry}
                    onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                  />
                  <span className="field-hint">اتركه فارغاً ليكون الكوبون سارياً ومفتوحاً دائماً</span>
                </div>
              </div>

              <div className="form-group">
                <label>الوصف الترويجي للعرض:</label>
                <input
                  type="text"
                  placeholder="مثال: خصم خاص 15% لحجوزات العرسان الجدد"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="modal-actions-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary">
                  حفظ وتفعيل الكوبون
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal to Edit Existing Coupon */}
      {editingPromo && (
        <div className="modal-overlay" onClick={() => setEditingPromo(null)}>
          <div className="modal-content modal-form-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-form-header">
              <div className="modal-header-icon-circle">
                <Edit3 size={20} className="text-primary" />
              </div>
              <div>
                <h3>تعديل بيانات الكوبون: {editingPromo.code}</h3>
                <p className="text-muted">تحديث قيمة الخصم، الحد الأدنى، أو تاريخ انتهاء الصلاحية</p>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="admin-edit-form">
              <div className="form-group">
                <label>رمز الكوبون: *</label>
                <div className="input-with-icon">
                  <input
                    type="text"
                    required
                    value={editingPromo.code}
                    onChange={(e) => setEditingPromo({ ...editingPromo, code: e.target.value.toUpperCase().replace(/\s+/g, '') })}
                    style={{ textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 'bold' }}
                  />
                  <Tag size={16} className="input-inner-icon" />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>نوع الخصم:</label>
                  <select
                    value={editingPromo.discountType}
                    onChange={(e) => setEditingPromo({ ...editingPromo, discountType: e.target.value })}
                  >
                    <option value="percentage">نسبة مئوية (%)</option>
                    <option value="fixed">مبلغ مالي ثابت ({settings.currency})</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>قيمة الخصم: *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editingPromo.discountValue}
                    onChange={(e) => setEditingPromo({ ...editingPromo, discountValue: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>الحد الأدنى لمبلغ الحجز ({settings.currency}):</label>
                  <input
                    type="number"
                    min="0"
                    value={editingPromo.minBookingAmount}
                    onChange={(e) => setEditingPromo({ ...editingPromo, minBookingAmount: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>تاريخ انتهاء الصلاحية:</label>
                  <input
                    type="date"
                    value={editingPromo.expiry}
                    onChange={(e) => setEditingPromo({ ...editingPromo, expiry: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>الوصف التوضيحي:</label>
                <input
                  type="text"
                  value={editingPromo.description}
                  onChange={(e) => setEditingPromo({ ...editingPromo, description: e.target.value })}
                />
              </div>

              <div className="modal-actions-footer">
                <button type="button" className="btn btn-outline" onClick={() => setEditingPromo(null)}>
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary">
                  تحديث وحفظ التعديلات
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
