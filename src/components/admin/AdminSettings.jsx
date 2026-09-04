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
  Server
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
      showToast('تم تصدير النسخة الاحتياطية بنجاح!', 'info');
    }
  };

  // Reset to default demo data
  const handleResetData = () => {
    if (window.confirm('تحذير: هل أنت متأكد من استعادة البيانات الافتراضية؟ سيتم مسح التعديلات المحلية.')) {
      localStorage.removeItem('7avelty_listings');
      localStorage.removeItem('7avelty_bookings');
      localStorage.removeItem('7avelty_categories');
      localStorage.removeItem('7avelty_packages');
      localStorage.removeItem('7avelty_promocodes');
      localStorage.removeItem('7avelty_settings');
      window.location.reload();
    }
  };

  return (
    <div className="admin-page-container">
      
      {/* Top Header */}
      <div className="admin-page-header settings-page-header">
        <div>
          <h2>الإعدادات العامة وإدارة المنصة</h2>
          <p className="text-muted">
            التحكم في العملة، نسب العمولة، بيانات التواصل، الأمان والرمز السري، وقاعدة بيانات Supabase
          </p>
        </div>
        <div className="settings-header-actions">
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            <Save size={18} /> حفظ الإعدادات
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {savedSuccess && (
        <div className="settings-alert-banner">
          <div className="alert-content">
            <Check size={20} className="text-success" />
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
          <Building2 size={16} /> الهوية والمالية
        </button>

        <button
          type="button"
          className={`settings-nav-btn ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          <Phone size={16} /> التواصل والمقر (موريتانيا)
        </button>

        <button
          type="button"
          className={`settings-nav-btn ${activeTab === 'automation' ? 'active' : ''}`}
          onClick={() => setActiveTab('automation')}
        >
          <Sliders size={16} /> الحجوزات والأتمتة
        </button>

        <button
          type="button"
          className={`settings-nav-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <Lock size={16} /> الأمان وقاعدة البيانات
        </button>

        <button
          type="button"
          className={`settings-nav-btn ${activeTab === 'backup' ? 'active' : ''}`}
          onClick={() => setActiveTab('backup')}
        >
          <Database size={16} /> النسخ الاحتياطي
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
                  <Building2 size={20} className="text-primary" />
                </div>
                <div>
                  <h3>هوية المنصة والعلامة التجارية</h3>
                  <p className="text-muted">الاسم الظاهر في شريط المتصفح، الترويسة، والإيصالات المطبوعة</p>
                </div>
              </div>

              <div className="settings-form-grid">
                <div className="form-group">
                  <label>اسم المنصة التجاري</label>
                  <input
                    type="text"
                    value={formData.platformName}
                    onChange={(e) => setFormData({ ...formData, platformName: e.target.value })}
                    placeholder="مثال: حفلتي | 7avelty"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>العملة الرسمية المعتمدة</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  >
                    <option value="أوقية">أوقية موريتانية (MRU)</option>
                    <option value="MRU">رمز العملة الدولي (MRU)</option>
                    <option value="أوقية جديدة">أوقية جديدة</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>الشعار والوصف الترويجي (Slogan)</label>
                  <input
                    type="text"
                    value={formData.platformSlogan}
                    onChange={(e) => setFormData({ ...formData, platformSlogan: e.target.value })}
                    placeholder="المنصة الموريتانية الأولى لحجز قاعات الأفراح وتجهيز المناسبات"
                  />
                </div>
              </div>
            </div>

            <div className="settings-card-panel">
              <div className="card-panel-header">
                <div className="panel-icon-circle">
                  <DollarSign size={20} className="text-primary" />
                </div>
                <div>
                  <h3>السياسة المالية وعمولة المنصة</h3>
                  <p className="text-muted">حساب الأرباح التقديرية وعمولة الوساطة عن كل حجز مؤكد</p>
                </div>
              </div>

              <div className="settings-form-grid">
                <div className="form-group">
                  <label>نسبة عمولة المنصة (%)</label>
                  <div className="input-with-icon">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={formData.commissionRate}
                      onChange={(e) => setFormData({ ...formData, commissionRate: parseFloat(e.target.value) || 0 })}
                    />
                    <Percent size={18} className="input-inner-icon" />
                  </div>
                  <span className="field-hint">النسبة المقتطعة من إجمالي قيمة حجز القاعات والخدمات (الافتراضي 10%)</span>
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
                  <Phone size={20} className="text-primary" />
                </div>
                <div>
                  <h3>بيانات التواصل ومكتب موريتانيا</h3>
                  <p className="text-muted">هذه البيانات تظهر في تذييل الموقع، الفواتير، وزر المحادثة المباشر</p>
                </div>
              </div>

              <div className="settings-form-grid">
                <div className="form-group">
                  <label>رقم هاتف الاتصال الرئيسي</label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+222 46 00 00 00"
                    />
                    <Phone size={18} className="input-inner-icon" />
                  </div>
                </div>

                <div className="form-group">
                  <label>رقم واتساب المعتمد (للحجوزات التلقائية)</label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="+22246000000"
                    />
                    <MessageSquare size={18} className="input-inner-icon" />
                  </div>
                  <span className="field-hint">بدون مسافات أو إشارات (+222XXXXXXXX)</span>
                </div>

                <div className="form-group">
                  <label>البريد الإلكتروني الرسمي</label>
                  <div className="input-with-icon">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contact@7avelty.mr"
                    />
                    <Mail size={18} className="input-inner-icon" />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>عنوان المقر في موريتانيا</label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="نواكشوط، تفرغ زينة، موريتانيا"
                    />
                    <MapPin size={18} className="input-inner-icon" />
                  </div>
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
                  <Sliders size={20} className="text-primary" />
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
                    <strong>تأكيد الحجوزات آلياً</strong>
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
                    <strong>إشعارات وتنبيهات واتساب للعميل</strong>
                    <p className="text-muted">
                      تجهيز رسالة واتساب منسقة تلقائياً للعميل عند إتمام الحجز لإرسالها بضغطة زر.
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
                    <strong>شريط تثبيت تطبيق حفلتي (PWA Install Prompt)</strong>
                    <p className="text-muted">
                      إظهار نافذة منبثقة أنيقة في أسفل الشاشة للزوار لتثبيت المنصة كتطبيق على هواتفهم.
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
                    <strong style={{ color: formData.maintenanceMode ? 'var(--danger)' : 'inherit' }}>
                      وضع الصيانة المؤقت
                    </strong>
                    <p className="text-muted">
                      إيقاف استقبال طلبات الحجز الجديدة مؤقتاً لأعمال التحديث والتطوير.
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
                  <Lock size={20} className="text-primary" />
                </div>
                <div>
                  <h3>أمان وحماية لوحة الإدارة (PIN Security)</h3>
                  <p className="text-muted">تحديد الرمز السري المطلوب لفتح لوحة التحكم ومنع المتطفلين</p>
                </div>
              </div>

              <div className="settings-form-grid">
                <div className="form-group">
                  <label>الرمز السري للوحة الإدارة (Admin PIN)</label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      maxLength="8"
                      value={formData.adminPin}
                      onChange={(e) => setFormData({ ...formData, adminPin: e.target.value })}
                      placeholder="7777"
                      required
                    />
                    <KeyRound size={18} className="input-inner-icon" />
                  </div>
                  <span className="field-hint">
                    يُطلب هذا الرمز تلقائياً عند الضغط على "لوحة الأدمن" من واجهة الموقع العامة (الرمز الافتراضي: 7777).
                  </span>
                </div>
              </div>
            </div>

            <div className="settings-card-panel">
              <div className="card-panel-header">
                <div className="panel-icon-circle">
                  <Server size={20} className="text-primary" />
                </div>
                <div>
                  <h3>قاعدة بيانات Supabase السحابية</h3>
                  <p className="text-muted">معلومات الربط السحابي المباشر والمزامنة اللحظية بين الأجهزة</p>
                </div>
              </div>

              <div className="supabase-meta-card">
                <div className="supabase-meta-row">
                  <span className="meta-label">معرف المشروع السحابي:</span>
                  <span className="meta-val font-mono">swadzlaylihpngcbdacl (7avelty)</span>
                </div>
                <div className="supabase-meta-row">
                  <span className="meta-label">المنطقة الجغرافية:</span>
                  <span className="meta-val">أوروبا الغربية (eu-west-1)</span>
                </div>
                <div className="supabase-meta-row">
                  <span className="meta-label">حالة الاتصال اللحظي:</span>
                  <span className="meta-val text-success font-bold">
                    {isCloudConnected ? '🟢 متصل ونشط (Active Healthy)' : '🟡 جارٍ الاتصال بالسحابة'}
                  </span>
                </div>
                <div className="supabase-meta-row">
                  <span className="meta-label">الجداول المتزامنة:</span>
                  <span className="meta-val">listings, bookings, packages, categories, promo_codes, settings</span>
                </div>
              </div>

              <div className="cloud-sync-action-box">
                <div>
                  <h4>مزامنة يدوية فورية مع Supabase</h4>
                  <p className="text-muted">
                    رفع جميع القاعات والباقات والكوبونات والحجوزات الحالية وتحديثها على السحابة بنقرة واحدة.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-outline"
                  disabled={syncingCloud}
                  onClick={handleForceCloudSync}
                >
                  <RefreshCw size={16} className={syncingCloud ? 'spin-animation' : ''} />
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
                  <Database size={20} className="text-primary" />
                </div>
                <div>
                  <h3>إدارة قاعدة البيانات والنسخ الاحتياطي</h3>
                  <p className="text-muted">حفظ نسخة احتياطية من جميع القاعات والحجوزات أو استعادة الإعدادات الأصلية</p>
                </div>
              </div>

              <div className="database-overview-stats">
                <div className="db-stat-box">
                  <Layers size={22} className="text-primary" />
                  <div>
                    <span className="db-stat-label">الخدمات والقاعات المسجلة</span>
                    <strong className="db-stat-value">{listings.length} خدمة</strong>
                  </div>
                </div>

                <div className="db-stat-box">
                  <CheckCircle2 size={22} className="text-success" />
                  <div>
                    <span className="db-stat-label">إجمالي سجلات الحجوزات</span>
                    <strong className="db-stat-value">{bookings.length} حجز</strong>
                  </div>
                </div>

                <div className="db-stat-box">
                  <ShieldCheck size={22} className="text-info" />
                  <div>
                    <span className="db-stat-label">حالة التخزين المحلي</span>
                    <strong className="db-stat-value">آمن ومتزامن (Local Storage)</strong>
                  </div>
                </div>
              </div>

              <div className="backup-actions-grid">
                <div className="backup-action-card">
                  <Download size={28} className="text-primary" />
                  <h4>تصدير نسخة احتياطية كاملة (JSON)</h4>
                  <p className="text-muted">
                    حمّل ملفاً يحتوي على جميع الخدمات، الأسعار، الحجوزات، والإعدادات للاحتفاظ به بأمان.
                  </p>
                  <button type="button" className="btn btn-outline" onClick={handleExportBackup}>
                    <Download size={16} /> تحميل النسخة الاحتياطية (.json)
                  </button>
                </div>

                <div className="backup-action-card reset-card">
                  <RotateCcw size={28} className="text-danger" />
                  <h4>استعادة البيانات الافتراضية للمنصة</h4>
                  <p className="text-muted">
                    إعادة ضبط الموقع والقاعات التجريبية الأصلية ومسح التعديلات المحلية المخزنة.
                  </p>
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
            <ShieldCheck size={16} className="text-primary" />
            <span>يتم حفظ جميع التغييرات في التخزين المحلي ومزامنتها لحظياً في خوادم Supabase.</span>
          </div>
          <button type="submit" className="btn btn-primary btn-lg">
            <Save size={18} /> حفظ ونشر جميع الإعدادات
          </button>
        </div>

      </form>

    </div>
  );
};

export default AdminSettings;
