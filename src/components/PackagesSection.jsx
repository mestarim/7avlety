import React from 'react';
import { Sparkles, CheckCircle2, CalendarDays, MessageCircle } from 'lucide-react';
import { useApp } from '../context/useApp';

const PackagesSection = () => {
  const { packages, setBookingModalItem, settings } = useApp();

  const handleBookPackage = (pkg) => {
    // Transform package to booking modal item format
    setBookingModalItem({
      id: pkg.id,
      title: pkg.title,
      badge: 'بكج متكامل',
      price: `${pkg.packagePrice.toLocaleString()} ${settings.currency}`,
      numericPrice: pkg.packagePrice,
      originalPrice: pkg.originalPrice,
      packageSavings: pkg.savings,
      location: 'نواكشوط (شامل كافة الخدمات)',
      image: pkg.image,
      isPackage: true,
      description: pkg.subtitle,
      notesDefault: `طلب حجز: ${pkg.title}\nالخدمات المشمولة:\n- ${pkg.itemsIncluded.join('\n- ')}`
    });
  };

  const handleWhatsAppPackage = (pkg) => {
    const text = encodeURIComponent(
      `مرحباً منصة حفلتي، أود الاستفسار عن ${pkg.title} بسعر ${pkg.packagePrice.toLocaleString()} ${settings.currency}`
    );
    window.open(`https://wa.me/${settings.whatsapp?.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <section id="packages" className="section packages-section">
      <div className="container">
        <div className="section-header">
          <div className="badge-pill-gold">
            <Sparkles size={16} className="text-primary" /> باقات حفلتي الحصرية
          </div>
          <h2 className="section-title">حزم وبكجات الأعراس الشاملة</h2>
          <p className="section-subtitle">
            وفر وقتك ومالك مع باقاتنا المتكاملة التي تجمع القاعة، الضيافة، السيارات الفاخرة، والتصوير في حزمة واحدة بأسعار لا تُنافس.
          </p>
        </div>

        <div className="packages-grid">
          {packages.map((pkg) => (
            <div key={pkg.id} className={`package-card ${pkg.popular ? 'popular-card' : ''}`}>
              {pkg.popular && <div className="package-popular-ribbon">الأكثر طلباً ومبيعاً ⭐</div>}

              <div className="package-img-wrap">
                <img src={pkg.image} alt={pkg.title} loading="lazy" />
                <span className="package-discount-tag">{pkg.discountBadge}</span>
              </div>

              <div className="package-content">
                <h3 className="package-title">{pkg.title}</h3>
                <p className="package-desc">{pkg.subtitle}</p>

                <div className="package-divider"></div>

                <h4 className="package-includes-title">ماذا تشمل هذه الباقة؟</h4>
                <ul className="package-features-list">
                  {pkg.itemsIncluded.map((item, index) => (
                    <li key={index}>
                      <CheckCircle2 size={16} className="text-primary check-icon" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="package-pricing-box">
                  <div className="package-prices">
                    <span className="package-original-price">
                      {pkg.originalPrice.toLocaleString()} {settings.currency}
                    </span>
                    <span className="package-final-price">
                      {pkg.packagePrice.toLocaleString()} <span className="currency-unit">{settings.currency}</span>
                    </span>
                  </div>
                  <div className="package-savings-note">
                    توفير مؤكد: {pkg.savings.toLocaleString()} {settings.currency}
                  </div>
                </div>

                <div className="package-card-actions">
                  <button 
                    className="btn btn-primary btn-block" 
                    onClick={() => handleBookPackage(pkg)}
                  >
                    <CalendarDays size={18} /> احجز الباقة الآن
                  </button>
                  <button 
                    className="btn btn-outline btn-block package-whatsapp-btn"
                    onClick={() => handleWhatsAppPackage(pkg)}
                  >
                    <MessageCircle size={18} /> استفسار عبر واتساب
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
