import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Star, 
  CalendarDays, 
  CheckCircle, 
  MessageCircle, 
  ChevronRight, 
  ChevronLeft, 
  Heart, 
  Users, 
  AlertCircle,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/useApp';

const ListingDetailsModal = () => {
  const { 
    detailsModalItem, 
    setDetailsModalItem, 
    setBookingModalItem, 
    settings,
    isWishlisted,
    toggleWishlist,
    isDateBooked,
    getBookedDates
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');

  if (!detailsModalItem) return null;

  const images = detailsModalItem.images && detailsModalItem.images.length > 0
    ? detailsModalItem.images
    : [detailsModalItem.image];

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const bookedDates = getBookedDates(detailsModalItem.title);
  const isSelectedDateBooked = selectedDate ? isDateBooked(detailsModalItem.title, selectedDate) : false;

  const handleBookNow = () => {
    const item = { ...detailsModalItem, preselectedDate: selectedDate };
    setDetailsModalItem(null);
    setBookingModalItem(item);
  };

  const handleWhatsApp = () => {
    const dateText = selectedDate ? `في تاريخ: ${selectedDate}` : '';
    const text = encodeURIComponent(
      `مرحباً منصة حفلتي، أود الاستفسار والحجز لـ: "${detailsModalItem.title}" (${detailsModalItem.price}) ${dateText}`
    );
    window.open(`https://wa.me/${settings.whatsapp?.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const wish = isWishlisted(detailsModalItem.id);

  return (
    <div className="modal-overlay" onClick={() => setDetailsModalItem(null)}>
      <div className="modal-content modal-details-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-top-actions">
          <button 
            className={`btn-fav-round ${wish ? 'active' : ''}`}
            onClick={() => toggleWishlist(detailsModalItem.id)}
            title={wish ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
          >
            <Heart size={20} fill={wish ? '#ef4444' : 'none'} color={wish ? '#ef4444' : 'currentColor'} />
          </button>
          <button 
            className="modal-close-btn" 
            onClick={() => setDetailsModalItem(null)}
            aria-label="إغلاق"
          >
            <X size={20} />
          </button>
        </div>

        {/* Multi-Image Gallery Carousel */}
        <div className="details-img-carousel">
          <img 
            src={images[activeImageIndex]} 
            alt={`${detailsModalItem.title} - صورة ${activeImageIndex + 1}`} 
            className="main-carousel-img"
          />
          <span className="details-badge">{detailsModalItem.badge}</span>

          {images.length > 1 && (
            <>
              <button className="carousel-nav-btn prev" onClick={handlePrevImage} aria-label="الصورة السابقة">
                <ChevronRight size={22} />
              </button>
              <button className="carousel-nav-btn next" onClick={handleNextImage} aria-label="الصورة التالية">
                <ChevronLeft size={22} />
              </button>

              <div className="carousel-dots">
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`carousel-dot ${idx === activeImageIndex ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Thumbnails Row */}
        {images.length > 1 && (
          <div className="carousel-thumbs-row">
            {images.map((img, idx) => (
              <button
                key={idx}
                className={`thumb-btn ${idx === activeImageIndex ? 'active' : ''}`}
                onClick={() => setActiveImageIndex(idx)}
              >
                <img src={img} alt={`مصغرة ${idx + 1}`} />
              </button>
            ))}
          </div>
        )}

        <div className="details-body">
          <div className="details-header-row">
            <div>
              <h2>{detailsModalItem.title}</h2>
              <div className="details-location text-muted">
                <MapPin size={15} /> {detailsModalItem.location}
              </div>
            </div>
            <div className="details-rating-box text-primary">
              <Star size={18} fill="currentColor" /> {detailsModalItem.rating || 5.0}
            </div>
          </div>

          {/* Quick Specs (Capacity, etc.) */}
          <div className="details-specs-bar">
            {detailsModalItem.capacity && (
              <div className="spec-pill">
                <Users size={16} className="text-primary" />
                <span>السعة: <strong>{detailsModalItem.capacity} شخص</strong></span>
              </div>
            )}
            <div className="spec-pill">
              <span className="text-muted">المدينة:</span>
              <strong>{detailsModalItem.city || 'نواكشوط'}</strong>
            </div>
          </div>

          <div className="details-price-banner">
            <span className="text-muted">السعر التقديري:</span>
            <strong className="text-primary price-val">{detailsModalItem.price}</strong>
          </div>

          {detailsModalItem.description && (
            <div className="details-description">
              <p>{detailsModalItem.description}</p>
            </div>
          )}

          {/* Features Grid */}
          <div className="details-features-section">
            <h4>المزايا والخدمات المتضمنة:</h4>
            <div className="features-grid">
              {(detailsModalItem.amenities || [
                'تكييف وتجهيز فاخر',
                'طاقم خدمة وضيافة متخصص',
                'إضاءة ومؤثرات صوتية',
                'مواقف سيارات آمنة',
                'خيارات مرنة لتعديل المواعيد',
                'دعم فني وإشراف مباشر'
              ]).map((feature, i) => (
                <div key={i} className="feature-item">
                  <CheckCircle size={15} className="text-primary" /> {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Real-Time Availability Checker */}
          <div className="availability-checker-box">
            <div className="avail-header">
              <Calendar size={18} className="text-primary" />
              <h4>التحقق من توفر التاريخ:</h4>
            </div>
            <div className="avail-input-group">
              <input 
                type="date" 
                value={selectedDate} 
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="avail-date-input"
              />
              {selectedDate && (
                <div className={`avail-status-result ${isSelectedDateBooked ? 'booked' : 'available'}`}>
                  {isSelectedDateBooked ? (
                    <>
                      <AlertCircle size={16} /> هذا التاريخ محجوز مسبقاً! يرجى اختيار تاريخ آخر
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} /> هذا التاريخ متاح للحجز الفوري!
                    </>
                  )}
                </div>
              )}
            </div>

            {bookedDates.length > 0 && (
              <div className="booked-dates-list-tag">
                <span className="text-muted" style={{ fontSize: '12px' }}>
                  ملاحظة: التواريخ التالية محجوزة بالفعل لهذه الخدمة:
                </span>
                <div className="booked-tags-wrap">
                  {bookedDates.map((d, i) => (
                    <span key={i} className="booked-tag">📅 {d}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="details-actions">
            <button 
              className="btn btn-primary btn-lg" 
              onClick={handleBookNow} 
              disabled={isSelectedDateBooked}
              style={{ flex: 2 }}
            >
              <CalendarDays size={18} /> احجز هذه الخدمة الآن
            </button>
            <button 
              className="btn btn-outline" 
              onClick={handleWhatsApp} 
              style={{ flex: 1 }}
            >
              <MessageCircle size={18} /> تواصل واتساب
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailsModal;
