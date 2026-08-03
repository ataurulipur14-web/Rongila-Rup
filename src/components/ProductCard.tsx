import React from 'react';
import { Heart, Star, ShoppingBag, Eye, CheckCircle } from 'lucide-react';
import { Product, Language } from '../types';

interface ProductCardProps {
  product: Product;
  lang: Language;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onQuickView: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  lang,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onQuickView
}) => {
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="group bg-rose-950/90 text-amber-50 rounded-2xl overflow-hidden border border-amber-500/30 shadow-lg hover:shadow-2xl hover:border-amber-400/60 transition-all duration-300 flex flex-col h-full relative">
      {/* Product Image Area */}
      <div className="relative aspect-[4/3] sm:aspect-[1/1] overflow-hidden bg-rose-900/40 cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={product.image}
          alt={lang === 'bn' ? product.nameBn : product.nameEn}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discountPercent > 0 && (
            <span className="bg-rose-600 text-white font-bold text-[10px] sm:text-xs px-2 py-0.5 rounded-full shadow-md">
              -{discountPercent}% {lang === 'bn' ? 'ছাড়' : 'OFF'}
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-amber-500 text-rose-950 font-bold text-[10px] sm:text-xs px-2 py-0.5 rounded-full shadow-md">
              ★ {lang === 'bn' ? 'বেস্ট সেলার' : 'Best Seller'}
            </span>
          )}
          {product.isFestiveSpecial && (
            <span className="bg-rose-900 text-amber-300 font-bold text-[10px] sm:text-xs px-2 py-0.5 rounded-full shadow-md border border-amber-400/30">
              {lang === 'bn' ? 'উৎসব কালেকশন' : 'Festive Edition'}
            </span>
          )}
          {(product.isBoosted || product.boostStatus === 'Active') && (
            <span className="bg-gradient-to-r from-amber-500 via-rose-600 to-amber-500 text-rose-950 font-extrabold text-[10px] sm:text-xs px-2 py-0.5 rounded-full shadow-md animate-pulse border border-amber-300">
              🚀 {lang === 'bn' ? 'স্পন্সরড / ট্রেন্ডিং' : 'Sponsored'}
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all z-10 shadow-md ${
            isWishlisted 
              ? 'bg-rose-600 text-white' 
              : 'bg-rose-950/80 text-amber-200 hover:bg-amber-500 hover:text-rose-950 border border-amber-500/30'
          }`}
          aria-label="Wishlist"
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        {/* Hover Quick View Overlay Button */}
        <div className="absolute inset-0 bg-rose-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="px-4 py-2 rounded-full bg-amber-500 text-rose-950 font-extrabold text-xs sm:text-sm shadow-lg hover:bg-amber-400 transition-colors flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
          >
            <Eye size={16} />
            <span>{lang === 'bn' ? 'এক নজরে দেখুন' : 'Quick View'}</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <div className="flex items-center justify-between text-xs mb-1 font-medium">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded text-[11px] font-semibold">
              {lang === 'bn' ? product.fabricBn : product.fabricEn}
            </span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span className="font-bold text-amber-200">{product.rating}</span>
              <span className="text-[10px] text-amber-300/60">({product.reviewsCount})</span>
            </div>
          </div>

          <h3 
            onClick={() => onQuickView(product)}
            className="text-sm sm:text-base font-serif font-bold text-amber-100 line-clamp-2 hover:text-amber-300 transition-colors cursor-pointer leading-snug"
          >
            {lang === 'bn' ? product.nameBn : product.nameEn}
          </h3>
        </div>

        <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between gap-2">
          {/* Price Tag */}
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-bold text-amber-300 font-sans">
                ৳{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-amber-200/50 line-through font-sans">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-0.5">
              <CheckCircle size={10} />
              {lang === 'bn' ? 'স্টকে আছে' : 'In Stock'}
            </span>
            <div className="text-[9px] sm:text-[10px] text-amber-300 bg-amber-950/80 border border-amber-500/30 px-1.5 py-0.5 rounded font-semibold mt-1 inline-flex items-center gap-1">
              <span>🚚 {lang === 'bn' ? 'কুরিয়ার চার্জ ৳৮০/৳১৫০' : 'Courier Fee ৳80/৳150'}</span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => onAddToCart(product)}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-rose-950 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <ShoppingBag size={14} />
            <span className="hidden xs:inline">
              {lang === 'bn' ? 'ব্যাগে যোগ করুন' : 'Add to Bag'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
