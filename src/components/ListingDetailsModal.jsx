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
  Calendar,
  Share2
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
    getBookedDates,
    listings,
    addReviewToListing,
    showToast
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ author: '', rating: 5, comment: '' });

  if (!detailsModalItem) return null;

  // Sync with live updated listing for realtime reviews
  const currentListing = listings.find((l) => l.id === detailsModalItem.id) || detailsModalItem;
  const reviewsList = currentListing.reviews || [];

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.author.trim() || !newReview.comment.trim()) {
      alert('يرجى ملء جميع حقول التقييم');
      return;
    }
    addReviewToListing(detailsModalItem.id, newReview);
    setNewReview({ author: '', rating: 5, comment: '' });
    setShowReviewForm(false);
  };

  const images = currentListing.images && currentListing.images.length > 0
    ? currentListing.images
    : [currentListing.image];

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

  const handleShare = async () => {
    const shareText = `شاهد خدمة "${detailsModalItem.title}" (${detailsModalItem.location}) بسعر ${detailsModalItem.price} على منصة حفلتي للمناسبات:`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: detailsModalItem.title,
          text: shareText,
          url: window.location.href
        });
        return;
      } catch {
        // Fallback
      }
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
      if (showToast) showToast('تم نسخ رابط الخدمة بنجاح للمشاركة! 📋', 'success');
    }
  };

  const wish = isWishlisted(detailsModalItem.id);

  return (
    <div className="modal-overlay" onClick={() => setDetailsModalItem(null)}>
      <div className="modal-content modal-details-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-top-actions">
          <button 
            type="button"
            className="btn-fav-round share-modal-btn"
            onClick={handleShare}
            title="مشاركة هذه الخدمة"
            aria-label="مشاركة"
          >
            <Share2 size={18} />
          </button>
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
              {(currentListing.amenities || [
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

          {/* Customer Reviews & Feedback Section */}
          <div className="details-reviews-section">
            <div className="reviews-section-header">
              <div className="reviews-title-wrap">
                <h4>آراء وتقييمات العملاء</h4>
                <div className="reviews-summary-badge">
                  <Star size={15} fill="#cba153" color="#cba153" />
                  <strong>{currentListing.rating || 5.0}</strong>
                  <span className="text-muted">({reviewsList.length} تقييم)</span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                {showReviewForm ? 'إلغاء' : '+ أضف تجربتك وتقييمك'}
              </button>
            </div>

            {/* Review Submission Form */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="add-review-box">
                <h5>شاركنا رأيك في {currentListing.title}</h5>
                <div className="rating-select-row">
                  <span className="rating-label">درجة التقييم:</span>
                  <div className="star-picker">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="star-pick-btn"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        title={`${star} نجوم`}
                      >
                        <Star
                          size={22}
                          fill={star <= newReview.rating ? '#cba153' : 'none'}
                          color={star <= newReview.rating ? '#cba153' : 'var(--text-muted)'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <input
                    type="text"
                    required
                    placeholder="اسمك الكريم..."
                    value={newReview.author}
                    onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <textarea
                    rows="2"
                    required
                    placeholder="اكتب انطباعك عن الخدمة وجودة التنظيم..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary btn-sm">
                  نشر التقييم الآن ⭐
                </button>
              </form>
            )}

            {/* Reviews List */}
            <div className="reviews-list">
              {reviewsList.length === 0 ? (
                <p className="no-reviews-note text-muted">
                  كن أول من يقيّم هذه الخدمة ويشارك تجربته مع الآخرين!
                </p>
              ) : (
                reviewsList.map((rev) => (
                  <div key={rev.id} className="review-card-bubble">
                    <div className="review-top-meta">
                      <div className="reviewer-info">
                        <strong>{rev.author}</strong>
                        <div className="stars-mini">
                          {[...Array(5)].map((_, idx) => (
                            <Star
                              key={idx}
                              size={12}
                              fill={idx < rev.rating ? '#cba153' : 'none'}
                              color={idx < rev.rating ? '#cba153' : 'var(--text-muted)'}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="review-date text-muted">{rev.date}</span>
                    </div>
                    <p className="review-text">{rev.comment}</p>
                  </div>
                ))
              )}
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
