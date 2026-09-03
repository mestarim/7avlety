import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Phone, 
  Calendar, 
  User, 
  MapPin, 
  FileText, 
  Download,
  CreditCard
} from 'lucide-react';
import { useApp } from '../../context/useApp';

const AdminBookings = () => {
  const { bookings, updateBookingStatus, deleteBooking, setInvoiceModalBooking, settings } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.includes(searchTerm) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.paymentRef && b.paymentRef.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' ? true : b.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' ? true : b.paymentMethod === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleStatusChange = (id, newStatus) => {
    updateBookingStatus(id, newStatus);
  };

  const handleDelete = (id, customerName) => {
    if (window.confirm(`هل أنت متأكد من حذف حجز العميل "${customerName}"؟`)) {
      deleteBooking(id);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'رقم الحجز',
      'اسم العميل',
      'رقم الهاتف',
      'الخدمة',
      'المدينة',
      'تاريخ الفعالية',
      'السعر الأصلي',
      'قيمة الخصم',
      'المبلغ الصافي',
      'كوبون الخصم',
      'طريقة الدفع',
      'رقم مرجع الدفع',
      'الحالة',
      'تاريخ الإنشاء'
    ];

    const rows = bookings.map((b) => [
      b.id,
      `"${b.customerName}"`,
      b.phone,
      `"${b.serviceTitle}"`,
      b.city,
      b.date,
      b.originalPrice || b.price,
      b.discountAmount || 0,
      b.price,
      b.promoCode || 'لا يوجد',
      b.paymentMethod || 'bankily',
      `"${b.paymentRef || ''}"`,
      b.status,
      b.createdAt || ''
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `7avelty_bookings_full_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const paymentMethodLabels = {
    bankily: 'بنكيلي',
    seddad: 'السداد',
    masrvi: 'مصرفي',
    click: 'كليك',
    cash: 'نقدي'
  };

  return (
    <div className="admin-bookings">
      <div className="admin-page-header">
        <div>
          <h2>إدارة طلبات الحجز</h2>
          <p className="text-muted">متابعة طلبات العملاء وطرق السداد وتأكيدها وطباعة السندات الرسمية</p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={handleExportCSV}>
          <Download size={15} /> تصدير تقرير شامل (CSV)
        </button>
      </div>

      {/* Filters Bar */}
      <div className="admin-filters-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="ابحث برقم الحجز، اسم العميل، الهاتف، أو رقم الحوالة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="status-pills">
          <button
            className={`pill-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            الكل ({bookings.length})
          </button>
          <button
            className={`pill-btn ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            معلقة ({bookings.filter((b) => b.status === 'pending').length})
          </button>
          <button
            className={`pill-btn ${statusFilter === 'confirmed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('confirmed')}
          >
            مؤكدة ({bookings.filter((b) => b.status === 'confirmed').length})
          </button>
          <button
            className={`pill-btn ${statusFilter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setStatusFilter('cancelled')}
          >
            ملغاة ({bookings.filter((b) => b.status === 'cancelled').length})
          </button>
        </div>

        {/* Payment Filter */}
        <div className="payment-filter-select-wrap">
          <select 
            value={paymentFilter} 
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="payment-select-filter"
          >
            <option value="all">جميع طرق الدفع</option>
            <option value="bankily">بنكيلي (Bankily)</option>
            <option value="seddad">السداد (Seddad)</option>
            <option value="masrvi">مصرفي (Masrvi)</option>
            <option value="click">كليك (Click)</option>
            <option value="cash">دفع نقدي</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>رقم الحجز</th>
              <th>العميل</th>
              <th>الخدمة المطلوبة</th>
              <th>تاريخ المناسبة</th>
              <th>طريقة الدفع</th>
              <th>المبلغ</th>
              <th>حالة الطلب</th>
              <th>الإجراءات والسند</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((b) => (
                <tr key={b.id}>
                  <td>
                    <strong className="booking-id-tag">{b.id}</strong>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{b.createdAt}</div>
                  </td>
                  <td>
                    <div className="client-cell">
                      <strong><User size={13} style={{ display: 'inline', marginLeft: '4px' }} />{b.customerName}</strong>
                      <a href={`tel:${b.phone}`} className="client-phone">
                        <Phone size={12} /> {b.phone}
                      </a>
                    </div>
                  </td>
                  <td>
                    <div>
                      <strong>{b.serviceTitle}</strong>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        <MapPin size={11} style={{ display: 'inline' }} /> {b.city}
                      </div>
                      {b.notes && (
                        <div className="booking-note-snippet" title={b.notes}>
                          ملاحظة: {b.notes}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} className="text-primary" /> {b.date}
                    </div>
                  </td>
                  <td>
                    <div className="payment-cell">
                      <span className={`payment-badge badge-${b.paymentMethod || 'bankily'}`}>
                        <CreditCard size={11} /> {paymentMethodLabels[b.paymentMethod] || b.paymentMethod || 'بنكيلي'}
                      </span>
                      {b.paymentRef && (
                        <span className="ref-cell-text" title={b.paymentRef}>
                          {b.paymentRef}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div>
                      <strong className="text-primary">
                        {(Number(b.price) || 0).toLocaleString()} {settings.currency}
                      </strong>
                      {b.discountAmount > 0 && (
                        <div style={{ fontSize: '11px', color: 'var(--success)' }}>
                          وفر: {b.discountAmount.toLocaleString()} {b.promoCode && `(${b.promoCode})`}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <select
                      className={`status-select status-${b.status}`}
                      value={b.status}
                      onChange={(e) => handleStatusChange(b.id, e.target.value)}
                    >
                      <option value="pending">⏳ معلق</option>
                      <option value="confirmed">✅ مؤكد</option>
                      <option value="completed">🏆 مكتمل</option>
                      <option value="cancelled">❌ ملغى</option>
                    </select>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="action-btn invoice-btn"
                        onClick={() => setInvoiceModalBooking(b)}
                        title="عرض وطباعة السند / الفاتورة مع QR"
                      >
                        <FileText size={16} />
                      </button>
                      {b.status !== 'confirmed' && (
                        <button
                          className="action-btn success-btn"
                          onClick={() => handleStatusChange(b.id, 'confirmed')}
                          title="تأكيد الحجز فوراً"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {b.status !== 'cancelled' && (
                        <button
                          className="action-btn warn-btn"
                          onClick={() => handleStatusChange(b.id, 'cancelled')}
                          title="إلغاء الطلب"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(b.id, b.customerName)}
                        title="حذف الحجز"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  لا توجد طلبات حجز مطابقة
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookings;
