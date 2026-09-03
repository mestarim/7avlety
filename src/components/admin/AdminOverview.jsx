import React from 'react';
import { 
  DollarSign, 
  CalendarCheck, 
  Clock, 
  TrendingUp, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  ArrowUpRight,
  CreditCard,
  Tag
} from 'lucide-react';
import { useApp } from '../../context/useApp';

const AdminOverview = () => {
  const { stats, bookings, promoCodes, setAdminTab, settings } = useApp();

  // City breakdown
  const cityCounts = {
    'نواكشوط': 0,
    'نواذيبو': 0,
    'روصو': 0,
    'كيفه': 0
  };

  // Payment Breakdown
  const paymentCounts = {
    bankily: 0,
    seddad: 0,
    masrvi: 0,
    click: 0,
    cash: 0
  };

  bookings.forEach((b) => {
    if (cityCounts[b.city] !== undefined) {
      cityCounts[b.city] += 1;
    } else {
      cityCounts['نواكشوط'] += 1;
    }

    const pay = b.paymentMethod || 'bankily';
    if (paymentCounts[pay] !== undefined) {
      paymentCounts[pay] += 1;
    } else {
      paymentCounts.bankily += 1;
    }
  });

  const totalCityBookings = Math.max(bookings.length, 1);

  return (
    <div className="admin-overview">
      {/* Top Welcome Banner */}
      <div className="admin-welcome-banner">
        <div>
          <h2>مرحباً بك في لوحة تحكم منصة حفلتي 👑</h2>
          <p className="text-muted">نظرة شاملة ومحدثة على أداء الحجوزات والخدمات والمدفوعات في موريتانيا</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-outline" onClick={() => setAdminTab('promos')}>
            <Tag size={16} /> إدارة الكوبونات
          </button>
          <button className="btn btn-primary" onClick={() => setAdminTab('listings')}>
            + إضافة خدمة جديدة
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="admin-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-box bg-gold-subtle">
            <DollarSign size={24} className="text-primary" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">إجمالي الإيرادات المؤكدة</span>
            <h3 className="kpi-value text-primary">{stats.totalRevenue.toLocaleString()} {settings.currency}</h3>
            <span className="kpi-trend positive"><TrendingUp size={14} /> +22% هذا الشهر</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box bg-blue-subtle">
            <CalendarCheck size={24} style={{ color: '#4da6ff' }} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">إجمالي الحجوزات</span>
            <h3 className="kpi-value">{stats.totalBookings} حجز</h3>
            <span className="kpi-subtext">{stats.confirmedBookingsCount} حجز مكتمل أو مؤكد</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box bg-amber-subtle">
            <Clock size={24} style={{ color: '#ffb84d' }} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">الحجوزات المعلقة</span>
            <h3 className="kpi-value" style={{ color: '#ffb84d' }}>{stats.pendingBookingsCount} طلب</h3>
            <span className="kpi-subtext">تتطلب المراجعة والتأكيد</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box bg-purple-subtle">
            <Tag size={24} style={{ color: '#c084fc' }} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">كوبونات الخصم النشطة</span>
            <h3 className="kpi-value">{stats.activePromosCount || promoCodes.length} كوبون</h3>
            <span className="kpi-subtext">تنشيط حركة المبيعات</span>
          </div>
        </div>
      </div>

      {/* Multi Column Section */}
      <div className="admin-two-cols">
        {/* City Distribution Chart */}
        <div className="admin-panel-card">
          <div className="panel-card-header">
            <h3><MapPin size={18} className="text-primary" /> توزيع الحجوزات حسب المدن</h3>
          </div>
          <div className="city-bars-container">
            {Object.entries(cityCounts).map(([city, count]) => {
              const percent = Math.round((count / totalCityBookings) * 100);
              return (
                <div key={city} className="city-bar-item">
                  <div className="city-bar-label">
                    <span>{city}</span>
                    <strong>{count} حجز ({percent}%)</strong>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${Math.max(percent, 5)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '24px' }}>
            <h4 style={{ fontSize: '14px', marginBottom: '12px', color: 'var(--text-muted)' }}>
              <CreditCard size={15} style={{ verticalAlign: 'middle' }} /> وسائل الدفع المفضلة لدى العملاء:
            </h4>
            <div className="payment-stats-pills">
              <span className="payment-stat-pill">بنكيلي: <strong>{paymentCounts.bankily}</strong></span>
              <span className="payment-stat-pill">السداد: <strong>{paymentCounts.seddad}</strong></span>
              <span className="payment-stat-pill">مصرفي: <strong>{paymentCounts.masrvi}</strong></span>
              <span className="payment-stat-pill">كاش: <strong>{paymentCounts.cash}</strong></span>
            </div>
          </div>
        </div>

        {/* Quick Recent Activity */}
        <div className="admin-panel-card">
          <div className="panel-card-header">
            <h3><Clock size={18} className="text-primary" /> أحدث طلبات الحجز الواردة</h3>
            <button className="text-primary text-btn" onClick={() => setAdminTab('bookings')}>
              عرض الكل <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="recent-activity-list">
            {bookings.slice(0, 5).map((b) => (
              <div key={b.id} className="activity-item">
                <div className="activity-icon">
                  {b.status === 'confirmed' || b.status === 'completed' ? (
                    <CheckCircle size={18} className="text-success" />
                  ) : (
                    <AlertCircle size={18} style={{ color: '#ffb84d' }} />
                  )}
                </div>
                <div className="activity-details">
                  <div className="activity-main">
                    <strong>{b.customerName}</strong> - {b.serviceTitle}
                  </div>
                  <div className="activity-meta">
                    <span>{b.city}</span> • <span>{b.date}</span> • <span className="text-primary">{(Number(b.price) || 0).toLocaleString()} {settings.currency}</span> • <span className="ref-cell-text">{b.paymentMethod || 'بنكيلي'}</span>
                  </div>
                </div>
                <span className={`status-badge status-${b.status}`}>
                  {b.status === 'confirmed' ? 'مؤكد' : b.status === 'pending' ? 'معلق' : b.status === 'completed' ? 'مكتمل' : 'ملغى'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
