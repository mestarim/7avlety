import { supabase } from './supabaseClient';

// Helper mapping for listings
export const mapListingToDb = (item) => ({
  id: String(item.id),
  title: item.title || '',
  category: item.category || '',
  price: String(item.price || ''),
  numeric_price: Number(item.numericPrice || 0),
  capacity: Number(item.capacity || 0),
  location: item.location || '',
  city: item.city || 'نواكشوط',
  image: item.image || '',
  images: item.images || [item.image].filter(Boolean),
  features: item.features || item.amenities || [],
  description: item.description || '',
  rating: Number(item.rating || 5.0),
  badge: item.badge || '',
  reviews: item.reviews || []
});

export const mapListingFromDb = (row) => ({
  id: isNaN(Number(row.id)) ? row.id : Number(row.id),
  title: row.title,
  category: row.category,
  price: row.price,
  numericPrice: Number(row.numeric_price || 0),
  capacity: Number(row.capacity || 0),
  location: row.location,
  city: row.city || 'نواكشوط',
  image: row.image,
  images: Array.isArray(row.images) && row.images.length > 0 ? row.images : [row.image].filter(Boolean),
  features: row.features || [],
  amenities: row.features || [],
  description: row.description,
  rating: Number(row.rating || 5.0),
  badge: row.badge,
  reviews: Array.isArray(row.reviews) ? row.reviews : []
});

// Helper mapping for bookings
export const mapBookingToDb = (b) => ({
  id: String(b.id),
  customer_name: b.customerName || '',
  phone: b.phone || '',
  service_title: b.serviceTitle || '',
  city: b.city || 'نواكشوط',
  date: b.date || '',
  price: Number(b.price || 0),
  original_price: Number(b.originalPrice || b.price || 0),
  discount_amount: Number(b.discountAmount || 0),
  promo_code: b.promoCode || null,
  payment_method: b.paymentMethod || 'bankily',
  payment_ref: b.paymentRef || '',
  status: b.status || 'pending',
  notes: b.notes || '',
  created_at: b.createdAt || new Date().toISOString()
});

export const mapBookingFromDb = (row) => ({
  id: row.id,
  customerName: row.customer_name,
  phone: row.phone,
  serviceTitle: row.service_title,
  city: row.city || 'نواكشوط',
  date: row.date,
  price: Number(row.price || 0),
  originalPrice: Number(row.original_price || row.price || 0),
  discountAmount: Number(row.discount_amount || 0),
  promoCode: row.promo_code,
  paymentMethod: row.payment_method || 'bankily',
  paymentRef: row.payment_ref || '',
  status: row.status || 'pending',
  notes: row.notes || '',
  createdAt: row.created_at
});

// Helper mapping for categories
export const mapCategoryToDb = (cat) => ({
  id: String(cat.id),
  name: cat.title || cat.name || '',
  count: Number(cat.count || 0),
  icon_name: cat.iconName || 'Sparkles',
  popular: Boolean(cat.popular)
});

export const mapCategoryFromDb = (row) => ({
  id: isNaN(Number(row.id)) ? row.id : Number(row.id),
  title: row.name,
  name: row.name,
  count: Number(row.count || 0),
  iconName: row.icon_name || 'Sparkles',
  popular: Boolean(row.popular)
});

// Helper mapping for packages
export const mapPackageToDb = (pkg) => ({
  id: String(pkg.id),
  title: pkg.title || '',
  subtitle: pkg.subtitle || '',
  original_price: Number(pkg.originalPrice || 0),
  package_price: Number(pkg.packagePrice || 0),
  savings: Number(pkg.savings || 0),
  discount_badge: pkg.discountBadge || '',
  rating: Number(pkg.rating || 5.0),
  popular: Boolean(pkg.popular),
  image: pkg.image || '',
  items_included: pkg.itemsIncluded || []
});

export const mapPackageFromDb = (row) => ({
  id: row.id,
  title: row.title,
  subtitle: row.subtitle,
  originalPrice: Number(row.original_price || 0),
  packagePrice: Number(row.package_price || 0),
  savings: Number(row.savings || 0),
  discountBadge: row.discount_badge,
  rating: Number(row.rating || 5.0),
  popular: Boolean(row.popular),
  image: row.image,
  itemsIncluded: Array.isArray(row.items_included) ? row.items_included : []
});

// Helper mapping for promo codes
export const mapPromoCodeToDb = (p) => ({
  id: String(p.id),
  code: (p.code || '').toUpperCase().trim(),
  discount_type: p.discountType || 'percentage',
  discount_value: Number(p.discountValue !== undefined ? p.discountValue : (p.discountPercent || p.discount || 10)),
  discount_percent: p.discountType === 'percentage' 
    ? Number(p.discountValue !== undefined ? p.discountValue : (p.discountPercent || 10))
    : 0,
  min_booking_amount: Number(p.minBookingAmount || 0),
  usage_count: Number(p.usageCount || 0),
  active: p.active !== undefined ? Boolean(p.active) : true,
  expiry: p.expiry || '',
  description: p.description || ''
});

