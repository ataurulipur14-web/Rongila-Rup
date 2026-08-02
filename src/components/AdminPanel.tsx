import React, { useState } from 'react';
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
  Search,
  Filter
} from 'lucide-react';
import { Product, Order, Language, CategoryId } from '../types';

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
  onUpdateOrderStatus
}) => {
  if (!isOpen) return null;

  // Active Tab: 'orders' | 'products' | 'add_product' | 'boost' | 'analytics'
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'add_product' | 'boost' | 'analytics'>('orders');

  // Search & Filters in Admin
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<'all' | Order['status']>('all');

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

  // Toggle Boost on Product
  const toggleBoost = (id: string) => {
    setBoostedProducts(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  // Calculated Stats
  const totalSales = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'processing').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

  const filteredOrders = orders.filter(o => {
    if (orderFilter !== 'all' && o.status !== orderFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.phone.toLowerCase().includes(q);
      return matchId || matchName || matchPhone;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-5xl bg-stone-50 rounded-3xl shadow-2xl overflow-hidden border border-amber-500/30 my-auto flex flex-col max-h-[92vh]">
        
        {/* Admin Header */}
        <div className="px-6 py-4 bg-rose-950 text-amber-50 flex items-center justify-between border-b border-amber-500/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-400 to-rose-500 text-rose-950 rounded-xl font-bold">
              <Lock size={20} />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-amber-100 flex items-center gap-2">
                <span>{lang === 'bn' ? 'রঙিলা রূপ - এডমিন কন্ট্রোল প্যানেল' : 'Rongila Rup - Store Admin Dashboard'}</span>
                <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] rounded-full uppercase tracking-wider">Owner Portal</span>
              </h3>
              <p className="text-[11px] text-amber-300/70">
                {lang === 'bn' ? 'পণ্য পরিচালনা, কাস্টমার অর্ডার কনফার্মেশন ও প্রমোশন ম্যানেজমেন্ট' : 'Manage Inventory, Confirm Customer Orders & Boost Sales'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-rose-900 text-amber-200 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Admin Stats Overview Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-amber-950/90 text-amber-100 border-b border-amber-500/20 text-xs shrink-0">
          <div className="p-2.5 bg-rose-900/40 rounded-2xl border border-amber-500/20">
            <span className="text-[10px] text-amber-300 block">{lang === 'bn' ? 'মোট বিক্রয় (Total Sales)' : 'Total Sales'}</span>
            <span className="text-base font-serif font-bold text-amber-300">৳{totalSales.toLocaleString()}</span>
          </div>
          <div className="p-2.5 bg-rose-900/40 rounded-2xl border border-amber-500/20">
            <span className="text-[10px] text-amber-300 block">{lang === 'bn' ? 'মোট অর্ডার' : 'Total Orders'}</span>
            <span className="text-base font-bold text-white">{totalOrders} <span className="text-[10px] font-normal text-amber-200">({pendingOrders} পেন্ডিং)</span></span>
          </div>
          <div className="p-2.5 bg-rose-900/40 rounded-2xl border border-amber-500/20">
            <span className="text-[10px] text-amber-300 block">{lang === 'bn' ? 'মোট পণ্য সংখ্যা' : 'Active Products'}</span>
            <span className="text-base font-bold text-white">{products.length} {lang === 'bn' ? 'টি' : 'items'}</span>
          </div>
          <div className="p-2.5 bg-rose-900/40 rounded-2xl border border-amber-500/20">
            <span className="text-[10px] text-amber-300 block">{lang === 'bn' ? 'একটিভ বুস্টেড প্রডাক্ট' : 'Active Boosted'}</span>
            <span className="text-base font-bold text-amber-400 flex items-center gap-1">
              <Rocket size={14} />
              <span>{boostedProducts.length} {lang === 'bn' ? 'টি প্রমোশন' : 'Campaigns'}</span>
            </span>
          </div>
        </div>

        {/* Tab Selector Navigation */}
        <div className="px-6 pt-3 bg-white border-b border-stone-200 flex gap-2 overflow-x-auto shrink-0 text-xs">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-3 font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'orders'
                ? 'border-rose-900 text-rose-950'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShoppingBag size={15} />
            <span>{lang === 'bn' ? 'অর্ডার প্রসেসিং ও কনফার্ম' : 'Order Confirmations'}</span>
            <span className="px-1.5 py-0.2 bg-rose-100 text-rose-900 rounded-full font-mono text-[10px]">{orders.length}</span>
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
            <span className="text-emerald-800 font-extrabold">{lang === 'bn' ? '+ নতুন প্রডাক্ট যোগ করুন' : '+ Add New Product'}</span>
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
            <span>{lang === 'bn' ? 'প্রডাক্ট বুস্ট ও এড মার্কেটিং' : 'Boost & Sell Marketing'}</span>
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
            <span>{lang === 'bn' ? 'বিক্রয় সামারি' : 'Sales Analytics'}</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="p-6 overflow-y-auto flex-1 bg-stone-100">

          {/* TAB 1: ORDER MANAGEMENT & CONFIRMATIONS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white p-3.5 rounded-2xl border border-stone-200">
                <div className="relative w-full sm:w-72">
                  <Search size={14} className="absolute left-3 top-3 text-stone-400" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder={lang === 'bn' ? 'অর্ডার আইডি, ফোন বা নাম দিয়ে খুঁজুন...' : 'Search order ID, phone or name...'}
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none"
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
                    <option value="shipped">{lang === 'bn' ? 'কুরিয়ারে শিপড (Shipped)' : 'Shipped'}</option>
                    <option value="out_for_delivery">{lang === 'bn' ? 'ডেলিভারি চলছে' : 'Out for Delivery'}</option>
                    <option value="delivered">{lang === 'bn' ? 'ডেলিভার্ড (Delivered)' : 'Delivered'}</option>
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
                <div className="space-y-3">
                  {filteredOrders.map(order => (
                    <div key={order.id} className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-3 hover:border-amber-400 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                        <div>
                          <span className="text-[10px] font-mono bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-bold">
                            {order.id}
                          </span>
                          <h4 className="text-sm font-serif font-bold text-stone-900 mt-1">
                            {order.customerName} — <span className="text-rose-900 font-mono">{order.phone}</span>
                          </h4>
                          <span className="text-[11px] text-stone-500">{order.address}, {order.city}</span>
                        </div>

                        {/* Order Status Badge & Updater */}
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full uppercase ${
                            order.status === 'delivered' ? 'bg-emerald-100 text-emerald-900' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-900' :
                            order.status === 'out_for_delivery' ? 'bg-amber-100 text-amber-900' :
                            'bg-rose-100 text-rose-900'
                          }`}>
                            {order.status === 'processing' && (lang === 'bn' ? 'পেন্ডিং / প্রসেসিং' : 'Pending')}
                            {order.status === 'shipped' && (lang === 'bn' ? 'কুরিয়ারে দেওয়া হয়েছে' : 'Shipped')}
                            {order.status === 'out_for_delivery' && (lang === 'bn' ? 'ডেলিভারি চলছে' : 'Out for Delivery')}
                            {order.status === 'delivered' && (lang === 'bn' ? 'ডেলিভারি সম্পন্ন' : 'Delivered')}
                          </span>

                          <select
                            value={order.status}
                            onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as any)}
                            className="p-1.5 bg-stone-100 border border-stone-300 rounded-xl text-xs font-bold text-stone-800 focus:outline-none cursor-pointer"
                          >
                            <option value="processing">{lang === 'bn' ? 'কনফার্ম করুন (Processing)' : 'Set Processing'}</option>
                            <option value="shipped">{lang === 'bn' ? 'কুরিয়ারে পাঠান (Shipped)' : 'Set Shipped'}</option>
                            <option value="out_for_delivery">{lang === 'bn' ? 'ডেলিভারিতে পাঠান' : 'Set Out for Delivery'}</option>
                            <option value="delivered">{lang === 'bn' ? 'ডেলিভার্ড সম্পন্ন' : 'Set Delivered'}</option>
                          </select>
                        </div>
                      </div>

                      {/* Items list */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <img src={item.product.image} alt={item.product.nameEn} className="w-10 h-10 object-cover rounded-lg shrink-0" referrerPolicy="no-referrer" />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-stone-900 truncate">
                                {lang === 'bn' ? item.product.nameBn : item.product.nameEn}
                              </p>
                              <p className="text-[10px] text-stone-500">
                                {item.quantity}x • {item.selectedSize || 'Standard'} • ৳{item.product.price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Payment & Contact Details */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-700">{lang === 'bn' ? 'পেমেন্ট মাধ্যম:' : 'Payment:'}</span>
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold rounded uppercase text-[10px]">
                            {order.paymentMethod}
                          </span>
                          <span className="text-stone-400">|</span>
                          <span className="font-extrabold text-rose-950 text-sm">৳{order.totalAmount.toLocaleString()}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${order.phone}`}
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center gap-1 transition-colors"
                          >
                            <PhoneCall size={12} />
                            <span>{lang === 'bn' ? 'কাস্টমারকে কল করুন' : 'Call Customer'}</span>
                          </a>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRODUCT INVENTORY LIST */}
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
                    <img src={p.image} alt={p.nameEn} className="w-20 h-24 object-cover rounded-xl shrink-0" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] font-bold text-amber-800 uppercase tracking-wider block">
                          {p.category}
                        </span>
                        <h5 className="font-serif font-bold text-xs text-stone-900 truncate">
                          {lang === 'bn' ? p.nameBn : p.nameEn}
                        </h5>
                        <p className="text-xs font-bold text-rose-950 mt-1">৳{p.price.toLocaleString()}</p>
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

          {/* TAB 3: ADD NEW PRODUCT FORM */}
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
                    <option value="panjabi">{lang === 'bn' ? 'পাঞ্জাবি (Panjabi)' : 'Panjabi'}</option>
                    <option value="jewelry">{lang === 'bn' ? 'গহনা / জুয়েলারি (Jewelry)' : 'Jewelry'}</option>
                    <option value="salwar">{lang === 'bn' ? 'আনোরকলি ও থ্রি-পিস' : 'Salwar Kameez'}</option>
                    <option value="festive">{lang === 'bn' ? 'উৎসব স্পেশাল (Festive)' : 'Festive Collection'}</option>
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
                  <label className="block font-bold text-stone-700 mb-1">{lang === 'bn' ? 'আগের মূল মূল্য (রেগুলার প্রাইজ)' : 'Original Price (for discount tag)'}</label>
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

          {/* TAB 4: PRODUCT BOOSTING & AD MARKETING MANAGER */}
          {activeTab === 'boost' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Boost Banner */}
              <div className="p-6 bg-gradient-to-r from-rose-950 via-amber-950 to-rose-950 text-amber-100 rounded-3xl border border-amber-500/30 shadow-lg space-y-3">
                <div className="flex items-center gap-2">
                  <Rocket size={24} className="text-amber-400 animate-pulse" />
                  <h4 className="text-lg font-serif font-bold text-amber-200">
                    {lang === 'bn' ? 'ফেসবুক ও ইনস্টাগ্রাম এড বুস্ট ম্যানেজার' : 'Facebook & Instagram Ad Boost Manager'}
                  </h4>
                </div>
                <p className="text-xs text-amber-200/80 max-w-xl leading-relaxed">
                  {lang === 'bn' 
                    ? 'আপনার রঙিলা রূপ কালেকশনের সেরা বিক্রিত জামদানি শাড়ি ও পাঞ্জাবি খুব সহজে প্রমোট করুন। বেশি কাস্টমার মেসেজ ও অর্ডার পেতে ১-ক্লিকে বুস্ট ক্যাম্পেইন কনফিগার করুন।' 
                    : 'Boost your best-selling Jamdani Sarees and Silk Panjabis on social media to maximize customer reach and sales orders.'}
                </p>

                {/* Daily Budget Selector */}
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
                  <span className="text-[11px] text-amber-300/80 font-mono">
                    ({lang === 'bn' ? `আনুমানিক পেজ রীচ: ${(boostBudget * 18).toLocaleString()} - ${(boostBudget * 35).toLocaleString()} জন` : `Est. Reach: ${boostBudget * 18} - ${boostBudget * 35} people`})
                  </span>
                </div>
              </div>

              {/* Products Boost List */}
              <div className="space-y-3">
                <h5 className="font-serif font-bold text-stone-900 text-sm">
                  {lang === 'bn' ? 'বুস্ট করার জন্য প্রডাক্ট নির্বাচন করুন:' : 'Select Products to Boost:'}
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.map(p => {
                    const isBoosted = boostedProducts.includes(p.id);
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
                            <span className="text-xs font-bold text-rose-950">৳{p.price.toLocaleString()}</span>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${isBoosted ? 'bg-amber-200 text-amber-900' : 'bg-stone-100 text-stone-500'}`}>
                                {isBoosted ? (lang === 'bn' ? 'ক্যাম্পেইন রানিং 🚀' : 'Active Campaign') : (lang === 'bn' ? 'অফলাইন' : 'Not Boosted')}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleBoost(p.id)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer shrink-0 ${
                            isBoosted
                              ? 'bg-amber-500 text-rose-950 hover:bg-amber-600'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                          }`}
                        >
                          {isBoosted ? (lang === 'bn' ? 'বুস্ট রানিং' : 'Boost Active') : (lang === 'bn' ? '+ বুস্ট করুন' : 'Boost Now')}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ready Social Media Ad Copy Generator */}
              <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-950 font-bold">
                    <Sparkles className="text-amber-500" size={16} />
                    <span>{lang === 'bn' ? 'ফেসবুক পেজ পোস্টের রেডি ক্যাপশন (Auto Ad Copy)' : 'Auto-Generated Facebook Ad Copy'}</span>
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`✨ রঙিলা রূপ - আভিজাত্যের বিশ্বস্ত ঠিকানা ✨\n\nউৎসব ও বিয়ের এই মৌসুমে নিজেকে সাজিয়ে তুলুন ১০০% অরজিনাল ঢাকাই জামদানি ও সিল্কের মোহনীয় সাজে।\n\n🛍️ সারাদেশে ক্যাশ অন ডেলিভারি সুবিধা।\n📞 অর্ডার করতে মেসেজ দিন অথবা কল করুন: +880 1700-000000\n\n#RongilaRup #DhakaiJamdani #EthnicFashion #BangladeshiSaree`);
                      alert(lang === 'bn' ? 'ক্যাপশন কপি করা হয়েছে!' : 'Ad Copy Copied to Clipboard!');
                    }}
                    className="px-3 py-1 bg-rose-950 text-amber-200 rounded-lg hover:bg-rose-900 font-bold"
                  >
                    {lang === 'bn' ? 'কপি করুন' : 'Copy Text'}
                  </button>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl font-sans text-stone-800 whitespace-pre-line leading-relaxed border border-stone-200">
                  {`✨ রঙিলা রূপ - আভিজাত্যের বিশ্বস্ত ঠিকানা ✨

উৎসব ও বিয়ের এই মৌসুমে নিজেকে সাজিয়ে তুলুন ১০০% অরজিনাল ঢাকাই জামদানি ও সিল্কের মোহনীয় সাজে।

🛍️ সারাদেশে ক্যাশ অন ডেলিভারি সুবিধা।
📞 অর্ডার করতে মেসেজ দিন অথবা কল করুন: +880 1700-000000

#RongilaRup #DhakaiJamdani #EthnicFashion #BangladeshiSaree`}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SALES ANALYTICS */}
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
                  <span className="text-stone-500 block font-semibold">{lang === 'bn' ? 'টপ ক্যাটাগরি' : 'Top Category'}</span>
                  <span className="text-xl font-serif font-extrabold text-amber-800">
                    {lang === 'bn' ? 'ঢাকাই জামদানি শাড়ি' : 'Jamdani Saree'}
                  </span>
                </div>
              </div>

              {/* Sales Chart Mock Visualization */}
              <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-4">
                <h4 className="font-serif font-bold text-stone-900 text-sm">
                  {lang === 'bn' ? 'সাপ্তাহিক সেলস ট্রেন্ড (Weekly Revenue Trend)' : 'Weekly Revenue Trend'}
                </h4>

                <div className="h-40 flex items-end justify-between gap-3 pt-6 px-4 bg-stone-50 rounded-2xl border border-stone-100">
                  {[
                    { day: 'শনি', val: 12000 },
                    { day: 'রবি', val: 18500 },
                    { day: 'সোম', val: 14000 },
                    { day: 'মঙ্গল', val: 24000 },
                    { day: 'বুধ', val: 19000 },
                    { day: 'বৃহঃ', val: 32000 },
                    { day: 'শুক্র', val: 45000 }
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-[9px] font-bold text-stone-600">৳{(bar.val/1000).toFixed(0)}k</span>
                      <div 
                        style={{ height: `${(bar.val / 45000) * 100}%` }}
                        className="w-full max-w-[28px] bg-gradient-to-t from-rose-950 to-amber-500 rounded-t-lg transition-all hover:brightness-110"
                      />
                      <span className="text-[10px] text-stone-500 font-bold">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
