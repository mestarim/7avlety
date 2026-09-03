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
import PWAInstallPrompt from './components/PWAInstallPrompt';
import Toast from './components/Toast';
import WhatsAppFloatingBtn from './components/WhatsAppFloatingBtn';

function MainAppContent() {
  const { currentView } = useApp();

  if (currentView === 'admin') {
    return (
      <>
        <AdminLayout />
        <InvoiceModal />
        <Toast />
      </>
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
