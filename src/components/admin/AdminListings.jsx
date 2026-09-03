import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  Star, 
  MapPin, 
  Tag, 
  Image as ImageIcon, 
  X, 
  Check, 
  Sparkles, 
  DollarSign, 
  Layers, 
  CheckCircle2, 
  Camera, 
  FileText, 
  Sliders, 
  Users, 
  Info, 
  ArrowRight,
  UploadCloud,
  Link as LinkIcon,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/useApp';

// Preset luxury curated image library for quick selection
const PRESET_IMAGES = [
  { label: 'قاعة ملكية فاخرة', url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop', category: 'قاعات الأفراح' },
  { label: 'فندق فخم ومؤتمرات', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop', category: 'الفنادق والمؤتمرات' },
  { label: 'سيارة رولز رويس زفاف', url: 'https://images.unsplash.com/photo-1631269389230-05e836b772c6?q=80&w=800&auto=format&fit=crop', category: 'سيارات زفاف' },
  { label: 'معدات صوت وإضاءة دي جي', url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop', category: 'معدات صوت ودي جي' },
  { label: 'سلة هدايا العروس', url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop', category: 'الهدايا والسلال' },
  { label: 'بوفيه وأواني ضيافة', url: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop', category: 'أواني ومعدات ضيافة' },
  { label: 'قاعة أفراح مفتوحة', url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop', category: 'قاعات الأفراح' },
  { label: 'سيارة ليموزين مرسيدس', url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=800&auto=format&fit=crop', category: 'سيارات زفاف' }
];

const AVAILABLE_AMENITIES = [
  'تكييف وتبريد مركزي',
  'طاقم ضيافة وخدمة VIP',
  'نظام صوت ومكبرات احترافية',
  'إضاءة ومؤثرات ليزر',
  'مواقف سيارات محروسة',
  'جناح خاص للعروسين',
  'تصوير فيديو وفوتوغرافي',
  'خدمة التوصيل والتركيب'
];

const AdminListings = () => {
  const { listings, addListing, updateListing, deleteListing, settings, showToast, categories } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [activeStep, setActiveStep] = useState(1); // 1: General Info, 2: Pricing & Location, 3: Images & Features
  const [imageSourceMode, setImageSourceMode] = useState('upload'); // 'upload' | 'preset' | 'url'
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'قاعات الأفراح',
    city: 'نواكشوط',
    detailedLocation: 'تفرغ زينة',
    priceNumber: '1500000',
    priceUnit: 'للحفل الكامل',
    badge: 'قاعة فاخرة',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop',
    description: 'قاعة فاخرة مجهزة بأحدث الديكورات ونظام صوت وإضاءة مميز لمختلف المناسبات والأفراح في موريتانيا.',
    amenities: ['تكييف وتبريد مركزي', 'طاقم ضيافة وخدمة VIP', 'نظام صوت ومكبرات احترافية'],
    isActive: true,
    capacity: '500 شخص'
  });

  const filteredListings = listings.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.badge && item.badge.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCat = selectedCategory 
      ? (item.badge === selectedCategory || (item.category && item.category === selectedCategory) || item.title.includes(selectedCategory)) 
      : true;

    return matchesSearch && matchesCat;
  });

  const handleOpenAdd = () => {
    setEditingListing(null);
    setActiveStep(1);
    setImageSourceMode('upload');
    setUploadedFileName('');
    setFormData({
      title: '',
      category: 'قاعات الأفراح',
      city: 'نواكشوط',
      detailedLocation: 'تفرغ زينة',
      priceNumber: '1000000',
      priceUnit: 'للحفل الكامل',
      badge: 'قاعة فاخرة',
      image: PRESET_IMAGES[0].url,
      description: 'خدمة راقية وتجهيزات متكاملة لإقامة أرقى المناسبات والأعراس.',
      amenities: ['تكييف وتبريد مركزي', 'طاقم ضيافة وخدمة VIP', 'نظام صوت ومكبرات احترافية'],
      isActive: true,
      capacity: '400 شخص'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingListing(item);
    setActiveStep(1);
    setUploadedFileName('');
    
    // Check if existing image is base64 or URL
    if (item.image && item.image.startsWith('data:image')) {
      setImageSourceMode('upload');
      setUploadedFileName('صورة محملة مسبقاً من الجهاز');
    } else {
      setImageSourceMode('preset');
    }

    // Extract price number
    let pNum = '1000000';
    let pUnit = 'للحفل الكامل';
    if (typeof item.price === 'string') {
      const match = item.price.replace(/,/g, '').match(/\d+/);
      if (match) pNum = match[0];
      if (item.price.includes('/ يوم')) pUnit = 'لكل يوم';
      if (item.price.includes('/ ليلة')) pUnit = 'لكل ليلة';
      if (item.price.includes('/ ساعة')) pUnit = 'لكل ساعة';
      if (item.price.includes('/ قطعة')) pUnit = 'لكل قطعة';
    }

    // Extract city & detailed location
    let city = 'نواكشوط';
    let detailedLocation = item.location || 'تفرغ زينة';
    if (item.location) {
      if (item.location.includes('نواذيبو')) city = 'نواذيبو';
      else if (item.location.includes('روصو')) city = 'روصو';
      else if (item.location.includes('كيفه')) city = 'كيفه';
      else if (item.location.includes('أطار')) city = 'أطار';
      else city = 'نواكشوط';
    }

    setFormData({
      title: item.title || '',
      category: item.category || 'قاعات الأفراح',
      city: city,
      detailedLocation: detailedLocation,
      priceNumber: pNum,
      priceUnit: pUnit,
      badge: item.badge || 'قاعة فاخرة',
      image: item.image || PRESET_IMAGES[0].url,
      description: item.description || 'خدمة وتجهيزات متكاملة لإقامة أرقى المناسبات والأعراس في موريتانيا.',
      amenities: item.amenities || ['تكييف وتبريد مركزي', 'طاقم ضيافة وخدمة VIP'],
      isActive: item.isActive !== undefined ? item.isActive : true,
      capacity: item.capacity ? String(typeof item.capacity === 'number' ? item.capacity : (parseInt(item.capacity, 10) || 350)) : '350'
    });
    setIsModalOpen(true);
  };

  // High performance Canvas-based image compressor to protect LocalStorage quota
  const compressImage = (file, maxWidth = 1200, quality = 0.75) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to JPEG format with specified quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  // Image Upload File Handler with Auto-Compression
  const processImageFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP)');
      return;
    }

    try {
      if (showToast) {
        showToast('جاري معالجة وضغط الصورة لسرعة التصفح...', 'info');
      }
      const compressedBase64 = await compressImage(file, 1200, 0.75);
      setFormData((prev) => ({ ...prev, image: compressedBase64 }));
      setUploadedFileName(file.name);
      if (showToast) {
        showToast(`تم تحميل وضغط الصورة "${file.name}" بنجاح!`, 'success');
      }
    } catch (err) {
      console.error('Error compressing image:', err);
      // Fallback
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, image: event.target.result }));
        setUploadedFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const toggleAmenity = (amenity) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists 
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity]
      };
    });
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`هل أنت متأكد من حذف "${title}" نهائياً من الموقع؟`)) {
      deleteListing(id);
    }
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!formData.title || !formData.priceNumber) {
      alert('يرجى تعبئة اسم الخدمة والسعر');
      return;
    }

    // Numerical Price & Integer Capacity
    const numericPriceVal = Number(formData.priceNumber) || 0;
    const parsedCapacity = parseInt(formData.capacity, 10) || (formData.category.includes('قاعة') || formData.category.includes('فندق') ? 350 : 1);
    
    // Formatted price
    const formattedPrice = `${numericPriceVal.toLocaleString()} ${settings.currency}${formData.priceUnit ? ` / ${formData.priceUnit}` : ''}`;
    const fullLocation = formData.detailedLocation.includes(formData.city)
      ? formData.detailedLocation
      : `${formData.city}، ${formData.detailedLocation}`;

    const submissionPayload = {
      title: formData.title,
      category: formData.category,
      city: formData.city || 'نواكشوط',
      location: fullLocation,
      price: formattedPrice,
      numericPrice: numericPriceVal,
      badge: formData.badge,
      image: formData.image || PRESET_IMAGES[0].url,
      images: editingListing?.images && editingListing.images.length > 0 
        ? [formData.image, ...editingListing.images.filter(img => img !== formData.image).slice(0, 3)]
        : [formData.image || PRESET_IMAGES[0].url],
      description: formData.description,
      amenities: formData.amenities,
      capacity: parsedCapacity,
      isActive: formData.isActive,
      rating: editingListing ? editingListing.rating : 5.0,
      reviews: editingListing?.reviews || []
    };

    if (editingListing) {
      updateListing(editingListing.id, submissionPayload);
    } else {
      addListing(submissionPayload);
    }

    setIsModalOpen(false);
  };

  // Preview formatted price
  const displayPreviewPrice = `${Number(formData.priceNumber || 0).toLocaleString()} ${settings.currency}${formData.priceUnit ? ` / ${formData.priceUnit}` : ''}`;

  return (
    <div className="admin-listings">
      <div className="admin-page-header">
        <div>
          <h2>إدارة الخدمات والقاعات</h2>
          <p className="text-muted">أضف وعدل القاعات، الفنادق، السيارات، والمعدات المعروضة في الموقع</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> إضافة خدمة جديدة
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-filters-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="ابحث باسم الخدمة أو المدينة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="admin-select"
        >
          <option value="">جميع التصنيفات</option>
          <option value="قاعة فاخرة">قاعات فاخرة</option>
          <option value="الأكثر طلباً">الأكثر طلباً (فنادق)</option>
          <option value="سيارة زفاف">سيارات زفاف</option>
          <option value="معدات">معدات صوت وضيافة</option>
          <option value="هدايا وسلال">هدايا وسلال</option>
        </select>
      </div>

      {/* Listings Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>الخدمة / المكان</th>
              <th>التصنيف والشارة</th>
              <th>الموقع والمدينة</th>
              <th>السعر الحالي</th>
              <th>التقييم</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredListings.length > 0 ? (
              filteredListings.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="table-item-cell">
                      <img src={item.image} alt={item.title} className="table-thumb" />
                      <div>
                        <strong>{item.title}</strong>
                        <span className="table-sub-id">#{item.id}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="admin-tag"><Tag size={12} /> {item.badge}</span>
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                      <MapPin size={14} /> {item.location}
                    </span>
                  </td>
                  <td>
                    <strong className="text-primary">{item.price}</strong>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={14} className="text-primary" fill="currentColor" /> {item.rating || 5.0}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${item.isActive !== false ? 'status-confirmed' : 'status-cancelled'}`}>
                      {item.isActive !== false ? 'معروض ✅' : 'موقف ⏸️'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleOpenEdit(item)}
                        title="تعديل بيانات الخدمة"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(item.id, item.title)}
                        title="حذف الخدمة"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  لا توجد خدمات مطابقة لبحثك
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* =========================================================
          Ultra-Luxurious Full-Width Edit/Add Modal
      ========================================================= */}
      {isModalOpen && (
        <div className="modal-overlay luxury-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="luxury-edit-modal-window" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="luxury-modal-top-bar">
              <div className="modal-header-main-title">
                <div className="luxury-header-icon-box">
                  {editingListing ? <Edit size={24} className="text-primary" /> : <Plus size={24} className="text-primary" />}
                </div>
                <div>
                  <h3 className="modal-title-text">
                    {editingListing ? `تعديل بيانات: ${formData.title || 'خدمة جديدة'}` : 'إضافة خدمة أو قاعة جديدة'}
                  </h3>
                  <p className="modal-subtitle-text">
                    لوحة تحكم الأدمن • تعديل التفاصيل والتسعير والمزايا مع المعاينة الفورية
                  </p>
                </div>
              </div>

              <div className="modal-header-right-controls">
                {/* Active Status Badge Switch */}
                <label className="luxury-status-pill-toggle">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span className="pill-switch-track"></span>
                  <span className="pill-switch-text">
                    {formData.isActive ? 'الخدمة منشورة ومتاحة للحجز ✅' : 'الخدمة موقوفة مؤقتاً ⏸️'}
                  </span>
                </label>

                {/* Close Button */}
                <button className="luxury-modal-close-icon" onClick={() => setIsModalOpen(false)} title="إغلاق">
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Navigation Stepper / Tabs */}
            <div className="luxury-steps-bar">
              <button 
                type="button" 
                className={`step-nav-item ${activeStep === 1 ? 'active' : ''}`}
                onClick={() => setActiveStep(1)}
              >
                <span className="step-num">1</span>
                <span className="step-label"><Sliders size={16} /> المعلومات الأساسية والتصنيف</span>
              </button>
              <button 
                type="button" 
                className={`step-nav-item ${activeStep === 2 ? 'active' : ''}`}
                onClick={() => setActiveStep(2)}
              >
                <span className="step-num">2</span>
                <span className="step-label"><DollarSign size={16} /> التسعير والموقع بالمدن</span>
              </button>
              <button 
                type="button" 
                className={`step-nav-item ${activeStep === 3 ? 'active' : ''}`}
                onClick={() => setActiveStep(3)}
              >
                <span className="step-num">3</span>
                <span className="step-label"><Camera size={16} /> الصورة (من الجهاز) والمزايا</span>
              </button>
            </div>

            {/* Modal Body: 2 Columns (Form + Interactive Preview) */}
            <div className="luxury-modal-content-grid">
              
              {/* Left/Main Column: Form */}
              <div className="luxury-form-column">
                <form onSubmit={handleSubmit} id="luxuryEditForm">
                  
                  {/* STEP 1: General Info */}
                  {activeStep === 1 && (
                    <div className="step-container-box">
                      <div className="section-divider-title">
                        <Info size={16} className="text-primary" /> تفاصيل العنوان والتصنيف
                      </div>

                      <div className="luxury-input-group">
                        <label className="luxury-field-label">اسم الخدمة أو القاعة أو المعروض *</label>
                        <input
                          type="text"
                          required
                          className="luxury-text-input"
                          placeholder="مثال: قاعة الألماس الملكية أو ليموزين الزفاف"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        <span className="input-helper-text">يظهر هذا الاسم كعنوان رئيسي في بطاقة العرض وصفحة التفاصيل.</span>
                      </div>

                      <div className="luxury-two-inputs-row">
                        <div className="luxury-input-group">
                          <label className="luxury-field-label"><Layers size={16} className="text-primary" /> القسم الرئيسي *</label>
                          <select
                            className="luxury-select-input"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          >
                            {categories && categories.length > 0 ? (
                              categories.filter((c) => c.title !== 'بكجات متكاملة').map((cat) => (
                                <option key={cat.id} value={cat.title}>
                                  {cat.title}
                                </option>
                              ))
                            ) : (
                              <>
                                <option value="قاعات الأفراح">قاعات الأفراح</option>
                                <option value="الفنادق والمؤتمرات">الفنادق والمؤتمرات</option>
                                <option value="معدات صوت ودي جي">معدات صوت ودي جي</option>
                                <option value="سيارات زفاف">سيارات زفاف</option>
                                <option value="أواني ومعدات ضيافة">أواني ومعدات ضيافة</option>
                                <option value="الهدايا والسلال">الهدايا والسلال</option>
                                <option value="تصوير وتوثيق">تصوير وتوثيق</option>
                              </>
                            )}
                          </select>
                        </div>

                        <div className="luxury-input-group">
                          <label className="luxury-field-label"><Tag size={16} className="text-primary" /> الشارة الترويجية (Badge) *</label>
                          <select
                            className="luxury-select-input"
                            value={formData.badge}
                            onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                          >
                            <option value="قاعة فاخرة">قاعة فاخرة</option>
                            <option value="الأكثر طلباً">الأكثر طلباً ⭐</option>
                            <option value="سيارة زفاف">سيارة زفاف 🚗</option>
                            <option value="معدات">معدات دي جي وضيافة 🎵</option>
                            <option value="هدايا وسلال">هدايا وسلال 🎁</option>
                            <option value="عرض خاص">عرض خاص 🔥</option>
                            <option value="جديد">جديد ومميز ✨</option>
                          </select>
                        </div>
                      </div>

                      <div className="luxury-input-group">
                        <label className="luxury-field-label"><Users size={16} className="text-primary" /> السعة التقريبية للحضور</label>
                        <input
                          type="text"
                          className="luxury-text-input"
                          placeholder="مثال: تتسع لـ 500 شخص أو مناسبة عائلية"
                          value={formData.capacity}
                          onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        />
                      </div>

                      <div className="step-actions-footer">
                        <button type="button" className="btn btn-primary" onClick={() => setActiveStep(2)}>
                          التالي: التسعير والموقع <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Pricing & Location */}
                  {activeStep === 2 && (
                    <div className="step-container-box">
                      <div className="section-divider-title">
                        <DollarSign size={16} className="text-primary" /> تحديد الأسعار والمدينة
                      </div>

                      <div className="luxury-two-inputs-row">
                        <div className="luxury-input-group" style={{ flex: 1.5 }}>
                          <label className="luxury-field-label"><DollarSign size={16} className="text-primary" /> السعر (بالأوقية الموريتانية) *</label>
                          <input
                            type="number"
                            required
                            className="luxury-text-input price-highlight"
                            placeholder="مثال: 1500000"
                            value={formData.priceNumber}
                            onChange={(e) => setFormData({ ...formData, priceNumber: e.target.value })}
                          />
                          <span className="input-helper-text">
                            المبلغ المعروض: <strong className="text-primary">{Number(formData.priceNumber || 0).toLocaleString()} أوقية</strong>
                          </span>
                        </div>

                        <div className="luxury-input-group" style={{ flex: 1 }}>
                          <label className="luxury-field-label">وحدة وفترة التسعير</label>
                          <select
                            className="luxury-select-input"
                            value={formData.priceUnit}
                            onChange={(e) => setFormData({ ...formData, priceUnit: e.target.value })}
                          >
                            <option value="للحفل الكامل">للحفل الكامل</option>
                            <option value="يوم">لكل يوم</option>
                            <option value="ليلة">لكل ليلة</option>
                            <option value="ساعة">لكل ساعة</option>
                            <option value="قطعة">لكل قطعة / سلة</option>
                          </select>
                        </div>
                      </div>

                      <div className="luxury-two-inputs-row">
                        <div className="luxury-input-group" style={{ flex: 1 }}>
                          <label className="luxury-field-label"><MapPin size={16} className="text-primary" /> المدينة (موريتانيا) *</label>
                          <select
                            className="luxury-select-input"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          >
                            <option value="نواكشوط">نواكشوط</option>
                            <option value="نواذيبو">نواذيبو</option>
                            <option value="روصو">روصو</option>
                            <option value="كيفه">كيفه</option>
                            <option value="أطار">أطار</option>
                          </select>
                        </div>

                        <div className="luxury-input-group" style={{ flex: 1.5 }}>
                          <label className="luxury-field-label">الحي / الشارع والموقع التفصيلي *</label>
                          <input
                            type="text"
                            required
                            className="luxury-text-input"
                            placeholder="مثال: تفرغ زينة، قرب السفارة الفرنسية"
                            value={formData.detailedLocation}
                            onChange={(e) => setFormData({ ...formData, detailedLocation: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="step-actions-footer">
                        <button type="button" className="btn btn-outline" onClick={() => setActiveStep(1)}>
                          السابق
                        </button>
                        <button type="button" className="btn btn-primary" onClick={() => setActiveStep(3)}>
                          التالي: الصور والمزايا <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Images & Amenities & Description */}
                  {activeStep === 3 && (
                    <div className="step-container-box">
                      <div className="section-divider-title">
                        <Camera size={16} className="text-primary" /> اختيار أو رفع صورة الخدمة
                      </div>

                      {/* Image Source Mode Selector Tabs */}
                      <div className="image-mode-tabs-nav">
                        <button
                          type="button"
                          className={`img-mode-tab-btn ${imageSourceMode === 'upload' ? 'active' : ''}`}
                          onClick={() => setImageSourceMode('upload')}
                        >
                          <UploadCloud size={16} /> رفع من الحاسوب (مباشر)
                        </button>
                        <button
                          type="button"
                          className={`img-mode-tab-btn ${imageSourceMode === 'preset' ? 'active' : ''}`}
                          onClick={() => setImageSourceMode('preset')}
                        >
                          <Sparkles size={16} /> مكتبة الصور الجاهزة
                        </button>
                        <button
                          type="button"
                          className={`img-mode-tab-btn ${imageSourceMode === 'url' ? 'active' : ''}`}
                          onClick={() => setImageSourceMode('url')}
                        >
                          <LinkIcon size={16} /> رابط خارجي (URL)
                        </button>
                      </div>

                      {/* OPTION A: Upload from Local Computer */}
                      {imageSourceMode === 'upload' && (
                        <div className="luxury-upload-box-wrapper">
                          <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleFileInputChange}
                          />

                          <div 
                            className={`luxury-dropzone ${isDragging ? 'dragging' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => {
                              if (fileInputRef.current) fileInputRef.current.click();
                            }}
                          >
                            <div className="dropzone-icon-circle">
                              <UploadCloud size={32} className="text-primary" />
                            </div>
                            <div className="dropzone-text-block">
                              <h4>اضغط هنا لاختيار صورة من حاسوبك</h4>
                              <p className="text-muted">أو قم بسحب وإفلات ملف الصورة هنا مباشرة</p>
                              <span className="dropzone-badge-info">يدعم JPG, PNG, WebP, GIF (بجودة عالية)</span>
                            </div>
                            <button 
                              type="button" 
                              className="btn btn-primary btn-sm"
                              style={{ marginTop: '10px' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (fileInputRef.current) fileInputRef.current.click();
                              }}
                            >
                              <ImageIcon size={14} /> تصفح ملفات الحاسوب
                            </button>
                          </div>

                          {uploadedFileName && (
                            <div className="uploaded-file-banner">
                              <div className="uploaded-file-info">
                                <CheckCircle2 size={16} className="text-primary" />
                                <div>
                                  <strong>الملف النشط: {uploadedFileName}</strong>
                                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>
                                    تم تحميل الصورة بنجاح وجاهزة للنشر
                                  </span>
                                </div>
                              </div>
                              <button 
                                type="button" 
                                className="action-btn"
                                onClick={() => {
                              if (fileInputRef.current) fileInputRef.current.click();
                            }}
                                title="تغيير الصورة"
                              >
                                <RefreshCw size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* OPTION B: Curated Preset Library */}
                      {imageSourceMode === 'preset' && (
                        <div className="luxury-preset-gallery-wrapper">
                          <label className="gallery-section-label">
                            <Sparkles size={15} className="text-primary" /> اختر صورة احترافية تناسب الخدمة بنقرة واحدة:
                          </label>
                          <div className="preset-gallery-cards-grid">
                            {PRESET_IMAGES.map((preset, idx) => {
                              const isSelected = formData.image === preset.url;
                              return (
                                <div
                                  key={idx}
                                  className={`preset-gallery-card-item ${isSelected ? 'selected' : ''}`}
                                  onClick={() => {
                                    setFormData({ ...formData, image: preset.url });
                                    setUploadedFileName('');
                                  }}
                                >
                                  <img src={preset.url} alt={preset.label} />
                                  <div className="preset-card-overlay">
                                    <span>{preset.label}</span>
                                  </div>
                                  {isSelected && (
                                    <div className="preset-selected-badge">
                                      <Check size={14} />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* OPTION C: Direct Image URL */}
                      {imageSourceMode === 'url' && (
                        <div className="luxury-input-group" style={{ marginTop: '10px' }}>
                          <label className="luxury-field-label"><ImageIcon size={16} className="text-primary" /> رابط الصورة الرئيسية (URL)</label>
                          <input
                            type="url"
                            className="luxury-text-input"
                            placeholder="https://images.unsplash.com/photo-..."
                            value={formData.image && formData.image.startsWith('data:') ? '' : formData.image}
                            onChange={(e) => {
                              setFormData({ ...formData, image: e.target.value });
                              setUploadedFileName('');
                            }}
                          />
                          <span className="input-helper-text">يمكنك نسخ ولصق رابط أي صورة من الإنترنت مباشرة.</span>
                        </div>
                      )}

                      <div className="section-divider-title" style={{ marginTop: '25px' }}>
                        <CheckCircle2 size={16} className="text-primary" /> المزايا والخدمات المتضمنة
                      </div>

                      <div className="luxury-amenities-selector-grid">
                        {AVAILABLE_AMENITIES.map((amenity, idx) => {
                          const isChecked = formData.amenities.includes(amenity);
                          return (
                            <div
                              key={idx}
                              className={`luxury-amenity-card-chip ${isChecked ? 'active-checked' : ''}`}
                              onClick={() => toggleAmenity(amenity)}
                            >
                              <div className="amenity-checkbox-circle">
                                {isChecked ? <Check size={13} className="text-primary" /> : null}
                              </div>
                              <span className="amenity-chip-title">{amenity}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="luxury-input-group" style={{ marginTop: '20px' }}>
                        <label className="luxury-field-label"><FileText size={16} className="text-primary" /> نبذة ووصف تفصيلي للخدمة</label>
                        <textarea
                          rows="3"
                          className="luxury-textarea-input"
                          placeholder="اكتب تفاصيل إضافية عن المكان، ساعات العمل، الإشراف، وشروط الدفع والحجز..."
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                      </div>

                      <div className="step-actions-footer">
                        <button type="button" className="btn btn-outline" onClick={() => setActiveStep(2)}>
                          السابق
                        </button>
                        <button type="submit" className="btn btn-primary btn-lg" style={{ padding: '12px 36px' }}>
                          <Check size={18} /> {editingListing ? 'حفظ ونشر التعديلات فوراً' : 'إضافة ونشر الخدمة الآن'}
                        </button>
                      </div>
                    </div>
                  )}

                </form>
              </div>

              {/* Right Column: Live Interactive Card Preview */}
              <div className="luxury-preview-column">
                <div className="preview-column-card">
                  <div className="preview-top-header">
                    <div className="live-pulse-dot"></div>
                    <strong>معاينة حية لشكل البطاقة للزوار</strong>
                  </div>

                  {/* Card Simulation */}
                  <div className="listing-card luxury-simulated-card">
                    <div className="listing-img-container">
                      <img 
                        src={formData.image || PRESET_IMAGES[0].url} 
                        alt="معاينة" 
                        className="listing-img" 
                        onError={(e) => {
                          e.target.src = PRESET_IMAGES[0].url;
                        }}
                      />
                      <span className="listing-badge">{formData.badge || 'قاعة فاخرة'}</span>
                    </div>
                    <div className="listing-content">
                      <h3 className="listing-title">{formData.title || 'اسم القاعة أو الخدمة'}</h3>
                      <div className="listing-location">
                        <MapPin size={14} /> {formData.city}، {formData.detailedLocation || 'الموقع'}
                      </div>
                      <div className="listing-footer">
                        <span className="listing-price">{displayPreviewPrice}</span>
                        <div className="listing-rating text-primary">
                          <Star size={16} fill="currentColor" /> 5.0
                        </div>
                      </div>
                      
                      <div className="simulated-meta-row">
                        <span>السعة: <strong>{formData.capacity || 'غير محدد'}</strong></span>
                        <span>•</span>
                        <span>{formData.amenities.length} مزايا</span>
                      </div>

                      <div style={{ marginTop: '12px' }}>
                        <button className="btn btn-primary" style={{ width: '100%', padding: '8px', fontSize: '13px', pointerEvents: 'none' }}>
                          احجز الآن (معاينة)
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="preview-guidance-box">
                    <p>💡 <strong>تحديث فوري للصورة:</strong> سواء قمت برفع الصورة من حاسوبك أو اختيارها من المعرض، يتم تحديث هذه المعاينة فوراً قبل النشر.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Bottom General Bar */}
            <div className="luxury-modal-bottom-general-bar">
              <div className="modal-bottom-info">
                <span>تعديل مباشر في قاعدة البيانات المحلية (Local Storage) لمنصة حفلتي</span>
              </div>
              <div className="modal-bottom-action-buttons">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
                  إغلاق
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                  <Check size={16} /> {editingListing ? 'حفظ ونشر التعديلات' : 'نشر الخدمة'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminListings;
