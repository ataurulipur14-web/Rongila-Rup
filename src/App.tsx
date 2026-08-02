import React, { useState, useEffect, useMemo } from 'react';
import { 
  Language, 
  CategoryId, 
  Product, 
  CartItem, 
  FilterState, 
  Review,
  Order
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
import { Footer } from './components/Footer';

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

  // Products state with LocalStorage
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('rr_products');
    return saved ? JSON.parse(saved) : PRODUCTS;
  });

  // Orders state with LocalStorage
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('rr_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: 'RR-849201',
        items: [{ product: PRODUCTS[0], quantity: 1, selectedSize: 'Free Size' }],
        totalAmount: 6580,
        shippingFee: 80,
        discount: 0,
        customerName: 'নুসরাত জাহান',
        phone: '01711-223344',
        address: 'ধানমন্ডি ২৭, রোড ৮, বাসা ৪২',
        city: 'Dhaka',
        paymentMethod: 'bkash',
        status: 'processing',
        createdAt: 'অগাস্ট ২, ২০২৬'
      },
      {
        id: 'RR-710492',
        items: [{ product: PRODUCTS[1], quantity: 1, selectedSize: 'L (42)' }],
        totalAmount: 4280,
        shippingFee: 80,
        discount: 0,
        customerName: 'আরিফুল ইসলাম',
        phone: '01819-887766',
        address: 'জিইসি মোড়, সিডিএ আ/এ',
        city: 'Chittagong',
        paymentMethod: 'cod',
        status: 'shipped',
        createdAt: 'অগাস্ট ১, ২০২৬'
      }
    ];
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

  // Checkout Amounts
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [shippingFee, setShippingFee] = useState(80);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceMax, setPriceMax] = useState<number>(15000);
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

  // Admin Product Handlers
  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
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

  const handleOrderPlaced = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
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
  };

  // Buy Now Trigger
  const handleBuyNow = (product: Product, size?: string) => {
    handleAddToCart(product, size);
    if (quickViewProduct) setQuickViewProduct(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
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
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans flex flex-col selection:bg-amber-500 selection:text-rose-950">
      
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
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
      />

      {/* Hero Banner Showcase */}
      <HeroBanner
        lang={lang}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onOpenAIStylist={() => setIsAIStylistOpen(true)}
      />

      {/* Main Content Catalog Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        
        {/* Category & Filter Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-rose-950">
                {selectedCategory === 'all' && (lang === 'bn' ? 'সকল এক্সক্লুসিভ কালেকশন' : 'All Heritage Collections')}
                {selectedCategory === 'saree' && (lang === 'bn' ? 'ঢাকাই জামদানি ও সিল্ক শাড়ি' : 'Jamdani & Silk Sarees')}
                {selectedCategory === 'panjabi' && (lang === 'bn' ? 'ডিজাইনার রেশম পাঞ্জাবি' : 'Designer Silk Panjabi')}
                {selectedCategory === 'jewelry' && (lang === 'bn' ? 'ঐতিহ্যবাহী অলংকার' : 'Traditional Jewelry')}
                {selectedCategory === 'festive' && (lang === 'bn' ? 'উৎসব ও পুজো স্পেশাল' : 'Festive & Boishakh Specials')}
                {selectedCategory === 'salwar' && (lang === 'bn' ? 'আনোরকলি ও থ্রি-পিস' : 'Salwar Kameez & Gowns')}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                {lang === 'bn' 
                  ? `মোট ${filteredProducts.length} টি পণ্য পাওয়া গেছে` 
                  : `Showing ${filteredProducts.length} products`}
              </p>
            </div>

            {/* Sort & Quick Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl text-xs">
                <Filter size={14} className="text-amber-700" />
                <span className="font-bold text-stone-700">{lang === 'bn' ? 'সাজান:' : 'Sort By:'}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent font-semibold text-rose-950 focus:outline-none cursor-pointer"
                >
                  <option value="featured">{lang === 'bn' ? 'জনপ্রিয় (Featured)' : 'Featured'}</option>
                  <option value="price-low">{lang === 'bn' ? 'কম মূল্য থেকে বেশি' : 'Price: Low to High'}</option>
                  <option value="price-high">{lang === 'bn' ? 'বেশি মূল্য থেকে কম' : 'Price: High to Low'}</option>
                  <option value="rating">{lang === 'bn' ? 'সর্বোচ্চ রেটিং' : 'Top Rated'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Detailed Filters row: Price Max Slider & Fabric */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1">
            {/* Price slider */}
            <div className="space-y-1">
              <div className="flex justify-between font-semibold text-stone-700">
                <span>{lang === 'bn' ? 'সর্বোচ্চ বাজেট:' : 'Max Price Budget:'}</span>
                <span className="font-bold text-rose-900">৳{priceMax.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="20000"
                step="500"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-rose-900 cursor-pointer"
              />
            </div>

            {/* Fabric Selector */}
            <div className="space-y-1">
              <span className="font-semibold text-stone-700 block">{lang === 'bn' ? 'ফেব্রিক ধরন:' : 'Fabric Type:'}</span>
              <select
                value={selectedFabric}
                onChange={(e) => setSelectedFabric(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none"
              >
                <option value="all">{lang === 'bn' ? 'সকল ফেব্রিক' : 'All Fabrics'}</option>
                <option value="জামদানি">{lang === 'bn' ? 'ঢাকাই জামদানি (Jamdani)' : 'Jamdani'}</option>
                <option value="সিল্ক">{lang === 'bn' ? 'রেশম সিল্ক (Silk)' : 'Silk'}</option>
                <option value="সুতি">{lang === 'bn' ? 'টাঙ্গাইল সুতি (Cotton)' : 'Cotton'}</option>
                <option value="ব্রাস">{lang === 'bn' ? 'গোল্ডেন জুয়েলারি (Jewelry)' : 'Gold Plated'}</option>
              </select>
            </div>

            {/* Reset Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setPriceMax(20000);
                  setSelectedFabric('all');
                  setSortBy('featured');
                }}
                className="w-full py-2 px-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>{lang === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-stone-200">
            <div className="w-16 h-16 bg-rose-100 text-rose-900 rounded-full flex items-center justify-center mx-auto">
              <Search size={28} />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900">
              {lang === 'bn' ? 'কোনো পণ্য পাওয়া যায়নি!' : 'No matching products found!'}
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              {lang === 'bn' 
                ? 'আপনার সার্চ ফিল্টার বা বাজেট পরিবর্তন করে আবার চেষ্টা করুন।' 
                : 'Try adjusting your search criteria, price range, or category filter.'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setPriceMax(20000);
                setSelectedFabric('all');
              }}
              className="px-6 py-2.5 rounded-full bg-rose-950 text-amber-100 font-bold text-xs hover:bg-rose-900"
            >
              {lang === 'bn' ? 'সকল পণ্য দেখুন' : 'Show All Products'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
      />

      {/* Floating AI Stylist Button at bottom right */}
      <button
        onClick={() => setIsAIStylistOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 via-rose-600 to-amber-500 text-rose-950 font-extrabold text-xs sm:text-sm shadow-2xl hover:scale-105 transition-all flex items-center gap-2 border-2 border-amber-300 animate-bounce cursor-pointer"
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

      {/* Footer */}
      <Footer
        lang={lang}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        onOpenAIStylist={() => setIsAIStylistOpen(true)}
      />

    </div>
  );
}
