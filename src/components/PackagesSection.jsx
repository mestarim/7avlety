import React from 'react';
import { Sparkles, CheckCircle2, CalendarDays, MessageCircle, Share2 } from 'lucide-react';
import { useApp } from '../context/useApp';

const PackagesSection = () => {
  const { packages, setBookingModalItem, settings, showToast, t } = useApp();

  const handleBookPackage = (pkg) => {
    setBookingModalItem({
      id: pkg.id,
      title: pkg.title,
      badge: t('categories.allInclusive', 'بكج متكامل'),
      price: `${Number(pkg.packagePrice).toLocaleString()} ${t('common.currency', settings.currency)}`,
      numericPrice: Number(pkg.packagePrice),
      originalPrice: Number(pkg.originalPrice),
      packageSavings: Number(pkg.savings),
      location: 'نواكشوط (شامل كافة الخدمات)',
      image: pkg.image,
      isPackage: true,
      description: pkg.subtitle,
      notesDefault: `${pkg.title}\n- ${(pkg.itemsIncluded || []).join('\n- ')}`
    });
  };

  const handleWhatsAppPackage = (pkg) => {
    const text = encodeURIComponent(
      `Hello 7avelty, I would like to inquire about: ${pkg.title} (${Number(pkg.packagePrice).toLocaleString()} ${t('common.currency', settings.currency)})`
    );
    window.open(`https://wa.me/${settings.whatsapp?.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const handleSharePackage = async (pkg) => {
    const shareText = `${pkg.title} - ${Number(pkg.packagePrice).toLocaleString()} ${t('common.currency', settings.currency)}:`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: pkg.title,
          text: shareText,
          url: `${window.location.origin}#packages`
        });
        return;
      } catch {
        // Fallback
      }
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${shareText} ${window.location.origin}#packages`);
      if (showToast) showToast(t('common.copied', 'تم نسخ رابط باقة العرس للمشاركة! 📋'), 'success');
    }
  };

  return (
    <section id="packages" className="section packages-section">
      <div className="container">
        <div className="section-header">
          <div className="badge-pill-gold">
            <Sparkles size={16} className="text-primary" /> {t('packages.badge', 'باقات حفلتي الحصرية')}
          </div>
          <h2 className="section-title">{t('packages.title', 'حزم وبكجات الأعراس الشاملة')}</h2>
          <p className="section-subtitle">
            {t('packages.subtitle', 'وفر وقتك ومالك مع باقاتنا المتكاملة التي تجمع القاعة، الضيافة، السيارات الفاخرة، والتصوير في حزمة واحدة بأسعار لا تُنافس.')}
          </p>
        </div>

        <div className="packages-grid">
          {packages.map((pkg) => (
            <div key={pkg.id} className={`package-card ${pkg.popular ? 'popular-card' : ''}`}>
              {pkg.popular && <div className="package-popular-ribbon">{t('packages.popularRibbon', 'الأكثر طلباً ومبيعاً ⭐')}</div>}

              <div className="package-img-wrap">
                <img src={pkg.image} alt={pkg.title} loading="lazy" />
                {pkg.discountBadge && (
                  <span className="package-discount-tag">{pkg.discountBadge}</span>
                )}
                <button
                  type="button"
                  className="package-share-btn"
                  onClick={() => handleSharePackage(pkg)}
                  title={t('common.share', 'مشاركة هذه الباقة')}
                  aria-label="مشاركة الباقة"
                >
                  <Share2 size={16} />
                </button>
              </div>

              <div className="package-content">
                <h3 className="package-title">{pkg.title}</h3>
                <p className="package-desc">{pkg.subtitle}</p>

                <div className="package-divider"></div>

                <h4 className="package-includes-title">{t('packages.whatIncluded', 'ماذا تشمل هذه الباقة؟')}</h4>
                <ul className="package-features-list">
                  {(pkg.itemsIncluded || []).map((item, index) => (
                    <li key={index}>
                      <CheckCircle2 size={16} className="text-primary check-icon" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="package-pricing-box">
                  <div className="package-prices">
                    {pkg.originalPrice && pkg.originalPrice > pkg.packagePrice && (
                      <span className="package-original-price">
                        {Number(pkg.originalPrice).toLocaleString()} {t('common.currency', settings.currency)}
                      </span>
                    )}
                    <span className="package-final-price">
                      {Number(pkg.packagePrice).toLocaleString()} <span className="currency-unit">{t('common.currency', settings.currency)}</span>
                    </span>
                  </div>
                  {pkg.savings > 0 && (
                    <div className="package-savings-note">
                      {t('packages.assuredSavings', 'توفير مؤكد:')} {Number(pkg.savings).toLocaleString()} {t('common.currency', settings.currency)}
                    </div>
                  )}
                </div>

                <div className="package-card-actions">
                  <button 
                    className="btn btn-primary btn-block" 
                    onClick={() => handleBookPackage(pkg)}
                  >
                    <CalendarDays size={18} /> {t('packages.bookPackage', 'احجز الباقة الآن')}
                  </button>
                  <button 
                    className="btn btn-outline btn-block package-whatsapp-btn"
                    onClick={() => handleWhatsAppPackage(pkg)}
                  >
                    <MessageCircle size={18} /> {t('common.inquireWhatsApp', 'استفسار عبر واتساب')}
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
