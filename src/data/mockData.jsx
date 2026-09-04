import React from 'react';
import { Building2, Hotel, Speaker, Car, Utensils, Gift, Camera, Sparkles, Music, Users, Heart } from 'lucide-react';

export const getCategoryIcon = (iconName, size = 28) => {
  switch (iconName) {
    case 'Building2': return <Building2 size={size} />;
    case 'Hotel': return <Hotel size={size} />;
    case 'Speaker': return <Speaker size={size} />;
    case 'Car': return <Car size={size} />;
    case 'Utensils': return <Utensils size={size} />;
    case 'Gift': return <Gift size={size} />;
    case 'Camera': return <Camera size={size} />;
    case 'Sparkles': return <Sparkles size={size} />;
    case 'Music': return <Music size={size} />;
    case 'Users': return <Users size={size} />;
    case 'Heart': return <Heart size={size} />;
    default: return <Sparkles size={size} />;
  }
};

export const categoriesData = [
  { id: 1, title: 'قاعات الأفراح', iconName: 'Building2' },
  { id: 2, title: 'الفنادق والمؤتمرات', iconName: 'Hotel' },
  { id: 3, title: 'معدات صوت ودي جي', iconName: 'Speaker' },
  { id: 4, title: 'سيارات زفاف', iconName: 'Car' },
  { id: 5, title: 'أواني ومعدات ضيافة', iconName: 'Utensils' },
  { id: 6, title: 'الهدايا والسلال', iconName: 'Gift' },
  { id: 7, title: 'تصوير وتوثيق', iconName: 'Camera' },
  { id: 8, title: 'بكجات متكاملة', iconName: 'Sparkles' },
];