export const mapPromoCodeFromDb = (row) => {
  const discountType = row.discount_type || 'percentage';
  const val = Number(
    row.discount_value !== undefined && row.discount_value !== null
      ? row.discount_value
      : (row.discount_percent || 10)
  );

  return {
    id: isNaN(Number(row.id)) ? row.id : Number(row.id),
    code: (row.code || '').toUpperCase().trim(),
    discountType,
    discountValue: val,
    discountPercent: discountType === 'percentage' ? val : 0,
    minBookingAmount: Number(row.min_booking_amount || 0),
    usageCount: Number(row.usage_count || 0),
    active: row.active !== undefined ? Boolean(row.active) : true,
    expiry: row.expiry || '',
    description: row.description || ''
  };
};

/**
 * Fetch all initial data from Supabase
 */
export const fetchAllFromSupabase = async () => {
  try {
    const [
      listingsRes,
      bookingsRes,
      categoriesRes,
      packagesRes,
      promosRes,
      settingsRes
    ] = await Promise.all([
      supabase.from('listings').select('*').order('created_at', { ascending: false }),
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('created_at', { ascending: true }),
      supabase.from('packages').select('*').order('created_at', { ascending: true }),
      supabase.from('promo_codes').select('*').order('created_at', { ascending: true }),
      supabase.from('settings').select('*').eq('id', 'main').single()
    ]);

    return {
      listings: listingsRes.data ? listingsRes.data.map(mapListingFromDb) : null,
      bookings: bookingsRes.data ? bookingsRes.data.map(mapBookingFromDb) : null,
      categories: categoriesRes.data ? categoriesRes.data.map(mapCategoryFromDb) : null,
      packages: packagesRes.data ? packagesRes.data.map(mapPackageFromDb) : null,
      promoCodes: promosRes.data ? promosRes.data.map(mapPromoCodeFromDb) : null,
      settings: settingsRes.data?.data || null,
      isOnline: true
    };
  } catch (error) {
    console.warn('Supabase fetch failed, falling back to local storage:', error);
    return { isOnline: false };
  }
};

/**
 * Seed initial data if tables are empty
 */
export const seedSupabaseIfEmpty = async (defaults) => {
  try {
    const { count, error } = await supabase.from('listings').select('*', { count: 'exact', head: true });
    if (error || count === null || count > 0) return;

    console.log('Seeding initial data into Supabase...');

    if (defaults.listings?.length > 0) {
      await supabase.from('listings').upsert(defaults.listings.map(mapListingToDb));
    }
    if (defaults.categories?.length > 0) {
      await supabase.from('categories').upsert(defaults.categories.map(mapCategoryToDb));
    }
    if (defaults.packages?.length > 0) {
      await supabase.from('packages').upsert(defaults.packages.map(mapPackageToDb));
    }
    if (defaults.promoCodes?.length > 0) {
      await supabase.from('promo_codes').upsert(defaults.promoCodes.map(mapPromoCodeToDb));
    }
    if (defaults.bookings?.length > 0) {
      await supabase.from('bookings').upsert(defaults.bookings.map(mapBookingToDb));
    }
    if (defaults.settings) {
      await supabase.from('settings').upsert({ id: 'main', data: defaults.settings });
    }

    console.log('Supabase seeding complete!');
  } catch (err) {
    console.warn('Seeding Supabase caught an error:', err);
  }
};

/**
 * Mutations Sync Helpers
 */
export const syncListingToSupabase = async (item) => {
  try {
    await supabase.from('listings').upsert(mapListingToDb(item));
  } catch (e) {
    console.warn('Sync listing failed:', e);
  }
};

export const deleteListingFromSupabase = async (id) => {
  try {
    await supabase.from('listings').delete().eq('id', String(id));
  } catch (e) {
    console.warn('Delete listing failed:', e);
  }
};

export const syncBookingToSupabase = async (booking) => {
  try {
    await supabase.from('bookings').upsert(mapBookingToDb(booking));
  } catch (e) {
    console.warn('Sync booking failed:', e);
  }
};

export const deleteBookingFromSupabase = async (id) => {
  try {
    await supabase.from('bookings').delete().eq('id', String(id));
  } catch (e) {
    console.warn('Delete booking failed:', e);
  }
};

export const syncCategoryToSupabase = async (cat) => {
  try {
    await supabase.from('categories').upsert(mapCategoryToDb(cat));
  } catch (e) {
    console.warn('Sync category failed:', e);
  }
};

export const deleteCategoryFromSupabase = async (id) => {
  try {
    await supabase.from('categories').delete().eq('id', String(id));
  } catch (e) {
    console.warn('Delete category failed:', e);
  }
};

export const syncPackageToSupabase = async (pkg) => {
  try {
    await supabase.from('packages').upsert(mapPackageToDb(pkg));
  } catch (e) {
    console.warn('Sync package failed:', e);
  }
};

export const deletePackageFromSupabase = async (id) => {
  try {
    await supabase.from('packages').delete().eq('id', String(id));
  } catch (e) {
    console.warn('Delete package failed:', e);
  }
};

export const syncPromoCodeToSupabase = async (promo) => {
  try {
    await supabase.from('promo_codes').upsert(mapPromoCodeToDb(promo));
  } catch (e) {
    console.warn('Sync promo code failed:', e);
  }
};

export const deletePromoCodeFromSupabase = async (id) => {
  try {
    await supabase.from('promo_codes').delete().eq('id', String(id));
  } catch (e) {
    console.warn('Delete promo code failed:', e);
  }
};

export const syncSettingsToSupabase = async (settings) => {
  try {
    await supabase.from('settings').upsert({ id: 'main', data: settings });
  } catch (e) {
    console.warn('Sync settings failed:', e);
  }
};
