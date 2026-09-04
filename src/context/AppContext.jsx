import React, { useState, useEffect } from 'react';
import { 
  listingsData as defaultListings, 
  categoriesData as defaultCategories, 
  packagesData, 
  initialPromoCodes 
} from '../data/mockData';
import { AppContext } from './AppContextInstance';
import {
  fetchAllFromSupabase,
  seedSupabaseIfEmpty,
  syncListingToSupabase,
  deleteListingFromSupabase,
  syncBookingToSupabase,
  deleteBookingFromSupabase,
  syncCategoryToSupabase,
  deleteCategoryFromSupabase,
  syncPackageToSupabase,
  deletePackageFromSupabase,
  syncPromoCodeToSupabase,
  deletePromoCodeFromSupabase,
  syncSettingsToSupabase
} from '../lib/supabaseSync';
import { translations } from '../i18n/translations';

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
  enablePwaBanner: true,
  adminPin: '7777',
  supabaseConnected: true
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
  const [adminTab, setAdminTab] = useState('overview'); // 'overview' | 'listings' | 'bookings' | 'packages' | 'categories' | 'promos' | 'settings'

  // Admin PIN Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('7avelty_admin_auth') === 'true';
  });
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  // Client Booking Tracker State
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);

  // Cloud Connection Status
  const [isCloudConnected, setIsCloudConnected] = useState(false);

  // Search and Filter States for Client View
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterCity, setFilterCity] = useState('all');
  const [filterKeyword, setFilterKeyword] = useState('');
  const [filterCapacity, setFilterCapacity] = useState('all');
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

  // Multilingual State: 'ar' | 'fr' | 'en'
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('7avelty_lang');
    return saved && ['ar', 'fr', 'en'].includes(saved) ? saved : 'ar';
  });

  useEffect(() => {
    localStorage.setItem('7avelty_lang', language);
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
  }, [language]);

  const changeLanguage = (newLang) => {
    if (['ar', 'fr', 'en'].includes(newLang)) {
      setLanguage(newLang);
    }
  };

  const t = (path, fallback = '') => {
    if (!path) return fallback;
    const keys = path.split('.');
    let current = translations[language] || translations.ar;
    for (const k of keys) {
      if (current && current[k] !== undefined) {
        current = current[k];
      } else {
        let arFallback = translations.ar;
        for (const fbKey of keys) {
          if (arFallback && arFallback[fbKey] !== undefined) {
            arFallback = arFallback[fbKey];
          } else {
            return fallback || path;
          }
        }
        return arFallback;
      }
    }
    return current || fallback || path;
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
    return [1, 3];
  });

  // Promo Codes State
  const [promoCodes, setPromoCodes] = useState(() => {
    const saved = localStorage.getItem('7avelty_promocodes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p) => {
            const discountType = p.discountType || 'percentage';
            const val = Number(
              p.discountValue !== undefined && p.discountValue !== null
                ? p.discountValue
                : (p.discountPercent || p.discount || 10)
            );
            return {
              id: p.id,
              code: (p.code || '').toUpperCase().trim(),
              discountType,
              discountValue: val,
              discountPercent: discountType === 'percentage' ? val : 0,
              minBookingAmount: Number(p.minBookingAmount || 0),
              usageCount: Number(p.usageCount || 0),
              active: p.active !== undefined ? Boolean(p.active) : true,
              expiry: p.expiry || '',
              description: p.description || ''
            };
          });
        }
      } catch (e) { console.error(e); }
    }
    return initialPromoCodes;
  });

  // Categories State
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('7avelty_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((c) => ({
            id: c.id,
            title: c.title || c.name || '',
            name: c.name || c.title || '',
            iconName: typeof c.iconName === 'string' ? c.iconName : 'Sparkles',
            count: Number(c.count) || 0,
            popular: Boolean(c.popular)
          }));
        }
      } catch (e) { console.error(e); }
    }
    return defaultCategories;
  });

  // Packages State
  const [packages, setPackages] = useState(() => {
    const saved = localStorage.getItem('7avelty_packages');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return packagesData;
  });

  // Settings State
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('7avelty_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialSettings;
  });

  // Supabase Initial Hydration and Seeding Effect
  useEffect(() => {
    let isMounted = true;

    const initCloud = async () => {
      try {
        const cloudData = await fetchAllFromSupabase();
        if (!isMounted) return;

        if (cloudData.isOnline) {
          setIsCloudConnected(true);

          if (cloudData.listings && cloudData.listings.length > 0) {
            setListings(cloudData.listings);
          }
          if (cloudData.bookings && cloudData.bookings.length > 0) {
            setBookings(cloudData.bookings);
          }
          if (cloudData.categories && cloudData.categories.length > 0) {
            setCategories(cloudData.categories);
          }
          if (cloudData.packages && cloudData.packages.length > 0) {
            setPackages(cloudData.packages);
          }
          if (cloudData.promoCodes && cloudData.promoCodes.length > 0) {
            setPromoCodes(cloudData.promoCodes);
          }
          if (cloudData.settings) {
            setSettings((prev) => ({ ...prev, ...cloudData.settings }));
          }

          // If database is brand new, seed with rich default data
          await seedSupabaseIfEmpty({
            listings: defaultListings,
            categories: defaultCategories,
            packages: packagesData,
            promoCodes: initialPromoCodes,
            bookings: initialBookings,
            settings: initialSettings
          });
        }
      } catch (err) {
        console.warn('Cloud sync hydration exception:', err);
      }
    };

    initCloud();

    return () => {
      isMounted = false;
    };
  }, []);

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
    safeSetItem('7avelty_packages', packages);
  }, [packages]);

  useEffect(() => {
    safeSetItem('7avelty_settings', settings);
  }, [settings]);

  // Admin PIN Authentication Methods
  const loginAdmin = (pin) => {
    const validPin = settings.adminPin || '7777';
    if (String(pin).trim() === String(validPin).trim()) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('7avelty_admin_auth', 'true');
      setIsAdminLoginModalOpen(false);
      setCurrentView('admin');
      showToast('مرحباً بك في لوحة تحكم الإدارة! 👑', 'success');
      return { success: true };
    } else {
      return { success: false, message: 'الرمز السري غير صحيح! يرجى التأكد والمحاولة مجدداً.' };
    }
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('7avelty_admin_auth');
    setCurrentView('client');
    showToast('تم تسجيل الخروج بنجاح من لوحة الأدمن', 'info');
  };

  const requestAdminAccess = () => {
    if (isAdminAuthenticated) {
      setCurrentView('admin');
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  // Client Booking Lookup Method
  const lookupBooking = (query) => {
    if (!query || !query.trim()) return [];
    const clean = query.trim().toLowerCase();
    const cleanDigits = clean.replace(/[^0-9]/g, '');

    return bookings.filter((b) => {
      const idMatch = b.id && b.id.toLowerCase().includes(clean);
      const phoneMatch = cleanDigits.length >= 4 && b.phone && b.phone.replace(/[^0-9]/g, '').includes(cleanDigits);
      const nameMatch = b.customerName && b.customerName.toLowerCase().includes(clean);
      return idMatch || phoneMatch || nameMatch;
    });
  };

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
      return { 
        valid: false, 
        message: language === 'ar' ? 'يرجى كتابة رمز الكوبون' : (language === 'fr' ? 'Veuillez saisir un code promo' : 'Please enter a promo code') 
      };
    }
    const cleanCode = codeStr.trim().toUpperCase();
    const found = promoCodes.find((p) => (p.code || '').toUpperCase().trim() === cleanCode);

    if (!found) {
      return { 
        valid: false, 
        message: language === 'ar' ? 'كوبون الخصم غير صحيح أو غير موجود' : (language === 'fr' ? 'Code promo invalide ou introuvable' : 'Invalid promo code') 
      };
    }

    if (!found.active) {
      return { 
        valid: false, 
        message: language === 'ar' ? 'هذا الكوبون غير مفعّل حالياً' : (language === 'fr' ? 'Ce coupon est actuellement désactivé' : 'This coupon is currently inactive') 
      };
    }

    // Expiry check
    if (found.expiry) {
      const todayStr = new Date().toISOString().split('T')[0];
      if (found.expiry < todayStr) {
        return {
          valid: false,
          message: language === 'ar' ? 'عذراً، هذا الكوبون انتهت فترة صلاحيته' : (language === 'fr' ? 'Ce coupon a expiré' : 'This coupon has expired')
        };
      }
    }

    // Minimum booking amount check
    const minAmount = Number(found.minBookingAmount || 0);
    const amount = Number(orderAmount || 0);
    if (minAmount > 0 && amount < minAmount) {
      return {
        valid: false,
        message: language === 'ar' 
          ? `الحد الأدنى للاستفادة من هذا الكوبون هو ${minAmount.toLocaleString()} ${settings.currency}` 
          : (language === 'fr' 
            ? `Le montant minimum pour ce coupon est de ${minAmount.toLocaleString()} ${settings.currency}` 
            : `Minimum booking amount for this coupon is ${minAmount.toLocaleString()} ${settings.currency}`)
      };
    }

    // Calculate discount
    const discountType = found.discountType || 'percentage';
    const discountVal = Number(found.discountValue !== undefined ? found.discountValue : (found.discountPercent || 10));
    let discountAmount = 0;

    if (discountType === 'fixed') {
      discountAmount = Math.min(amount, discountVal);
    } else {
      discountAmount = Math.round((amount * discountVal) / 100);
    }

    const finalAmount = Math.max(0, amount - discountAmount);

    const successMessage = discountType === 'fixed'
      ? (language === 'ar' 
          ? `تم تطبيق خصم فوري بقيمة ${discountAmount.toLocaleString()} ${settings.currency} بنجاح!` 
          : (language === 'fr' ? `Remise immédiate de ${discountAmount.toLocaleString()} ${settings.currency} appliquée !` : `Flat discount of ${discountAmount.toLocaleString()} ${settings.currency} applied!`))
      : (language === 'ar'
          ? `تم تطبيق خصم ${discountVal}% بنجاح! (وفرت ${discountAmount.toLocaleString()} ${settings.currency})`
          : (language === 'fr' ? `Remise de ${discountVal}% appliquée !` : `${discountVal}% discount applied!`));

    return {
      valid: true,
      promoId: found.id,
      code: found.code,
      discountType,
      discountValue: discountVal,
      discountPercent: discountType === 'percentage' ? discountVal : 0,
      discountAmount,
      finalAmount,
      message: successMessage
    };
  };

  const addPromoCode = (newPromo) => {
    const discountType = newPromo.discountType || 'percentage';
    const val = Number(newPromo.discountValue || 10);
    const promoWithId = {
      id: newPromo.id || `pc-${Date.now()}`,
      code: (newPromo.code || '').toUpperCase().trim(),
      discountType,
      discountValue: val,
      discountPercent: discountType === 'percentage' ? val : 0,
      minBookingAmount: Number(newPromo.minBookingAmount || 0),
      expiry: newPromo.expiry || '',
      description: newPromo.description || `خصم ${val}${discountType === 'percentage' ? '%' : ' ' + settings.currency}`,
      active: true,
      usageCount: 0
    };
    setPromoCodes((prev) => [promoWithId, ...prev]);
    syncPromoCodeToSupabase(promoWithId);
    showToast(`تمت إضافة الكوبون ${promoWithId.code} بنجاح! 🏷️`, 'success');
    return promoWithId;
  };

  const updatePromoCode = (id, updatedData) => {
    setPromoCodes((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const discountType = updatedData.discountType || p.discountType || 'percentage';
          const val = Number(
            updatedData.discountValue !== undefined 
              ? updatedData.discountValue 
              : p.discountValue
          );
          const updated = {
            ...p,
            ...updatedData,
            code: updatedData.code ? updatedData.code.toUpperCase().trim() : p.code,
            discountType,
            discountValue: val,
            discountPercent: discountType === 'percentage' ? val : 0,
            minBookingAmount: Number(
              updatedData.minBookingAmount !== undefined 
                ? updatedData.minBookingAmount 
                : (p.minBookingAmount || 0)
            )
          };
          syncPromoCodeToSupabase(updated);
          return updated;
        }
        return p;
      })
    );
    showToast('تم تحديث بيانات الكوبون بنجاح! 🏷️', 'success');
  };

  const deletePromoCode = (id) => {
    setPromoCodes((prev) => prev.filter((p) => p.id !== id));
    deletePromoCodeFromSupabase(id);
    showToast('تم حذف الكوبون بنجاح', 'info');
  };

  const togglePromoCodeStatus = (id) => {
    setPromoCodes((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, active: !p.active };
          syncPromoCodeToSupabase(updated);
          return updated;
        }
        return p;
      })
    );
    showToast('تم تحديث حالة الكوبون', 'info');
  };

  // Category Actions
  const addCategory = (categoryData) => {
    const newCat = {
      id: Date.now(),
      title: categoryData.title,
      name: categoryData.title,
      iconName: categoryData.iconName || 'Sparkles',
      popular: categoryData.popular || false,
      count: 0
    };
    setCategories((prev) => [...prev, newCat]);
    syncCategoryToSupabase(newCat);
    showToast(`تمت إضافة تصنيف "${newCat.title}" بنجاح! 🏷️`, 'success');
    return newCat;
  };

  const updateCategory = (id, updatedData) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = {
            ...c,
            ...updatedData,
            name: updatedData.title || c.title || c.name,
            title: updatedData.title || c.title
          };
          syncCategoryToSupabase(updated);
          return updated;
        }
        return c;
      })
    );
    showToast('تم تحديث بيانات التصنيف بنجاح! ✨', 'success');
  };

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    deleteCategoryFromSupabase(id);
    showToast('تم حذف التصنيف بنجاح', 'info');
  };

  // Packages Actions (CRUD)
  const addPackage = (packageData) => {
    const origPrice = Number(packageData.originalPrice) || 0;
    const pkgPrice = Number(packageData.packagePrice) || 0;
    const savings = Math.max(0, origPrice - pkgPrice);

    const newPkg = {
      id: packageData.id || `pkg-${Date.now().toString().slice(-6)}`,
      title: packageData.title,
      subtitle: packageData.subtitle || '',
      originalPrice: origPrice,
      packagePrice: pkgPrice,
      savings: savings,
      discountBadge: packageData.discountBadge || (savings > 0 ? `وفر ${savings.toLocaleString()} ${settings.currency}` : ''),
      rating: Number(packageData.rating || 5.0),
      popular: Boolean(packageData.popular),
      image: packageData.image || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop',
      itemsIncluded: Array.isArray(packageData.itemsIncluded) ? packageData.itemsIncluded : []
    };

    setPackages((prev) => [newPkg, ...prev]);
    syncPackageToSupabase(newPkg);
    showToast('تمت إضافة باقة العرس الجديدة بنجاح! 👑', 'success');
    return newPkg;
  };

  const updatePackage = (id, updatedData) => {
    setPackages((prev) =>
      prev.map((pkg) => {
        if (pkg.id === id) {
          const orig = updatedData.originalPrice !== undefined ? Number(updatedData.originalPrice) : pkg.originalPrice;
          const price = updatedData.packagePrice !== undefined ? Number(updatedData.packagePrice) : pkg.packagePrice;
          const savings = Math.max(0, orig - price);

          const merged = {
            ...pkg,
            ...updatedData,
            originalPrice: orig,
            packagePrice: price,
            savings,
            discountBadge: updatedData.discountBadge !== undefined 
              ? updatedData.discountBadge 
              : (savings > 0 ? `وفر ${savings.toLocaleString()} ${settings.currency}` : '')
          };
          syncPackageToSupabase(merged);
          return merged;
        }
        return pkg;
      })
    );
    showToast('تم تحديث الباقة بنجاح! ✨', 'success');
  };

  const deletePackage = (id) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
    deletePackageFromSupabase(id);
    showToast('تم حذف باقة العرس بنجاح', 'info');
  };

  // Listings Actions
  const addListing = (newListing) => {
    const createdItem = {
      ...newListing,
      id: Date.now(),
      rating: newListing.rating || 5.0,
      badge: newListing.badge || 'جديد حصرياً',
      images: newListing.images && newListing.images.length > 0 ? newListing.images : [newListing.image],
      reviews: []
    };
    setListings((prev) => [createdItem, ...prev]);
    syncListingToSupabase(createdItem);
    showToast('تمت إضافة الخدمة / القاعة بنجاح! 🎉', 'success');
  };

  const updateListing = (id, updatedListing) => {
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const merged = {
            ...item,
            ...updatedListing,
            images: updatedListing.images && updatedListing.images.length > 0 
              ? updatedListing.images 
              : (item.images || [item.image])
          };
          syncListingToSupabase(merged);
          return merged;
        }
        return item;
      })
    );
    showToast('تم تحديث بيانات الخدمة بنجاح! ✨', 'success');
  };

  const deleteListing = (id) => {
    setListings((prev) => prev.filter((item) => item.id !== id));
    deleteListingFromSupabase(id);
    showToast('تم حذف الخدمة من القائمة', 'info');
  };

  // Add Review to Listing Action
  const addReviewToListing = (listingId, reviewData) => {
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === listingId) {
          const newReviewObj = {
            id: Date.now(),
            author: reviewData.author || 'عميل حفلتي',
            rating: Number(reviewData.rating) || 5,
            comment: reviewData.comment || '',
            date: new Date().toLocaleDateString('ar-MR', { year: 'numeric', month: 'long', day: 'numeric' })
          };
          const updatedReviews = [newReviewObj, ...(item.reviews || [])];
          
          const totalScore = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
          const newAvgRating = parseFloat((totalScore / updatedReviews.length).toFixed(1));

          const updatedListing = {
            ...item,
            rating: newAvgRating,
            reviews: updatedReviews
          };
          syncListingToSupabase(updatedListing);
          return updatedListing;
        }
        return item;
      })
    );
    showToast('شكراً لك! تمت إضافة تقييمك بنجاح ⭐', 'success');
  };

  // Bookings Actions
  const addBooking = (bookingData) => {
    const newBooking = {
      ...bookingData,
      id: `BK-${Date.now().toString().slice(-4)}`,
      status: settings.autoConfirmBookings ? 'confirmed' : 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setBookings((prev) => [newBooking, ...prev]);
    syncBookingToSupabase(newBooking);

    // Increment promo usage if a promo code was applied
    if (bookingData.promoCode) {
      setPromoCodes((prev) =>
        prev.map((p) => {
          if ((p.code || '').toUpperCase().trim() === (bookingData.promoCode || '').toUpperCase().trim()) {
            const updated = { ...p, usageCount: (p.usageCount || 0) + 1 };
            syncPromoCodeToSupabase(updated);
            return updated;
          }
          return p;
        })
      );
    }

    showToast('تم استلام طلب حجزك بنجاح! سنتواصل معك للتأكيد 💍', 'success');
    return newBooking;
  };

  const updateBookingStatus = (id, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const updated = { ...b, status: newStatus };
          syncBookingToSupabase(updated);
          return updated;
        }
        return b;
      })
    );
    const statusArabic = newStatus === 'confirmed' ? 'مؤكد' : newStatus === 'cancelled' ? 'ملغى' : 'مكتمل';
    showToast(`تم تغيير حالة الحجز إلى: ${statusArabic}`, 'info');
  };

  const deleteBooking = (id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    deleteBookingFromSupabase(id);
    showToast('تم حذف الحجز بنجاح', 'info');
  };

  // Settings Actions
  const updateSettings = (newSettings) => {
    setSettings((prev) => {
      const merged = { ...prev, ...newSettings };
      syncSettingsToSupabase(merged);
      return merged;
    });
    showToast('تم حفظ الإعدادات وتحديثها سحابياً بنجاح! ⚙️', 'success');
  };

  // Financial and KPI calculations
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
        isAdminAuthenticated,
        isAdminLoginModalOpen,
        setIsAdminLoginModalOpen,
        loginAdmin,
        logoutAdmin,
        requestAdminAccess,
        isTrackerModalOpen,
        setIsTrackerModalOpen,
        lookupBooking,
        isCloudConnected,
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
        addPackage,
        updatePackage,
        deletePackage,
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
        language,
        changeLanguage,
        t,
        dir: language === 'ar' ? 'rtl' : 'ltr',
        promoCodes,
        applyPromoCode,
        addPromoCode,
        updatePromoCode,
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

export default AppProvider;