export const listingsData = [
  {
    id: 1,
    title: 'قاعة الألماس الملكية',
    category: 'قاعات الأفراح',
    location: 'نواكشوط، تفرغ زينة',
    city: 'نواكشوط',
    price: '1,500,000 أوقية',
    numericPrice: 1500000,
    rating: 4.9,
    capacity: 600,
    amenities: ['تكييف مركزي', 'مواقف خاصة', 'جناح للعروس', 'إضاءة ليزر', 'شاشات عرض عملاقة'],
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800&auto=format&fit=crop'
    ],
    badge: 'قاعة فاخرة VIP',
    description: 'قاعة مجهزة بأحدث الديكورات الكلاسيكية والعصرية، تتسع لـ 600 شخص مع جناح خاص للعروس ومواقف سيارات محروسة.',
    reviews: [
      { id: 'rev-1', author: 'أحمد سالم ولد ببكر', rating: 5, comment: 'قاعة أسطورية بمعنى الكلمة، التكييف ممتاز والضيافة والتنظيم شرفونا أمام الضيوف.', date: '2026-08-10' },
      { id: 'rev-2', author: 'مريم بنت المصطفى', rating: 5, comment: 'جناح العروس مريح جداً والإضاءة كانت ساحرة في تصوير الفيديو.', date: '2026-08-01' }
    ]
  },
  {
    id: 2,
    title: 'فندق نواكشوط - القاعة الكبرى',
    category: 'الفنادق والمؤتمرات',
    location: 'نواكشوط، قلب المدينة',
    city: 'نواكشوط',
    price: '2,500,000 أوقية',
    numericPrice: 2500000,
    rating: 5.0,
    capacity: 800,
    amenities: ['بوفيه فاخر', 'إقامة مجانية للعروسين', 'خدمة صف السيارات', 'صوتيات رقمية متطورة'],
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop'
    ],
    badge: 'الأكثر طلباً',
    description: 'قاعة فاخرة داخل فندق 5 نجوم مع بوفيه عشاء موريتاني وعالمي، وجناح رئاسي مجاني ليلة الزفاف.'
  },
  {
    id: 3,
    title: 'رولز رويس فانتوم 2024 مع سائق',
    category: 'سيارات زفاف',
    location: 'نواذيبو',
    city: 'نواذيبو',
    price: '300,000 أوقية / يوم',
    numericPrice: 300000,
    rating: 4.8,
    capacity: 4,
    amenities: ['سائق بزي رسمي', 'زينة الورد الفاخرة', 'تكييف ومقاعد جلدية', 'مشروبات ترحيبية'],
    image: 'https://images.unsplash.com/photo-1631269389230-05e836b772c6?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1631269389230-05e836b772c6?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop'
    ],
    badge: 'سيارة زفاف ملكية',
    description: 'سيارة فاخرة مجهزة لنقل العروسين في موكب مهيب مع سائق محترف وتزيين كامل بأجود أنواع الزهور.'
  },
  {
    id: 4,
    title: 'طقم إضاءة وصوت دي جي احترافي',
    category: 'معدات صوت ودي جي',
    location: 'نواكشوط، خدمة التوصيل والتركيب',
    city: 'نواكشوط',
    price: '250,000 أوقية',
    numericPrice: 250000,
    rating: 4.7,
    capacity: 1000,
    amenities: ['مهندس صوت مرافق', 'إضاءة ليزر متحركة', 'ميكروفونات لاسلكية', 'دخان ومؤثرات بصرية'],
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop'
    ],
    badge: 'معدات احترافية',
    description: 'نظام صوتي رقمي متكامل يغطي القاعات الكبيرة مع هندسة صوتية متخصصة ومؤثرات ضوئية مبهجة.'
  },
  {
    id: 5,
    title: 'سلة هدايا العروس الفاخرة',
    category: 'الهدايا والسلال',
    location: 'نواكشوط، التوصيل متاح',
    city: 'نواكشوط',
    price: '50,000 أوقية',
    numericPrice: 50000,
    rating: 4.9,
    capacity: 1,
    amenities: ['عطور وبخور موريتاني أصيل', 'تغليف مخملي أنيق', 'بطاقة تهنئة مخصصة', 'توصيل فوري'],
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop'
    ],
    badge: 'هدايا وسلال مميزة',
    description: 'مجموعة فاخرة مختارة بعناية من العطور والمخلطات والبخور الموريتاني التقليدي بتغليف ملكي.'
  },
  {
    id: 6,
    title: 'قصر الأميرة للمناسبات',
    category: 'قاعات الأفراح',
    location: 'نواكشوط، عرفات',
    city: 'نواكشوط',
    price: '850,000 أوقية',
    numericPrice: 850000,
    rating: 4.8,
    capacity: 350,
    amenities: ['تكييف كامل', 'مطبخ تحضيري', 'طاولات دائرية فاخرة', 'منصة عروس ديكور مغربي'],
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop'
    ],
    badge: 'سعر اقتصادي ممتاز',
    description: 'قاعة راقية بأسعار مناسبة تتسع لـ 350 ضيف مع إضاءة دافئة وديكورات تقليدية وحديثة.'
  },
  {
    id: 7,
    title: 'موكب تويوتا لاندكروزر VXR (3 سيارات)',
    category: 'سيارات زفاف',
    location: 'نواكشوط',
    city: 'نواكشوط',
    price: '200,000 أوقية / يوم',
    numericPrice: 200000,
    rating: 4.9,
    capacity: 15,
    amenities: ['موكب متناسق أسود', 'سائقين محترفين', 'زينة شريط الحفل', 'تكييف قوي'],
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop'
    ],
    badge: 'موكب كبار الشخصيات',
    description: 'موكب سيارات دفع رباعي لاندكروزر حديثة لمرافقة العروسين وأهل الحفل في أجواء من الهيبة والفخامة.'
  },
  {
    id: 8,
    title: 'طاقم تصوير وتوثيق فيديو فوتوغرافي 4K',
    category: 'تصوير وتوثيق',
    location: 'نواكشوط ونواذيبو',
    city: 'نواكشوط',
    price: '350,000 أوقية',
    numericPrice: 350000,
    rating: 5.0,
    capacity: 1,
    amenities: ['كاميرا درون جوية', 'ألبوم حراري ملكي', 'فيديو سينمائي ترويجي', 'تسليم فلاش ميموري ذهبي'],
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop'
    ],
    badge: 'فريق محترف',
    description: 'توثيق سينمائي للحفل بجودة فائقة بأحدث كاميرات السينما والدرون الجوي مع ألبوم مطبوع فاخر.'
  }
];

