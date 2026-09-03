import React from 'react';
import { X, Heart, Trash2, CalendarDays, Eye, MapPin, Star } from 'lucide-react';
import { useApp } from '../context/useApp';

const WishlistModal = () => {
  const { 
    isWishlistOpen, 
    setIsWishlistOpen, 
    wishlist, 
    toggleWishlist, 
    listings, 
    setBookingModalItem, 
    setDetailsModalItem 
  } = useApp();

  if (!isWishlistOpen) return null;

  const wishlistedItems = listings.filter((item) => wishlist.includes(item.id));

  const handleBook = (item) => {
    setIsWishlistOpen(false);
    setBookingModalItem(item);
  };

  const handleViewDetails = (item) => {
    setIsWishlistOpen(false);
    setDetailsModalItem(item);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsWishlistOpen(false)}>
      <div className="modal-content wishlist-modal-content" onClick={(e) => e.stopPropagation()}>
        <button 
          className="modal-close-btn" 
          onClick={() => setIsWishlistOpen(false)}
          aria-label="إغلاق"
        >
          <X size={20} />
        </button>

        <div className="wishlist-modal-header">
          <div className="wishlist-icon-badge">
            <Heart size={26} className="text-danger" fill="currentColor" />
          </div>
          <div>
            <h2>قائمة الخدمات المحفوظة</h2>
            <p className="text-muted">
              {wishlistedItems.length > 0 
                ? `لديك ${wishlistedItems.length} خدمة في قائمتك المفضلة` 
                : 'قائمتك المفضلة فارغة حالياً'}
            </p>
          </div>
        </div>

        <div className="wishlist-items-container">
          {wishlistedItems.length === 0 ? (
            <div className="wishlist-empty-state">
              <Heart size={56} className="empty-heart-icon" />
              <h3>لم تحفظ أي خدمات بعد</h3>
              <p className="text-muted">
                اضغط على أيقونة القلب في أي خدمة أو قاعة لحفظها هنا ومقارنتها لاحقاً مع العائلة أو الأصدقاء.
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => setIsWishlistOpen(false)}
              >
                استعرض الخدمات الآن
              </button>
            </div>
          ) : (
            <div className="wishlist-list">
              {wishlistedItems.map((item) => (
                <div key={item.id} className="wishlist-card-item">
                  <div className="wishlist-thumb">
                    <img src={item.image} alt={item.title} />
                    <span className="wishlist-badge">{item.badge}</span>
                  </div>

                  <div className="wishlist-item-info">
                    <div className="item-title-row">
                      <h4>{item.title}</h4>
                      <div className="item-rating text-primary">
                        <Star size={14} fill="currentColor" /> {item.rating}
                      </div>
                    </div>
                    <div className="item-loc text-muted">
                      <MapPin size={13} /> {item.location}
                    </div>
                    <div className="item-price text-primary">
                      {item.price}
                    </div>
                  </div>

                  <div className="wishlist-item-actions">
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleBook(item)}
                      title="احجز هذه الخدمة الآن"
                    >
                      <CalendarDays size={15} /> حجز
                    </button>
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => handleViewDetails(item)}
                      title="عرض التفاصيل الكاملة"
                    >
                      <Eye size={15} /> تفاصيل
                    </button>
                    <button 
                      className="btn btn-icon delete-wishlist-btn"
                      onClick={() => toggleWishlist(item.id)}
                      title="إزالة من المفضلة"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistModal;
