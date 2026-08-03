import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Sparkles, 
  Truck, 
  Globe, 
  Menu, 
  X,
  PhoneCall,
  SlidersHorizontal,
  Lock,
  HardDrive
} from 'lucide-react';
import { Language, CategoryId } from '../types';

interface NavbarProps {
  lang: Language;
  onLanguageToggle: () => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAIStylist: () => void;
  onOpenTrackOrder: () => void;
  onOpenAdmin: () => void;
  onOpenDrive: () => void;
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onToggleFilterDrawer?: () => void;
  announcementBn?: string;
  announcementEn?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onLanguageToggle,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAIStylist,
  onOpenTrackOrder,
  onOpenAdmin,
  onOpenDrive,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onToggleFilterDrawer,
  announcementBn,
  announcementEn
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories: { id: CategoryId; bn: string; en: string }[] = [
    { id: 'all', bn: 'সকল পণ্য', en: 'All Items' },
    { id: 'saree', bn: 'শাড়ি কালেকশন', en: 'Sarees' },
    { id: 'salwar', bn: 'স্যালোয়ার কামিজ', en: 'Salwar Kameez' },
    { id: 'panjabi', bn: 'পাঞ্জাবি ও কুর্তা', en: 'Panjabi & Kurta' },
    { id: 'jewelry', bn: 'ঐতিহ্যবাহী অলংকার', en: 'Jewelry' },
    { id: 'festive', bn: 'উৎসব কালেকশন', en: 'Festive Specials' },
    { id: 'threepiece', bn: 'থ্রি-পিস ও আনোরকলি', en: 'Three Piece' },
    { id: 'lehenga', bn: 'লেহেঙ্গা', en: 'Lehenga' },
    { id: 'kids', bn: 'কিডস কালেকশন', en: 'Kids Wear' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-rose-950/95 backdrop-blur-md text-amber-50 border-b border-amber-500/20 shadow-lg">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-amber-700 via-rose-900 to-amber-700 text-amber-100 text-xs py-1.5 px-4 text-center font-medium tracking-wide flex justify-between items-center max-w-7xl mx-auto">
        <div className="hidden md:flex items-center gap-2">
          <PhoneCall size={12} className="text-amber-300" />
          <span>{lang === 'bn' ? 'হটলাইন: ০১৭৯২৭৬৫৬৯৩ (সকাল ৯টা - রাত ১০টা)' : 'Hotline: +880 01792765693 (9am - 10pm)'}</span>
        </div>
        <div className="mx-auto md:mx-0 font-semibold flex items-center gap-1.5">
          <span className="bg-amber-500 text-rose-950 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">
            {lang === 'bn' ? 'অফার' : 'OFFER'}
          </span>
          <span>
            {lang === 'bn' 
              ? (announcementBn || 'স্পেশাল অফার: "RONGILA20" কুপনে ২০% ছাড়! সারাদেশে ক্যাশ অন ডেলিভারি') 
              : (announcementEn || 'Special Offer: 20% OFF with "RONGILA20"! Cash on Delivery All Over Bangladesh')}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={onOpenTrackOrder}
            className="hover:text-amber-300 transition-colors flex items-center gap-1 text-xs cursor-pointer"
          >
            <Truck size={12} />
            <span>{lang === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track Order'}</span>
          </button>
          <span className="text-amber-500/40">|</span>
          <button 
            onClick={onOpenDrive}
            className="hover:text-amber-300 transition-colors flex items-center gap-1 text-xs cursor-pointer text-amber-300 font-bold"
          >
            <HardDrive size={12} />
            <span>{lang === 'bn' ? 'গুগল ড্রাইভ' : 'Google Drive'}</span>
          </button>
          <span className="text-amber-500/40">|</span>
          <button 
            onClick={onOpenAdmin}
            className="px-2 py-0.5 rounded bg-amber-500 text-rose-950 font-extrabold text-[11px] hover:bg-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Lock size={11} />
            <span>{lang === 'bn' ? 'এডমিন প্যানেল' : 'Admin Panel'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-amber-200 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <a href="#" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 p-0.5 shadow-md group-hover:scale-105 transition-transform shrink-0">
              <div className="w-full h-full bg-rose-950 rounded-full flex items-center justify-center border border-amber-300/40 flex items-center justify-center">
                <span className="text-xl font-serif font-bold text-amber-400">র</span>
              </div>
            </div>
            <div className="flex flex-col shrink-0">
              <span className="text-2xl font-serif font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent whitespace-nowrap">
                {lang === 'bn' ? 'রঙিলা রূপ' : 'Rongila Rup'}
              </span>
              <span className="text-[10px] tracking-widest text-amber-300/80 uppercase font-sans -mt-1 whitespace-nowrap">
                {lang === 'bn' ? 'ঐতিহ্যবাহী বুটিক কালেকশন' : 'Heritage Ethnic Boutique'}
              </span>
            </div>
          </a>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              lang === 'bn' 
                ? 'জামদানি, তাঁত শাড়ি, রেশমি পাঞ্জাবি বা গহনা খুঁজুন...' 
                : 'Search Jamdani, Tant Saree, Silk Panjabi or Jewelry...'
            }
            className="w-full pl-10 pr-4 py-2 bg-rose-900/60 border border-amber-500/30 rounded-full text-amber-100 placeholder-amber-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent shadow-inner"
          />
          <Search size={18} className="absolute left-3.5 top-2.5 text-amber-300/70" />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-2.5 text-amber-300/70 hover:text-amber-100 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Stylist Button */}
          <button
            onClick={onOpenAIStylist}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 text-rose-950 font-semibold text-xs sm:text-sm hover:opacity-90 transition-all shadow-md hover:shadow-amber-500/20 active:scale-95 cursor-pointer"
          >
            <Sparkles size={16} className="animate-pulse text-rose-950" />
            <span className="hidden sm:inline">
              {lang === 'bn' ? 'AI স্টাইলিস্ট' : 'AI Stylist'}
            </span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={onLanguageToggle}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-rose-900/80 border border-amber-500/30 text-amber-200 hover:text-white text-xs font-medium transition-colors cursor-pointer"
            title="Switch Language"
          >
            <Globe size={14} className="text-amber-400" />
            <span>{lang === 'bn' ? 'EN' : 'বাংলা'}</span>
          </button>

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2 rounded-full hover:bg-rose-900/80 text-amber-200 hover:text-amber-100 transition-colors cursor-pointer"
            aria-label="Wishlist"
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-rose-950 font-bold text-sm transition-colors shadow-md cursor-pointer"
            aria-label="Cart"
          >
            <ShoppingBag size={18} />
            <span>{cartCount}</span>
          </button>
        </div>
      </div>

      {/* Categories Desktop Bar */}
      <div className="hidden lg:block border-t border-amber-500/10 bg-rose-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <nav className="flex space-x-1 py-1 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500/20 text-amber-300 font-bold border-b-2 border-amber-400'
                    : 'text-amber-100/80 hover:text-amber-200 hover:bg-rose-900/50'
                }`}
              >
                {lang === 'bn' ? cat.bn : cat.en}
              </button>
            ))}
          </nav>

          <button
            onClick={onOpenTrackOrder}
            className="text-xs font-medium text-amber-300/80 hover:text-amber-200 flex items-center gap-1"
          >
            <Truck size={14} />
            <span>{lang === 'bn' ? 'অর্ডার ট্র্যাকিং' : 'Track Order'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-amber-500/20 bg-rose-950 px-4 pt-3 pb-6 space-y-3">
          {/* Mobile Search */}
          <div className="relative mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={lang === 'bn' ? 'পণ্য খুঁজুন...' : 'Search items...'}
              className="w-full pl-10 pr-4 py-2 bg-rose-900/80 border border-amber-500/30 rounded-lg text-amber-100 text-sm focus:outline-none"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-amber-300/70" />
          </div>

          <div className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-rose-950 font-bold'
                    : 'text-amber-100 hover:bg-rose-900/50'
                }`}
              >
                {lang === 'bn' ? cat.bn : cat.en}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-amber-500/20 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenTrackOrder();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-md text-sm text-amber-200 hover:bg-rose-900/50 flex items-center gap-2"
            >
              <Truck size={16} />
              <span>{lang === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track Order'}</span>
            </button>
            <button
              onClick={() => {
                onOpenDrive();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-md text-sm text-amber-300 hover:bg-rose-900/50 flex items-center gap-2"
            >
              <HardDrive size={16} />
              <span>{lang === 'bn' ? 'গুগল ড্রাইভ ব্যাকআপ' : 'Google Drive Backups'}</span>
            </button>
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-md text-sm text-amber-300 font-bold hover:bg-rose-900/50 flex items-center gap-2 bg-amber-500/20 border border-amber-500/30"
            >
              <Lock size={16} />
              <span>{lang === 'bn' ? 'এডমিন কন্ট্রোল প্যানেল' : 'Admin Control Panel'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
