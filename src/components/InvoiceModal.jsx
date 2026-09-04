import React from 'react';
import { 
  X, 
  Printer, 
  Calendar, 
  User, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Tag, 
  CreditCard, 
  Share2
} from 'lucide-react';
import { useApp } from '../context/useApp';

const InvoiceModal = () => {
  const { invoiceModalBooking, setInvoiceModalBooking, settings, t, language } = useApp();

  if (!invoiceModalBooking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `سند حجز رسمي من منصة حفلتي 7avelty:\n` +
      `رقم السند: ${invoiceModalBooking.id}\n` +
      `العميل: ${invoiceModalBooking.customerName}\n` +
      `الخدمة: ${invoiceModalBooking.serviceTitle}\n` +
      `التاريخ: ${invoiceModalBooking.date}\n` +
      `وسيلة الدفع: ${invoiceModalBooking.paymentMethod}\n` +
      `المبلغ: ${(Number(invoiceModalBooking.price) || 0).toLocaleString()} ${settings.currency}\n` +
      `الحالة: ${invoiceModalBooking.status}\n` +
      `للتحقق: https://7avelty.mr/verify/${invoiceModalBooking.id}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const statusLabel = {
    confirmed: language === 'ar' ? 'مؤكد ومقبول ✅' : (language === 'fr' ? 'Confirmé ✅' : 'Confirmed ✅'),
    pending: language === 'ar' ? 'قيد المراجعة ⏳' : (language === 'fr' ? 'En cours d’examen ⏳' : 'Under Review ⏳'),
    completed: language === 'ar' ? 'مكتمل بنجاح 🏆' : (language === 'fr' ? 'Terminé 🏆' : 'Completed 🏆'),
    cancelled: language === 'ar' ? 'ملغى ❌' : (language === 'fr' ? 'Annulé ❌' : 'Cancelled ❌')
  }[invoiceModalBooking.status] || invoiceModalBooking.status;

  const paymentLabels = {
    bankily: t('booking.bankily', 'بنكيلي (Bankily)'),
    seddad: t('booking.seddad', 'السداد (Seddad)'),
    masrvi: t('booking.masrvi', 'مصرفي (Masrvi)'),
    click: t('booking.click', 'كليك (Click)'),
    cash: t('booking.cash', 'دفع نقدي')
  };

  const basePrice = Number(invoiceModalBooking.originalPrice || invoiceModalBooking.price) || 0;
  const finalPrice = Number(invoiceModalBooking.price) || 0;
  const discountAmount = Number(invoiceModalBooking.discountAmount) || 0;

  return (
    <div className="modal-overlay" onClick={() => setInvoiceModalBooking(null)}>
      <div className="modal-content invoice-modal-content" onClick={(e) => e.stopPropagation()}>
        <button 
          className="modal-close-btn no-print" 
          onClick={() => setInvoiceModalBooking(null)}
          aria-label="إغلاق"
        >
          <X size={20} />
        </button>

        <div className="invoice-printable-area">
          {/* Invoice Top Ribbon & Header */}
          <div className="invoice-header">
            <div>
              <div className="invoice-brand">
                <ShieldCheck size={32} className="text-primary" />
                <div>
                  <h2>7avelty | حفلتي</h2>
                  <p className="invoice-sub-brand">
                    {language === 'ar' ? 'منصة حجز المناسبات والأفراح الأولى في موريتانيا' : (language === 'fr' ? 'Première plateforme événementielle en Mauritanie' : 'Mauritania’s Premier Event & Wedding Platform')}
                  </p>
                </div>
              </div>
            </div>
            <div className="invoice-meta-top">
              <div className="invoice-badge-status">
                <span className={`status-badge status-${invoiceModalBooking.status}`}>
                  {statusLabel}
                </span>
              </div>
              <div className="invoice-number">
                {language === 'ar' ? 'رقم السند:' : (language === 'fr' ? 'Réf Facture :' : 'Invoice ID:')} <strong>{invoiceModalBooking.id}</strong>
              </div>
              <div className="invoice-date text-muted">
                {language === 'ar' ? 'تاريخ الإصدار:' : (language === 'fr' ? 'Date d’émission :' : 'Issue Date:')} {invoiceModalBooking.createdAt || '2026-08-15'}
              </div>
            </div>
          </div>

          <div className="invoice-divider"></div>

          {/* Client & Booking Info Cards */}
          <div className="invoice-grid-two">
            <div className="invoice-box">
              <h4>{language === 'ar' ? 'بيانات العميل المستفيد:' : (language === 'fr' ? 'Informations du client :' : 'Client Information:')}</h4>
              <p><User size={13} /> <strong>{language === 'ar' ? 'الاسم:' : (language === 'fr' ? 'Nom :' : 'Name:')}</strong> {invoiceModalBooking.customerName}</p>
              <p><Phone size={13} /> <strong>{language === 'ar' ? 'الهاتف:' : (language === 'fr' ? 'Tél :' : 'Phone:')}</strong> {invoiceModalBooking.phone}</p>
              <p><MapPin size={13} /> <strong>{language === 'ar' ? 'المدينة:' : (language === 'fr' ? 'Ville :' : 'City:')}</strong> {invoiceModalBooking.city}</p>
            </div>
            <div className="invoice-box">
              <h4>{language === 'ar' ? 'تفاصيل الفعالية والدفع:' : (language === 'fr' ? 'Détails de l’événement & paiement :' : 'Event & Payment Details:')}</h4>
              <p><Tag size={13} /> <strong>{language === 'ar' ? 'الخدمة:' : (language === 'fr' ? 'Prestation :' : 'Service:')}</strong> {invoiceModalBooking.serviceTitle}</p>
              <p><Calendar size={13} /> <strong>{language === 'ar' ? 'تاريخ المناسبة:' : (language === 'fr' ? 'Date :' : 'Date:')}</strong> {invoiceModalBooking.date}</p>
              <p>
                <CreditCard size={13} /> <strong>{language === 'ar' ? 'طريقة الدفع:' : (language === 'fr' ? 'Moyen de paiement :' : 'Payment:')}</strong> {paymentLabels[invoiceModalBooking.paymentMethod] || invoiceModalBooking.paymentMethod || 'Bankily'}
              </p>
              {invoiceModalBooking.paymentRef && (
                <p style={{ fontSize: '12px' }}>
                  <strong>{language === 'ar' ? 'المرجع:' : (language === 'fr' ? 'Réf :' : 'Ref:')}</strong> <span className="ref-code">{invoiceModalBooking.paymentRef}</span>
                </p>
              )}
            </div>
          </div>

          {invoiceModalBooking.notes && (
            <div className="invoice-notes-box">
              <strong>{language === 'ar' ? 'ملاحظات الحجز:' : (language === 'fr' ? 'Remarques :' : 'Booking Notes:')}</strong> {invoiceModalBooking.notes}
            </div>
          )}

          {/* Pricing Table */}
          <table className="invoice-table">
            <thead>
              <tr>
                <th>{language === 'ar' ? 'البند والوصف' : (language === 'fr' ? 'Désignation & Service' : 'Item & Description')}</th>
                <th>{t('tracker.eventDate', 'تاريخ المناسبة')}</th>
                <th>{t('tracker.payment', 'طريقة السداد')}</th>
                <th>{t('tracker.totalAmount', 'المبلغ')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>{invoiceModalBooking.serviceTitle}</strong>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {invoiceModalBooking.serviceCategory} • {invoiceModalBooking.city}
                  </div>
                </td>
                <td>{invoiceModalBooking.date}</td>
                <td>{paymentLabels[invoiceModalBooking.paymentMethod] || 'Bankily'}</td>
                <td><strong>{basePrice.toLocaleString()} {settings.currency}</strong></td>
              </tr>
            </tbody>
            <tfoot>
              {discountAmount > 0 && (
                <tr className="discount-calc-row">
                  <td colSpan="3" style={{ textAlign: 'left', color: 'var(--success)' }}>
                    {language === 'ar' ? 'خصم الكوبون' : (language === 'fr' ? 'Remise coupon' : 'Coupon discount')} ({invoiceModalBooking.promoCode || 'PROMO'}):
                  </td>
                  <td style={{ color: 'var(--success)', fontWeight: 'bold' }}>
                    - {discountAmount.toLocaleString()} {settings.currency}
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan="3" style={{ textAlign: 'left', fontWeight: 'bold' }}>
                  {t('booking.amountDue', 'المجموع الصافي للدفع:')}
                </td>
                <td>
                  <strong className="text-primary total-price-val">
                    {finalPrice.toLocaleString()} {settings.currency}
                  </strong>
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Verification QR Code & Official Stamp */}
          <div className="invoice-verification-section">
            <div className="qr-code-box">
              {/* Clean Geometric SVG QR Code simulation */}
              <svg width="74" height="74" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg" className="qr-svg">
                <rect width="74" height="74" rx="6" fill="#1e1e1e" />
                <rect x="8" y="8" width="18" height="18" rx="3" stroke="#cba153" strokeWidth="2" />
                <rect x="13" y="13" width="8" height="8" fill="#cba153" />
                <rect x="48" y="8" width="18" height="18" rx="3" stroke="#cba153" strokeWidth="2" />
                <rect x="53" y="13" width="8" height="8" fill="#cba153" />
                <rect x="8" y="48" width="18" height="18" rx="3" stroke="#cba153" strokeWidth="2" />
                <rect x="13" y="53" width="8" height="8" fill="#cba153" />
                <rect x="32" y="10" width="8" height="8" fill="#cba153" />
                <rect x="32" y="32" width="10" height="10" fill="#cba153" />
                <rect x="48" y="48" width="8" height="8" fill="#cba153" />
                <rect x="58" y="58" width="8" height="8" fill="#cba153" />
              </svg>
              <div className="qr-text">
                <strong>{language === 'ar' ? 'رمز التحقق الرقمي' : (language === 'fr' ? 'Code QR de vérification' : 'Digital Verification QR')}</strong>
                <span>{language === 'ar' ? 'امسح الرمز للتحقق من مصداقية السند عبر خوادم حفلتي' : (language === 'fr' ? 'Scannez pour vérifier l’authenticité du reçu sur les serveurs 7avelty' : 'Scan code to verify invoice authenticity via 7avelty servers')}</span>
              </div>
            </div>

            <div className="invoice-official-stamp">
              <div className="stamp-inner">
                <ShieldCheck size={22} />
                <span>7AVELTY</span>
                <strong>{language === 'ar' ? 'معتمد رسمياً' : (language === 'fr' ? 'Certifié Conforme' : 'Officially Certified')}</strong>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="invoice-footer-note">
            <p>
              {language === 'ar' 
                ? <>شكراً لثقتكم في منصة <strong>حفلتي</strong>. لأي تعديل أو استفسار، يرجى الاتصال بمركز خدمة العملاء: <strong>{settings.phone}</strong></>
                : (language === 'fr'
                  ? <>Merci de faire confiance à <strong>7avelty</strong>. Pour toute modification, contactez le service client : <strong>{settings.phone}</strong></>
                  : <>Thank you for trusting <strong>7avelty</strong>. For any inquiries or edits, please contact support: <strong>{settings.phone}</strong></>
                )}
            </p>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {language === 'ar' ? 'نواكشوط، تفرغ زينة، موريتانيا • contact@7avelty.mr' : 'Nouakchott, Tevragh Zeina, Mauritanie • contact@7avelty.mr'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="invoice-actions no-print">
          <button className="btn btn-primary" onClick={handlePrint} style={{ flex: 1 }}>
            <Printer size={16} /> {language === 'ar' ? 'طباعة السند / حفظ PDF' : (language === 'fr' ? 'Imprimer / Sauvegarder PDF' : 'Print / Save PDF')}
          </button>
          <button className="btn btn-outline" onClick={handleShareWhatsApp} style={{ flex: 1 }}>
            <Share2 size={16} /> {language === 'ar' ? 'مشاركة السند عبر واتساب' : (language === 'fr' ? 'Partager via WhatsApp' : 'Share on WhatsApp')}
          </button>
          <button className="btn btn-outline" onClick={() => setInvoiceModalBooking(null)}>
            {t('booking.cancel', 'إلغاء')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
