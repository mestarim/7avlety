import React, { useState } from 'react';
import { 
  X, 
  Calculator, 
  Sparkles, 
  Users, 
  Check, 
  CalendarDays 
} from 'lucide-react';
import { useApp } from '../context/useApp';

const BudgetCalculatorModal = () => {
  const { 
    isBudgetCalculatorOpen, 
    setIsBudgetCalculatorOpen, 
    listings, 
    setBookingModalItem,
    settings,
    t,
    language 
  } = useApp();

  const [budget, setBudget] = useState(1800000);
  const [guests, setGuests] = useState(350);
  const [selectedServices, setSelectedServices] = useState({
    hall: true,
    car: true,
    sound: true,
    photography: true,
    hospitality: true
  });

  if (!isBudgetCalculatorOpen) return null;

  const toggleService = (key) => {
    setSelectedServices((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Preset quick budgets
  const budgetPresets = [
    { label: language === 'ar' ? 'اقتصادي' : (language === 'fr' ? 'Économique' : 'Budget'), amount: 900000 },
    { label: language === 'ar' ? 'متوسط راقٍ' : (language === 'fr' ? 'Standard Plus' : 'Premium'), amount: 1800000 },
    { label: language === 'ar' ? 'فاخر VIP' : (language === 'fr' ? 'Luxe VIP' : 'Luxury VIP'), amount: 3000000 },
    { label: language === 'ar' ? 'ملكي أسطوري' : (language === 'fr' ? 'Royal Légendaire' : 'Royal Grand'), amount: 5000000 },
  ];

  // Smart matching algorithm
  const findBestMatches = () => {
    const recommended = [];
    let allocatedTotal = 0;

    // 1. Hall
    if (selectedServices.hall) {
      const halls = listings.filter((l) => l.category === 'قاعات الأفراح' || l.category === 'الفنادق والمؤتمرات');
      // Pick hall with capacity >= guests and price within reasonable proportion
      const suitableHalls = halls.filter((h) => (h.capacity || 400) >= guests * 0.8);
      const chosenHall = (suitableHalls.length > 0 ? suitableHalls : halls).sort(
        (a, b) => Math.abs(a.numericPrice - budget * 0.5) - Math.abs(b.numericPrice - budget * 0.5)
      )[0] || halls[0];

      if (chosenHall) {
        recommended.push({
          role: language === 'ar' ? 'القاعة والمقر' : (language === 'fr' ? 'Salle & Lieu' : 'Venue & Hall'),
          item: chosenHall,
          cost: chosenHall.numericPrice
        });
        allocatedTotal += chosenHall.numericPrice;
      }
    }

    // 2. Car
    if (selectedServices.car) {
      const cars = listings.filter((l) => l.category === 'سيارات زفاف');
      const chosenCar = budget > 2000000 ? cars[0] : (cars[1] || cars[0]);
      if (chosenCar) {
        recommended.push({
          role: language === 'ar' ? 'سيارة وموكب الزفاف' : (language === 'fr' ? 'Cortège de mariage' : 'Wedding Car'),
          item: chosenCar,
          cost: chosenCar.numericPrice
        });
        allocatedTotal += chosenCar.numericPrice;
      }
    }

    // 3. Sound & DJ
    if (selectedServices.sound) {
      const soundItems = listings.filter((l) => l.category === 'معدات صوت ودي جي');
      const chosenSound = soundItems[0];
      if (chosenSound) {
        recommended.push({
          role: language === 'ar' ? 'الصوتيات وهندسة الإضاءة' : (language === 'fr' ? 'Sonorisation & DJ' : 'Sound & Lighting'),
          item: chosenSound,
          cost: chosenSound.numericPrice
        });
        allocatedTotal += chosenSound.numericPrice;
      }
    }

    // 4. Photography
    if (selectedServices.photography) {
      const photoItems = listings.filter((l) => l.category === 'تصوير وتوثيق');
      const chosenPhoto = photoItems[0];
      if (chosenPhoto) {
        recommended.push({
          role: language === 'ar' ? 'التصوير والتوثيق السينمائي' : (language === 'fr' ? 'Photo & Cinéma' : 'Photography & Video'),
          item: chosenPhoto,
          cost: chosenPhoto.numericPrice
        });
        allocatedTotal += chosenPhoto.numericPrice;
      }
    }

    // 5. Hospitality / Gifts
    if (selectedServices.hospitality) {
      const giftItems = listings.filter((l) => l.category === 'الهدايا والسلال');
      const chosenGift = giftItems[0];
      if (chosenGift) {
        recommended.push({
          role: language === 'ar' ? 'هدايا الضيافة والبخور' : (language === 'fr' ? 'Accueil & Cadeaux' : 'Hospitality & Gifts'),
          item: chosenGift,
          cost: chosenGift.numericPrice
        });
        allocatedTotal += chosenGift.numericPrice;
      }
    }

    return { recommended, allocatedTotal };
  };

  const { recommended, allocatedTotal } = findBestMatches();
  const diffBudget = budget - allocatedTotal;

  const handleBookCustomBundle = () => {
    setIsBudgetCalculatorOpen(false);
    const notesSummary = recommended
      .map((r) => `• ${r.role}: ${r.item.title} (${r.cost.toLocaleString()} ${settings.currency})`)
      .join('\n');

    setBookingModalItem({
      id: `calc-plan-${Date.now()}`,
      title: language === 'ar' ? `خطة حفل مخصصة (${guests} ضيف)` : (language === 'fr' ? `Formule personnalisée (${guests} invités)` : `Custom Event Plan (${guests} guests)`),
      badge: language === 'ar' ? 'توليفة ميزانية ذكية' : (language === 'fr' ? 'Pack Budget Intelligent' : 'Smart Budget Plan'),
      price: `${allocatedTotal.toLocaleString()} ${settings.currency}`,
      numericPrice: allocatedTotal,
      location: language === 'ar' ? 'نواكشوط (خطة مخصصة)' : (language === 'fr' ? 'Nouakchott (Personnalisé)' : 'Nouakchott (Custom)'),
      image: recommended[0]?.item.image || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop',
      notesDefault: `خطة حفل مخصصة تم توليدها بحاسبة الميزانية:\nميزانية العميل: ${budget.toLocaleString()} ${settings.currency}\nعدد الضيوف: ${guests}\nالخدمات الموصى بها:\n${notesSummary}`
    });
  };

  return (
    <div className="modal-overlay" onClick={() => setIsBudgetCalculatorOpen(false)}>
      <div 
        className="modal-content budget-calculator-content" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="modal-close-btn" 
          onClick={() => setIsBudgetCalculatorOpen(false)}
          aria-label="إغلاق"
        >
          <X size={20} />
        </button>

        <div className="calc-header">
          <div className="calc-icon-badge">
            <Calculator size={28} className="text-primary" />
          </div>
          <div>
            <h2>{t('calculator.title', 'حاسبة ميزانية الحفل الذكية')}</h2>
            <p className="text-muted">
              {t('calculator.subtitle', 'حدد ميزانيتك وعدد ضيوفك ودعنا نبتكر لك الخطة المثالية بأفضل الأسعار المتاحة في موريتانيا')}
            </p>
          </div>
        </div>

        <div className="calc-grid">
          {/* Controls Side */}
          <div className="calc-inputs-panel">
            {/* Budget Slider */}
            <div className="calc-form-group">
              <div className="calc-label-row">
                <label>{t('calculator.totalBudget', 'ميزانيتك التقديرية الإجمالية:')}</label>
                <span className="calc-live-val">
                  {Number(budget).toLocaleString()} {settings.currency}
                </span>
              </div>
              <input 
                type="range" 
                min="500000" 
                max="5000000" 
                step="50000" 
                value={budget} 
                onChange={(e) => setBudget(Number(e.target.value))} 
                className="calc-range-slider"
              />
              <div className="calc-presets-row">
                {budgetPresets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`preset-btn ${budget === p.amount ? 'active' : ''}`}
                    onClick={() => setBudget(p.amount)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Guest Count */}
            <div className="calc-form-group">
              <div className="calc-label-row">
                <label><Users size={16} /> {t('calculator.guestsCount', 'عدد الضيوف المتوقع:')}</label>
                <span className="calc-live-val">{guests} {t('listings.guests', 'ضيف')}</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="1000" 
                step="25" 
                value={guests} 
                onChange={(e) => setGuests(Number(e.target.value))} 
                className="calc-range-slider"
              />
            </div>

            {/* Required Services Selection */}
            <div className="calc-form-group">
              <label className="calc-subheading">{t('calculator.includedServices', 'الخدمات التي ترغب بإدراجها في الخطة:')}</label>
              <div className="calc-services-chips">
                {[
                  { key: 'hall', label: t('calculator.hall', 'القاعة والمكان') },
                  { key: 'car', label: t('calculator.car', 'سيارة الزفاف') },
                  { key: 'sound', label: t('calculator.sound', 'الصوتيات والدي جي') },
                  { key: 'photography', label: t('calculator.photography', 'التصوير والتوثيق') },
                  { key: 'hospitality', label: t('calculator.hospitality', 'الهدايا والضيافة') }
                ].map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    className={`chip-select-btn ${selectedServices[s.key] ? 'selected' : ''}`}
                    onClick={() => toggleService(s.key)}
                  >
                    {selectedServices[s.key] && <Check size={14} />} {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Side */}
          <div className="calc-results-panel">
            <div className="calc-plan-card">
              <div className="calc-plan-header">
                <Sparkles size={20} className="text-primary" />
                <h4>{t('calculator.suggestedPackage', 'الخطة المقترحة لمناسبتك')}</h4>
              </div>

              <div className="calc-plan-items">
                {recommended.length === 0 ? (
                  <p className="text-muted" style={{ padding: '20px', textAlign: 'center' }}>
                    {language === 'ar' ? 'يرجى تفعيل خدمة واحدة على الأقل للاقتراح' : (language === 'fr' ? 'Veuillez sélectionner au moins un service' : 'Please select at least one service')}
                  </p>
                ) : (
                  recommended.map((rec, idx) => (
                    <div key={idx} className="calc-plan-item-row">
                      <div className="plan-item-meta">
                        <span className="plan-item-role">{rec.role}</span>
                        <strong className="plan-item-title">{rec.item.title}</strong>
                      </div>
                      <span className="plan-item-price">
                        {rec.cost.toLocaleString()} {settings.currency}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Total & Comparison */}
              <div className="calc-total-box">
                <div className="total-row">
                  <span>{t('calculator.estimatedCost', 'إجمالي تكلفة الخطة المقترحة:')}</span>
                  <strong className="total-val text-primary">
                    {allocatedTotal.toLocaleString()} {settings.currency}
                  </strong>
                </div>
                <div className="budget-status-indicator">
                  {diffBudget >= 0 ? (
                    <span className="status-saved">
                      {language === 'ar' ? `✅ ضمن الميزانية المحددة (فائض: ${diffBudget.toLocaleString()} ${settings.currency})` : (language === 'fr' ? `✅ Dans votre budget (Économie : ${diffBudget.toLocaleString()} ${settings.currency})` : `✅ Within budget (Surplus: ${diffBudget.toLocaleString()} ${settings.currency})`)}
                    </span>
                  ) : (
                    <span className="status-exceeded">
                      {language === 'ar' ? `⚠️ تجاوز الميزانية بمقدار: ${Math.abs(diffBudget).toLocaleString()} ${settings.currency}` : (language === 'fr' ? `⚠️ Dépassement de budget : ${Math.abs(diffBudget).toLocaleString()} ${settings.currency}` : `⚠️ Budget exceeded by: ${Math.abs(diffBudget).toLocaleString()} ${settings.currency}`)}
                    </span>
                  )}
                </div>
              </div>

              <button 
                className="btn btn-primary btn-block calc-book-now-btn"
                onClick={handleBookCustomBundle}
                disabled={recommended.length === 0}
              >
                <CalendarDays size={18} /> {t('calculator.bookPlan', 'احجز هذه التوليفة الآن')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetCalculatorModal;
