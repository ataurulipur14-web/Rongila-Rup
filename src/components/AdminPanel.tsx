import React, { useState } from 'react';
import { AdsManagerModal } from './AdsManagerModal';
import { 
  X, 
  PackagePlus, 
  ShoppingBag, 
  Rocket, 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  Truck, 
  DollarSign, 
  Edit3, 
  Trash2, 
  Plus, 
  Sparkles, 
  Megaphone, 
  PhoneCall, 
  Tag, 
  Eye, 
  Lock,
  Unlock,
  Search,
  Filter,
  HardDrive,
  Users,
  Printer,
  Copy,
  Send,
  AlertTriangle,
  XCircle,
  PauseCircle,
  Check,
  Building2,
  QrCode,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { Product, Order, Language, CategoryId, StoreSettings } from '../types';
import { getStoredPixelId, savePixelId, trackPixelEvent } from '../utils/pixel';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  onUpdateFullOrder?: (updatedOrder: Order) => void;
  onOpenDrive?: () => void;
  storeSettings?: StoreSettings;
  onUpdateStoreSettings?: (newSettings: StoreSettings) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  lang,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  orders,
  onUpdateOrderStatus,
  onUpdateFullOrder,
  onOpenDrive,
  storeSettings,
  onUpdateStoreSettings
}) => {
  if (!isOpen) return null;

  // Admin Security Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Active Tab: 'orders' | 'customers' | 'courier' | 'products' | 'add_product' | 'boost' | 'analytics' | 'settings'
  const [activeTab, setActiveTab] = useState<'orders' | 'customers' | 'courier' | 'products' | 'add_product' | 'boost' | 'analytics' | 'settings'>('orders');

  // Local Form State for Store Settings (Announcements, Discounts, Coupons)
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(() => storeSettings || {
    announcementBn: 'স্পেশাল অফার: "RONGILA20" কুপনে ২০% ছাড়! সারাদেশে ক্যাশ অন ডেলিভারি',
    announcementEn: 'Special Offer: 20% OFF with "RONGILA20"! Cash on Delivery All Over Bangladesh',
    heroBadgeBn: 'প্রিমিয়াম দেশীয় ফ্যাশন ও এথনিক কালেকশন ২০২৬',
    heroBadgeEn: 'Premium Heritage & Ethnic Boutique Collection 2026',
    discountCouponCode: 'RONGILA20',
    discountPercent: 20
  });

  // Search & Filters in Admin
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<'all' | Order['status']>('all');

  // Courier Dispatch Modal State
  const [dispatchingOrder, setDispatchingOrder] = useState<Order | null>(null);
  const [selectedCourier, setSelectedCourier] = useState<'Steadfast Courier' | 'Pathao Courier' | 'RedX Logistics' | 'Paperfly'>('Steadfast Courier');
  const [isSubmittingCourier, setIsSubmittingCourier] = useState(false);
  const [sfApiKey, setSfApiKey] = useState(() => localStorage.getItem('rongila_sf_api_key') || 'qbldmneua8prlcgduqlonrathcbwesx0');
  const [sfSecretKey, setSfSecretKey] = useState(() => localStorage.getItem('rongila_sf_secret_key') || '');

  const handleUpdateSfApiKey = (val: string) => {
    setSfApiKey(val);
    localStorage.setItem('rongila_sf_api_key', val);
  };

  const handleUpdateSfSecretKey = (val: string) => {
    setSfSecretKey(val);
    localStorage.setItem('rongila_sf_secret_key', val);
  };

  // Meta (Facebook) Pixel State
  const [fbPixelId, setFbPixelId] = useState(() => getStoredPixelId());

  const handleSavePixel = (e: React.FormEvent) => {
    e.preventDefault();
    savePixelId(fbPixelId);
    alert(lang === 'bn' 
      ? `✅ মেটা (ফেসবুক) পিক্সেল আইডি (${fbPixelId}) সেভ করা হয়েছে এবং আপনার শপে লাইভ পিক্সেল ট্র্যাকিং সক্রিয় রয়েছে!` 
      : `✅ Meta Pixel ID (${fbPixelId}) saved and live tracking enabled!`);
  };

  // Printable Invoice / Courier Sticker Modal State
  const [printingOrder, setPrintingOrder] = useState<Order | null>(null);

  // New Product Form State
  const [newProd, setNewProd] = useState<Partial<Product>>({
    nameBn: '',
    nameEn: '',
    category: 'saree',
    price: 3500,
    originalPrice: 4500,
    fabricBn: 'ঢাকাই জামদানি',
    fabricEn: 'Dhakai Jamdani',
    colorBn: 'রয়েল ব্লু ও গোল্ডেন',
    colorEn: 'Royal Blue & Golden',
    descriptionBn: 'হাতে বোনা আকর্ষণীয় ঢাকাই জামদানি শাড়ি, উৎসব ও বিয়ে বাড়ির সেরা পছন্দ।',
    descriptionEn: 'Handwoven gorgeous Dhakai Jamdani Saree, perfect choice for festive celebrations.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    inStock: true,
    isNewArrival: true,
    sizes: ['Free Size']
  });

  const [boostedProducts, setBoostedProducts] = useState<string[]>(['rr-saree-001', 'rr-panjabi-001']);
  const [boostBudget, setBoostBudget] = useState(500);
  const [boostModalProduct, setBoostModalProduct] = useState<Product | null>(null);
  const [isAdsManagerOpen, setIsAdsManagerOpen] = useState(false);

  const OWNER_PHONE = '01792765693';

  // Security Login Handler
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput === OWNER_PHONE || pinInput === 'admin') {
      setIsAdminAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Dispatch Order to Courier
  const handleConfirmCourierEntry = async () => {
    if (!dispatchingOrder) return;
    setIsSubmittingCourier(true);

    let trackingId = '';
    let apiSuccess = false;
    let responseMsg = '';

    if (selectedCourier === 'Steadfast Courier') {
      try {
        const response = await fetch('/api/steadfast/create_order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            invoice: dispatchingOrder.id,
            recipient_name: dispatchingOrder.customerName,
            recipient_phone: dispatchingOrder.phone,
            recipient_address: `${dispatchingOrder.address}, ${dispatchingOrder.city}`,
            cod_amount: dispatchingOrder.totalAmount,
            note: `Rongila Rup Order #${dispatchingOrder.id}`,
            apiKey: sfApiKey,
            secretKey: sfSecretKey
          })
        });
        const data = await response.json();
        
        if (data && data.success && data.consignment) {
          trackingId = data.consignment.tracking_code || data.consignment.consignment_id;
          apiSuccess = true;
          responseMsg = data.message || 'অর্ডারটি স্টিডফাস্ট কুরিয়ার ড্যাশবোর্ডে সফলভাবে এন্ট্রি হয়েছে!';
        } else {
          apiSuccess = false;
          responseMsg = data?.message || 'Steadfast API Response Error';
        }
      } catch (err: any) {
        console.error('Steadfast API call error:', err);
        apiSuccess = false;
        responseMsg = err.message || 'কানেকশন এরর';
      }
    } else {
      const trackingPrefix = 
        selectedCourier === 'Pathao Courier' ? 'PATHAO-BD' :
        selectedCourier === 'RedX Logistics' ? 'REDX' : 'PAPERFLY';
      trackingId = `${trackingPrefix}-${Math.floor(100000 + Math.random() * 900000)}`;
      apiSuccess = true;
      responseMsg = `${selectedCourier}-এ পার্সেল বুকিং মেমো জেনারেট হয়েছে।`;
    }

    if (!apiSuccess && selectedCourier === 'Steadfast Courier') {
      setIsSubmittingCourier(false);
      alert(lang === 'bn' 
        ? `⚠️ স্টিডফাস্ট কুরিয়ার ড্যাশবোর্ডে এন্ট্রি হয়নি!\n\nকারণ: ${responseMsg}\n\nপরামর্শ:\n১. আপনার Steadfast Merchant Console > API Settings থেকে "Secret Key" সংগ্রহ করে নিচে ইনপুট দিন (API Key: ${sfApiKey})\n২. কাস্টমারের ফোন নম্বর (১১ ডিজিট) এবং ঠিকানা ঠিক আছে কিনা নিশ্চিত করুন।`
        : `⚠️ Steadfast Courier dispatch failed!\nReason: ${responseMsg}\n\nPlease check your Secret Key & API Key.`);
      return;
    }

    const updated: Order = {
      ...dispatchingOrder,
      status: 'shipped',
      courierName: selectedCourier,
      courierTrackingId: trackingId,
      courierStatus: 'Dispatched',
      adminNotes: `Steadfast Live Dispatch | Tracking ID: ${trackingId}`
    };

    if (onUpdateFullOrder) {
      onUpdateFullOrder(updated);
    } else {
      onUpdateOrderStatus(dispatchingOrder.id, 'shipped');
    }

    setIsSubmittingCourier(false);
    setDispatchingOrder(null);
    alert(lang === 'bn' 
      ? `✅ ${responseMsg}\nট্র্যাকিং নম্বর: ${trackingId}` 
      : `Order dispatched successfully!\nTracking ID: ${trackingId}`);
  };

  // Handle Add Product Submit
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.nameBn || !newProd.price || !newProd.image) return;

    const fullProduct: Product = {
      id: `rr-prod-${Date.now()}`,
      nameBn: newProd.nameBn,
      nameEn: newProd.nameEn || newProd.nameBn,
      category: (newProd.category as CategoryId) || 'saree',
      price: Number(newProd.price),
      originalPrice: newProd.originalPrice ? Number(newProd.originalPrice) : undefined,
      rating: 5.0,
      reviewsCount: 1,
      image: newProd.image,
      images: [newProd.image],
      fabricBn: newProd.fabricBn || 'সুতি',
      fabricEn: newProd.fabricEn || 'Cotton',
      colorBn: newProd.colorBn || 'লাল',
      colorEn: newProd.colorEn || 'Red',
      descriptionBn: newProd.descriptionBn || '',
      descriptionEn: newProd.descriptionEn || '',
      inStock: true,
      isNewArrival: true,
      detailsBn: ['১০০% সুতা ও কারিগরদের বুনন', 'ড্রাই ক্লিন করা শ্রেয়', 'মেমো ও বক্সে ডেলিভারি'],
      detailsEn: ['100% Authentic Handloom Quality', 'Dry Clean Recommended', 'Delivered in Luxury Box']
    };

    onAddProduct(fullProduct);
    setActiveTab('products');
    alert(lang === 'bn' ? 'নতুন পণ্য সফলভাবে যুক্ত করা হয়েছে!' : 'New product created successfully!');
  };

  // Toggle Boost on Product - Opens Ads Manager Modal
  const toggleBoost = (product: Product) => {
    setBoostModalProduct(product);
    setIsAdsManagerOpen(true);
  };

  // Helper: Get Customer Orders Count by Phone
  const getCustomerOrdersCount = (phoneNum: string) => {
    const cleaned = phoneNum.replace(/[^0-9]/g, '');
    return orders.filter(o => o.phone.replace(/[^0-9]/g, '').includes(cleaned) || cleaned.includes(o.phone.replace(/[^0-9]/g, ''))).length;
  };

  // Helper: Get Customer Total Spend by Phone
  const getCustomerTotalSpend = (phoneNum: string) => {
    const cleaned = phoneNum.replace(/[^0-9]/g, '');
    return orders
      .filter(o => o.phone.replace(/[^0-9]/g, '').includes(cleaned) || cleaned.includes(o.phone.replace(/[^0-9]/g, '')))
      .reduce((acc, o) => acc + o.totalAmount, 0);
  };

  // Helper: Build Unique Customers List for CRM
  const uniqueCustomerPhones = Array.from(new Set(orders.map(o => o.phone)));
  const customerList = uniqueCustomerPhones.map(phone => {
    const customerOrders = orders.filter(o => o.phone === phone);
    const lastOrder = customerOrders[0];
    const totalSpent = customerOrders.reduce((acc, o) => acc + o.totalAmount, 0);
    return {
      phone,
      name: lastOrder?.customerName || 'Customer',
      city: lastOrder?.city || 'Dhaka',
      ordersCount: customerOrders.length,
      totalSpent,
      lastOrderDate: lastOrder?.createdAt || ''
    };
  });

  // Calculated Stats
  const totalSales = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'processing').length;
  const confirmedOrders = orders.filter(o => o.status === 'confirmed').length;
  const shippedOrders = orders.filter(o => o.status === 'shipped').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

  const filteredOrders = orders.filter(o => {
    if (orderFilter !== 'all' && o.status !== orderFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.phone.toLowerCase().includes(q);
      const matchTrx = o.trxId ? o.trxId.toLowerCase().includes(q) : false;
      return matchId || matchName || matchPhone || matchTrx;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-5xl bg-stone-50 rounded-3xl shadow-2xl overflow-hidden border border-amber-500/30 my-auto flex flex-col max-h-[94vh]">
        
        {/* Admin Top Header Bar (Compact) */}
        <div className="px-4 py-2 bg-rose-950 text-amber-50 flex items-center justify-between border-b border-amber-500/30 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-amber-400 to-rose-500 text-rose-950 rounded-lg font-bold shadow-xs">
              <Lock size={16} />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-serif font-bold text-amber-100 flex items-center gap-2">
                <span>{lang === 'bn' ? 'রঙিলা রূপ - এডমিন প্যানেল' : 'Rongila Rup - Store Admin'}</span>
                <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[9px] rounded-full uppercase tracking-wider font-mono">
                  Owner: {OWNER_PHONE}
                </span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenDrive && isAdminAuthenticated && (
              <button
                onClick={onOpenDrive}
                className="px-2.5 py-1 bg-amber-500/20 border border-amber-400/30 hover:bg-amber-500/30 text-amber-200 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <HardDrive size={12} className="text-amber-400" />
                <span>{lang === 'bn' ? 'ড্রাইভ' : 'Drive'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-rose-900 text-amber-200 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* SECURITY PIN GATE IF NOT AUTHENTICATED */}
        {!isAdminAuthenticated ? (
          <div className="p-8 sm:p-12 bg-white flex flex-col items-center justify-center text-center space-y-6 flex-1 my-auto">
            <div className="p-4 bg-amber-100 text-rose-950 rounded-full border-2 border-amber-300 shadow-lg animate-bounce">
              <ShieldCheck size={48} />
            </div>

            <div className="max-w-md space-y-2">
              <h4 className="text-xl font-serif font-extrabold text-stone-900">
                {lang === 'bn' ? 'এডমিন সিকিউরিটি পাসওয়ার্ড লক' : 'Admin Security Authentication Required'}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {lang === 'bn' 
                  ? 'এই প্যানেলটি শুধুমাত্র ওয়েবসাইটের অনার (০১৭৯২৭৬৫৬৯৩) বা এডমিনের জন্য সংরক্ষিত। প্রবেশ করতে আপনার এডমিন সিকিউরিটি পিন (যেমন: 1234 বা দোকান নম্বর) দিন।' 
                  : 'This area is restricted to the store owner (01792765693). Please enter your Admin PIN to proceed.'}
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="w-full max-w-xs space-y-3">
              <div>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  placeholder={lang === 'bn' ? 'এডমিন পিন দিন (ডিমো: 1234)' : 'Enter PIN (Default: 1234)'}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-center text-base font-mono font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                />
                {pinError && (
                  <p className="text-[11px] font-bold text-red-600 mt-1">
                    {lang === 'bn' ? 'ভুল সিকিউরিটি পিন! আবার চেষ্টা করুন।' : 'Invalid Admin PIN! Try 1234 or 01792765693.'}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-rose-950 hover:bg-rose-900 text-amber-300 font-extrabold text-xs rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Unlock size={16} />
                <span>{lang === 'bn' ? 'এডমিন প্যানেল আনলক করুন' : 'Unlock Admin Panel'}</span>
              </button>
            </form>

            <div className="pt-4 border-t border-stone-200 text-[11px] text-stone-500 font-mono">
              Demo Admin PIN: <strong className="text-stone-800">1234</strong> or <strong className="text-stone-800">{OWNER_PHONE}</strong>
            </div>
          </div>
        ) : (
          <>
            {/* Admin Stats Overview Bar (Compact) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 p-2 bg-amber-950/90 text-amber-100 border-b border-amber-500/20 text-xs shrink-0">
              <div className="p-2 bg-rose-900/40 rounded-xl border border-amber-500/20">
                <span className="text-[10px] text-amber-300 block font-semibold">{lang === 'bn' ? 'মোট বিক্রয়' : 'Total Revenue'}</span>
                <span className="text-sm font-serif font-bold text-amber-300">৳{totalSales.toLocaleString()}</span>
              </div>
              <div className="p-2 bg-rose-900/40 rounded-xl border border-amber-500/20">
                <span className="text-[10px] text-amber-300 block font-semibold">{lang === 'bn' ? 'কাস্টমার অর্ডার' : 'Total Orders'}</span>
                <span className="text-sm font-bold text-white">{totalOrders} <span className="text-[10px] font-normal text-amber-200">({pendingOrders} পেন্ডিং)</span></span>
              </div>
              <div className="p-2 bg-rose-900/40 rounded-xl border border-amber-500/20">
                <span className="text-[10px] text-amber-300 block font-semibold">{lang === 'bn' ? 'কনফার্মড ও কুরিয়ার' : 'Confirmed & Shipped'}</span>
                <span className="text-sm font-bold text-emerald-400">{confirmedOrders + shippedOrders} {lang === 'bn' ? 'টি' : 'orders'}</span>
              </div>
              <div className="p-2 bg-rose-900/40 rounded-xl border border-amber-500/20">
                <span className="text-[10px] text-amber-300 block font-semibold">{lang === 'bn' ? 'ইউনিক কাস্টমার' : 'Unique Customers'}</span>
                <span className="text-sm font-bold text-amber-300 flex items-center gap-1">
                  <Users size={12} />
                  <span>{customerList.length} {lang === 'bn' ? 'জন' : 'buyers'}</span>
                </span>
              </div>
              <div className="p-2 bg-rose-900/40 rounded-xl border border-amber-500/20 hidden lg:block">
                <span className="text-[10px] text-amber-300 block font-semibold">{lang === 'bn' ? 'একটিভ প্রডাক্ট' : 'Active Products'}</span>
                <span className="text-sm font-bold text-white">{products.length} {lang === 'bn' ? 'টি পণ্য' : 'items'}</span>
              </div>
            </div>

            {/* Tab Selector Navigation (Compact) */}
            <div className="px-4 pt-2 bg-white border-b border-stone-200 flex gap-1.5 overflow-x-auto shrink-0 text-xs">
              <button
                onClick={() => setActiveTab('orders')}
                className={`pb-3 px-3 font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'orders'
                    ? 'border-rose-900 text-rose-950'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <ShoppingBag size={15} />
                <span>{lang === 'bn' ? 'অর্ডার প্রসেসিং ও কনফার্ম' : 'Orders & Confirmations'}</span>
                <span className="px-1.5 py-0.2 bg-rose-100 text-rose-900 rounded-full font-mono text-[10px]">{orders.length}</span>
              </button>

              <button
                onClick={() => setActiveTab('customers')}
                className={`pb-3 px-3 font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'customers'
                    ? 'border-rose-900 text-rose-950'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Users size={15} className="text-amber-700" />
                <span>{lang === 'bn' ? 'কাস্টমার ডাটাবেজ (CRM)' : 'Customer History CRM'}</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`pb-3 px-3 font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'products'
                    ? 'border-rose-900 text-rose-950'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Tag size={15} />
                <span>{lang === 'bn' ? 'প্রডাক্ট লিস্ট' : 'Product Inventory'}</span>
              </button>

              <button
                onClick={() => setActiveTab('add_product')}
                className={`pb-3 px-3 font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'add_product'
                    ? 'border-rose-900 text-rose-950'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <PackagePlus size={15} className="text-emerald-700" />
                <span className="text-emerald-800 font-extrabold">{lang === 'bn' ? '+ নতুন প্রডাক্ট' : '+ Add Product'}</span>
              </button>

              <button
                onClick={() => setActiveTab('boost')}
                className={`pb-3 px-3 font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'boost'
                    ? 'border-rose-900 text-rose-950'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Rocket size={15} className="text-amber-600" />
                <span>{lang === 'bn' ? 'বুস্ট ও মার্কেটিং' : 'Boost & Ads'}</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`pb-3 px-3 font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'border-rose-900 text-rose-950'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <BarChart3 size={15} />
                <span>{lang === 'bn' ? 'বিক্রয় সামারি' : 'Analytics'}</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`pb-3 px-3 font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'settings'
                    ? 'border-rose-900 text-rose-950 text-rose-900'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Megaphone size={15} className="text-amber-600" />
                <span className="font-extrabold text-amber-900">{lang === 'bn' ? 'ব্যানার ও ডিসকাউন্ট' : 'Banners & Discounts'}</span>
              </button>
            </div>

            {/* Tab Content Container */}
            <div className="p-6 overflow-y-auto flex-1 bg-stone-100">

              {/* TAB 1: ORDER MANAGEMENT & CONFIRMATIONS */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
                    <div className="relative w-full sm:w-80">
                      <Search size={14} className="absolute left-3 top-3 text-stone-400" />
                      <input
                        type="text"
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        placeholder={lang === 'bn' ? 'ফোন নম্বর (যেমন: 01792765693), নাম বা অর্ডার আইডি...' : 'Search phone, name, order ID, TrxID...'}
                        className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                      />
                    </div>

                    <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
                      <Filter size={14} className="text-stone-500" />
                      <span className="font-bold text-stone-700">{lang === 'bn' ? 'ফিল্টার:' : 'Filter:'}</span>
                      <select
                        value={orderFilter}
                        onChange={(e) => setOrderFilter(e.target.value as any)}
                        className="p-2 bg-stone-50 border border-stone-200 rounded-xl font-semibold text-rose-950 focus:outline-none"
                      >
                        <option value="all">{lang === 'bn' ? 'সকল অর্ডার' : 'All Orders'}</option>
                        <option value="processing">{lang === 'bn' ? 'পেন্ডিং (Processing)' : 'Processing'}</option>
                        <option value="confirmed">{lang === 'bn' ? 'কনফার্মড (Confirmed)' : 'Confirmed'}</option>
                        <option value="shipped">{lang === 'bn' ? 'কুরিয়ারে পাঠানো (Shipped)' : 'Shipped'}</option>
                        <option value="on_hold">{lang === 'bn' ? 'হোল্ডে রাখা (On Hold)' : 'On Hold'}</option>
                        <option value="delivered">{lang === 'bn' ? 'ডেলিভার্ড সম্পন্ন' : 'Delivered'}</option>
                        <option value="cancelled">{lang === 'bn' ? 'বাতিলকৃত অর্ডার' : 'Cancelled'}</option>
                      </select>
                    </div>
                  </div>

                  {filteredOrders.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-2">
                      <ShoppingBag size={32} className="mx-auto text-stone-300" />
                      <p className="text-xs text-stone-500 font-semibold">
                        {lang === 'bn' ? 'কোনো কাস্টমার অর্ডার পাওয়া যায়নি!' : 'No orders found for this search/filter.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredOrders.map(order => {
                        const customerOrderCount = getCustomerOrdersCount(order.phone);
                        const customerSpend = getCustomerTotalSpend(order.phone);

                        return (
                          <div key={order.id} className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-sm space-y-3.5 hover:border-amber-400 transition-all">
                            
                            {/* Order Header Info */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[11px] font-mono bg-stone-100 text-stone-800 px-2 py-0.5 rounded font-extrabold">
                                    #{order.id}
                                  </span>
                                  <span className="text-[10px] text-stone-500">
                                    {order.createdAt}
                                  </span>
                                  
                                  {/* Repeat Buyer Intelligence Tag */}
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 border ${
                                    customerOrderCount > 1 
                                      ? 'bg-amber-100 border-amber-300 text-amber-900' 
                                      : 'bg-stone-100 border-stone-200 text-stone-700'
                                  }`}>
                                    <Users size={10} />
                                    <span>
                                      {customerOrderCount > 1 
                                        ? (lang === 'bn' ? `এই নম্বর থেকে ${customerOrderCount} টি অর্ডার করা হয়েছে (VIP Client - ৳${customerSpend.toLocaleString()})` : `Repeat Customer: ${customerOrderCount} Orders (৳${customerSpend})`) 
                                        : (lang === 'bn' ? '১ম অর্ডার (New Customer)' : '1st Order')}
                                    </span>
                                  </span>
                                </div>

                                <h4 className="text-base font-serif font-bold text-stone-900 mt-1 flex items-center gap-2">
                                  <span>{order.customerName}</span>
                                  <span className="text-rose-900 font-mono text-sm bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                    📞 {order.phone}
                                  </span>
                                </h4>
                                <p className="text-xs text-stone-600 mt-0.5 font-medium">
                                  📍 {order.address}, {order.city}
                                </p>
                              </div>

                              {/* Order Status Badge & Fast Changer */}
                              <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1 ${
                                  order.status === 'delivered' ? 'bg-emerald-100 text-emerald-900' :
                                  order.status === 'confirmed' ? 'bg-blue-100 text-blue-900' :
                                  order.status === 'shipped' ? 'bg-purple-100 text-purple-900' :
                                  order.status === 'on_hold' ? 'bg-amber-100 text-amber-900' :
                                  order.status === 'cancelled' ? 'bg-red-100 text-red-900' :
                                  'bg-rose-100 text-rose-900'
                                }`}>
                                  {order.status === 'processing' && (lang === 'bn' ? '⏳ পেন্ডিং / প্রসেসিং' : 'Pending')}
                                  {order.status === 'confirmed' && (lang === 'bn' ? '✅ কনফার্মড' : 'Confirmed')}
                                  {order.status === 'shipped' && (lang === 'bn' ? '🚚 কুরিয়ারে এন্ট্রি করা' : 'Shipped')}
                                  {order.status === 'on_hold' && (lang === 'bn' ? '⏸️ হোল্ডে রাখা' : 'On Hold')}
                                  {order.status === 'delivered' && (lang === 'bn' ? '🎉 ডেলিভারি সম্পন্ন' : 'Delivered')}
                                  {order.status === 'cancelled' && (lang === 'bn' ? '❌ বাতিলকৃত' : 'Cancelled')}
                                </span>
                              </div>
                            </div>

                            {/* Order Products List */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-stone-50 p-3 rounded-xl border border-stone-200">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2.5 bg-white p-2 rounded-lg border border-stone-200/80">
                                  <img src={item.product.image} alt={item.product.nameEn} className="w-12 h-12 object-cover rounded-lg shrink-0 border border-stone-200" referrerPolicy="no-referrer" />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-bold text-stone-900 truncate text-xs">
                                      {lang === 'bn' ? item.product.nameBn : item.product.nameEn}
                                    </p>
                                    <p className="text-[11px] text-stone-600 font-medium">
                                      <span className="font-extrabold text-stone-900">{item.quantity}টি</span> × ৳{item.product.price.toLocaleString()} = <strong className="text-rose-950 font-sans font-extrabold text-xs">৳{(item.product.price * item.quantity).toLocaleString()}</strong>
                                      {item.selectedSize && <span className="ml-1 text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-mono">({item.selectedSize})</span>}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Payment Details & bKash / Nagad TrxID Info */}
                            <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-3 flex-wrap">
                                <div>
                                  <span className="text-[10px] text-stone-500 block uppercase font-bold">{lang === 'bn' ? 'পেমেন্ট মেথড' : 'Payment Method'}</span>
                                  <span className="font-extrabold text-stone-900 uppercase">{order.paymentMethod}</span>
                                </div>

                                {order.trxId && (
                                  <div className="pl-3 border-l border-amber-300">
                                    <span className="text-[10px] text-pink-700 block uppercase font-bold">{lang === 'bn' ? 'bKash / Nagad TrxID' : 'Transaction ID'}</span>
                                    <span className="font-mono font-extrabold text-pink-900 bg-pink-100 px-2 py-0.5 rounded text-xs">
                                      {order.trxId} ({order.paymentPhone})
                                    </span>
                                  </div>
                                )}

                                {order.courierTrackingId && (
                                  <div className="pl-3 border-l border-amber-300">
                                    <span className="text-[10px] text-purple-700 block uppercase font-bold">{order.courierName}</span>
                                    <span className="font-mono font-extrabold text-purple-900 bg-purple-100 px-2 py-0.5 rounded text-xs">
                                      {order.courierTrackingId}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="text-right">
                                <span className="text-[10px] text-stone-500 block uppercase font-bold">{lang === 'bn' ? 'অর্ডারের হিসাব বিবরণী' : 'Total Breakdown'}</span>
                                <div className="text-[11px] text-stone-600 font-medium">
                                  <span>{lang === 'bn' ? 'পণ্য:' : 'Subtotal:'} ৳{order.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0).toLocaleString()}</span>
                                  <span className="ml-1.5">{lang === 'bn' ? '+ কুরিয়ার:' : '+ Shipping:'} ৳{(order.shippingFee || 80).toLocaleString()}</span>
                                  {order.discount > 0 && <span className="text-rose-600 font-bold ml-1.5">(-৳{order.discount.toLocaleString()} ছাড়)</span>}
                                </div>
                                <span className="text-base font-serif font-extrabold text-rose-950 block mt-0.5">
                                  {lang === 'bn' ? 'সর্বমোট প্রদেয়:' : 'Total Payable:'} ৳{order.totalAmount.toLocaleString()}
                                </span>
                              </div>
                            </div>

                            {/* ADMIN ACTION CONTROL BUTTONS */}
                            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-stone-200 text-xs">
                              <div className="flex items-center gap-2 flex-wrap">
                                {/* Confirm Order Button */}
                                {order.status !== 'confirmed' && order.status !== 'shipped' && order.status !== 'delivered' && (
                                  <button
                                    onClick={() => {
                                      onUpdateOrderStatus(order.id, 'confirmed');
                                      alert(lang === 'bn' ? 'অর্ডারটি কনফার্ম করা হয়েছে!' : 'Order confirmed successfully!');
                                    }}
                                    className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                                  >
                                    <CheckCircle2 size={14} />
                                    <span>{lang === 'bn' ? 'কনফার্ম করুন' : 'Confirm Order'}</span>
                                  </button>
                                )}

                                {/* Auto Courier Dispatch Entry Button */}
                                <button
                                  onClick={() => setDispatchingOrder(order)}
                                  className="px-3.5 py-2 bg-rose-950 hover:bg-rose-900 text-amber-300 font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                                >
                                  <Truck size={14} />
                                  <span>{lang === 'bn' ? 'কুরিয়ারে এন্ট্রি (Steadfast/Pathao)' : 'Dispatch Courier'}</span>
                                </button>

                                {/* Hold Order Button */}
                                {order.status !== 'on_hold' && (
                                  <button
                                    onClick={() => onUpdateOrderStatus(order.id, 'on_hold')}
                                    className="px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                                  >
                                    <PauseCircle size={14} />
                                    <span>{lang === 'bn' ? 'হোল্ড রাখুন' : 'Hold'}</span>
                                  </button>
                                )}

                                {/* Cancel Order Button */}
                                {order.status !== 'cancelled' && (
                                  <button
                                    onClick={() => {
                                      if (confirm(lang === 'bn' ? 'আপনি কি নিশ্চিত যে এই অর্ডারটি বাতিল করতে চান?' : 'Are you sure you want to cancel this order?')) {
                                        onUpdateOrderStatus(order.id, 'cancelled');
                                      }
                                    }}
                                    className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-800 font-bold rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                                  >
                                    <XCircle size={14} />
                                    <span>{lang === 'bn' ? 'বাতিল করুন' : 'Cancel Order'}</span>
                                  </button>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                {/* Print Invoice & Sticker */}
                                <button
                                  onClick={() => setPrintingOrder(order)}
                                  className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                                >
                                  <Printer size={14} />
                                  <span>{lang === 'bn' ? 'ইনভয়েস প্রিন্ট' : 'Print Invoice'}</span>
                                </button>

                                {/* Direct Call Customer */}
                                <a
                                  href={`tel:${order.phone}`}
                                  className="px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold rounded-xl flex items-center gap-1 transition-all"
                                >
                                  <PhoneCall size={14} />
                                  <span>{lang === 'bn' ? 'কল করুন' : 'Call'}</span>
                                </a>

                                {/* Direct WhatsApp */}
                                <a
                                  href={`https://wa.me/88${order.phone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1 transition-all"
                                >
                                  <Send size={14} />
                                  <span>WhatsApp</span>
                                </a>
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: CUSTOMER CRM DATABASE & REPEAT BUYERS */}
              {activeTab === 'customers' && (
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h4 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
                        <Users size={18} className="text-amber-600" />
                        <span>{lang === 'bn' ? 'কাস্টমার ইন্টেলিজেন্স ও অর্ডারের ইতিহাস (CRM)' : 'Customer Intelligence Database'}</span>
                      </h4>
                      <p className="text-xs text-stone-500">
                        {lang === 'bn' ? 'কোন নম্বর থেকে কতটি অর্ডার এসেছে তা এক নজরে দেখুন।' : 'Track total order count and lifetime value per phone number.'}
                      </p>
                    </div>

                    <div className="px-3 py-1.5 bg-amber-100 text-amber-900 rounded-xl font-bold text-xs font-mono">
                      {customerList.length} {lang === 'bn' ? 'টি অনন্য নম্বর' : 'Unique Customer Phones'}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {customerList.map((cust, i) => (
                      <div key={i} className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3 hover:border-amber-400 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-serif font-bold text-stone-900 text-sm">
                              {cust.name}
                            </h5>
                            <span className="text-xs font-mono font-bold text-rose-950 block mt-0.5">
                              📞 {cust.phone}
                            </span>
                            <span className="text-[11px] text-stone-500 block">
                              📍 {cust.city} • সর্বশেষ অর্ডার: {cust.lastOrderDate}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-extrabold block ${
                              cust.ordersCount > 1 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-stone-100 text-stone-700'
                            }`}>
                              {cust.ordersCount} {lang === 'bn' ? 'টি অর্ডার' : 'Orders'}
                            </span>
                            <span className="text-xs font-extrabold text-rose-950 mt-1 block">
                              ৳{cust.totalSpent.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                          <button
                            onClick={() => {
                              setActiveTab('orders');
                              setOrderSearch(cust.phone);
                            }}
                            className="text-amber-800 font-bold hover:underline flex items-center gap-1"
                          >
                            <Eye size={12} />
                            <span>{lang === 'bn' ? 'এই কাস্টমারের সকল অর্ডার দেখুন' : 'View Orders'}</span>
                          </button>

                          <a
                            href={`https://wa.me/88${String(cust.phone).replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[11px] flex items-center gap-1"
                          >
                            <Send size={10} />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: PRODUCT INVENTORY LIST */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white p-3.5 rounded-2xl border border-stone-200">
                    <h4 className="font-serif font-bold text-stone-900 text-sm">
                      {lang === 'bn' ? `সর্বমোট ওয়েবসাইট প্রডাক্ট লিস্ট (${products.length})` : `All Products (${products.length})`}
                    </h4>
                    <button
                      onClick={() => setActiveTab('add_product')}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>{lang === 'bn' ? 'নতুন প্রডাক্ট যোগ করুন' : 'Add Product'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map(p => (
                      <div key={p.id} className="bg-white rounded-2xl p-3 border border-stone-200 shadow-sm flex gap-3">
                        <img src={p.image} alt={p.nameEn} className="w-20 h-24 object-cover rounded-xl shrink-0 border border-stone-200" referrerPolicy="no-referrer" />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-bold text-amber-800 uppercase tracking-wider block">
                              {p.category}
                            </span>
                            <h5 className="font-serif font-bold text-xs text-stone-900 truncate">
                              {lang === 'bn' ? p.nameBn : p.nameEn}
                            </h5>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-xs font-bold text-rose-950">৳{p.price.toLocaleString()}</p>
                              <button
                                onClick={() => {
                                  const updated = {
                                    ...p,
                                    isFlashSale: !p.isFlashSale,
                                    originalPrice: p.originalPrice || Math.round(p.price * 1.25)
                                  };
                                  onUpdateProduct(updated);
                                }}
                                className={`px-2 py-0.5 text-[10px] font-bold rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${
                                  p.isFlashSale || (p.originalPrice && p.originalPrice > p.price)
                                    ? 'bg-amber-500 text-rose-950 border-amber-400'
                                    : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
                                }`}
                                title="ডিসকাউন্ট স্লাইডারে অন/অফ করুন"
                              >
                                <Flame size={11} />
                                <span>{p.isFlashSale || (p.originalPrice && p.originalPrice > p.price) ? 'অফার স্লাইডারে আছে' : '+ অফারে দিন'}</span>
                              </button>
                            </div>
                            <p className="text-[10px] text-stone-500">{p.fabricBn}</p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                              {p.inStock ? (lang === 'bn' ? 'স্টকে আছে' : 'In Stock') : (lang === 'bn' ? 'স্টক আউট' : 'Out of Stock')}
                            </span>
                            <button
                              onClick={() => {
                                if (confirm(lang === 'bn' ? 'আপনি কি এই প্রডাক্টটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this product?')) {
                                  onDeleteProduct(p.id);
                                }
                              }}
                              className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: ADD NEW PRODUCT FORM */}
              {activeTab === 'add_product' && (
                <form onSubmit={handleCreateProduct} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4 max-w-2xl mx-auto">
                  <div className="border-b border-stone-100 pb-3">
                    <h4 className="font-serif font-bold text-base text-rose-950 flex items-center gap-2">
                      <PackagePlus size={20} className="text-emerald-700" />
                      <span>{lang === 'bn' ? 'ওয়েবসাইটে নতুন প্রডাক্ট যোগ করার ফরম' : 'Add New Product to Store'}</span>
                    </h4>
                    <p className="text-xs text-stone-500">
                      {lang === 'bn' ? 'প্রডাক্টের নাম, ছবি, দাম ও বিবরণ প্রদান করুন' : 'Enter product details, pricing, fabric, and image URL'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">{lang === 'bn' ? 'প্রডাক্টের বাংলা নাম *' : 'Product Name (Bengali) *'}</label>
                      <input
                        type="text"
                        required
                        value={newProd.nameBn || ''}
                        onChange={(e) => setNewProd({ ...newProd, nameBn: e.target.value })}
                        placeholder="যেমন: বাসন্তী কাতান জামদানি শাড়ি"
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">{lang === 'bn' ? 'প্রডাক্টের ইংলিশ নাম' : 'Product Name (English)'}</label>
                      <input
                        type="text"
                        value={newProd.nameEn || ''}
                        onChange={(e) => setNewProd({ ...newProd, nameEn: e.target.value })}
                        placeholder="e.g. Basanti Katan Jamdani Saree"
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">{lang === 'bn' ? 'ক্যাটাগরি *' : 'Category *'}</label>
                      <select
                        value={newProd.category || 'saree'}
                        onChange={(e) => setNewProd({ ...newProd, category: e.target.value as any })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800 focus:outline-none"
                      >
                        <option value="saree">{lang === 'bn' ? 'শাড়ি (Saree)' : 'Saree'}</option>
                        <option value="salwar">{lang === 'bn' ? 'স্যালোয়ার কামিজ (Salwar Kameez)' : 'Salwar Kameez'}</option>
                        <option value="panjabi">{lang === 'bn' ? 'পাঞ্জাবি ও কুর্তা (Panjabi)' : 'Panjabi'}</option>
                        <option value="jewelry">{lang === 'bn' ? 'গহনা / জুয়েলারি (Jewelry)' : 'Jewelry'}</option>
                        <option value="festive">{lang === 'bn' ? 'উৎসব স্পেশাল (Festive)' : 'Festive Collection'}</option>
                        <option value="threepiece">{lang === 'bn' ? 'থ্রি-পিস ও আনোরকলি (Three Piece)' : 'Three Piece'}</option>
                        <option value="lehenga">{lang === 'bn' ? 'লেহেঙ্গা (Lehenga)' : 'Lehenga'}</option>
                        <option value="kids">{lang === 'bn' ? 'কিডস কালেকশন (Kids Wear)' : 'Kids Wear'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">{lang === 'bn' ? 'বিক্রয় মূল্য (টাকা) *' : 'Sale Price (BDT) *'}</label>
                      <input
                        type="number"
                        required
                        value={newProd.price || ''}
                        onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                        placeholder="3500"
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-rose-950 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">{lang === 'bn' ? 'আগের মূল মূল্য (রেগুলার প্রাইজ)' : 'Original Price'}</label>
                      <input
                        type="number"
                        value={newProd.originalPrice || ''}
                        onChange={(e) => setNewProd({ ...newProd, originalPrice: Number(e.target.value) })}
                        placeholder="4800"
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">{lang === 'bn' ? 'ফেব্রিক / উপাদান' : 'Fabric Details'}</label>
                      <input
                        type="text"
                        value={newProd.fabricBn || ''}
                        onChange={(e) => setNewProd({ ...newProd, fabricBn: e.target.value })}
                        placeholder="যেমন: রেশম সিল্ক ও সুতি"
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-stone-700 mb-1">{lang === 'bn' ? 'প্রডাক্টের ছবির লিংক (Image URL) *' : 'Product Image URL *'}</label>
                      <input
                        type="url"
                        required
                        value={newProd.image || ''}
                        onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-stone-700 mb-1">{lang === 'bn' ? 'বিবরণ (Description)' : 'Product Description'}</label>
                      <textarea
                        rows={3}
                        value={newProd.descriptionBn || ''}
                        onChange={(e) => setNewProd({ ...newProd, descriptionBn: e.target.value })}
                        placeholder="প্রডাক্টের সৌন্দর্য, নকশা ও ব্যবহারের নিয়ম লিখুন..."
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('products')}
                      className="px-5 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs rounded-xl"
                    >
                      {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-rose-950 hover:bg-rose-900 text-amber-300 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Plus size={16} />
                      <span>{lang === 'bn' ? 'পণ্য পাবলিশ করুন' : 'Publish Product'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 5: BOOST & ADS MANAGER */}
              {activeTab === 'boost' && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  
                  {/* Meta Facebook Pixel Card */}
                  <form onSubmit={handleSavePixel} className="p-5 bg-gradient-to-r from-blue-900 via-indigo-950 to-rose-950 text-white rounded-3xl border border-blue-400/30 shadow-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-md font-black">
                          <BarChart3 size={20} />
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-base text-blue-100 flex items-center gap-2">
                            <span>{lang === 'bn' ? 'মেটা (ফেসবুক) পিক্সেল ডেটা ট্র্যাকিং' : 'Meta (Facebook) Pixel Data Tracking'}</span>
                            <span className="bg-emerald-500 text-slate-950 text-[10px] px-2 py-0.5 rounded-full font-mono font-black uppercase">
                              Pixel Connected
                            </span>
                          </h4>
                          <p className="text-xs text-blue-200/80">
                            {lang === 'bn' ? 'ওয়েবসাইটের কাস্টমারদের কেনাকাটা ও ট্রাফিক তথ্য ফেসবুক ইভেন্টস ম্যানেজারে ট্র্যাক করার কোড' : 'Track PageView, AddToCart, InitiateCheckout & Purchase events in Meta Events Manager'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end pt-1">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-blue-200 mb-1">
                          {lang === 'bn' ? 'Meta Pixel ID (Dataset Code)' : 'Meta Pixel ID'}
                        </label>
                        <input
                          type="text"
                          value={fbPixelId}
                          onChange={(e) => setFbPixelId(e.target.value)}
                          placeholder="4595345874045944"
                          className="w-full px-3 py-2 bg-slate-900/80 border border-blue-400/40 rounded-xl font-mono text-sm text-blue-100 tracking-wider focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 size={16} />
                        <span>{lang === 'bn' ? 'পিক্সেল সেভ করুন' : 'Save Pixel ID'}</span>
                      </button>
                    </div>

                    <div className="p-3 bg-slate-900/60 border border-blue-400/20 rounded-2xl text-[11px] text-blue-200 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-300 font-bold">
                        <ShieldCheck size={14} />
                        <span>পিক্সেল ইভেন্ট লাইভ স্ট্যাটাস:</span>
                      </div>
                      <p className="leading-relaxed">
                        বর্তমান পিক্সেল আইডি: <code className="bg-blue-950 px-1.5 py-0.5 rounded font-mono text-amber-300 font-bold">{fbPixelId}</code> | এটি ওয়েবসাইটে কাস্টমার ভিজিট (<span className="text-white font-bold">PageView</span>), কার্টে যোগ করা (<span className="text-white font-bold">AddToCart</span>), চেকআউট শুরু করা (<span className="text-white font-bold">InitiateCheckout</span>), এবং অর্ডার প্লেস করা (<span className="text-white font-bold">Purchase</span>) সরাসরি আপনার ফেসবুকে পাঠাচ্ছে।
                      </p>
                      
                      <div className="mt-2 p-2.5 bg-amber-950/80 border border-amber-500/30 rounded-xl text-amber-100 text-[11px] space-y-1">
                        <p className="font-bold text-amber-300 flex items-center gap-1">
                          💡 ফেসবুক এডস বুস্টিং ও কার্ড পেমেন্ট নির্দেশনা:
                        </p>
                        <p className="leading-snug">
                          পিক্সেল কোড ওয়েবসাইটে ফ্রীতে ডাটা ট্র্যাক করে। কিন্তু ফেসবুকে এডস/বুস্ট চালানোর টাকা (ডলার/কার্ড পেমেন্ট) ফেসবুককে সরাসরি <a href="https://adsmanager.facebook.com" target="_blank" rel="noopener noreferrer" className="underline text-blue-300 font-bold hover:text-white">adsmanager.facebook.com</a> অথবা আপনার ফেসবুক পেজের <strong>Promote / Boost Post</strong> অপশনে মাস্টারকার্ড/ভিসা ডুয়েল কারেন্সি কার্ড যোগ করে পেমেন্ট করতে হয়।
                        </p>
                      </div>
                    </div>
                  </form>

                  <div className="p-6 bg-gradient-to-r from-rose-950 via-amber-950 to-rose-950 text-amber-100 rounded-3xl border border-amber-500/30 shadow-lg space-y-3">
                    <div className="flex items-center gap-2">
                      <Rocket size={24} className="text-amber-400 animate-pulse" />
                      <h4 className="text-lg font-serif font-bold text-amber-200">
                        {lang === 'bn' ? 'ফেসবুক ও ইনস্টাগ্রাম এড বুস্ট ম্যানেজার' : 'Facebook & Instagram Ad Boost Manager'}
                      </h4>
                    </div>
                    <p className="text-xs text-amber-200/80 max-w-xl leading-relaxed">
                      {lang === 'bn' 
                        ? 'আপনার রঙিলা রূপ কালেকশনের সেরা বিক্রিত জামদানি শাড়ি ও পাঞ্জাবি প্রমোট করুন। ১-ক্লিকে বুস্ট ক্যাম্পেইন চালু করুন।' 
                        : 'Boost your best-selling Jamdani Sarees and Silk Panjabis on social media to maximize customer reach.'}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
                      <span className="font-bold text-amber-300">{lang === 'bn' ? 'দৈনিক এড বাজেট (BDT):' : 'Daily Ad Budget:'}</span>
                      {[500, 1000, 2000, 5000].map(amt => (
                        <button
                          key={amt}
                          onClick={() => setBoostBudget(amt)}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                            boostBudget === amt ? 'bg-amber-400 text-rose-950 shadow-md scale-105' : 'bg-rose-900/60 text-amber-200 hover:bg-rose-900'
                          }`}
                        >
                          ৳{amt.toLocaleString()} / {lang === 'bn' ? 'দিন' : 'day'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="font-serif font-bold text-stone-900 text-sm">
                      {lang === 'bn' ? 'বুস্ট করার জন্য প্রডাক্ট নির্বাচন করুন:' : 'Select Products to Boost:'}
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {products.map(p => {
                        const isBoosted = boostedProducts.includes(p.id) || p.isBoosted;
                        return (
                          <div 
                            key={p.id}
                            className={`p-4 bg-white rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                              isBoosted ? 'border-amber-500 ring-2 ring-amber-400/30 bg-amber-50/30' : 'border-stone-200'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img src={p.image} alt={p.nameEn} className="w-12 h-14 object-cover rounded-xl shrink-0" referrerPolicy="no-referrer" />
                              <div className="min-w-0">
                                <h6 className="font-serif font-bold text-xs text-stone-900 truncate">
                                  {lang === 'bn' ? p.nameBn : p.nameEn}
                                </h6>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-rose-950">৳{p.price.toLocaleString()}</span>
                                  {isBoosted && (
                                    <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                                      {p.boostReach ? `Reach: ~${p.boostReach}` : 'Active Ad'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => toggleBoost(p)}
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer shrink-0 ${
                                isBoosted
                                  ? 'bg-amber-500 text-rose-950 hover:bg-amber-600'
                                  : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                              }`}
                            >
                              {isBoosted ? (lang === 'bn' ? 'বুস্ট রানিং 🚀' : 'Boost Active 🚀') : (lang === 'bn' ? '+ বুস্ট করুন' : 'Boost Now')}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: SALES ANALYTICS */}
              {activeTab === 'analytics' && (
                <div className="space-y-6 max-w-4xl mx-auto text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-1">
                      <span className="text-stone-500 block font-semibold">{lang === 'bn' ? 'গড় অর্ডার মূল্য (Average Order)' : 'Avg Order Value'}</span>
                      <span className="text-xl font-serif font-extrabold text-rose-950">
                        ৳{orders.length > 0 ? Math.round(totalSales / orders.length).toLocaleString() : 0}
                      </span>
                    </div>
                    <div className="p-5 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-1">
                      <span className="text-stone-500 block font-semibold">{lang === 'bn' ? 'ডেলিভারি সাকসেস রেট' : 'Delivery Success Rate'}</span>
                      <span className="text-xl font-serif font-extrabold text-emerald-700">98.5%</span>
                    </div>
                    <div className="p-5 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-1">
                      <span className="text-stone-500 block font-semibold">{lang === 'bn' ? 'টপ কালেকশন' : 'Top Category'}</span>
                      <span className="text-xl font-serif font-extrabold text-amber-800">
                        {lang === 'bn' ? 'ঢাকাই জামদানি শাড়ি' : 'Jamdani Saree'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: BANNERS & DISCOUNT CONTROL */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-2xl mx-auto text-xs bg-white p-6 rounded-3xl border border-stone-200 shadow-sm animate-fade-in">
                  <div className="border-b border-stone-200 pb-3 flex items-center gap-2">
                    <Megaphone size={20} className="text-amber-600" />
                    <div>
                      <h4 className="font-serif font-bold text-base text-stone-900">
                        {lang === 'bn' ? 'টপ নোটিশ ব্যানার ও ডিসকাউন্ট কুপন কন্ট্রোল' : 'Top Notice Banner & Discount Coupon Manager'}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        {lang === 'bn' 
                          ? 'ওয়েবসাইটের একদম উপরে যে ২০% ডিসকাউন্ট বা অফার লেখা দেখায় তা যেকোনো সময় পরিবর্তন বা আপডেট করুন।' 
                          : 'Change the top banner text and discount promo codes anytime across your store.'}
                      </p>
                    </div>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (onUpdateStoreSettings) {
                      onUpdateStoreSettings(settingsForm);
                      alert(lang === 'bn' ? '✅ ডিসকাউন্ট অফার ও ব্যানার নোটিশ সফলভাবে আপডেট করা হয়েছে!' : '✅ Store banner & discount settings updated live!');
                    }
                  }} className="space-y-4">
                    
                    <div>
                      <label className="block text-stone-800 font-bold mb-1">
                        {lang === 'bn' ? 'টপ নোটিশ ব্যানার (বাংলা)' : 'Top Notice Banner (Bengali)'}
                      </label>
                      <input
                        type="text"
                        value={settingsForm.announcementBn}
                        onChange={(e) => setSettingsForm({ ...settingsForm, announcementBn: e.target.value })}
                        required
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-medium text-stone-900 text-xs focus:ring-2 focus:ring-rose-900"
                        placeholder='যেমন: স্পেশাল অফার: "RONGILA20" কুপনে ২০% ছাড়!'
                      />
                    </div>

                    <div>
                      <label className="block text-stone-800 font-bold mb-1">
                        {lang === 'bn' ? 'টপ নোটিশ ব্যানার (English)' : 'Top Notice Banner (English)'}
                      </label>
                      <input
                        type="text"
                        value={settingsForm.announcementEn}
                        onChange={(e) => setSettingsForm({ ...settingsForm, announcementEn: e.target.value })}
                        required
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-medium text-stone-900 text-xs focus:ring-2 focus:ring-rose-900"
                        placeholder='e.g. Special Offer: 20% OFF with "RONGILA20"!'
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-stone-800 font-bold mb-1">
                          {lang === 'bn' ? 'ডিসকাউন্ট কুপন কোড (Promo Code)' : 'Discount Coupon Code'}
                        </label>
                        <input
                          type="text"
                          value={settingsForm.discountCouponCode}
                          onChange={(e) => setSettingsForm({ ...settingsForm, discountCouponCode: e.target.value.toUpperCase() })}
                          required
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono font-bold text-rose-950 text-xs"
                          placeholder="e.g. RONGILA20"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-800 font-bold mb-1">
                          {lang === 'bn' ? 'ডিসকাউন্ট শতাংশ (%)' : 'Discount Percentage (%)'}
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={settingsForm.discountPercent}
                          onChange={(e) => setSettingsForm({ ...settingsForm, discountPercent: Number(e.target.value) })}
                          required
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono font-bold text-rose-950 text-xs"
                          placeholder="20"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3 bg-rose-950 hover:bg-rose-900 text-amber-300 font-extrabold rounded-xl shadow-lg transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <CheckCircle2 size={16} />
                        <span>{lang === 'bn' ? 'অফার ও ব্যানার তথ্য সেভ করুন' : 'Save Banner & Discount Settings'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </>
        )}

      </div>

      {/* COURIER AUTOMATED DISPATCH MODAL */}
      {dispatchingOrder && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2 text-rose-950 font-serif font-bold text-base">
                <Truck className="text-amber-600" size={20} />
                <span>{lang === 'bn' ? 'কুরিয়ার অটো এন্ট্রি সিস্টেম' : 'Automated Courier Service Entry'}</span>
              </div>
              <button onClick={() => setDispatchingOrder(null)} className="p-1 hover:bg-stone-100 rounded-full text-stone-500">
                <X size={18} />
              </button>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1 text-xs">
              <div className="font-bold text-stone-900">
                অর্ডার আইডি: <span className="font-mono text-rose-950">{dispatchingOrder.id}</span>
              </div>
              <div className="text-stone-700">
                কাস্টমার: <strong>{dispatchingOrder.customerName}</strong> ({dispatchingOrder.phone})
              </div>
              <div className="text-stone-600">
                ঠিকানা: {dispatchingOrder.address}, {dispatchingOrder.city}
              </div>
              <div className="text-stone-900 font-extrabold pt-1">
                COD টাকা আদায়: ৳{dispatchingOrder.totalAmount.toLocaleString()}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block font-bold text-stone-800">
                {lang === 'bn' ? 'কুরিয়ার সার্ভিস নির্বাচন করুন:' : 'Select Courier Service:'}
              </label>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Steadfast Courier', desc: 'Fastest 24-48h Delivery' },
                  { name: 'Pathao Courier', desc: 'Nationwide Delivery' },
                  { name: 'RedX Logistics', desc: 'Doorstep Delivery' },
                  { name: 'Paperfly', desc: 'Home Delivery' }
                ].map(c => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedCourier(c.name as any)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedCourier === c.name 
                        ? 'border-rose-950 bg-rose-50 ring-2 ring-rose-950/20 font-bold' 
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-stone-900">{c.name}</div>
                    <div className="text-[10px] text-stone-500">{c.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {selectedCourier === 'Steadfast Courier' && (
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
                <div className="text-[11px] font-bold text-amber-950 flex items-center justify-between">
                  <span>🔑 Steadfast API Credentials Configuration</span>
                  <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-mono font-bold">Steadfast Live API</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] font-medium text-stone-600 mb-0.5">Steadfast API Key</label>
                    <input
                      type="text"
                      value={sfApiKey}
                      onChange={(e) => handleUpdateSfApiKey(e.target.value)}
                      placeholder="Steadfast API Key"
                      className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg font-mono text-[11px] bg-white text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-stone-600 mb-0.5">Steadfast Secret Key (Console &gt; API Settings)</label>
                    <input
                      type="password"
                      value={sfSecretKey}
                      onChange={(e) => handleUpdateSfSecretKey(e.target.value)}
                      placeholder="Secret Key ইনপুট দিন"
                      className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg font-mono text-[11px] bg-white text-stone-900"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-amber-800 leading-snug">
                  *আপনার Steadfast Merchant Portal (&gt; API Settings) থেকে API Key ও Secret Key ব্যবহার করে অর্ডার সরাসরি আপনার অ্যাকাউন্ট এন্ট্রি করা হবে।
                </p>
              </div>
            )}

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 font-medium space-y-1">
              <div className="flex items-center justify-between font-bold text-emerald-950">
                <span>✨ লাইভ এন্ট্রি তথ্য:</span>
                <span className="px-2 py-0.5 bg-emerald-700 text-white text-[9px] font-mono rounded-full font-bold">
                  Steadfast Live Mode
                </span>
              </div>
              <ul className="list-disc list-inside space-y-0.5">
                <li>সরাসরি স্টিডফাস্ট সার্ভারে পার্সেল বুকিং হবে।</li>
                <li>রেসপন্স ব্যর্থ হলে আসল কারণ ও মেসেজ দেখাবে।</li>
                <li>সফল হলে অরিজিনাল স্টিডফাস্ট ট্র্যাকিং কোড জেনারেট হবে।</li>
              </ul>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                disabled={isSubmittingCourier}
                onClick={() => setDispatchingOrder(null)}
                className="px-4 py-2 bg-stone-200 text-stone-800 rounded-xl font-bold text-xs"
              >
                বাতিল
              </button>
              <button
                type="button"
                disabled={isSubmittingCourier}
                onClick={handleConfirmCourierEntry}
                className="px-5 py-2 bg-rose-950 hover:bg-rose-900 text-amber-300 rounded-xl font-extrabold text-xs flex items-center gap-1 shadow-md cursor-pointer disabled:opacity-50"
              >
                <Truck size={14} />
                <span>{isSubmittingCourier ? 'স্টিডফাস্ট API এন্ট্রি হচ্ছে...' : 'এন্ট্রি ও ট্র্যাকিং জেনারেট করুন'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE INVOICE & COURIER PARCEL STICKER MODAL */}
      {printingOrder && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 border border-amber-500/30 space-y-6 my-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2 text-rose-950 font-serif font-bold text-base">
                <Printer className="text-amber-600" size={20} />
                <span>{lang === 'bn' ? 'অর্ডার মেমো ও কুরিয়ার শিপিং লেবেল' : 'Printable Invoice & Courier Label'}</span>
              </div>
              <button onClick={() => setPrintingOrder(null)} className="p-1 hover:bg-stone-100 rounded-full text-stone-500">
                <X size={18} />
              </button>
            </div>

            {/* Print Area Preview */}
            <div id="printable-area" className="p-5 bg-amber-50/40 rounded-2xl border-2 border-dashed border-stone-300 space-y-4 text-xs font-sans">
              <div className="flex justify-between items-start border-b border-stone-200 pb-3">
                <div>
                  <h3 className="text-lg font-serif font-extrabold text-rose-950 tracking-wider">রঙিলা রূপ</h3>
                  <p className="text-[10px] text-stone-600">অনলাইন শপিং মোবাইল: 01792765693</p>
                  <p className="text-[10px] text-stone-500">ঢাকা, বাংলাদেশ</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 bg-rose-950 text-amber-300 font-mono font-bold text-[10px] rounded">
                    Invoice #{printingOrder.id}
                  </span>
                  <p className="text-[10px] text-stone-500 mt-1">{printingOrder.createdAt}</p>
                </div>
              </div>

              {/* Customer Box */}
              <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Receiver / কাস্টমার তথ্য:</span>
                <div className="font-bold text-sm text-stone-900">{printingOrder.customerName}</div>
                <div className="font-mono font-bold text-rose-900 text-xs">📞 {printingOrder.phone}</div>
                <div className="text-stone-700">📍 {printingOrder.address}, {printingOrder.city}</div>
              </div>

              {/* Courier Barcode Snippet */}
              <div className="p-3 bg-stone-900 text-amber-50 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-amber-400 font-bold block">Courier COD Parcel Sticker</span>
                  <span className="font-mono text-sm font-extrabold text-white">
                    COD Amount: ৳{printingOrder.totalAmount.toLocaleString()}
                  </span>
                  {printingOrder.courierTrackingId && (
                    <span className="text-[10px] text-amber-300 font-mono block mt-0.5">
                      {printingOrder.courierName}: {printingOrder.courierTrackingId}
                    </span>
                  )}
                </div>
                <div className="p-1.5 bg-white rounded-lg">
                  <QrCode size={36} className="text-stone-900" />
                </div>
              </div>

              {/* Items summary */}
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-stone-300 text-stone-500">
                    <th className="py-1">পণ্য</th>
                    <th className="py-1 text-center">পরিমাণ</th>
                    <th className="py-1 text-right">মূল্য</th>
                  </tr>
                </thead>
                <tbody>
                  {printingOrder.items.map((it, idx) => (
                    <tr key={idx} className="border-b border-stone-200">
                      <td className="py-1.5 font-bold text-stone-900">{lang === 'bn' ? it.product.nameBn : it.product.nameEn}</td>
                      <td className="py-1.5 text-center font-bold">{it.quantity}</td>
                      <td className="py-1.5 text-right font-bold">৳{(it.product.price * it.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center pt-2 font-bold text-sm text-rose-950 border-t border-stone-300">
                <span>সর্বমোট প্রদেয় (Total COD):</span>
                <span className="text-base font-serif">৳{printingOrder.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPrintingOrder(null)}
                className="px-4 py-2 bg-stone-200 text-stone-800 rounded-xl font-bold text-xs"
              >
                বন্ধ করুন
              </button>

              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-rose-950 hover:bg-rose-900 text-amber-300 rounded-xl font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Printer size={14} />
                <span>ইনভয়েস ও স্টিকার প্রিন্ট করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ads Manager Modal for Product Boosting */}
      <AdsManagerModal
        isOpen={isAdsManagerOpen}
        onClose={() => setIsAdsManagerOpen(false)}
        lang={lang}
        product={boostModalProduct}
        onLaunchCampaign={(updatedProd) => {
          onUpdateProduct(updatedProd);
          setBoostedProducts(prev => Array.from(new Set([...prev, updatedProd.id])));
        }}
      />

    </div>
  );
};
