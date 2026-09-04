import React, { useState } from 'react';
import { 
  Save, 
  Check, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MapPin, 
  Percent, 
  DollarSign, 
  Building2, 
  MessageSquare, 
  Sliders, 
  Database, 
  Download, 
  RotateCcw, 
  ShieldCheck, 
  Layers,
  Lock,
  KeyRound,
  RefreshCw,
  Server,
  Eye,
  EyeOff,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/useApp';
import { 
  syncListingToSupabase, 
  syncPackageToSupabase, 
  syncCategoryToSupabase, 
  syncPromoCodeToSupabase, 
  syncBookingToSupabase, 
  syncSettingsToSupabase 
} from '../../lib/supabaseSync';

const AdminSettings = () => {
  const { 
    settings, 
    updateSettings, 
    showToast, 
    listings, 
    bookings, 
    packages, 
    categories, 
    promoCodes, 
    isCloudConnected 
  } = useApp();

  const [formData, setFormData] = useState({
    platformName: settings.platformName || 'حفلتي | 7avelty',
    platformSlogan: settings.platformSlogan || 'المنصة الموريتانية الأولى لحجز قاعات الأفراح وتجهيز المناسبات',
    currency: settings.currency || 'أوقية',
    phone: settings.phone || '+222 46 00 00 00',
    whatsapp: settings.whatsapp || '+22246000000',
    email: settings.email || 'contact@7avelty.mr',
    location: settings.location || 'نواكشوط، تفرغ زينة، موريتانيا',
    commissionRate: settings.commissionRate !== undefined ? settings.commissionRate : 10,
    autoConfirmBookings: settings.autoConfirmBookings || false,
    maintenanceMode: settings.maintenanceMode || false,
    whatsappAlerts: settings.whatsappAlerts !== undefined ? settings.whatsappAlerts : true,
    enablePwaBanner: settings.enablePwaBanner !== undefined ? settings.enablePwaBanner : true,
    adminPin: settings.adminPin || '7777'
  });

  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'contact' | 'automation' | 'security' | 'backup'
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [syncingCloud, setSyncingCloud] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    if (showToast) {
      showToast('تم حفظ جميع الإعدادات وتحديثها سحابياً بنجاح! 👑', 'success');
    }
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleForceCloudSync = async () => {
    setSyncingCloud(true);
    try {
      await Promise.all([
        ...listings.map(syncListingToSupabase),
        ...(packages || []).map(syncPackageToSupabase),
        ...categories.map(syncCategoryToSupabase),
        ...promoCodes.map(syncPromoCodeToSupabase),
        ...bookings.map(syncBookingToSupabase),
        syncSettingsToSupabase(formData)
      ]);
      if (showToast) {
        showToast('تمت مزامنة ورفع كافة بيانات المنصة إلى خوادم Supabase بنجاح! ☁️👑', 'success');
      }
    } catch (err) {
      console.error(err);
      if (showToast) {
        showToast('حدث خطأ أثناء المزامنة، يرجى المحاولة لاحقاً', 'error');
      }
    } finally {
      setSyncingCloud(false);
    }
  };

  // Export full JSON backup
  const handleExportBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      platform: formData.platformName,
      settings: formData,
      listingsCount: listings.length,
      bookingsCount: bookings.length,
      packagesCount: packages ? packages.length : 0,
      listings,
      bookings,
      packages,
      categories,
      promoCodes
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `7avelty_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    if (showToast) {
      showToast('تم تصدير النسخة الاحتياطية بنجاح! 💾', 'info');
    }
  };

  // Reset to default demo data
  const handleResetData = () => {
    if (window.confirm('تحذير هام: هل أنت متأكد من استعادة البيانات الافتراضية؟ سيتم مسح التعديلات المحلية وإعادة ضبط المنصة.')) {
      localStorage.removeItem('7avelty_listings');
      localStorage.removeItem('7avelty_bookings');
      localStorage.removeItem('7avelty_categories');
      localStorage.removeItem('7avelty_packages');
      localStorage.removeItem('7avelty_promocodes');
      localStorage.removeItem('7avelty_settings');
      window.location.reload();
    }
  };

  // Live Commission Calculator preview
  const sampleBookingAmount = 1000000;
  const estimatedPlatformCommission = Math.round((sampleBookingAmount * (formData.commissionRate || 0)) / 100);
  const estimatedVendorPayout = sampleBookingAmount - estimatedPlatformCommission;

  return (
    <div className="admin-page-container admin-settings-container">
      
      {/* Top Header */}
      <div className="admin-page-header settings-page-header">
        <div>
          <h2>الإعدادات العامة وإدارة المنصة</h2>
          <p className="text-muted">
            التحكم في العملة، نسب العمولة، بيانات التواصل، الأمان والرمز السري، وقاعدة بيانات Supabase
          </p>
        </div>
        <div className="settings-header-actions">
          <button 
            type="button" 
            className={`btn btn-primary ${savedSuccess ? 'btn-saved-success' : ''}`}
            onClick={handleSubmit}
          >
            {savedSuccess ? <Check size={18} /> : <Save size={18} />}
            <span>{savedSuccess ? 'تم الحفظ بنجاح!' : 'حفظ الإعدادات'}</span>
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {savedSuccess && (
        <div className="settings-alert-banner">
          <div className="alert-content">
            <CheckCircle2 size={22} className="text-success" />
            <div>
              <strong>تم حفظ وتحديث الإعدادات بنجاح!</strong>
              <p>تم تطبيق العملة وبيانات التواصل ومزامنتها سحابياً مع Supabase فورياً.</p>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab Navigation */}
      <div className="settings-nav-tabs">
        <button
          type="button"
          className={`settings-nav-btn ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          <Building2 size={17} />
          <span>الهوية والمالية</span>
        </button>

        <button
          type="button"
          className={`settings-nav-btn ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          <Phone size={17} />
          <span>التواصل ومكتب موريتانيا</span>
        </button>

        <button
          type="button"
          className={`settings-nav-btn ${activeTab === 'automation' ? 'active' : ''}`}
          onClick={() => setActiveTab('automation')}
        >
          <Sliders size={17} />
          <span>الحجوزات والأتمتة</span>
        </button>

        <button
          type="button"
          className={`settings-nav-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <Lock size={17} />
          <span>الأمان وقاعدة البيانات</span>
        </button>

        <button
          type="button"
          className={`settings-nav-btn ${activeTab === 'backup' ? 'active' : ''}`}
          onClick={() => setActiveTab('backup')}
        >
          <Database size={17} />
          <span>النسخ الاحتياطي</span>
        </button>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="settings-form-layout">
        
        {/* =========================================================
            TAB 1: Brand & Financials
        ========================================================= */}
        {activeTab === 'general' && (
          <div className="settings-tab-pane">
            <div className="settings-card-panel">
              <div className="card-panel-header">
                <div className="panel-icon-circle">
                  <Building2 size={22} className="text-primary" />
                </div>
                <div>
                  <h3>هوية المنصة والعلامة التجارية</h3>
                  <p className="text-muted">الاسم الظاهر في شريط المتصفح، الترويسة، والإيصالات المطبوعة</p>
                </div>
              </div>

              <div className="settings-form-grid">
                <div className="form-group">
                  <label>اسم المنصة التجاري: *</label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      value={formData.platformName}
                      onChange={(e) => setFormData({ ...formData, platformName: e.target.value })}
                      placeholder="مثال: حفلتي | 7avelty"
                      required
                    />
                    <Building2 size={18} className="input-inner-icon" />
                  </div>
                  <span className="field-hint">يظهر في أعلى كل صفحة وفي تذييل الموقع</span>
                </div>

                <div className="form-group">
                  <label>العملة الرسمية المعتمدة في المنصة: *</label>
                  <div className="input-with-icon">
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    >
                      <option value="أوقية">أوقية موريتانية (MRU)</option>
                      <option value="MRU">رمز العملة الدولي (MRU)</option>
                      <option value="أوقية جديدة">أوقية جديدة</option>
                    </select>
                    <DollarSign size={18} className="input-inner-icon" />
                  </div>
                  <span className="field-hint">تُعرض بجانب جميع أسعار الخدمات والباقات والكوبونات</span>
                </div>

                <div className="form-group full-width">
                  <label>الشعار والوصف الترويجي (Slogan):</label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      value={formData.platformSlogan}
                      onChange={(e) => setFormData({ ...formData, platformSlogan: e.target.value })}
                      placeholder="المنصة الموريتانية الأولى لحجز قاعات الأفراح وتجهيز المناسبات"
                    />
                    <Sparkles size={18} className="input-inner-icon" />
                  </div>
                  <span className="field-hint">الجملة الترويجية التي تعبر عن هوية المنصة في محركات البحث ومشاركات التواصل</span>
                </div>
              </div>
            </div>

            <div className="settings-card-panel">
              <div className="card-panel-header">
                <div className="panel-icon-circle">
                  <DollarSign size={22} className="text-primary" />
                </div>
                <div>
                  <h3>السياسة المالية وعمولة الوساطة</h3>
                  <p className="text-muted">حساب الأرباح التقديرية وعمولة الوساطة عن كل حجز مؤكد</p>
                </div>
              </div>

              <div className="settings-form-grid">
                <div className="form-group">
                  <label>نسبة عمولة المنصة (%): *</label>
                  <div className="input-with-icon">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={formData.commissionRate}
                      onChange={(e) => setFormData({ ...formData, commissionRate: parseFloat(e.target.value) || 0 })}
                      required
                    />
                    <Percent size={18} className="input-inner-icon" />
                  </div>
                  <span className="field-hint">النسبة المقتطعة من إجمالي قيمة حجز القاعات والخدمات (الافتراضي: 10%)</span>
                </div>

                <div className="form-group">
                  {/* Live Simulation preview */}
                  <div className="commission-calculator-box">
                    <div className="calc-header">
                      <Sparkles size={16} />
                      <strong>معاينة حية لاحتساب عمولة حجز بقيمة {sampleBookingAmount.toLocaleString()} {formData.currency}:</strong>
                    </div>
                    <div className="calc-results-row">
                      <div className="calc-pill">
                        <span>عمولة حفلتي ({formData.commissionRate}%):</span>
                        <strong className="text-primary font-bold">{estimatedPlatformCommission.toLocaleString()} {formData.currency}</strong>
                      </div>
                      <div className="calc-pill">
                        <span>مستحقات مزود الخدمة:</span>
                        <strong className="text-success font-bold">{estimatedVendorPayout.toLocaleString()} {formData.currency}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: Contact & Mauritania Office
        ========================================================= */}
        {activeTab === 'contact' && (
          <div className="settings-tab-pane">
            <div className="settings-card-panel">
              <div className="card-panel-header">
                <div className="panel-icon-circle">
                  <Phone size={22} className="text-primary" />
                </div>
                <div>
                  <h3>بيانات التواصل ومقر المنصة في موريتانيا</h3>
                  <p className="text-muted">هذه البيانات تظهر في تذييل الموقع، الفواتير المطبوعة، وزر المحادثة المباشر</p>
                </div>
              </div>

              <div className="settings-form-grid">
                <div className="form-group">
                  <label>رقم هاتف الاتصال المباشر:</label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+222 46 00 00 00"
                      required
                    />
                    <Phone size={18} className="input-inner-icon" />
                  </div>
                  <span className="field-hint">يظهر للزبائن عند رغبتهم بالاتصال التليفوني المباشر</span>
                </div>

                <div className="form-group">
                  <label>رقم واتساب المعتمد (للحجوزات والدعم الفني):</label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="+22246000000"
                      required
                    />
                    <MessageSquare size={18} className="input-inner-icon" />
                  </div>
                  <div className="field-hint-with-action">
                    <span className="field-hint">صيغة رقم الواتساب الدولي (+222XXXXXXXX)</span>
                    {formData.whatsapp && (
                      <a 
                        href={`https://wa.me/${formData.whatsapp.replace(/[^0-9]/g, '')}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="test-whatsapp-link"
                      >
                        <ExternalLink size={13} /> تجربة فتح المحادثة
                      </a>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>البريد الإلكتروني الرسمي:</label>
                  <div className="input-with-icon">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contact@7avelty.mr"
                    />
                    <Mail size={18} className="input-inner-icon" />
                  </div>
                  <span className="field-hint">يُدرج في إشعارات الاستفسارات والفواتير</span>
                </div>

                <div className="form-group">
                  <label>عنوان المقر في موريتانيا:</label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="نواكشوط، تفرغ زينة، موريتانيا"
                    />
                    <MapPin size={18} className="input-inner-icon" />
                  </div>
                  <span className="field-hint">العنوان الفعلي لمكتب خدمة العملاء وتوقيع العقود</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: Automation & Switches
        ========================================================= */}
        {activeTab === 'automation' && (
          <div className="settings-tab-pane">
            <div className="settings-card-panel">
              <div className="card-panel-header">
                <div className="panel-icon-circle">
                  <Sliders size={22} className="text-primary" />
                </div>
                <div>
                  <h3>الأتمتة وتجربة المستخدم</h3>
                  <p className="text-muted">التحكم في خيارات قبول الحجوزات وإشعارات المنصة وتطبيق PWA</p>
                </div>
              </div>

              <div className="settings-toggles-list">
                {/* Toggle 1: Auto Confirm */}
                <div className="setting-toggle-card">
                  <div className="toggle-card-info">
                    <div className="toggle-title-row">
                      <strong>تأكيد الحجوزات آلياً</strong>
                      <span className={`toggle-status-badge ${formData.autoConfirmBookings ? 'active' : 'inactive'}`}>
                        {formData.autoConfirmBookings ? 'مفعّل آلياً' : 'يتطلب مراجعة يدوية'}
                      </span>
                    </div>
                    <p className="text-muted">
                      اعتبار أي حجز جديد "مؤكداً" فور إرسال العميل للطلب دون الحاجة لمراجعة يدوية من الأدمن.
                    </p>
                  </div>
                  <label className="luxury-switch-label">
                    <input
                      type="checkbox"
                      checked={formData.autoConfirmBookings}
                      onChange={(e) => setFormData({ ...formData, autoConfirmBookings: e.target.checked })}
                    />
                    <span className="luxury-switch-slider"></span>
                  </label>
                </div>

                {/* Toggle 2: WhatsApp alerts */}
                <div className="setting-toggle-card">
                  <div className="toggle-card-info">
                    <div className="toggle-title-row">
                      <strong>إشعارات وتنبيهات واتساب للعميل</strong>
                      <span className={`toggle-status-badge ${formData.whatsappAlerts ? 'active' : 'inactive'}`}>
                        {formData.whatsappAlerts ? 'مفعّل' : 'معطّل'}
                      </span>
                    </div>
                    <p className="text-muted">
                      تجهيز رسالة واتساب منسقة تلقائياً للعميل عند إتمام الحجز لإرسالها بضغطة زر وتأكيد تفاصيل الموعد.
                    </p>
                  </div>
                  <label className="luxury-switch-label">
                    <input
                      type="checkbox"
                      checked={formData.whatsappAlerts}
                      onChange={(e) => setFormData({ ...formData, whatsappAlerts: e.target.checked })}
                    />
                    <span className="luxury-switch-slider"></span>
                  </label>
                </div>

                {/* Toggle 3: PWA Banner */}
                <div className="setting-toggle-card">
                  <div className="toggle-card-info">
                    <div className="toggle-title-row">
                      <strong>شريط تثبيت تطبيق حفلتي (PWA Install Prompt)</strong>
                      <span className={`toggle-status-badge ${formData.enablePwaBanner ? 'active' : 'inactive'}`}>
                        {formData.enablePwaBanner ? 'مفعّل' : 'معطّل'}
                      </span>
                    </div>
                    <p className="text-muted">
                      إظهار نافذة منبثقة أنيقة في أسفل الشاشة للزوار لتثبيت المنصة كتطبيق على هواتفهم الذكية.
                    </p>
                  </div>
                  <label className="luxury-switch-label">
                    <input
                      type="checkbox"
                      checked={formData.enablePwaBanner}
                      onChange={(e) => setFormData({ ...formData, enablePwaBanner: e.target.checked })}
                    />
                    <span className="luxury-switch-slider"></span>
                  </label>
                </div>

                {/* Toggle 4: Maintenance Mode */}
                <div className="setting-toggle-card">
                  <div className="toggle-card-info">
                    <div className="toggle-title-row">
                      <strong style={{ color: formData.maintenanceMode ? 'var(--danger)' : 'inherit' }}>
                        وضع الصيانة المؤقت للمنصة
                      </strong>
                      <span className={`toggle-status-badge ${formData.maintenanceMode ? 'danger' : 'inactive'}`}>
                        {formData.maintenanceMode ? 'الموقع في وضع الصيانة' : 'الموقع يعمل بشكل طبيعي'}
                      </span>
                    </div>
                    <p className="text-muted">
                      إيقاف استقبال طلبات الحجز الجديدة مؤقتاً لأعمال التحديث والتطوير وإظهار رسالة لطيفة للزوار.
                    </p>
                  </div>
                  <label className="luxury-switch-label">
                    <input
                      type="checkbox"
                      checked={formData.maintenanceMode}
                      onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
                    />
                    <span className="luxury-switch-slider danger-switch"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 4: Security & Supabase Cloud
        ========================================================= */}
        {activeTab === 'security' && (
          <div className="settings-tab-pane">
            <div className="settings-card-panel">
              <div className="card-panel-header">
                <div className="panel-icon-circle">
                  <Lock size={22} className="text-primary" />
                </div>
                <div>
                  <h3>أمان وحماية لوحة الإدارة (Admin PIN Security)</h3>
                  <p className="text-muted">تحديد الرمز السري المطلوب لفتح لوحة التحكم ومنع الوصول غير المصرح به</p>
                </div>
              </div>

              <div className="settings-form-grid">
                <div className="form-group">
                  <label>الرمز السري للوحة الإدارة (Admin PIN): *</label>
                  <div className="input-with-icon">
                    <input
                      type={showPin ? "text" : "password"}
                      maxLength="8"
                      value={formData.adminPin}
                      onChange={(e) => setFormData({ ...formData, adminPin: e.target.value })}
                      placeholder="7777"
                      required
                      style={{ letterSpacing: '4px', fontSize: '18px', fontWeight: 'bold' }}
                    />
                    <KeyRound size={18} className="input-inner-icon" />
                    <button
                      type="button"
                      className="input-eye-btn"
                      onClick={() => setShowPin(!showPin)}
                      title={showPin ? "إخفاء الرمز" : "إظهار الرمز"}
                    >
                      {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <span className="field-hint">
                    يُطلب هذا الرمز تلقائياً عند الضغط على "لوحة الأدمن" من الموقع العام (الرمز الافتراضي: 7777).
                  </span>
                </div>
              </div>
            </div>

            <div className="settings-card-panel">
              <div className="card-panel-header">
                <div className="panel-icon-circle">
                  <Server size={22} className="text-primary" />
                </div>
                <div>
                  <h3>قاعدة بيانات Supabase السحابية</h3>
                  <p className="text-muted">معلومات الربط السحابي المباشر والمزامنة اللحظية بين جميع الأجهزة</p>
                </div>
              </div>

              <div className="supabase-meta-card">
                <div className="supabase-meta-row">
                  <span className="meta-label">معرف المشروع السحابي:</span>
                  <span className="meta-val font-mono">swadzlaylihpngcbdacl (7avelty)</span>
                </div>
                <div className="supabase-meta-row">
                  <span className="meta-label">المنطقة الجغرافية للخادم:</span>
                  <span className="meta-val">أوروبا الغربية (eu-west-1)</span>
                </div>
                <div className="supabase-meta-row">
                  <span className="meta-label">حالة الاتصال السحابي:</span>
                  <span className="meta-val text-success font-bold">
                    {isCloudConnected ? '🟢 متصل ونشط لحظياً (Active Healthy)' : '🟡 جارٍ الاتصال بالسحابة'}
                  </span>
                </div>
                <div className="supabase-meta-row">
                  <span className="meta-label">الجداول السحابية النشطة:</span>
                  <span className="meta-val">listings, bookings, packages, categories, promo_codes, settings</span>
                </div>
              </div>

              <div className="cloud-sync-action-box">
                <div className="cloud-sync-info">
                  <h4>مزامنة يدوية فورية وشاملة مع Supabase</h4>
                  <p className="text-muted">
                    رفع وحفظ جميع القاعات والباقات والكوبونات والحجوزات الحالية وتحديثها على السحابة بنقرة واحدة.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-outline cloud-sync-btn"
                  disabled={syncingCloud}
                  onClick={handleForceCloudSync}
                >
                  <RefreshCw size={17} className={syncingCloud ? 'spin-animation' : ''} />
                  <span>{syncingCloud ? 'جارٍ المزامنة السحابية...' : 'مزامنة السحابة الآن'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 5: Backup & Reset
        ========================================================= */}
        {activeTab === 'backup' && (
          <div className="settings-tab-pane">
            <div className="settings-card-panel">
              <div className="card-panel-header">
                <div className="panel-icon-circle">
                  <Database size={22} className="text-primary" />
                </div>
                <div>
                  <h3>إدارة قاعدة البيانات والنسخ الاحتياطي</h3>
                  <p className="text-muted">حفظ نسخة احتياطية من جميع القاعات والحجوزات أو استعادة الإعدادات الأصلية</p>
                </div>
              </div>

              <div className="database-overview-stats">
                <div className="db-stat-box">
                  <Layers size={24} className="text-primary" />
                  <div>
                    <span className="db-stat-label">الخدمات والقاعات المسجلة</span>
                    <strong className="db-stat-value">{listings.length} خدمة</strong>
                  </div>
                </div>

                <div className="db-stat-box">
                  <CheckCircle2 size={24} className="text-success" />
                  <div>
                    <span className="db-stat-label">إجمالي سجلات الحجوزات</span>
                    <strong className="db-stat-value">{bookings.length} حجز</strong>
                  </div>
                </div>

                <div className="db-stat-box">
                  <ShieldCheck size={24} className="text-info" />
                  <div>
                    <span className="db-stat-label">حالة التخزين المحلي</span>
                    <strong className="db-stat-value">آمن ومتزامن (LocalStorage)</strong>
                  </div>
                </div>
              </div>

              <div className="backup-actions-grid">
                <div className="backup-action-card">
                  <div className="backup-card-top">
                    <Download size={32} className="text-primary" />
                    <div>
                      <h4>تصدير نسخة احتياطية كاملة (JSON)</h4>
                      <p className="text-muted">
                        حمّل ملفاً يحتوي على كافة الخدمات، الأسعار، الحجوزات، والكوبونات للاحتفاظ به أو نقله.
                      </p>
                    </div>
                  </div>
                  <button type="button" className="btn btn-outline" onClick={handleExportBackup}>
                    <Download size={16} /> تحميل النسخة الاحتياطية (.json)
                  </button>
                </div>

                <div className="backup-action-card reset-card">
                  <div className="backup-card-top">
                    <RotateCcw size={32} className="text-danger" />
                    <div>
                      <h4>استعادة البيانات الافتراضية للمنصة</h4>
                      <p className="text-muted">
                        إعادة ضبط الموقع والبيانات التجريبية الأصلية ومسح التعديلات المحلية المخزنة.
                      </p>
                    </div>
                  </div>
                  <button type="button" className="btn btn-danger-outline" onClick={handleResetData}>
                    <RotateCcw size={16} /> استعادة البيانات الافتراضية
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Bottom Submit Actions */}
        <div className="settings-bottom-actions-bar">
          <div className="settings-bottom-status">
            <ShieldCheck size={18} className="text-primary" />
            <span>يتم حفظ جميع التغييرات في التخزين المحلي ومزامنتها لحظياً في خوادم Supabase السحابية.</span>
          </div>
          <button 
            type="submit" 
            className={`btn btn-primary btn-lg ${savedSuccess ? 'btn-saved-success' : ''}`}
          >
            {savedSuccess ? <Check size={18} /> : <Save size={18} />}
            <span>{savedSuccess ? 'تم حفظ التعديلات بنجاح! 👑' : 'حفظ ونشر جميع الإعدادات'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};

export default AdminSettings;
