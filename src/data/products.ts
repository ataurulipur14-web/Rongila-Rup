import { Product, Review } from '../types';

import heroBannerImg from '../assets/images/rongila_hero_banner_1785695137887.jpg';
import jamdaniImg from '../assets/images/jamdani_saree_collection_1785695153522.jpg';
import panjabiImg from '../assets/images/panjabi_collection_1785695168399.jpg';
import jewelleryImg from '../assets/images/jewellery_collection_1785695196550.jpg';

export const HERO_IMAGES = {
  banner: heroBannerImg,
  jamdani: jamdaniImg,
  panjabi: panjabiImg,
  jewellery: jewelleryImg,
};

export const PRODUCTS: Product[] = [
  {
    id: 'rr-saree-001',
    nameBn: 'রাজকীয় লাল-সোনালী ঢাকাই জামদানি শাড়ি',
    nameEn: 'Royal Red & Gold Dhakai Jamdani Saree',
    category: 'saree',
    price: 8500,
    originalPrice: 10500,
    rating: 4.9,
    reviewsCount: 128,
    image: jamdaniImg,
    images: [
      jamdaniImg,
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800'
    ],
    fabricBn: 'খাটি সুতি ও গোল্ডেন জরি',
    fabricEn: 'Pure Cotton & Golden Zari',
    colorBn: 'লাল ও সোনালী',
    colorEn: 'Red & Gold',
    descriptionBn: 'নারায়ণগঞ্জের ঐতিহ্যবাহী কারিগরদের হাতে বোনা খাঁটি ঢাকাই জামদানি। এর সূক্ষ্ম ময়ূর ও বুটি নকশা আপনাকে যেকোনো উৎসবে এনে দেবে অনন্য রাজকীয় রূপ।',
    descriptionEn: 'Authentic Dhakai Jamdani hand-woven by artisan weavers of Narayanganj. Features intricate peacock and floral motif work perfect for festive celebrations.',
    inStock: true,
    isBestSeller: true,
    isFestiveSpecial: true,
    sizes: ['১২ হাত (Standard Saree)'],
    detailsBn: [
      '১০০% হাতে বোনা সুতি ও জরি সুতা',
      'ম্যাচিং ব্লাউজ পিস সহ (৮০ সেমি)',
      'ড্রাই ক্লিন রেকমেন্ডেড',
      'ঐতিহ্যবাহী বয়ন শৈলী'
    ],
    detailsEn: [
      '100% Handloom Cotton & Zari Thread',
      'Unstitched Blouse Piece Included (80cm)',
      'Dry Clean Recommended',
      'Traditional Heritage Weaving'
    ]
  },
  {
    id: 'rr-panjabi-001',
    nameBn: 'রয়্যাল ব্লু সিল্ক এমব্রয়ডারি ডিজাইনার পাঞ্জাবি',
    nameEn: 'Royal Blue Silk Embroidered Designer Panjabi',
    category: 'panjabi',
    price: 4200,
    originalPrice: 5200,
    rating: 4.8,
    reviewsCount: 94,
    image: panjabiImg,
    images: [
      panjabiImg,
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&q=80&w=800'
    ],
    fabricBn: 'প্রিমিয়াম রেশম সিল্ক',
    fabricEn: 'Premium Resham Silk',
    colorBn: 'রয়্যাল ব্লু',
    colorEn: 'Royal Blue',
    descriptionBn: 'কলার ও প্লেকেটে জারদৌসি ও কারচুপির নকশা করা রয়্যাল ব্লু প্রিমিয়াম সিল্ক পাঞ্জাবি। ঈদের দিন, গায়ে হলুদ ও বিবাহ অনুষ্ঠানের জন্য একদম পারফেক্ট।',
    descriptionEn: 'Royal Blue premium silk Panjabi decorated with exquisite Zardosi and Karchopi embroidery on collar and placket. Ideal for Eid, weddings, and celebrations.',
    inStock: true,
    isNewArrival: true,
    isFestiveSpecial: true,
    sizes: ['S (38)', 'M (40)', 'L (42)', 'XL (44)', 'XXL (46)'],
    detailsBn: [
      'আরামদায়ক সফট রেশমি সিল্ক ফেব্রিক',
      'কলার ও হাতায় হাতের কারচুপি কাজ',
      'পায়জামা সহ ফুল সেট (Optional)',
      'ড্রাই ওয়াশ প্রযোজ্য'
    ],
    detailsEn: [
      'Soft and breathable Silk blend',
      'Intricate handcrafted collar detailing',
      'Comes with matching white pajama',
      'Dry Clean Only'
    ]
  },
  {
    id: 'rr-jewelry-001',
    nameBn: 'অ্যান্টিক গোল্ড প্লেটেড ঐতিহ্যবাহী ঝুমকা ও চোকার সেট',
    nameEn: 'Antique Gold Plated Bridal Choker & Jhumka Set',
    category: 'jewelry',
    price: 3500,
    originalPrice: 4500,
    rating: 4.9,
    reviewsCount: 76,
    image: jewelleryImg,
    images: [
      jewelleryImg,
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800'
    ],
    fabricBn: 'ব্রাস ও ২২K গোল্ড প্লেটেড',
    fabricEn: 'Brass with 22K Gold Plating',
    colorBn: 'অ্যান্টিক গোল্ড',
    colorEn: 'Antique Gold',
    descriptionBn: 'রঙিলা রূপের বিশেষ কারিগরদের বানানো ব্রাইডাল চোকার ও ঝুমকা সেট। ঐতিহ্যবাহী নকশা ও পোলকি পাথরের ছোঁয়ায় আপনার সাজকে দেবে অতুলনীয় সৌন্দর্য।',
    descriptionEn: 'Handcrafted antique gold choker set featuring traditional Bengali motif jhumkas with Polki stone accents. A showstopper accessory for festive outfits.',
    inStock: true,
    isBestSeller: true,
    sizes: ['Standard Free Size (Adjustable)'],
    detailsBn: [
      '২২ ক্যারেট হাই-কোয়ালিটি গোল্ড প্লেটিং',
      'অ্যালার্জি-ফ্রি পরিবেশবান্ধব মেটেরিয়াল',
      'অ্যাডজাস্টেবল থ্রেড লকিং',
      'প্রিমিয়াম গিফট বক্স প্যাকেজিং'
    ],
    detailsEn: [
      '22K High Polish Durable Gold Plating',
      'Hypoallergenic Nickel-Free Alloy',
      'Adjustable Dori cord for custom fit',
      'Delivered in velvet jewelry gift box'
    ]
  },
  {
    id: 'rr-saree-002',
    nameBn: 'বসন্ত উৎসব বাসন্তী সুতি তাঁত শাড়ি',
    nameEn: 'Basanti Yellow Cotton Tant Saree for Spring',
    category: 'saree',
    price: 2800,
    originalPrice: 3500,
    rating: 4.7,
    reviewsCount: 62,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
      jamdaniImg
    ],
    fabricBn: '১০০% সফট কটন তাঁত',
    fabricEn: '100% Soft Cotton Tant',
    colorBn: 'বাসন্তী হলুদ ও লাল পাড়',
    colorEn: 'Basanti Yellow with Red Border',
    descriptionBn: 'পহেলা ফাল্গুন ও বৈশাখী উৎসবের সেরা পছন্দ! টাঙ্গাইলের তাঁতিদের হাতের বুননে দারুণ আরামদায়ক ও উজ্জ্বল বাসন্তী হলুদ তাঁত শাড়ি।',
    descriptionEn: 'Perfect choice for Pohela Falgun and Boishakh celebrations. Handwoven Tangail Tant saree offering lightweight comfort and vibrant cheerful colors.',
    inStock: true,
    isFestiveSpecial: true,
    sizes: ['১২ হাত'],
    detailsBn: [
      'টাঙ্গাইল অরিজিনাল সুতি বয়ন',
      'লাল চওড়া পাড় ও চমৎকার আঁচল',
      'হাতে সাধারণ ধোয়া সম্ভব'
    ],
    detailsEn: [
      'Original Tangail Pure Cotton',
      'Broad Red Temple Border',
      'Hand Washable with Soft Detergent'
    ]
  },
  {
    id: 'rr-panjabi-002',
    nameBn: 'সাদা কাবলি স্যুট পাঞ্জাবি ও পাজামা সেট',
    nameEn: 'Pure White Cotton Kabli Panjabi Set',
    category: 'panjabi',
    price: 3200,
    originalPrice: 3800,
    rating: 4.8,
    reviewsCount: 45,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
      panjabiImg
    ],
    fabricBn: '১০০% মিশরীয় কটন',
    fabricEn: '100% Egyptian Cotton',
    colorBn: 'শুভ্র সাদা',
    colorEn: 'Pure White',
    descriptionBn: 'অভিজাত শুভ্র সাদা সুতি কাবলি পাঞ্জাবি সেট। সুতি কাপড়ের চমৎকার ফিটিং ও পরিপাটি লুকে জুমার নামাজ এবং উৎসব অনুষ্ঠানে পরার জন্য অতুলনীয়।',
    descriptionEn: 'Elegant pure white Egyptian cotton Kabli suit set. Classy tailored fit for religious occasions, Jummah, and casual ethnic gatherings.',
    inStock: true,
    sizes: ['M (40)', 'L (42)', 'XL (44)'],
    detailsBn: [
      'প্রিমিয়াম প্রিক্যাম্ব্রেসড কটন',
      'ম্যাচিং কাবলি পাজামা ইনক্লুডেড',
      'পকেট ডিজাইন ও ফ্ল্যাপ বাটন'
    ],
    detailsEn: [
      'Pre-shrunk Egyptian Cotton',
      'Includes matching pleated Kabli pants',
      'Chest pockets with custom brand buttons'
    ]
  },
  {
    id: 'rr-saree-003',
    nameBn: 'মেরুন কাঞ্জিভরম সিল্ক শাড়ি (জরি পাড়)',
    nameEn: 'Deep Maroon Kanjivaram Silk Saree',
    category: 'saree',
    price: 12500,
    originalPrice: 15000,
    rating: 5.0,
    reviewsCount: 89,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800',
      jamdaniImg
    ],
    fabricBn: 'কাঞ্জিভরম আর্ট সিল্ক',
    fabricEn: 'Kanjivaram Art Silk',
    colorBn: 'গাড় মেরুন ও গোল্ড',
    colorEn: 'Deep Maroon & Gold',
    descriptionBn: 'বিয়ের অনুষ্ঠান ও বউভাতের জন্য ক্লাসিক মেরুন কাঞ্জিভরম সিল্ক শাড়ি। ভারি কাজ করা বর্ডার ও আঁচলে অলওভার বুটি ওয়ার্ক।',
    descriptionEn: 'Classic deep maroon Kanjivaram silk saree for weddings and receptions. Features heavy gold brocade pallu and temple border motifs.',
    inStock: true,
    isFestiveSpecial: true,
    isBestSeller: true,
    sizes: ['১২ হাত (Standard)'],
    detailsBn: [
      'ভারী জাকার্ড বয়ন',
      'ব্রাইডাল স্পেশাল কালেকশন',
      'হাতে তৈরি সূক্ষ্ম ফিনিশিং'
    ],
    detailsEn: [
      'Heavy Jacquard Weave Pattern',
      'Bridal Special Collection',
      'Silky Smooth Drape'
    ]
  },
  {
    id: 'rr-jewelry-002',
    nameBn: 'কুন্দন বালা ও চুড়ি সেট (৪ পিস)',
    nameEn: 'Kundan Pearl Bangles Set (4 Pcs)',
    category: 'jewelry',
    price: 1800,
    originalPrice: 2200,
    rating: 4.6,
    reviewsCount: 38,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800'
    ],
    fabricBn: 'কুন্দন পাথর ও মেটাল',
    fabricEn: 'Kundan Stones & Metal Alloy',
    colorBn: 'সোনালী ও মুক্তা',
    colorEn: 'Gold & Pearl White',
    descriptionBn: '৪ পিস হাতের কুন্দন ও মুক্তার ঐতিহ্যবাহী চুড়ি। যেকোনো শাড়ি বা থ্রি পিসের সাথে হাতে পরলে রূপ ফুটে উঠবে বহুগুণ।',
    descriptionEn: 'Set of 4 traditional Kundan bangles studded with pearls and shiny stones. Complements both sarees and ethnic gowns.',
    inStock: true,
    sizes: ['2.4 (Small)', '2.6 (Medium)', '2.8 (Large)'],
    detailsBn: [
      'প্রাকৃতিক মুক্তার পুতি কাজ',
      'দীর্ঘস্থায়ী শাইনিং পোলিশ',
      'আরামদায়ক অভ্যন্তরীণ মসৃণতা'
    ],
    detailsEn: [
      'Hand-set Kundan stones and faux pearls',
      'Long-lasting anti-tarnish coat',
      'Smooth inner edges for comfortable wear'
    ]
  },
  {
    id: 'rr-salwar-001',
    nameBn: 'ডিজাইনার আনোরকলি থ্রি-পিস অর্গাঞ্জা সেট',
    nameEn: 'Designer Organza Anarkali Three-Piece Set',
    category: 'salwar',
    price: 5800,
    originalPrice: 6900,
    rating: 4.9,
    reviewsCount: 51,
    image: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&q=80&w=800'
    ],
    fabricBn: 'পিওর অর্গাঞ্জা ও কটন সিল্ক',
    fabricEn: 'Pure Organza & Cotton Silk',
    colorBn: 'পেস্টাল পিঙ্ক',
    colorEn: 'Pastel Pink',
    descriptionBn: 'হালকা গোলাপী রঙের ফ্লোরালপ্রিন্ট আনোরকলি গাউন, সাথে ম্যাচিং ট্রাউজার ও গর্জিয়াস অর্গাঞ্জা দোপাট্টা। পার্টি ও এনগেজমেন্টের জন্য পারফেক্ট।',
    descriptionEn: 'Pastel pink floral printed Anarkali gown paired with cigarette trousers and a rich organza dupatta. Ideal for evening parties.',
    inStock: true,
    isNewArrival: true,
    sizes: ['S', 'M', 'L', 'XL'],
    detailsBn: [
      'জর্জেট ও অর্গাঞ্জা থ্রি পিস',
      'ডিজিটাল ফ্লোরাল প্রিন্ট ও সিক্যুয়েন কাজ',
      'ইনার সফট কটন লাইনিং দেওয়া'
    ],
    detailsEn: [
      '3-Piece Set: Kameez, Salwar & Dupatta',
      'Digital Floral Print with Sequins',
      'Breathable Cotton Inner Lining'
    ]
  },
  {
    id: 'rr-kids-001',
    nameBn: 'কিডস কিউট জামদানি প্রিন্ট ফ্রক ও লেহেঙ্গা সেট',
    nameEn: 'Kids Cute Jamdani Print Frock & Lehenga Set',
    category: 'kids',
    price: 1850,
    originalPrice: 2400,
    rating: 4.9,
    reviewsCount: 32,
    image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=800'
    ],
    fabricBn: '১০০% সফট কম্বড কটন',
    fabricEn: '100% Soft Combed Cotton',
    colorBn: 'গোলাপী ও গোল্ডেন',
    colorEn: 'Pink & Golden',
    descriptionBn: 'ছোট সোনামণিদের জন্য আরামদায়ক সফট কটন জামদানি প্রিন্ট ফ্রক। কোমল ত্বকের জন্য সম্পূর্ণ এলার্জি-ফ্রি ও আরামদায়ক।',
    descriptionEn: 'Soft and comfortable 100% combed cotton Jamdani pattern ethnic dress for kids. Gentle on skin and perfect for festive events.',
    inStock: true,
    isBestSeller: true,
    isFlashSale: true,
    sizes: ['২-৩ বছর', '৪-৫ বছর', '৬-৭ বছর', '৮-৯ বছর', '১০-১২ বছর'],
    detailsBn: [
      'সফট কটন ব্রিদেবল ফেব্রিক',
      'শিশুর ত্বকের সুরক্ষায় সুতি ইনার',
      'ঈদের দিন ও পার্টিতে পরার উপযোগী'
    ],
    detailsEn: [
      'Soft breathable pure cotton',
      'Skin-safe inner cotton lining',
      'Ideal for festive occasions'
    ]
  },
  {
    id: 'rr-kids-002',
    nameBn: 'কিডস প্রিমিয়াম সিল্ক কটি পাঞ্জাবি ও পাজামা সেট',
    nameEn: 'Kids Premium Silk Koti Panjabi Set',
    category: 'kids',
    price: 1750,
    originalPrice: 2200,
    rating: 4.8,
    reviewsCount: 29,
    image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&q=80&w=800'
    ],
    fabricBn: 'সফট সিল্ক ও এথনিক কটি',
    fabricEn: 'Soft Silk & Ethnic Koti',
    colorBn: 'মেরুন ও গোল্ড',
    colorEn: 'Maroon & Gold',
    descriptionBn: 'ছোটদের রাজকীয় লুক দিতে গর্জিয়াস কটি পাঞ্জাবি সেট। সুতি কাপড়ের চমৎকার ফিটিং এবং আরামদায়ক পরিধান।',
    descriptionEn: 'Royal festive Koti Panjabi 3-piece set for young boys. Offers a traditional dapper look with maximum comfort.',
    inStock: true,
    isNewArrival: true,
    isFlashSale: true,
    sizes: ['২-৩ বছর', '৪-৫ বছর', '৬-৭ বছর', '৮-১০ বছর'],
    detailsBn: [
      'পাঞ্জাবি, কটি ও পায়জামা ফুল সেট',
      'উজ্জ্বল রঙ ও আরামদায়ক ফিটিং',
      'উৎসব ও আকিকা অনুষ্ঠানের জন্য চমৎকার'
    ],
    detailsEn: [
      'Includes Panjabi, Koti vest & Pajama',
      'Vibrant color fastness',
      'Great for weddings and family functions'
    ]
  },
  {
    id: 'rr-kids-003',
    nameBn: 'ছোটদের বসন্ত ও বৈশাখী কটন পাঞ্জাবি',
    nameEn: 'Kids Festive Yellow Cotton Panjabi',
    category: 'kids',
    price: 1350,
    originalPrice: 1700,
    rating: 4.7,
    reviewsCount: 18,
    image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&q=80&w=800'
    ],
    fabricBn: '১০০% টাঙ্গাইল সুতি',
    fabricEn: '100% Tangail Cotton',
    colorBn: 'হলুদ ও লাল পাড়',
    colorEn: 'Yellow & Red',
    descriptionBn: 'পহেলা বৈশাখ ও বিভিন্ন উৎসবে ছোটদের পরানোর জন্য বাসন্তী হলুদ প্রিমিয়াম সুতি পাঞ্জাবি।',
    descriptionEn: 'Vibrant yellow pure cotton ethnic shirt for children celebrating Pohela Boishakh and Cultural events.',
    inStock: true,
    sizes: ['২ বছর', '৪ বছর', '৬ বছর', '৮ বছর', '১০ বছর'],
    detailsBn: [
      '১০০% খাঁটি সুতি সুতা',
      'হাতে সাধারণ ওয়াশ করা যায়',
      'খুবই টেকসই ও আরামদায়ক'
    ],
    detailsEn: [
      '100% Pure breathable cotton',
      'Easy hand wash',
      'Durable and colorfast'
    ]
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'rr-saree-001',
    userName: 'নাসরিন সুলতানা (Nasrin Sultana)',
    rating: 5,
    date: '15 July 2026',
    commentBn: 'অসাধারণ ঢাকাই জামদানি! শাড়ির সুতার কাজ এবং রঙ ঠিক ছবির মতোই দারুণ। প্যাকেজিংও অনেক সুন্দর ছিল।',
    commentEn: 'Amazing Dhakai Jamdani! The weave and colors match the pictures perfectly. Beautiful packaging too!',
    verifiedPurchase: true
  },
  {
    id: 'rev-2',
    productId: 'rr-panjabi-001',
    userName: 'তানভীর আহমেদ (Tanvir Ahmed)',
    rating: 5,
    date: '28 June 2026',
    commentBn: 'রয়্যাল ব্লু পাঞ্জাবির ফেব্রিক অত্যন্ত আরামদায়ক আর কলারের কাজ খুব গর্জিয়াস। ধন্যবাদ রঙিলা রূপ!',
    commentEn: 'The royal blue panjabi fabric is super comfortable and the collar detailing is gorgeous. Thanks Rongila Rup!',
    verifiedPurchase: true
  },
  {
    id: 'rev-3',
    productId: 'rr-jewelry-001',
    userName: 'ফারজানা আক্তার (Farzana Akter)',
    rating: 5,
    date: '02 May 2026',
    commentBn: 'বিয়ের অনুষ্ঠানে এই গহনা সেট পরে প্রচুর প্রশংসা পেয়েছি। একদম অরিজিনাল সোনার গহনার মতো দেখায়!',
    commentEn: 'Received so many compliments wearing this jewelry set at a wedding! Looks just like real gold jewelry!',
    verifiedPurchase: true
  }
];

export const COUPON_CODES: Record<string, number> = {
  'BOISHAKH10': 0.10, // 10% off
  'RONGILA20': 0.20,  // 20% off
  'EIDSPECIAL': 0.15, // 15% off
};
