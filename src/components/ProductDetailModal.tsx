import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShoppingBag, 
  Heart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  Share2,
  MessageSquarePlus,
  ThumbsUp
} from 'lucide-react';
import { Product, Language, Review } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  lang: Language;
  onClose: () => void;
  onAddToCart: (p: Product, size?: string) => void;
  onToggleWishlist: (p: Product) => void;
  isWishlisted: boolean;
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void;
  onBuyNow: (p: Product, size?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  lang,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  reviews,
  onAddReview,
  onBuyNow
}) => {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState<string>(product.image || '');
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : ''
  );
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  // Sync state when product prop changes
  React.useEffect(() => {
    if (product) {
      setSelectedImage(product.image || '');
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : '');
    }
  }, [product]);

  // Review Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const productReviews = reviews.filter(r => r.productId === product.id);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    onAddReview({
      productId: product.id,
      userName: reviewName,
      rating: reviewRating,
      commentBn: reviewComment,
      commentEn: reviewComment,
      verifiedPurchase: true
    });

    setReviewName('');
    setReviewComment('');
    setShowReviewForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-stone-50 rounded-3xl shadow-2xl overflow-hidden border border-amber-500/20 my-auto max-h-[92vh] flex flex-col">
        
        {/* Header bar with close button */}
        <div className="flex items-center justify-between px-6 py-4 bg-rose-950 text-amber-50 border-b border-amber-500/20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-amber-500 text-rose-950 px-2.5 py-0.5 rounded-full uppercase">
              {lang === 'bn' ? product.fabricBn : product.fabricEn}
            </span>
            <span className="text-xs text-amber-200/80">ID: {product.id}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-rose-900 text-amber-200 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left: Image Gallery */}
          <div className="md:col-span-6 space-y-4">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-md">
              <img
                src={selectedImage}
                alt={lang === 'bn' ? product.nameBn : product.nameEn}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail list */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === imgUrl ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}

            {/* Service Highlights */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-amber-950">
              <div className="flex items-center gap-2">
                <Truck className="text-amber-700 shrink-0" size={18} />
                <span>{lang === 'bn' ? 'ক্যাশ অন ডেলিভারি (কুরিয়ার চার্জ ৳৮০/৳১৫০)' : 'Cash on Delivery (Shipping ৳80/৳150)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-amber-700 shrink-0" size={18} />
                <span>{lang === 'bn' ? '১০০% অরিজিনাল গ্যারান্টি' : '100% Authentic Product'}</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="text-amber-700 shrink-0" size={18} />
                <span>{lang === 'bn' ? '৭ দিনের সহজ পরিবর্তন' : '7-Day Easy Exchange'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="text-amber-700 shrink-0" size={18} />
                <span>{lang === 'bn' ? 'অর্ডারের পর কাস্টমার সাপোর্ট' : 'Dedicated Support'}</span>
              </div>
            </div>
          </div>

          {/* Right: Product Specs & Actions */}
          <div className="md:col-span-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-serif font-extrabold text-stone-900 leading-snug">
                  {lang === 'bn' ? product.nameBn : product.nameEn}
                </h2>

                {/* Rating & Reviews counter */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-stone-700">{product.rating}</span>
                  <span className="text-xs text-stone-400">({productReviews.length} {lang === 'bn' ? 'টি রিভিউ' : 'reviews'})</span>
                </div>
              </div>

              {/* Price Display */}
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-rose-950 font-sans">
                      ৳{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-stone-400 line-through font-sans">
                        ৳{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {lang === 'bn' ? 'সকল ট্যাক্স অন্তর্ভুক্ত (ভ্যাট সহ)' : 'Inclusive of all local taxes'}
                  </p>
                </div>

                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                  {lang === 'bn' ? 'স্টকে উপলব্ধ' : 'In Stock'}
                </span>
              </div>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                    {lang === 'bn' ? 'সাইজ নির্বাচন করুন:' : 'Select Size:'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedSize === sz
                            ? 'bg-rose-900 text-amber-100 shadow-md ring-2 ring-rose-900/30'
                            : 'bg-white border border-stone-200 text-stone-700 hover:border-rose-300'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tabs: Details vs Reviews */}
              <div className="border-b border-stone-200 flex gap-6">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-2 text-sm font-bold transition-colors border-b-2 cursor-pointer ${
                    activeTab === 'details' ? 'border-rose-900 text-rose-950' : 'border-transparent text-stone-400 hover:text-stone-700'
                  }`}
                >
                  {lang === 'bn' ? 'বিবরণ ও বিবরণী' : 'Description & Care'}
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2 text-sm font-bold transition-colors border-b-2 cursor-pointer ${
                    activeTab === 'reviews' ? 'border-rose-900 text-rose-950' : 'border-transparent text-stone-400 hover:text-stone-700'
                  }`}
                >
                  {lang === 'bn' ? `রিভিউ (${productReviews.length})` : `Reviews (${productReviews.length})`}
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'details' ? (
                <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
                  <p>{lang === 'bn' ? (product.descriptionBn || '') : (product.descriptionEn || '')}</p>
                  {((lang === 'bn' ? product.detailsBn : product.detailsEn) || []).length > 0 && (
                    <ul className="space-y-1.5 pt-2 list-disc list-inside text-stone-600">
                      {((lang === 'bn' ? product.detailsBn : product.detailsEn) || []).map((dt, i) => (
                        <li key={i}>{dt}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800">
                      {lang === 'bn' ? 'ক্রেতাদের মতামত' : 'Customer Feedback'}
                    </span>
                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="text-xs font-semibold text-rose-800 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <MessageSquarePlus size={14} />
                      <span>{lang === 'bn' ? 'রিভিউ দিন' : 'Write Review'}</span>
                    </button>
                  </div>

                  {showReviewForm && (
                    <form onSubmit={handleSubmitReview} className="p-3 bg-stone-100 rounded-xl space-y-2 border border-stone-200">
                      <input
                        type="text"
                        placeholder={lang === 'bn' ? 'আপনার নাম' : 'Your Name'}
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        required
                        className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                      />
                      <div className="flex items-center gap-2 text-xs">
                        <span>{lang === 'bn' ? 'রেটিং:' : 'Rating:'}</span>
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(Number(e.target.value))}
                          className="text-xs p-1 rounded border border-stone-300 bg-white font-bold text-amber-600"
                        >
                          <option value={5}>★★★★★ (5)</option>
                          <option value={4}>★★★★☆ (4)</option>
                          <option value={3}>★★★☆☆ (3)</option>
                        </select>
                      </div>
                      <textarea
                        placeholder={lang === 'bn' ? 'আপনার অভিজ্ঞতা লিখুন...' : 'Write your experience...'}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        required
                        rows={2}
                        className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-lg bg-rose-900 text-amber-100 font-bold text-xs hover:bg-rose-800"
                      >
                        {lang === 'bn' ? 'সাবমিট করুন' : 'Submit Review'}
                      </button>
                    </form>
                  )}

                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {productReviews.length === 0 ? (
                      <p className="text-xs text-stone-400 italic">
                        {lang === 'bn' ? 'এখনো কোনো রিভিউ দেওয়া হয়নি। প্রথম রিভিউ দিন!' : 'No reviews yet. Be the first to review!'}
                      </p>
                    ) : (
                      productReviews.map((rev) => (
                        <div key={rev.id} className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-stone-800">{rev.userName}</span>
                            <span className="text-[10px] text-stone-400">{rev.date}</span>
                          </div>
                          <div className="flex items-center text-amber-400 text-xs">
                            {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                          </div>
                          <p className="text-xs text-stone-600">
                            {lang === 'bn' ? rev.commentBn : rev.commentEn}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4 border-t border-stone-200">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onAddToCart(product, selectedSize)}
                  className="py-3 px-4 rounded-xl bg-rose-950 hover:bg-rose-900 text-amber-100 font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ShoppingBag size={18} />
                  <span>{lang === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}</span>
                </button>

                <button
                  onClick={() => onBuyNow(product, selectedSize)}
                  className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-rose-950 font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>{lang === 'bn' ? 'এখনি অর্ডার করুন' : 'Buy Now'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => onToggleWishlist(product)}
                  className="text-xs font-semibold text-rose-900 hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
                  <span>
                    {isWishlisted 
                      ? (lang === 'bn' ? 'উইশলিস্টে আছে' : 'Saved in Wishlist') 
                      : (lang === 'bn' ? 'উইশলিস্টে রাখুন' : 'Save to Wishlist')}
                  </span>
                </button>

                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert(lang === 'bn' ? 'লিংক কপি করা হয়েছে!' : 'Product link copied!');
                  }}
                  className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
                >
                  <Share2 size={14} />
                  <span>{lang === 'bn' ? 'শেয়ার করুন' : 'Share'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
