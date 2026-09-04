import React from 'react';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/useApp';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Categories from './components/Categories';
import PackagesSection from './components/PackagesSection';
import FeaturedListings from './components/FeaturedListings';
import Footer from './components/Footer';
import AdminLayout from './components/admin/AdminLayout';
import BookingModal from './components/BookingModal';
import ListingDetailsModal from './components/ListingDetailsModal';
import InvoiceModal from './components/InvoiceModal';
import BudgetCalculatorModal from './components/BudgetCalculatorModal';
import WishlistModal from './components/WishlistModal';
import BookingTrackerModal from './components/BookingTrackerModal';
import AdminLoginModal from './components/AdminLoginModal';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import Toast from './components/Toast';
import WhatsAppFloatingBtn from './components/WhatsAppFloatingBtn';

import { MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';

function MainAppContent() {
  const { currentView, settings, requestAdminAccess } = useApp();

  if (currentView === 'admin') {
    return (
      <>
        <AdminLayout />
        <InvoiceModal />
        <Toast />
      </>
    );
  }

  // Maintenance Mode Screen
  if (settings.maintenanceMode) {
    return (
      <div className="maintenance-screen">
        <div className="maintenance-card">
          <div className="maintenance-icon-glow">
            <Sparkles size={40} className="text-primary" />
          </div>
          <div className="logo" style={{ fontSize: '32px', marginBottom: '12px' }}>
            7avelty <span style={{ color: 'var(--text-light)', fontSize: '20px', fontWeight: '400' }}>| حفلتي</span>
          </div>
          <h2>المنصة تحت أعمال التحديث والصيانة</h2>
          <p className="text-muted">
            نقوم حالياً بترقية خوادمنا وتجهيز باقات وعروض حصرية لمناسباتكم وأفراحكم في موريتانيا. سنعود لاستقبال الحجوزات قريباً جداً!
          </p>

          <div className="maintenance-actions">
            <a
              href={`https://wa.me/${(settings.whatsapp || '22246000000').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('السلام عليكم، أود الاستفسار عن حجوزات حفلتي.')}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              <MessageCircle size={18} /> تواصل معنا عبر واتساب
            </a>
            <button
              className="btn btn-outline"
              onClick={requestAdminAccess}
              title="دخول المشرف بالرمز السري"
            >
              <ShieldCheck size={16} /> لوحة تحكم الإدارة
            </button>
          </div>
        </div>
        <AdminLoginModal />
        <Toast />
      </div>
    );
  }

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <Categories />
        <PackagesSection />
        <FeaturedListings />
      </main>
      <Footer />
      <BookingModal />
      <ListingDetailsModal />
      <InvoiceModal />
      <BudgetCalculatorModal />
      <WishlistModal />
      <BookingTrackerModal />
      <AdminLoginModal />
      <PWAInstallPrompt />
      <WhatsAppFloatingBtn />
      <Toast />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
