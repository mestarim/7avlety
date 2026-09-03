import React, { useState, useEffect } from 'react';
import { 
  listingsData as defaultListings, 
  categoriesData as defaultCategories, 
  packagesData, 
  initialPromoCodes 
} from '../data/mockData';
import { AppContext } from './AppContextInstance';

const initialBookings = [
  {
    id: 'BK-1001',
    customerName: 'محمد ولد أحمد',
    phone: '+222 46 12 34 56',
    serviceTitle: 'قاعة الألماس الملكية',
    serviceCategory: 'قاعات الأفراح',
    city: 'نواكشوط',
    date: '2026-09-15',
    price: 1500000,
    originalPrice: 1500000,
    discountAmount: 0,
    paymentMethod: 'bankily',
    paymentRef: 'BNK-98314',
    status: 'confirmed',
    createdAt: '2026-08-12',
    notes: 'حفل زفاف - التجهيزات كاملة مع الضيافة الفاخرة'
  },
  {
    id: 'BK-1002',
    customerName: 'فاطمة بنت المختار',
    phone: '+222 36 98 76 54',
    serviceTitle: 'فندق نواكشوط - القاعة الكبرى',
    serviceCategory: 'الفنادق والمؤتمرات',
    city: 'نواكشوط',
    date: '2026-08-28',
    price: 2125000,
    originalPrice: 2500000,
    discountAmount: 375000,
    promoCode: 'AROSS2026',
    paymentMethod: 'seddad',
    paymentRef: 'SDD-44120',
    status: 'pending',
    createdAt: '2026-08-13',
    notes: 'مؤتمر سنوي مع وجبات عشاء وضيافة فاخرة'
  },
  {
    id: 'BK-1003',
    customerName: 'سيد أحمد ولد الشيخ',
    phone: '+222 22 45 67 89',
    serviceTitle: 'رولز رويس فانتوم 2024 مع سائق',
    serviceCategory: 'سيارات زفاف',
    city: 'نواذيبو',
    date: '2026-09-02',
    price: 300000,
    originalPrice: 300000,
    discountAmount: 0,
    paymentMethod: 'cash',
    paymentRef: 'دفع نقدي عند المعاينة',
    status: 'confirmed',
    createdAt: '2026-08-14',
    notes: 'موكب زفاف مع سائق خاص'
  },
  {
    id: 'BK-1004',
    customerName: 'مريم بنت المصطفى',
    phone: '+222 41 88 99 00',
    serviceTitle: 'سلة هدايا العروس الفاخرة',
    serviceCategory: 'الهدايا والسلال',
    city: 'نواكشوط',
    date: '2026-08-20',
    price: 50000,
    originalPrice: 50000,
    discountAmount: 0,
    paymentMethod: 'masrvi',
    paymentRef: 'MSR-88219',
    status: 'completed',
    createdAt: '2026-08-10',
    notes: 'توصيل مباشر إلى تفرغ زينة'
  }
];

const initialSettings = {
  platformName: 'حفلتي | 7avelty',
  platformSlogan: 'المنصة الموريتانية الأولى لحجز قاعات الأفراح وتجهيز المناسبات',
  currency: 'أوقية',
  phone: '+222 46 00 00 00',
  whatsapp: '+22246000000',
  email: 'contact@7avelty.mr',
  location: 'نواكشوط، تفرغ زينة، موريتانيا',
  commissionRate: 10,
  autoConfirmBookings: false,
  maintenanceMode: false,
  whatsappAlerts: true,
  enablePwaBanner: true
};

// Safe helper for localStorage to catch QuotaExceededError
const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`LocalStorage quota warning for ${key}:`, e);
  }
};

