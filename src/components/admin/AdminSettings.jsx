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
  ExternalLink,
  Sparkles,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/useApp';

const AdminSettings = () => {
  const { settings, updateSettings, showToast, listings, bookings } = useApp();
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
    enablePwaBanner: settings.enablePwaBanner !== undefined ? settings.enablePwaBanner : true
  });

  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'contact' | 'automation' | 'backup'
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    if (showToast) {
      showToast('تم حفظ جميع الإعدادات وتحديثها في كامل المنصة بنجاح! 👑', 'success');
    }
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  // Export full JSON backup
  const handleExportBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      platform: formData.platformName,
      settings: formData,
      listingsCount: listings.length,
      bookingsCount: bookings.length,
      listings: listings,
      bookings: bookings
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
    if (window.confirm('هل أنت متأكد من إعادة ضبط المنصة على البيانات الافتراضية؟ سيتم استرجاع الخدمات والقاعات الأولية.')) {
      localStorage.removeItem('7avelty_listings');
      localStorage.removeItem('7avelty_bookings');
      localStorage.removeItem('7avelty_settings');
      if (showToast) {
        showToast('تمت استعادة البيانات الافتراضية. جاري تحديث الصفحة...', 'info');
      }
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  // Commission calculation example (based on 1,000,000 MRU booking)
  const sampleAmount = 1000000;
  const estimatedProfit = (sampleAmount * (Number(formData.commissionRate) || 0)) / 100;

  return (
    <div className="admin-settings-container">
      
      {/* Top Header */}
      <div className="admin-page-header settings-page-header">
        <div>
          <h2>الإعدادات العامة وإدارة المنصة</h2>
          <p className="text-muted">
            التحكم في العملة، نسب العمولة، بيانات التواصل في موريتانيا، وإدارة قاعدة البيانات
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
              <p>تم تطبيق العملة وبيانات التواصل على واجهة الزوار ولوحة التحكم فورياً.</p>
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
          className={`settings-nav-btn ${activeTab === 'backup' ? 'active' : ''}`}
          onClick={() => setActiveTab('backup')}
        >
          <Database size={16} /> النسخ الاحتياطي والبيانات
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

              <div className="settings-fields-grid">
                <div className="luxury-input-group">
                  <label className="luxury-field-label">اسم المنصة الرسمي *</label>
                  <input
                    type="text"
                    required
                    className="luxury-text-input"
                    value={formData.platformName}
                    onChange={(e) => setFormData({ ...formData, platformName: e.target.value })}
                  />
                  <span className="input-helper-text">يظهر في أعلى الموقع والفواتير وعنوان التطبيق.</span>
                </div>

                <div className="luxury-input-group">
                  <label className="luxury-field-label">شعار أو وصف المنصة الترويجي</label>
                  <input
                    type="text"
                    className="luxury-text-input"
                    value={formData.platformSlogan}
                    onChange={(e) => setFormData({ ...formData, platformSlogan: e.target.value })}
                  />
                  <span className="input-helper-text">يظهر في ترويسة الصفحة الرئيسية ومحركات البحث.</span>
                </div>
              </div>
            </div>

            <div className="settings-card-panel">
              <div className="card-panel-header">
                <div className="panel-icon-circle">
                  <DollarSign size={20} className="text-primary" />
                </div>
                <div>
                  <h3>العملة ونظام العمولات</h3>
                  <p className="text-muted">تحديد العملة المستخدمة واحتساب أرباح المنصة من الحجوزات</p>
                </div>
              </div>

              <div className="settings-fields-grid two-cols">
                <div className="luxury-input-group">
                  <label className="luxury-field-label"><DollarSign size={16} className="text-primary" /> العملة الرسمية *</label>
                  <input
                    type="text"
                    required
                    className="luxury-text-input price-highlight"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  />
                  <span className="input-helper-text">مثال: أوقية أو MRU.</span>
                </div>

                <div className="luxury-input-group">
                  <label className="luxury-field-label"><Percent size={16} className="text-primary" /> نسبة عمولة المنصة (%) *</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    className="luxury-text-input price-highlight"
                    value={formData.commissionRate}
                    onChange={(e) => setFormData({ ...formData, commissionRate: Number(e.target.value) })}
                  />
                  <span className="input-helper-text">النسبة المقتطعة من مزودي القاعات والخدمات.</span>
                </div>
              </div>

              {/* Commission Live Estimator Box */}
              <div className="commission-calculator-box">
                <div className="calc-header">
                  <Sparkles size={16} className="text-primary" />
                  <strong>حاسبة الأرباح التقديرية (نموذج عملي):</strong>
                </div>
                <p>
                  عند حجز قاعة بقيمة <strong className="text-primary">{sampleAmount.toLocaleString()} {formData.currency}</strong> بنسبة عمولة <strong>%{formData.commissionRate}</strong>:
                </p>
                <div className="calc-results-row">
                  <div className="calc-pill">
                    <span>ربح المنصة الصافي:</span>
                    <strong className="text-primary">{estimatedProfit.toLocaleString()} {formData.currency}</strong>
                  </div>
                  <div className="calc-pill">
                    <span>مستحقات مزود الخدمة:</span>
                    <strong>{(sampleAmount - estimatedProfit).toLocaleString()} {formData.currency}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: Contact & Headquarters in Mauritania
        ========================================================= */}
        {activeTab === 'contact' && (
          <div className="settings-tab-pane">
            <div className="settings-card-panel">
              <div className="card-panel-header">
                <div className="panel-icon-circle">
                  <Phone size={20} className="text-primary" />
                </div>
                <div>
                  <h3>بيانات التواصل وخدمة العملاء في موريتانيا</h3>
                  <p className="text-muted">الأرقام والعناوين التي يراها العملاء للتواصل المباشر والاستفسارات</p>
                </div>
              </div>

              <div className="settings-fields-grid two-cols">
                <div className="luxury-input-group">
                  <label className="luxury-field-label"><Phone size={16} className="text-primary" /> رقم الهاتف المباشر</label>
                  <input
                    type="text"
                    className="luxury-text-input"
                    placeholder="+222 46 00 00 00"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <span className="input-helper-text">للاتصال الهاتفي السريع من داخل موريتانيا.</span>
                </div>

                <div className="luxury-input-group">
                  <label className="luxury-field-label"><MessageSquare size={16} className="text-primary" /> رقم الواتساب الرسمي (+222)</label>
                  <input
                    type="text"
                    className="luxury-text-input"
                    placeholder="+22246000000"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  />
                  <span className="input-helper-text">
                    مرتبط بزر الواتساب العائم في أسفل الموقع. 
                    {formData.whatsapp && (
                      <a
                        href={`https://wa.me/${formData.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="test-whatsapp-link"
                      >
                        تجربة فتح الواتساب <ExternalLink size={12} />
                      </a>
                    )}
                  </span>
                </div>
              </div>

              <div className="settings-fields-grid two-cols">
                <div className="luxury-input-group">
                  <label className="luxury-field-label"><Mail size={16} className="text-primary" /> البريد الإلكتروني الرسمي</label>
                  <input
                    type="email"
                    className="luxury-text-input"
                    placeholder="contact@7avelty.mr"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <span className="input-helper-text">لاستقبال الإشعارات وطلبات الانضمام.</span>
                </div>

                <div className="luxury-input-group">
                  <label className="luxury-field-label"><MapPin size={16} className="text-primary" /> المقر الرئيسي والعنوان</label>
                  <input
                    type="text"
                    className="luxury-text-input"
                    placeholder="نواكشوط، تفرغ زينة، موريتانيا"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                  <span className="input-helper-text">يظهر في تذييل الموقع (Footer) والفواتير.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: Automation & Booking Rules
        ========================================================= */}
        {activeTab === 'automation' && (
          <div className="settings-tab-pane">
            <div className="settings-card-panel">
              <div className="card-panel-header">
                <div className="panel-icon-circle">
                  <Sliders size={20} className="text-primary" />
                </div>
                <div>
                  <h3>خيارات الحجز والأتمتة الذكية</h3>
                  <p className="text-muted">التحكم في طريقة معالجة طلبات الحجز والإشعارات الفورية</p>
                </div>
              </div>

              <div className="settings-toggles-list">
                {/* Toggle 1: Auto Confirm */}
                <div className="setting-toggle-card">
                  <div className="toggle-card-info">
                    <strong>التأكيد التلقائي لطلبات الحجز</strong>
                    <p className="text-muted">
                      قبول أي طلب حجز يقدمه العميل مباشرة بحالة "مؤكد" دون انتظار مراجعة الأدمن اليدوية.
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

                {/* Toggle 2: WhatsApp Alerts */}
                <div className="setting-toggle-card">
                  <div className="toggle-card-info">
                    <strong>إشعارات الواتساب المباشرة</strong>
                    <p className="text-muted">
                      توجيه العميل مباشرة إلى محادثة واتساب الإدارة مع ملخص الحجز بعد إرسال الطلب.
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
                    <strong>شريط تثبيت تطبيق الهاتف (PWA App Banner)</strong>
                    <p className="text-muted">
                      إظهار إشعار تثبيت التطبيق تلقائياً للمستخدمين على هواتف الأندرويد والآيفون.
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
            TAB 4: Data Management & Backup
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
            <span>يتم حفظ جميع التغييرات في التخزين المحلي ومزامنتها لحظياً في كامل المنصة.</span>
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