// All-Inclusive Wedding Packages (حزم وبكجات الأعراس الشاملة)
export const packagesData = [
  {
    id: 'pkg-royal',
    title: 'البكج الماسي الملكي الشامل',
    subtitle: 'كل ما تحتاجه لليلة العمر بفخامة لا تُنسى في حزمة واحدة متكاملة',
    originalPrice: 4200000,
    packagePrice: 3450000,
    savings: 750000,
    discountBadge: 'وفر 750,000 أوقية',
    rating: 5.0,
    popular: true,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop',
    itemsIncluded: [
      'حجز قاعة فندقية 5 نجوم (تتسع لـ 600 ضيف)',
      'عشاء بوفيه مفتوح وضيافة شاي ومشروبات راقية',
      'سيارة رولز رويس فانتوم للعروسين مع سائق وزينة ورد',
      'طقم دي جي وصوتيات رقمية وهندسة صوت وإضاءة ليزر',
      'فريق تصوير فوتوغرافي وسينمائي مع كاميرا درون',
      'جناح فندقي خاص للعروسين ليلة الزفاف مجاناً'
    ]
  },
  {
    id: 'pkg-heritage',
    title: 'بكج الأصالة والضيافة الموريتانية',
    subtitle: 'مزيج فاخر يجمع بين التراث الموريتاني العريق والخدمة العصرية الراقية',
    originalPrice: 2300000,
    packagePrice: 1890000,
    savings: 410000,
    discountBadge: 'وفر 410,000 أوقية',
    rating: 4.9,
    popular: false,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop',
    itemsIncluded: [
      'قاعة أفراح تفرغ زينة مكيفة تتسع لـ 400 ضيف',
      'ضيافة الشاي الأخضر التقليدي وحلويات وتمر فاخر',
      'موكب سيارات لاند كروزر VXR حديثة',
      'معدات صوت وإضاءة احترافية',
      'سلتين من هدايا العروس وعطور وبخور موريتاني أصيل'
    ]
  },
  {
    id: 'pkg-economy',
    title: 'بكج الفرحة الاقتصادية الأنيقة',
    subtitle: 'تنظيم راقٍ وجميل بأقل التكاليف وبأعلى معايير الجودة والراحة',
    originalPrice: 1400000,
    packagePrice: 1100000,
    savings: 300000,
    discountBadge: 'وفر 300,000 أوقية',
    rating: 4.8,
    popular: false,
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop',
    itemsIncluded: [
      'قصر الأميرة للمناسبات (تتسع لـ 300 ضيف)',
      'تجهيزات أواني ومعدات الضيافة كاملة',
      'نظام صوت وإضاءة أساسي',
      'خدمة تصوير فوتوغرافي مع ألبوم تذكاري'
    ]
  }
];

// Promo Codes
export const initialPromoCodes = [
  {
    id: 'pc-1',
    code: 'AROSS2026',
    discountType: 'percentage', // percentage or fixed
    discountValue: 15,
    description: 'خصم خاص للعرسان الجدد 15%',
    active: true,
    minBookingAmount: 500000,
    usageCount: 14
  },
  {
    id: 'pc-2',
    code: '7AVELTY50',
    discountType: 'fixed',
    discountValue: 50000,
    description: 'خصم فوري 50,000 أوقية على أي حجز',
    active: true,
    minBookingAmount: 200000,
    usageCount: 38
  },
  {
    id: 'pc-3',
    code: 'RAMADAN',
    discountType: 'percentage',
    discountValue: 10,
    description: 'عرض المناسبات الرمضانية 10%',
    active: true,
    minBookingAmount: 100000,
    usageCount: 8
  }
];
