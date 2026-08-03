import React, { useState, useEffect, useMemo } from 'react';
import { 
  Language, 
  CategoryId, 
  Product, 
  CartItem, 
  FilterState, 
  Review,
  Order,
  StoreSettings
} from './types';
import { PRODUCTS, INITIAL_REVIEWS } from './data/products';

import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AIStylistWidget } from './components/AIStylistWidget';
import { TrackOrderModal } from './components/TrackOrderModal';
import { AdminPanel } from './components/AdminPanel';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { DiscountSlider } from './components/DiscountSlider';
import { BottomNav } from './components/BottomNav';
import { CustomerProfileModal } from './components/CustomerProfileModal';
import { Footer } from './components/Footer';
import { initMetaPixel, trackPixelEvent } from './utils/pixel';

import { 
  Sparkles, 
  SlidersHorizontal, 
  Search, 
  X, 
  Heart, 
  ShoppingBag,
  Filter,
  RotateCcw
} from 'lucide-react';

export default function App() {
  // Language toggle (Default Bengali)
  const [lang, setLang] = useState<Language>('bn');

  // Store Settings (Announcements, Hero Banner Badges & Promo Coupons)
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('rr_store_settings');
    return saved ? JSON.parse(saved) : {
      announcementBn: 'স্পেশাল অফার: "RONGILA20" কুপনে ২০% ছাড়! সারাদেশে ক্যাশ অন ডেলিভারি',
      announcementEn: 'Special Offer: 20% OFF with "RONGILA20"! Cash on Delivery All Over Bangladesh',
      heroBadgeBn: 'প্রিমিয়াম দেশীয় ফ্যাশন ও এথনিক কালেকশন ২০২৬',
      heroBadgeEn: 'Premium Heritage & Ethnic Boutique Collection 2026',
      discountCouponCode: 'RONGILA20',
      discountPercent: 20
    };
  });

  useEffect(() => {
    localStorage.setItem('rr_store_settings', JSON.stringify(storeSettings));
  }, [storeSettings]);

  // Products state with LocalStorage
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('rr_products');
    return saved ? JSON.parse(saved) : PRODUCTS;
  });

  // Orders state with LocalStorage (Initialized to empty [] as requested by owner)
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('rr_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('rr_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Cart State with LocalStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('rr_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Wishlist State with LocalStorage
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('rr_wishlist');
    return saved ? JSON.parse(saved) : ['rr-saree-001'];
  });

  // Modals & Drawers state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAIStylistOpen, setIsAIStylistOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isDriveOpen, setIsDriveOpen] = useState(false);
  const [isCustomerProfileOpen, setIsCustomerProfileOpen] = useState(false);

  // Checkout Amounts
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [shippingFee, setShippingFee] = useState(80);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceMax, setPriceMax] = useState<number>(30000);
  const [selectedFabric, setSelectedFabric] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  // Save to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem('rr_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('rr_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('rr_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('rr_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    localStorage.setItem('rr_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Initialize Meta (Facebook) Pixel
  useEffect(() => {
    initMetaPixel();
  }, []);

  // Admin Product Handlers
  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    // Reset filters so newly added product is immediately visible on store catalog
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedFabric('all');
    setPriceMax(30000);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  // Admin Order Handlers
  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleUpdateFullOrder = (updatedOrder: Order) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };

  const handleOrderPlaced = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    trackPixelEvent('Purchase', {
      value: newOrder.totalAmount,
      currency: 'BDT',
      order_id: newOrder.id,
      content_name: newOrder.items.map(i => i.product.nameBn || i.product.nameEn).join(', ')
    });
  };

  // Wishlist Toggle
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds(prev => 
      prev.includes(product.id)
        ? prev.filter(id => id !== product.id)
        : [...prev, product.id]
    );
  };

  // Add to Cart
  const handleAddToCart = (product: Product, size?: string) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1, selectedSize: size || item.selectedSize }
            : item
        );
      }
      return [...prev, { product, quantity: 1, selectedSize: size || product.sizes?.[0] }];
    });
    setIsCartOpen(true);
    trackPixelEvent('AddToCart', {
      content_name: product.nameBn || product.nameEn,
      value: product.price,
      currency: 'BDT'
    });
  };

  // Buy Now Trigger
  const handleBuyNow = (product: Product, size?: string) => {
    handleAddToCart(product, size);
    if (quickViewProduct) setQuickViewProduct(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
    trackPixelEvent('InitiateCheckout', {
      content_name: product.nameBn || product.nameEn,
      value: product.price,
      currency: 'BDT'
    });
  };

  // Update Cart Item Quantity
  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems(prev => 
      prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Remove item from Cart
  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  // Add New Customer Review
  const handleAddReview = (newRev: Omit<Review, 'id' | 'date'>) => {
    const rev: Review = {
      ...newRev,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    setReviews(prev => [rev, ...prev]);
  };

  // Filtered Products Calculation
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        if (selectedCategory === 'festive' && !p.isFestiveSpecial) return false;
        if (selectedCategory !== 'festive') return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNameBn = p.nameBn.toLowerCase().includes(q);
        const matchNameEn = p.nameEn.toLowerCase().includes(q);
        const matchFabric = p.fabricBn.toLowerCase().includes(q) || p.fabricEn.toLowerCase().includes(q);
        if (!matchNameBn && !matchNameEn && !matchFabric) return false;
      }

      // Price filter
      if (p.price > priceMax) return false;

      // Fabric filter
      if (selectedFabric !== 'all' && !p.fabricBn.includes(selectedFabric) && !p.fabricEn.includes(selectedFabric)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured default
    });
  }, [products, selectedCategory, searchQuery, priceMax, selectedFabric, sortBy]);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#1c0309] text-amber-50 font-sans flex flex-col selection:bg-amber-500 selection:text-rose-950">
      
      {/* Navbar */}
      <Navbar
        lang={lang}
        onLanguageToggle={() => setLang(l => l === 'bn' ? 'en' : 'bn')}
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAIStylist={() => setIsAIStylistOpen(true)}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenDrive={() => setIsDriveOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
        announcementBn={storeSettings.announcementBn}
        announcementEn={storeSettings.announcementEn}
      />

      {/* Hero Banner Showcase */}
      <HeroBanner
        lang={lang}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onOpenAIStylist={() => setIsAIStylistOpen(true)}
        heroBadgeBn={storeSettings.heroBadgeBn}
        heroBadgeEn={storeSettings.heroBadgeEn}
      />

      {/* Main Content Catalog Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6 pb-24">
        
        {/* 1. DISCOUNT PRODUCTS SLIDER (Catagories er upore discount product show korbe aktar por akta) */}
        <DiscountSlider
          products={products}
          lang={lang}
          onAddToCart={handleAddToCart}
          onQuickView={(prod) => setQuickViewProduct(prod)}
        />

        {/* 2. SEARCH BAR & CATEGORY SYSTEM (ডিসকাউন্ট স্লাইডারের নিচে সার্চ বার, তার নিচে ক্যাটাগরি) */}
        <div className="bg-rose-950/80 rounded-3xl p-4 sm:p-5 border border-amber-500/30 shadow-xl space-y-4 backdrop-blur-md">
          
          {/* SEARCH BAR (তার নিচে সার্চ বার) */}
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-3 text-amber-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'bn' ? 'পছন্দের শাড়ি, থ্রি-পিস, ফেব্রিক বা রঙ লিখে সার্চ করুন...' : 'Search sarees, salwar, panjabi, fabric...'}
                className="w-full pl-10 pr-10 py-2.5 bg-rose-900/50 border border-amber-500/30 rounded-2xl text-xs font-semibold text-amber-100 placeholder-amber-200/50 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-amber-300/60 hover:text-amber-200"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
              <div className="flex items-center gap-2 bg-rose-900/50 border border-amber-500/30 px-3 py-2 rounded-2xl text-xs w-full md:w-auto text-amber-200">
                <Filter size={14} className="text-amber-400" />
                <span className="font-bold text-amber-300">{lang === 'bn' ? 'সাজান:' : 'Sort:'}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent font-bold text-amber-200 focus:outline-none cursor-pointer text-xs [&>option]:bg-rose-950 [&>option]:text-amber-200"
                >
                  <option value="featured">{lang === 'bn' ? 'জনপ্রিয় (Featured)' : 'Featured'}</option>
                  <option value="price-low">{lang === 'bn' ? 'কম মূল্য থেকে বেশি' : 'Price: Low to High'}</option>
                  <option value="price-high">{lang === 'bn' ? 'বেশি মূল্য থেকে কম' : 'Price: High to Low'}</option>
                  <option value="rating">{lang === 'bn' ? 'সর্বোচ্চ রেটিং' : 'Top Rated'}</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setPriceMax(30000);
                  setSelectedFabric('all');
                  setSortBy('featured');
                }}
                className="p-2.5 rounded-2xl border border-amber-500/30 bg-rose-900/50 hover:bg-rose-900 text-amber-200 font-bold transition-colors cursor-pointer shrink-0"
                title="Reset Filters"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          {/* CATEGORY TABS (সার্চ বারের নিচে ক্যাটাগরিগুলো) */}
          <div className="pt-3 border-t border-amber-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-serif font-extrabold text-amber-100 flex items-center gap-2">
                <span>{lang === 'bn' ? 'পণ্যের ক্যাটাগরি নির্বাচন করুন' : 'Explore Collections by Category'}</span>
              </h3>
              <span className="text-xs text-amber-300/80 font-semibold">
                {lang === 'bn' ? `${filteredProducts.length} টি পণ্য পাওয়া গেছে` : `${filteredProducts.length} items`}
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'all', bn: 'সকল পণ্য', en: 'All Items', icon: '✨' },
                { id: 'saree', bn: 'শাড়ি কালেকশন', en: 'Sarees', icon: '🥻' },
                { id: 'salwar', bn: 'স্যালোয়ার কামিজ', en: 'Salwar Kameez', icon: '👗' },
                { id: 'panjabi', bn: 'পাঞ্জাবি ও কুর্তা', en: 'Panjabi', icon: '👔' },
                { id: 'jewelry', bn: 'ঐতিহ্যবাহী অলংকার', en: 'Jewelry', icon: '👑' },
                { id: 'festive', bn: 'উৎসব কালেকশন', en: 'Festive', icon: '🎉' },
                { id: 'threepiece', bn: 'থ্রি-পিস ও আনোরকলি', en: 'Three Piece', icon: '✨' },
                { id: 'lehenga', bn: 'লেহেঙ্গা', en: 'Lehenga', icon: '💃' },
                { id: 'kids', bn: 'কিডস কালেকশন', en: 'Kids Wear', icon: '🧸' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as CategoryId)}
                  className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-rose-950 font-extrabold shadow-md ring-2 ring-amber-300'
                      : 'bg-rose-900/40 text-amber-200 border border-amber-500/30 hover:bg-rose-800/60'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{lang === 'bn' ? cat.bn : cat.en}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. PRODUCT GRID (4ta kore product dekha jabe) */}
        {filteredProducts.length === 0 ? (
          <div className="bg-rose-950/80 rounded-3xl p-12 text-center space-y-4 border border-amber-500/30 text-amber-100">
            <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto">
              <Search size={28} />
            </div>
            <h3 className="text-lg font-serif font-bold text-amber-100">
              {lang === 'bn' ? 'কোনো পণ্য পাওয়া যায়নি!' : 'No matching products found!'}
            </h3>
            <p className="text-xs text-amber-300/70 max-w-md mx-auto">
              {lang === 'bn' 
                ? 'আপনার সার্চ ফিল্টার বা বাজেট পরিবর্তন করে আবার চেষ্টা করুন।' 
                : 'Try adjusting your search criteria, price range, or category filter.'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setPriceMax(30000);
                setSelectedFabric('all');
              }}
              className="px-6 py-2.5 rounded-full bg-rose-950 text-amber-100 font-bold text-xs hover:bg-rose-900"
            >
              {lang === 'bn' ? 'সকল পণ্য দেখুন' : 'Show All Products'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                lang={lang}
                isWishlisted={wishlistIds.includes(p.id)}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={(prod) => handleAddToCart(prod)}
                onQuickView={(prod) => setQuickViewProduct(prod)}
              />
            ))}
          </div>
        )}

      </main>

      {/* Wishlist Drawer Modal */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-stone-50 h-full shadow-2xl flex flex-col justify-between border-l border-amber-500/20">
            <div className="px-6 py-4 bg-rose-950 text-amber-50 flex items-center justify-between border-b border-amber-500/20">
              <div className="flex items-center gap-2">
                <Heart className="text-rose-500 fill-rose-500" size={20} />
                <h3 className="text-lg font-serif font-bold text-amber-100">
                  {lang === 'bn' ? 'পছন্দের তালিকা (উইশলিস্ট)' : 'Your Saved Wishlist'}
                </h3>
              </div>
              <button onClick={() => setIsWishlistOpen(false)} className="p-1 rounded-full text-amber-200 hover:bg-rose-900">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {wishlistIds.length === 0 ? (
                <p className="text-center text-xs text-stone-500 italic py-12">
                  {lang === 'bn' ? 'উইশলিস্টে কোনো পণ্য নেই' : 'No items saved in wishlist'}
                </p>
              ) : (
                products.filter(p => wishlistIds.includes(p.id)).map(item => (
                  <div key={item.id} className="p-3 bg-white rounded-2xl border border-stone-200 flex items-center gap-3">
                    <img src={item.image} alt={item.nameEn} className="w-14 h-16 object-cover rounded-xl shrink-0" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-serif font-bold text-stone-900 truncate">
                        {lang === 'bn' ? item.nameBn : item.nameEn}
                      </h4>
                      <span className="text-xs font-bold text-rose-900">৳{item.price.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="p-2 bg-rose-950 text-amber-200 rounded-xl hover:bg-rose-900 text-xs font-bold"
                    >
                      <ShoppingBag size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Product Quick View Detail Modal */}
      <ProductDetailModal
        product={quickViewProduct}
        lang={lang}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false}
        reviews={reviews}
        onAddReview={handleAddReview}
        onBuyNow={handleBuyNow}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        lang={lang}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={(disc, ship) => {
          setAppliedDiscount(disc);
          setShippingFee(ship);
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        lang={lang}
        cartItems={cartItems}
        discountAmount={appliedDiscount}
        shippingFee={shippingFee}
        onClearCart={() => setCartItems([])}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Admin Panel Modal */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        lang={lang}
        products={products}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onUpdateFullOrder={handleUpdateFullOrder}
        onOpenDrive={() => setIsDriveOpen(true)}
        storeSettings={storeSettings}
        onUpdateStoreSettings={setStoreSettings}
      />

      {/* Google Drive Workspace Modal */}
      <GoogleDriveModal
        isOpen={isDriveOpen}
        onClose={() => setIsDriveOpen(false)}
        lang={lang}
        products={products}
        orders={orders}
      />

      {/* WhatsApp Quick Direct Order Floating Button */}
      <a
        href="https://wa.me/8801792765693?text=%E0%A6%86%E0%A6%B8%E0%A7%8D%E0%A6%B8%E0%A6%BE%E0%A6%B2%E0%A6%BE%E0%A6%AE%E0%A7%81%20%E0%A6%86%E0%A6%B2%E0%A6%BE%E0%A6%AF%E0%A6%BC%E0%A6%95%E0%A6%BF%E0%A6%AE%20%E0%A6%86%E0%A6%AE%E0%A6%BF%20%E0%A6%B0%E0%A6%99%E0%A6%BF%E0%A6%B2%E0%A6%BE%20%E0%A6%B0%E0%A7%82%E0%A6%AA%20%E0%A6%93%E0%A6%AF%E0%A6%BC%E0%A7%87%E0%A6%AC%E0%A6%B8%E0%A6%BE%E0%A6%84%E0%A6%9F%20%E0%A6%A5%E0%A7%87%E0%A6%95%E0%A7%87%20%E0%A6%AA%E0%A7%8D%E0%A6%B0%E0%A7%8B%E0%A6%A1%E0%A6%BE%E0%A6%95%E0%A7%8D%E0%A6%9F%20%E0%A6%85%E0%A6%B0%E0%A7%8D%E0%A6%A1%E0%A6%BE%E0%A6%B0%20%E0%A6%95%E0%A6%B0%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%84%E0%A6%BF"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 left-4 z-40 px-3.5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-300 transition-transform hover:scale-105 cursor-pointer"
        title="WhatsApp Direct Order Support"
      >
        <span className="w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping shrink-0" />
        <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপে সরাসরি অর্ডার' : 'WhatsApp Order'}</span>
      </a>

      {/* Floating AI Stylist Button at bottom right */}
      <button
        onClick={() => setIsAIStylistOpen(true)}
        className="fixed bottom-20 right-4 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 via-rose-600 to-amber-500 text-rose-950 font-extrabold text-xs sm:text-sm shadow-2xl hover:scale-105 transition-all flex items-center gap-2 border-2 border-amber-300 animate-bounce cursor-pointer"
      >
        <Sparkles size={18} className="text-rose-950" />
        <span>{lang === 'bn' ? 'রঙিলা রূপ AI স্টাইলিস্ট' : 'Rongila Rup AI Stylist'}</span>
      </button>

      {/* AI Stylist Drawer */}
      <AIStylistWidget
        isOpen={isAIStylistOpen}
        onClose={() => setIsAIStylistOpen(false)}
        lang={lang}
        products={products}
        onQuickViewProduct={(prod) => {
          setIsAIStylistOpen(false);
          setQuickViewProduct(prod);
        }}
      />

      {/* Order Tracking Modal */}
      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
        lang={lang}
      />

      {/* Customer Profile & Sign In Modal */}
      <CustomerProfileModal
        isOpen={isCustomerProfileOpen}
        onClose={() => setIsCustomerProfileOpen(false)}
        lang={lang}
        orders={orders}
      />

      {/* Footer */}
      <Footer
        lang={lang}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        onOpenAIStylist={() => setIsAIStylistOpen(true)}
      />

      {/* Bottom Sticky Navigation Bar (Home, Cart, Profile) */}
      <BottomNav
        lang={lang}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onGoHome={() => {
          setSelectedCategory('all');
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenProfile={() => setIsCustomerProfileOpen(true)}
      />

    </div>
  );
}
