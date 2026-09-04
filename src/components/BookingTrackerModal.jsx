import React, { useState } from 'react';
import { 
  Search, 
  X, 
  CalendarCheck2, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  MessageCircle, 
  MapPin, 
  AlertCircle,
  Calendar,
  Sparkles,
  CreditCard
} from 'lucide-react';
import { useApp } from '../context/useApp';

const BookingTrackerModal = () => {
  const { 
    isTrackerModalOpen, 
    setIsTrackerModalOpen, 
    lookupBooking, 
    setInvoiceModalBooking,
    settings 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState([]);

  if (!isTrackerModalOpen) return null;

  const handleSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!searchQuery.trim()) return;
    const found = lookupBooking(searchQuery);
    setResults(found);
    setHasSearched(true);
  };

  const handleReset = () => {
    setSearchQuery('');
    setResults([]);
    setHasSearched(false);
  };

  const handleWhatsAppInquiry = (booking) => {
    const text = encodeURIComponent(
      `مرحباً منصة حفلتي، أود الاستفسار عن حالة حجزي رقم (${booking.id}) لخدمة: "${booking.serviceTitle}" المقررة بتاريخ: ${booking.date}`
    );
    window.open(`https://wa.me/${settings.whatsapp?.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const paymentLabels = {
    bankily: 'تطبيق بنكيلي',
    seddad: 'تطبيق السداد',
    masrvi: 'تطبيق مصرفي',
    click: 'خدمة كليك',
    cash: 'دفع نقدي عند المعاينة'
  };

  return (
    <div className="modal-overlay" onClick={() => setIsTrackerModalOpen(false)}>
      <div className="modal-content tracker-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header tracker-modal-header">
          <div className="tracker-title-wrap">
            <div className="tracker-icon-badge">
              <CalendarCheck2 size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="modal-title">تتبع حالة الحجز</h3>
              <p className="modal-subtitle">ابحث برقم الحجز (مثل BK-1001) أو برقم هاتفك المسجل</p>
            </div>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={() => setIsTrackerModalOpen(false)}
            aria-label="إغلاق"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="tracker-search-form">
          <div className="tracker-input-group">
            <Search size={18} className="tracker-search-icon" />
            <input
              type="text"
              className="tracker-input"
              placeholder="اكتب رقم الحجز (BK-1001) أو رقم هاتفك..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button type="button" className="tracker-clear-btn" onClick={handleReset}>
                <X size={16} />
              </button>
            )}
          </div>
          <button type="submit" className="btn btn-primary tracker-submit-btn">
            بحث وتتبع
          </button>
        </form>

        {/* Results View */}
        <div className="tracker-results-container">
          {hasSearched && results.length === 0 && (
            <div className="tracker-empty-state">
              <AlertCircle size={40} className="text-muted" />
              <h4>لم يتم العثور على أي حجز مطابق</h4>
              <p>تأكد من كتابة رقم الحجز بالشكل الصحيح أو رقم الهاتف المستخدم عند التسجيل.</p>
            </div>
          )}

          {results.map((booking) => {
            const isConfirmed = booking.status === 'confirmed' || booking.status === 'completed';
            const isCancelled = booking.status === 'cancelled';
            const isPending = booking.status === 'pending';

            return (
              <div key={booking.id} className={`tracker-card status-${booking.status}`}>
                <div className="tracker-card-top">
                  <div className="tracker-booking-id">
                    <span className="id-label">رقم الحجز:</span>
                    <span className="id-value font-bold">{booking.id}</span>
                  </div>

                  {isPending && (
                    <span className="tracker-status-pill status-pending">
                      <Clock size={14} /> قيد التدقيق والمراجعة
                    </span>
                  )}
                  {isConfirmed && (
                    <span className="tracker-status-pill status-confirmed">
                      <CheckCircle2 size={14} /> تم التأكيد رسمياً ✅
                    </span>
                  )}
                  {isCancelled && (
                    <span className="tracker-status-pill status-cancelled">
                      <XCircle size={14} /> تم الإلغاء
                    </span>
                  )}
                </div>

                <div className="tracker-card-body">
                  <h4 className="tracker-service-title">{booking.serviceTitle}</h4>
                  
                  <div className="tracker-details-grid">
                    <div className="tracker-detail-item">
                      <Calendar size={15} className="text-primary" />
                      <span>تاريخ المناسبة: <strong>{booking.date}</strong></span>
                    </div>
                    <div className="tracker-detail-item">
                      <MapPin size={15} className="text-primary" />
                      <span>المدينة: <strong>{booking.city || 'نواكشوط'}</strong></span>
                    </div>
                    <div className="tracker-detail-item">
                      <CreditCard size={15} className="text-primary" />
                      <span>طريقة الدفع: <strong>{paymentLabels[booking.paymentMethod] || booking.paymentMethod}</strong></span>
                    </div>
                    <div className="tracker-detail-item">
                      <Sparkles size={15} className="text-primary" />
                      <span>المبلغ الإجمالي: <strong className="text-primary">{Number(booking.price).toLocaleString()} {settings.currency}</strong></span>
                    </div>
                  </div>

                  {booking.paymentRef && (
                    <div className="tracker-ref-note">
                      <span>مرجع الدفع:</span> <code>{booking.paymentRef}</code>
                    </div>
                  )}

                  {booking.notes && (
                    <div className="tracker-customer-notes">
                      <strong>ملاحظاتك:</strong> {booking.notes}
                    </div>
                  )}
                </div>

                <div className="tracker-card-actions">
                  <button 
                    type="button" 
                    className="btn btn-outline btn-sm tracker-invoice-btn"
                    onClick={() => {
                      setIsTrackerModalOpen(false);
                      setInvoiceModalBooking(booking);
                    }}
                  >
                    <FileText size={15} /> عرض الفاتورة والطباعة
                  </button>

                  <button 
                    type="button" 
                    className="btn btn-primary btn-sm tracker-whatsapp-btn"
                    onClick={() => handleWhatsAppInquiry(booking)}
                  >
                    <MessageCircle size={15} /> استفسار واتساب
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BookingTrackerModal;
