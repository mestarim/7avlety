import React, { useState } from 'react';
import { 
  Star, 
  MapPin, 
  CalendarDays, 
  FilterX, 
  Heart, 
  MessageCircle, 
  Users, 
  SlidersHorizontal, 
  Sparkles, 
  ArrowUpDown
} from 'lucide-react';
import { useApp } from '../context/useApp';

const FeaturedListings = () => {
  const { 
    listings, 
    categories,
    setBookingModalItem, 
    setDetailsModalItem,
    filterCategory, 
    setFilterCategory, 
    filterCity, 
    setFilterCity, 
    filterKeyword, 
    setFilterKeyword,
    toggleWishlist,
    isWishlisted,
    settings 
  } = useApp();

  const [capacityFilter, setCapacityFilter] = useState('all'); // 'all' | 'small' | 'medium' | 'large'
  const [maxPriceFilter, setMaxPriceFilter] = useState(3000000);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'rating' | 'price-asc' | 'price-desc' | 'capacity'

  // Dynamic category tabs derived from user-managed categories
  const categoryTabs = [
    { id: 'all', label: 'جميع الخدمات' },
    ...categories.map((c) => ({
      id: c.title || c.name,
      label: c.title || c.name
    }))
  ];

  const cityTabs = ['all', 'نواكشوط', 'نواذيبو', 'روصو', 'كيفه'];

  // Filtering Logic
  const filteredListings = listings.filter((item) => {
    // Category match
    let matchesCategory = true;
    if (filterCategory !== 'all') {
      const cat = filterCategory.toLowerCase();
      matchesCategory = 
        (item.category && item.category.toLowerCase().includes(cat)) ||
        (item.badge && item.badge.toLowerCase().includes(cat)) ||
        item.title.toLowerCase().includes(cat) ||
        (cat.includes('قاعات') && (item.badge?.includes('قاعة') || item.title.includes('قاعة'))) ||
        (cat.includes('فنادق') && (item.title.includes('فندق') || item.badge?.includes('الأكثر طلباً'))) ||
        (cat.includes('صوت') && (item.badge?.includes('معدات') || item.title.includes('صوت') || item.title.includes('إضاءة'))) ||
        (cat.includes('سيارات') && (item.badge?.includes('سيارة') || item.title.includes('رويس') || item.title.includes('سيارة') || item.title.includes('لاندكروزر'))) ||
        (cat.includes('أواني') && (item.badge?.includes('أواني') || item.badge?.includes('ضيافة'))) ||
        (cat.includes('تصوير') && (item.category?.includes('تصوير') || item.title.includes('تصوير'))) ||
        (cat.includes('هدايا') && (item.badge?.includes('هدايا') || item.title.includes('سلة') || item.title.includes('هدايا')));
    }

    // City match
    let matchesCity = true;
    if (filterCity !== 'all') {
      matchesCity = (item.city && item.city.includes(filterCity)) || (item.location && item.location.includes(filterCity));
    }

    // Keyword match
    let matchesKeyword = true;
    if (filterKeyword && filterKeyword.trim() !== '') {
      const kw = filterKeyword.toLowerCase();
      matchesKeyword = 
        item.title.toLowerCase().includes(kw) || 
        (item.location && item.location.toLowerCase().includes(kw)) ||
        (item.badge && item.badge.toLowerCase().includes(kw));
    }

    // Capacity filter
    let matchesCapacity = true;
    if (capacityFilter !== 'all') {
      const cap = item.capacity || 0;
      if (capacityFilter === 'small') matchesCapacity = cap > 0 && cap <= 200;
      else if (capacityFilter === 'medium') matchesCapacity = cap > 200 && cap <= 500;
      else if (capacityFilter === 'large') matchesCapacity = cap > 500;
    }

    // Price Filter
    let matchesPrice = true;
    const priceNum = item.numericPrice || (typeof item.price === 'number' ? item.price : 0);
    if (priceNum > 0) {
      matchesPrice = priceNum <= maxPriceFilter;
    }

    return matchesCategory && matchesCity && matchesKeyword && matchesCapacity && matchesPrice;
  });

  // Sorting Logic
  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === 'rating') {
      return (b.rating || 0) - (a.rating || 0);
    }
    if (sortBy === 'price-asc') {
      const pA = a.numericPrice || (typeof a.price === 'number' ? a.price : 0);
      const pB = b.numericPrice || (typeof b.price === 'number' ? b.price : 0);
      return pA - pB;
    }
    if (sortBy === 'price-desc') {
      const pA = a.numericPrice || (typeof a.price === 'number' ? a.price : 0);
      const pB = b.numericPrice || (typeof b.price === 'number' ? b.price : 0);
      return pB - pA;
    }
    if (sortBy === 'capacity') {
      return (b.capacity || 0) - (a.capacity || 0);
    }
    return 0; // 'featured' keeps default order
  });

  const handleResetFilters = () => {
    setFilterCategory('all');
    setFilterCity('all');
    setFilterKeyword('');
    setCapacityFilter('all');
    setMaxPriceFilter(3000000);
    setSortBy('featured');
  };

  const handleQuickWhatsApp = (e, item) => {
    e.stopPropagation();
    const text = encodeURIComponent(`مرحباً حفلتي، أود الاستفسار عن: ${item.title} (${item.price})`);
    window.open(`https://wa.me/${settings.whatsapp?.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <section id="featured" className="section" style={{ backgroundColor: 'var(--bg-dark)' }}>
      <div className="container">
        <div className="section-header">
          <div className="badge-pill-gold">
            <Sparkles size={16} className="text-primary" /> مختارات فاخرة لمناسبتك
          </div>
          <h2 className="section-title">العروض والخدمات المتاحة</h2>
          <p className="section-subtitle">
            استعرض وحجز قاعات الأفراح، الفنادق، السيارات والمعدات مع توفر التحقق اللحظي والحجز المباشر
          </p>
        </div>

        {/* Category Tabs */}
        <div className="filter-tabs-wrapper">
          <div className="category-pills-bar">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                className={`category-pill ${filterCategory === tab.id ? 'active' : ''}`}
                onClick={() => setFilterCategory(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="filter-sub-bar">
            {/* City Selector */}
            <div className="city-filter-group">
              <span className="filter-label"><MapPin size={14} /> المدينة:</span>
              <div className="city-pills">
                {cityTabs.map((city) => (
                  <button
                    key={city}
                    className={`city-pill ${filterCity === city ? 'active' : ''}`}
                    onClick={() => setFilterCity(city)}
                  >
                    {city === 'all' ? 'الكل' : city}
                  </button>
                ))}
              </div>
            </div>

            {/* Sorting Dropdown */}
            <div className="sort-filter-group">
              <span className="filter-label"><ArrowUpDown size={14} className="text-primary" /> ترتيب:</span>
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="ترتيب وفرز العروض"
              >
                <option value="featured">المميز والافتراضي 👑</option>
                <option value="rating">الأعلى تقييماً ⭐</option>
                <option value="price-asc">السعر: من الأقل للأعلى 💰</option>
                <option value="price-desc">السعر: من الأعلى للأقل 💎</option>
                <option value="capacity">السعة: الأكبر فالأصغر 👥</option>
              </select>
            </div>

            {/* Advanced Filters Toggle */}
            <button 
              className={`btn btn-outline btn-sm adv-filter-toggle-btn ${showAdvancedFilters ? 'active' : ''}`}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <SlidersHorizontal size={14} /> فلاتر متقدمة
            </button>
          </div>

          {/* Advanced Filter Collapse Box */}
          {showAdvancedFilters && (
            <div className="advanced-filter-drawer">
              <div className="adv-filter-grid">
                {/* Capacity */}
                <div className="adv-filter-col">
                  <label><Users size={14} className="text-primary" /> سعة القاعة / الحضور:</label>
                  <div className="adv-options-row">
                    {[
                      { id: 'all', label: 'أي سعة' },
                      { id: 'small', label: 'حتى 200 ضيف' },
                      { id: 'medium', label: '200 - 500 ضيف' },
                      { id: 'large', label: 'أكثر من 500 ضيف' }
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        className={`adv-chip ${capacityFilter === c.id ? 'active' : ''}`}
                        onClick={() => setCapacityFilter(c.id)}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Slider */}
                <div className="adv-filter-col">
                  <div className="adv-label-row">
                    <label>الحد الأقصى للسعر:</label>
                    <span className="text-primary font-bold">{maxPriceFilter.toLocaleString()} {settings.currency}</span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="3000000"
                    step="50000"
                    value={maxPriceFilter}
                    onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                    className="calc-range-slider"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Listings Grid */}
        {sortedListings.length === 0 ? (
          <div className="empty-listings-state">
            <FilterX size={48} className="text-muted empty-filter-icon" />
            <h3>لا توجد خدمات مطابقة لبحثك</h3>
            <p className="text-muted">جرب تغيير معايير البحث أو تصفية تصنيف أو مدينة أخرى</p>
            <button className="btn btn-outline" onClick={handleResetFilters}>
              إعادة ضبط الفلاتر
            </button>
          </div>
        ) : (
          <div className="listings-grid">
            {sortedListings.map((item) => {
              const wish = isWishlisted(item.id);
              return (
                <div 
                  key={item.id} 
                  className="listing-card"
                  onClick={() => setDetailsModalItem(item)}
                >
                  <div className="listing-img-box">
                    <img src={item.image} alt={item.title} loading="lazy" />
                    <span className="listing-badge">{item.badge}</span>

                    {/* Wishlist Heart Button */}
                    <button
                      className={`listing-card-fav-btn ${wish ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(item.id);
                      }}
                      title={wish ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
                      aria-label="حفظ في المفضلة"
                    >
                      <Heart size={18} fill={wish ? '#ef4444' : 'rgba(0,0,0,0.3)'} color={wish ? '#ef4444' : '#fff'} />
                    </button>

                    {item.capacity && (
                      <span className="listing-capacity-tag">
                        <Users size={12} /> {item.capacity} ضيف
                      </span>
                    )}
                  </div>

                  <div className="listing-content">
                    <div className="listing-category-badge">{item.category}</div>
                    <h3 className="listing-title">{item.title}</h3>
                    
                    <div className="listing-meta-row">
                      <div className="listing-location">
                        <MapPin size={14} className="text-primary" />
                        <span>{item.location}</span>
                      </div>
                      <div className="listing-rating">
                        <Star size={14} fill="#f59e0b" color="#f59e0b" />
                        <span>{item.rating}</span>
                        {item.reviews && item.reviews.length > 0 && (
                          <span className="listing-reviews-count">({item.reviews.length})</span>
                        )}
                      </div>
                    </div>

                    <div className="listing-features-tags">
                      {(item.features || item.amenities || []).slice(0, 3).map((feat, idx) => (
                        <span key={idx} className="feat-chip">{feat}</span>
                      ))}
                    </div>

                    <div className="listing-footer">
                      <div className="listing-price-box">
                        <span className="price-label">يبدأ من</span>
                        <span className="price-value">{item.price}</span>
                      </div>

                      <div className="listing-actions">
                        {/* Quick WhatsApp Inquiry */}
                        <button
                          type="button"
                          className="btn-icon-round whatsapp-card-btn"
                          onClick={(e) => handleQuickWhatsApp(e, item)}
                          title="استفسار سريع عبر واتساب"
                          aria-label="واتساب"
                        >
                          <MessageCircle size={16} />
                        </button>

                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setBookingModalItem(item);
                          }}
                        >
                          <CalendarDays size={14} /> حجز الآن
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedListings;
