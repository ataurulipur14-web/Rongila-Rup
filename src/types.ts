export type Language = 'bn' | 'en';

export type CategoryId = 'all' | 'saree' | 'salwar' | 'panjabi' | 'jewelry' | 'festive' | 'threepiece' | 'lehenga' | 'kids';

export interface Product {
  id: string;
  nameBn: string;
  nameEn: string;
  category: CategoryId;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  fabricBn: string;
  fabricEn: string;
  colorBn: string;
  colorEn: string;
  descriptionBn: string;
  descriptionEn: string;
  inStock: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFestiveSpecial?: boolean;
  isFlashSale?: boolean;
  isBoosted?: boolean;
  boostStatus?: 'Active' | 'Paused' | 'None';
  boostBudget?: number;
  boostReach?: number;
  sizes?: string[];
  detailsBn: string[];
  detailsEn: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface FilterState {
  category: CategoryId;
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  color: string;
  fabric: string;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
  inStockOnly: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  date: string;
  commentBn: string;
  commentEn: string;
  verifiedPurchase: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  shippingFee: number;
  discount: number;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'rocket';
  paymentStatus: 'PAID' | 'UNPAID' | 'VERIFIED_PAID';
  amountDue: number;
  trxId?: string;
  paymentPhone?: string;
  status: 'processing' | 'confirmed' | 'on_hold' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  courierName?: 'Steadfast Courier' | 'Pathao Courier' | 'RedX Logistics' | 'Paperfly';
  courierTrackingId?: string;
  courierStatus?: 'Pending Entry' | 'Dispatched' | 'In Transit' | 'Delivered' | 'Returned';
  adminNotes?: string;
  createdAt: string;
}

export interface StoreSettings {
  topAnnouncementBn: string;
  topAnnouncementEn: string;
  couponCode: string;
  couponDiscountPercent: number;
  heroBadgeBn: string;
  heroBadgeEn: string;
  heroHeadlineBn: string;
  heroHeadlineEn: string;
  heroSubBn: string;
  heroSubEn: string;
}

export interface AIStylistMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  recommendedProductIds?: string[];
  timestamp: string;
}
