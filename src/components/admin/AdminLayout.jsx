import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Building, 
  CalendarCheck, 
  Layers, 
  Settings, 
  ArrowLeft, 
  Menu, 
  X, 
  ShieldCheck, 
  Globe,
  Tag,
  Bell,
  Sparkles,
  LogOut,
  Database
} from 'lucide-react';
import { useApp } from '../../context/useApp';
import AdminOverview from './AdminOverview';
import AdminListings from './AdminListings';
import AdminBookings from './AdminBookings';
import AdminCategories from './AdminCategories';
import AdminPromoCodes from './AdminPromoCodes';
import AdminSettings from './AdminSettings';
import AdminPackages from './AdminPackages';

const AdminLayout = () => {
  const { 
    adminTab, 
    setAdminTab, 
    setCurrentView, 
    bookings, 
    promoCodes, 
    logoutAdmin,
    isCloudConnected 
  } = useApp();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;

  const navItems = [
    { id: 'overview', label: 'لوحة التحكم والإحصائيات', icon: <LayoutDashboard size={20} /> },
    { id: 'listings', label: 'إدارة الخدمات والقاعات', icon: <Building size={20} /> },
    { id: 'packages', label: 'إدارة باقات الأعراس', icon: <Sparkles size={20} /> },
    { 
      id: 'bookings', 
      label: 'إدارة الحجوزات والطلبات', 
      icon: <CalendarCheck size={20} />,
      badge: pendingCount > 0 ? pendingCount : null 
    },
    { 
      id: 'promos', 
      label: 'كوبونات الخصم والعروض', 
      icon: <Tag size={20} />,
      badge: promoCodes.filter((p) => p.active).length > 0 ? promoCodes.filter((p) => p.active).length : null 
    },
    { id: 'categories', label: 'الأقسام والتصنيفات', icon: <Layers size={20} /> },
    { id: 'settings', label: 'الإعدادات العامة', icon: <Settings size={20} /> },
  ];

  return (
    <div className="admin-root-container">
      {/* Mobile Drawer Overlay */}
      {isMobileNavOpen && (
        <div className="admin-mobile-overlay" onClick={() => setIsMobileNavOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isMobileNavOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-brand">
            <ShieldCheck size={26} className="text-primary" />
            <div>
              <div className="brand-name">7avelty <span className="text-primary">Admin</span></div>
              <span className="brand-subtitle">لوحة الإدارة السحابية</span>
            </div>
          </div>
          <button className="admin-mobile-close" onClick={() => setIsMobileNavOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`admin-nav-link ${adminTab === item.id ? 'active' : ''}`}
              onClick={() => {
                setAdminTab(item.id);
                setIsMobileNavOpen(false);
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="btn btn-outline admin-switch-view-btn mb-2" onClick={() => setCurrentView('client')}>
            <Globe size={18} /> عرض واجهة الزوار
          </button>
          <button className="btn btn-outline admin-logout-btn" onClick={logoutAdmin} title="تسجيل الخروج وقفل اللوحة">
            <LogOut size={16} /> تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main-wrapper">
        {/* Admin Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button className="admin-mobile-toggle" onClick={() => setIsMobileNavOpen(true)}>
              <Menu size={22} />
            </button>
            <span className="admin-view-title">
              {navItems.find((n) => n.id === adminTab)?.label}
            </span>
          </div>

          <div className="admin-topbar-actions">
            {/* Cloud Status Pill */}
            <div className={`admin-cloud-pill ${isCloudConnected ? 'connected' : 'local'}`} title="حالة الربط السحابي بقاعدة البيانات">
              <Database size={15} />
              <span>{isCloudConnected ? 'Supabase متصل 🟢' : 'تخزين محلي 💾'}</span>
            </div>

            {pendingCount > 0 && (
              <div className="admin-notification-pill" title={`${pendingCount} طلبات حجز بانتظار التأكيد`}>
                <Bell size={16} className="text-warning" />
                <span>{pendingCount} حجز جديد</span>
              </div>
            )}

            <button
              className="btn btn-primary btn-sm switch-store-btn"
              onClick={() => setCurrentView('client')}
              title="الرجوع إلى موقع حفلتي للزوار"
            >
              <ArrowLeft size={16} /> العودة للموقع
            </button>

            <div className="admin-profile-pill">
              <div className="avatar-circle">أدمن</div>
              <div className="admin-profile-meta">
                <strong>مدير المنصة</strong>
                <span className="status-dot-online">متصل الآن 🟢</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <main className="admin-body">
          {adminTab === 'overview' && <AdminOverview />}
          {adminTab === 'listings' && <AdminListings />}
          {adminTab === 'packages' && <AdminPackages />}
          {adminTab === 'bookings' && <AdminBookings />}
          {adminTab === 'promos' && <AdminPromoCodes />}
          {adminTab === 'categories' && <AdminCategories />}
          {adminTab === 'settings' && <AdminSettings />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
