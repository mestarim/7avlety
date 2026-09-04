import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Phone, 
  User, 
  CheckCircle2, 
  MapPin, 
  Tag, 
  FileText, 
  AlertCircle, 
  CreditCard, 
  MessageCircle
} from 'lucide-react';
import { useApp } from '../context/useApp';

const BookingModal = () => {
  const { 
    bookingModalItem, 
    setBookingModalItem, 
    addBooking, 
    setInvoiceModalBooking,
    isDateBooked,
    getBookedDates,
    applyPromoCode,
    settings,
    t,
    language 
  } = useApp();

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    date: '',
    notes: '',
    city: 'نواكشوط'
  });

  // Payment Method: 'bankily' | 'seddad' | 'masrvi' | 'click' | 'cash'
  const [paymentMethod, setPaymentMethod] = useState('bankily');
  const [paymentRef, setPaymentRef] = useState('');

  // Promo Code
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  const [createdBooking, setCreatedBooking] = useState(null);

  // Sync preselected date or default notes
  useEffect(() => {
    if (bookingModalItem) {
      setFormData((prev) => ({
        ...prev,
        date: bookingModalItem.preselectedDate || prev.date || '',
        notes: bookingModalItem.notesDefault || prev.notes || ''
      }));
      setAppliedPromo(null);
      setPromoCodeInput('');
      setPromoError('');
    }
  }, [bookingModalItem]);

  if (!bookingModalItem) return null;

  // Numerical Price calculation
  let basePrice = 0;
  if (bookingModalItem.numericPrice) {
    basePrice = bookingModalItem.numericPrice;
  } else if (typeof bookingModalItem.price === 'number') {
    basePrice = bookingModalItem.price;
  } else {
    const match = bookingModalItem.price.toString().replace(/,/g, '').match(/\d+/);
    basePrice = match ? parseInt(match[0], 10) : 100000;
  }

  const finalPrice = appliedPromo ? appliedPromo.finalAmount : basePrice;
  const discountAmount = appliedPromo ? appliedPromo.discountAmount : 0;

  const bookedDates = getBookedDates(bookingModalItem.title);
  const isDateConflict = formData.date ? isDateBooked(bookingModalItem.title, formData.date) : false;

  const handleApplyPromo = () => {
    setPromoError('');
    const result = applyPromoCode(promoCodeInput, basePrice);
    if (result.valid) {
      setAppliedPromo(result);
    } else {
      setPromoError(result.message);
      setAppliedPromo(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone || !formData.date) {
      alert(t('booking.fillRequired', 'يرجى ملء جميع الحقول الإلزامية'));
      return;
    }

    if (isDateConflict) {
      alert(t('booking.dateBookedWarning', 'التاريخ المحدد محجوز بالفعل لهذه الخدمة! يرجى اختيار تاريخ آخر.'));
      return;
    }

    const packageDiscount = bookingModalItem.packageSavings || 0;
    const initialPrice = bookingModalItem.originalPrice || basePrice;
    const totalDiscount = discountAmount + packageDiscount;

    const newBooking = addBooking({
      customerName: formData.customerName,
      phone: formData.phone,
      serviceTitle: bookingModalItem.title,
      serviceCategory: bookingModalItem.badge || 'خدمة مناسبات',
      city: formData.city || 'نواكشوط',
      date: formData.date,
      price: finalPrice,
      originalPrice: initialPrice,
      discountAmount: totalDiscount,
      promoCode: appliedPromo ? appliedPromo.code : (packageDiscount > 0 ? 'خصم باقة شاملة' : null),
      paymentMethod: paymentMethod,
      paymentRef: paymentRef || (paymentMethod === 'cash' ? 'دفع عند المعاينة' : 'بانتظار التأكيد'),
      notes: formData.notes
    });

    setCreatedBooking(newBooking);
  };

  const handleClose = () => {
    setCreatedBooking(null);
    setBookingModalItem(null);
    setFormData({ customerName: '', phone: '', date: '', notes: '', city: 'نواكشوط' });
    setAppliedPromo(null);
    setPaymentRef('');
  };

  const handleViewInvoice = () => {
    const booking = createdBooking;
    handleClose();
    setInvoiceModalBooking(booking);
  };

  const handleWhatsAppBookingConfirm = () => {
    const text = encodeURIComponent(
      `السلام عليكم، لقد قمت بتسجيل طلب حجز في منصة حفلتي:\n` +
      `- رقم الحجز: ${createdBooking.id}\n` +
      `- الخدمة: ${createdBooking.serviceTitle}\n` +
      `- التاريخ: ${createdBooking.date}\n` +
      `- الاسم: ${createdBooking.customerName}\n` +
      `- طريقة الدفع: ${createdBooking.paymentMethod}\n` +
      `- الإجمالي: ${createdBooking.price.toLocaleString()} ${settings.currency}`
    );
    window.open(`https://wa.me/${settings.whatsapp?.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content modal-booking-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose} aria-label="إغلاق">
          <X size={20} />
        </button>

        {createdBooking ? (
          /* Confirmation Success State */
          <div className="booking-success-view">
            <div className="success-icon-anim">
              <CheckCircle2 size={68} className="text-success" />
            </div>
            <h2>{t('booking.successTitle', 'تم استلام طلب الحجز بنجاح!')}</h2>
            <p className="text-muted">
              {t('booking.successDesc', 'شكراً لاختيارك منصة حفلتي. تم تسجيل حجزك برقم مرجعي:')} <strong>{createdBooking.id}</strong>
            </p>

            <div className="booking-summary-card">
              <div className="summary-row">
                <span>{t('booking.serviceRequested', 'الخدمة المطلوبة:')}</span>
                <strong>{createdBooking.serviceTitle}</strong>
              </div>
              <div className="summary-row">
                <span>{t('booking.eventDate', 'تاريخ المناسبة:')}</span>
                <strong>{createdBooking.date}</strong>
              </div>
              <div className="summary-row">
                <span>{t('booking.paymentMethodLabel', 'وسيلة الدفع:')}</span>
                <strong style={{ textTransform: 'uppercase' }}>{createdBooking.paymentMethod}</strong>
              </div>
              <div className="summary-row">
                <span>{t('booking.totalAmountLabel', 'المبلغ الإجمالي:')}</span>
                <strong className="text-primary price-hl">
                  {createdBooking.price.toLocaleString()} {settings.currency}
                </strong>
              </div>
            </div>

            <div className="success-actions-row">
              <button className="btn btn-primary" onClick={handleViewInvoice}>
                <FileText size={18} /> {t('booking.viewInvoice', 'عرض وطباعة السند / الفاتورة')}
              </button>
              <button className="btn btn-outline whatsapp-btn-confirm" onClick={handleWhatsAppBookingConfirm}>
                <MessageCircle size={18} /> {t('booking.whatsappConfirm', 'تأكيد فوري عبر واتساب')}
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <>
            <div className="booking-header">
              <h3>{t('booking.bookingHeader', 'طلب حجز وتأكيد الخدمة')}</h3>
              <div className="booking-item-badge">
                <span>{bookingModalItem.title}</span>
                <strong className="text-primary">
                  {basePrice.toLocaleString()} {settings.currency}
                </strong>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="booking-form-modern">
              {/* Personal Info */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label><User size={15} /> {t('booking.clientName', 'الاسم الكامل *')}</label>
                  <input
                    type="text"
                    required
                    placeholder={language === 'ar' ? 'مثال: محمد ولد أحمد' : (language === 'fr' ? 'ex: Mohamed Ould Ahmed' : 'e.g. Mohamed Ahmed')}
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label><Phone size={15} /> {t('booking.clientPhone', 'رقم الهاتف (واتساب) *')}</label>
                  <input
                    type="tel"
                    required
                    placeholder="+222 46 -- -- --"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              {/* City & Date */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label><MapPin size={15} /> {t('booking.eventCity', 'المدينة *')}</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  >
                    <option value="نواكشوط">{t('hero.cities.nouakchott', 'نواكشوط')}</option>
                    <option value="نواذيبو">{t('hero.cities.nouadhibou', 'نواذيبو')}</option>
                    <option value="روصو">{t('hero.cities.rosso', 'روصو')}</option>
                    <option value="كيفه">{t('hero.cities.kiffa', 'كيفه')}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label><Calendar size={15} /> {t('booking.eventDate', 'تاريخ الفعالية / الحجز *')}</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={isDateConflict ? 'input-error' : ''}
                  />
                  {isDateConflict && (
                    <div className="date-conflict-warning">
                      <AlertCircle size={14} /> {t('booking.dateBookedWarning', 'هذا التاريخ محجوز مسبقاً! يرجى اختيار تاريخ بديل.')}
                    </div>
                  )}
                  {bookedDates.length > 0 && !formData.date && (
                    <span className="text-muted" style={{ fontSize: '11px' }}>
                      {language === 'ar' ? 'محجوز سابقاً: ' : (language === 'fr' ? 'Déjà réservé : ' : 'Already booked: ')}{bookedDates.join('، ')}
                    </span>
                  )}
                </div>
              </div>

              {/* Mauritanian Payment Gateway Selector */}
              <div className="payment-gateway-section">
                <label className="section-label">
                  <CreditCard size={15} /> {t('booking.paymentMethod', 'طريقة الدفع وتأكيد الحجز:')}
                </label>
                <div className="payment-options-grid">
                  {[
                    { id: 'bankily', name: t('booking.bankily', 'بنكيلي (Bankily)'), desc: t('booking.bankilyDesc', 'تطبيق البنك الشعبي موريتانيا') },
                    { id: 'seddad', name: t('booking.seddad', 'السداد (Seddad)'), desc: t('booking.seddadDesc', 'تطبيق بنك المعاملات الإسلامية') },
                    { id: 'masrvi', name: t('booking.masrvi', 'مصرفي (Masrvi)'), desc: t('booking.masrviDesc', 'تطبيق بنك التجارة والمعاملات') },
                    { id: 'click', name: t('booking.click', 'كليك (Click)'), desc: t('booking.clickDesc', 'البريد الموريتاني') },
                    { id: 'cash', name: t('booking.cash', 'دفع نقدي'), desc: t('booking.cashDesc', 'معاينة ودفع خلال 24 ساعة') }
                  ].map((method) => (
                    <div
                      key={method.id}
                      className={`payment-option-card ${paymentMethod === method.id ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod(method.id)}
                    >
                      <div className="payment-radio-indicator">
                        {paymentMethod === method.id && <div className="inner-dot" />}
                      </div>
                      <div className="payment-info">
                        <strong>{method.name}</strong>
                        <span>{method.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bank Account Instructions */}
                {paymentMethod !== 'cash' && (
                  <div className="bank-account-box">
                    <p>
                      {t('booking.transferInstructions', 'يرجى تحويل العربون (أو المبلغ كاملاً) إلى حسابنا عبر')} <strong>{paymentMethod.toUpperCase()}</strong>:
                    </p>
                    <div className="account-number-pill">
                      <span>{t('booking.accountNumber', 'رقم الحساب / الهاتف:')}</span>
                      <strong>{settings.phone}</strong>
                    </div>
                    <div className="form-group" style={{ marginTop: '10px' }}>
                      <input
                        type="text"
                        placeholder={t('booking.refPlaceholder', 'أدخل رقم عملية التحويل (Reference Number)...')}
                        value={paymentRef}
                        onChange={(e) => setPaymentRef(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Promo Code Section */}
              <div className="promo-code-box">
                <div className="promo-input-row">
                  <Tag size={16} className="text-primary" />
                  <input
                    type="text"
                    placeholder={t('booking.promoPlaceholder', 'هل لديك كود خصم؟ (مثلاً: AROSS2026)')}
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                  />
                  <button type="button" className="btn btn-outline btn-sm" onClick={handleApplyPromo}>
                    {t('booking.applyPromo', 'تطبيق')}
                  </button>
                </div>

                {appliedPromo && (
                  <div className="promo-success-alert">
                    <CheckCircle2 size={15} /> {language === 'ar' ? 'تم تطبيق الكوبون' : (language === 'fr' ? 'Coupon appliqué' : 'Coupon applied')} <strong>{appliedPromo.code}</strong>! {language === 'ar' ? 'خصم' : (language === 'fr' ? 'Remise' : 'Discount')} {appliedPromo.discountAmount.toLocaleString()} {settings.currency}
                  </div>
                )}
                {promoError && (
                  <div className="promo-error-alert">
                    <AlertCircle size={15} /> {promoError}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="price-breakdown-card">
                <div className="price-row">
                  <span>{t('booking.basePrice', 'السعر الأساسي:')}</span>
                  <span>{basePrice.toLocaleString()} {settings.currency}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="price-row discount-row text-success">
                    <span>{t('booking.appliedDiscount', 'الخصم المطبق:')}</span>
                    <span>- {discountAmount.toLocaleString()} {settings.currency}</span>
                  </div>
                )}
                <div className="price-row total-row">
                  <strong>{t('booking.amountDue', 'المبلغ المطلوب دفعه:')}</strong>
                  <strong className="text-primary total-amount">
                    {finalPrice.toLocaleString()} {settings.currency}
                  </strong>
                </div>
              </div>

              {/* Notes */}
              <div className="form-group">
                <label>{t('booking.notes', 'ملاحظات أو متطلبات خاصة (اختياري)')}</label>
                <textarea
                  rows="2"
                  placeholder={t('booking.notesPlaceholder', 'أي تفاصيل ترغب بإضافتها أو ترتيبات خاصة ترغب بها...')}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                ></textarea>
              </div>

              <div className="booking-modal-actions">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-block"
                  disabled={isDateConflict}
                >
                  <CheckCircle2 size={18} /> {t('booking.confirmBooking', 'تأكيد وإرسال طلب الحجز')}
                </button>
                <button type="button" className="btn btn-outline btn-block" onClick={handleClose}>
                  {t('booking.cancel', 'إلغاء')}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