export const AppProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState('client'); // 'client' | 'admin'
  const [adminTab, setAdminTab] = useState('overview'); // 'overview' | 'listings' | 'bookings' | 'categories' | 'promos' | 'settings'

  // Search and Filter States for Client View
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterCity, setFilterCity] = useState('all');
  const [filterKeyword, setFilterKeyword] = useState('');
  const [filterCapacity, setFilterCapacity] = useState('all'); // 'all', 'small' (<200), 'medium' (200-500), 'large' (>500)
  const [filterMaxPrice, setFilterMaxPrice] = useState(3000000);

  // Modals & Drawers States
  const [bookingModalItem, setBookingModalItem] = useState(null);
  const [detailsModalItem, setDetailsModalItem] = useState(null);
  const [invoiceModalBooking, setInvoiceModalBooking] = useState(null);
  const [isBudgetCalculatorOpen, setIsBudgetCalculatorOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Theme State: 'dark' | 'light'
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('7avelty_theme');
    return saved || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('7avelty_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Listings State
  const [listings, setListings] = useState(() => {
    const saved = localStorage.getItem('7avelty_listings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return defaultListings;
  });

  // Bookings State
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('7avelty_bookings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialBookings;
  });

  // Wishlist State (Array of listing IDs)
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('7avelty_wishlist');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [1, 3]; // Default favorites for rich first impression
  });

  // Promo Codes State
  const [promoCodes, setPromoCodes] = useState(() => {
    const saved = localStorage.getItem('7avelty_promocodes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialPromoCodes;
  });

  // Categories State with LocalStorage persistence & CRUD
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('7avelty_categories');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return defaultCategories;
  });

  const [packages] = useState(packagesData);

  // Settings State
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('7avelty_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialSettings;
  });

  // Save to LocalStorage with Safe Handling
  useEffect(() => {
    safeSetItem('7avelty_listings', listings);
  }, [listings]);

  useEffect(() => {
    safeSetItem('7avelty_bookings', bookings);
  }, [bookings]);

  useEffect(() => {
    safeSetItem('7avelty_wishlist', wishlist);
  }, [wishlist]);

  useEffect(() => {
    safeSetItem('7avelty_promocodes', promoCodes);
  }, [promoCodes]);

  useEffect(() => {
    safeSetItem('7avelty_categories', categories);
  }, [categories]);

  useEffect(() => {
    safeSetItem('7avelty_settings', settings);
  }, [settings]);

  // Wishlist Actions
  const toggleWishlist = (listingId) => {
    setWishlist((prev) => {
      const exists = prev.includes(listingId);
      if (exists) {
        showToast('تمت إزالة الخدمة من قائمة المفضلة', 'info');
        return prev.filter((id) => id !== listingId);
      } else {
        showToast('تمت إضافة الخدمة إلى قائمة المفضلة ❤️', 'success');
        return [...prev, listingId];
      }
    });
  };

  const isWishlisted = (listingId) => wishlist.includes(listingId);

  // Availability Check Helpers
  const getBookedDates = (serviceTitle) => {
    if (!serviceTitle) return [];
    return bookings
      .filter((b) => b.serviceTitle === serviceTitle && b.status !== 'cancelled')
      .map((b) => b.date);
  };

  const isDateBooked = (serviceTitle, date) => {
    if (!serviceTitle || !date) return false;
    return bookings.some(
      (b) => b.serviceTitle === serviceTitle && b.date === date && b.status !== 'cancelled'
    );
  };

  // Promo Code Validation & Application
  const applyPromoCode = (codeStr, orderAmount) => {
    if (!codeStr || !codeStr.trim()) {
      return { valid: false, message: 'يرجى إدخال رمز الكوبون' };
    }
    const cleanCode = codeStr.trim().toUpperCase();
    const found = promoCodes.find((c) => c.code.toUpperCase() === cleanCode && c.active);

    if (!found) {
      return { valid: false, message: 'رمز الكوبون غير صحيح أو منتهي الصلاحية' };
    }

    if (found.minBookingAmount && orderAmount < found.minBookingAmount) {
      return {
        valid: false,
        message: `الحد الأدنى لتطبيق هذا الكوبون هو ${found.minBookingAmount.toLocaleString()} أوقية`
      };
    }

    let discountAmount = 0;
    if (found.discountType === 'percentage') {
      discountAmount = Math.round((orderAmount * found.discountValue) / 100);
    } else {
      discountAmount = found.discountValue;
    }

    // Ensure discount doesn't exceed total
    discountAmount = Math.min(discountAmount, orderAmount);
    const finalAmount = Math.max(0, orderAmount - discountAmount);

    return {
      valid: true,
      code: found.code,
      discountAmount,
      finalAmount,
      description: found.description
    };
  };

  const addPromoCode = (newCode) => {
    const item = {
      ...newCode,
      id: `pc-${Date.now()}`,
      code: newCode.code.toUpperCase().trim(),
      active: true,
      usageCount: 0
    };
    setPromoCodes((prev) => [item, ...prev]);
    showToast(`تمت إضافة الكوبون ${item.code} بنجاح!`);
    return item;
  };

  const deletePromoCode = (id) => {
    setPromoCodes((prev) => prev.filter((c) => c.id !== id));
    showToast('تم حذف الكوبون', 'info');
  };

  const togglePromoCodeStatus = (id) => {
    setPromoCodes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
    showToast('تم تغيير حالة الكوبون');
  };

  // Actions: Listings
  const addListing = (listing) => {
    const newListing = {
      ...listing,
      id: Date.now(),
      rating: 5.0,
      createdAt: new Date().toISOString()
    };
    setListings((prev) => [newListing, ...prev]);
    showToast('تمت إضافة ونشر الخدمة بنجاح في الموقع!');
    return newListing;
  };

  const updateListing = (id, updatedData) => {
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
    showToast('تم تحديث بيانات الخدمة بنجاح!');
  };

  const deleteListing = (id) => {
    setListings((prev) => prev.filter((item) => item.id !== id));
    showToast('تم حذف الخدمة بنجاح', 'info');
  };

  // Actions: Bookings
  const addBooking = (bookingData) => {
    const newBooking = {
      ...bookingData,
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      status: settings.autoConfirmBookings ? 'confirmed' : 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setBookings((prev) => [newBooking, ...prev]);
    
    // Update promo code usage count if used
    if (bookingData.promoCode) {
      setPromoCodes((prev) =>
        prev.map((c) =>
          c.code.toUpperCase() === bookingData.promoCode.toUpperCase()
            ? { ...c, usageCount: (c.usageCount || 0) + 1 }
            : c
        )
      );
    }

    showToast('تم تسجيل وإرسال طلب الحجز بنجاح!');
    return newBooking;
  };

  const updateBookingStatus = (id, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    const statusText = newStatus === 'confirmed' ? 'تأكيد' : newStatus === 'cancelled' ? 'إلغاء' : 'تحديث';
    showToast(`تم ${statusText} حالة الحجز بنجاح`);
  };

  const deleteBooking = (id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    showToast('تم حذف سجل الحجز', 'info');
  };

  // Actions: Categories
  const addCategory = (categoryData) => {
    const newCat = {
      ...categoryData,
      id: Date.now(),
      title: categoryData.title.trim(),
      iconName: categoryData.iconName || 'Sparkles'
    };
    setCategories((prev) => [...prev, newCat]);
    showToast(`تمت إضافة قسم "${newCat.title}" بنجاح!`);
    return newCat;
  };

  const updateCategory = (id, updatedData) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c))
    );
    showToast('تم تحديث بيانات القسم بنجاح!');
  };

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('تم حذف القسم', 'info');
  };

  // Actions: Reviews
  const addReviewToListing = (listingId, reviewData) => {
    setListings((prev) =>
      prev.map((item) => {
        if (item.id !== listingId) return item;
        const currentReviews = item.reviews || [];
        const newReview = {
          id: `rev-${Date.now()}`,
          author: reviewData.author || 'زائر كريم',
          rating: Number(reviewData.rating) || 5,
          comment: reviewData.comment || '',
          date: new Date().toISOString().split('T')[0]
        };
        const updatedReviews = [newReview, ...currentReviews];
        const avgRating = (
          updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length
        ).toFixed(1);

        return {
          ...item,
          rating: parseFloat(avgRating),
          reviews: updatedReviews
        };
      })
    );
    showToast('شكراً لك! تم نشر تقييمك بنجاح ⭐', 'success');
  };

  // Update Settings
  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('تم حفظ إعدادات المنصة بنجاح!');
  };

  // Quick stats calculation
  const totalRevenue = bookings
    .filter((b) => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + (Number(b.price) || 0), 0);

  const pendingRevenue = bookings
    .filter((b) => b.status === 'pending')
    .reduce((sum, b) => sum + (Number(b.price) || 0), 0);

  const pendingBookingsCount = bookings.filter((b) => b.status === 'pending').length;
  const confirmedBookingsCount = bookings.filter((b) => b.status === 'confirmed' || b.status === 'completed').length;

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        adminTab,
        setAdminTab,
        listings,
        addListing,
        updateListing,
        deleteListing,
        addReviewToListing,
        bookings,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        packages,
        settings,
        updateSettings,
        bookingModalItem,
        setBookingModalItem,
        detailsModalItem,
        setDetailsModalItem,
        invoiceModalBooking,
        setInvoiceModalBooking,
        filterCategory,
        setFilterCategory,
        filterCity,
        setFilterCity,
        filterKeyword,
        setFilterKeyword,
        filterCapacity,
        setFilterCapacity,
        filterMaxPrice,
        setFilterMaxPrice,
        toast,
        showToast,
        wishlist,
        toggleWishlist,
        isWishlisted,
        isWishlistOpen,
        setIsWishlistOpen,
        isBudgetCalculatorOpen,
        setIsBudgetCalculatorOpen,
        theme,
        toggleTheme,
        promoCodes,
        applyPromoCode,
        addPromoCode,
        deletePromoCode,
        togglePromoCodeStatus,
        getBookedDates,
        isDateBooked,
        stats: {
          totalRevenue,
          pendingRevenue,
          totalBookings: bookings.length,
          pendingBookingsCount,
          confirmedBookingsCount,
          activeListingsCount: listings.length,
          activePromosCount: promoCodes.filter((p) => p.active).length
        }
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
