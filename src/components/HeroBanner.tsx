import React from 'react';
import { Sparkles, ShieldCheck, Truck, RefreshCw, ArrowRight } from 'lucide-react';
import { Language, CategoryId } from '../types';
import { HERO_IMAGES } from '../data/products';

interface HeroBannerProps {
  lang: Language;
  onSelectCategory: (cat: CategoryId) => void;
  onOpenAIStylist: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  lang,
  onSelectCategory,
  onOpenAIStylist
}) => {
  return (
    <div className="relative bg-gradient-to-b from-rose-950 via-rose-900 to-amber-950 text-amber-50 overflow-hidden py-8 lg:py-16">
      {/* Decorative Traditional Patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide">
              <Sparkles size={16} className="text-amber-400" />
              <span>
                {lang === 'bn' ? 'শুভ উৎসব ও বৈশাখী বুটিক কালেকশন ২০২৬' : 'Festive & Heritage Boutique Collection 2026'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-amber-100 leading-tight">
              {lang === 'bn' ? (
                <>
                  ঐতিহ্যের ছোঁয়ায় সাজুক <br />
                  <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 bg-clip-text text-transparent">
                    আপনার রঙিন রূপ
                  </span>
                </>
              ) : (
                <>
                  Celebrate Tradition in <br />
                  <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 bg-clip-text text-transparent">
                    Royal Bengali Elegance
                  </span>
                </>
              )}
            </h1>

            <p className="text-amber-200/90 text-sm sm:text-base max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
              {lang === 'bn' 
                ? 'নারায়ণগঞ্জের খাঁটি ঢাকাই জামদানি, টাঙ্গাইলের তাঁত শাড়ি, প্রিমিয়াম রেশম সিল্কের রাজকীয় পাঞ্জাবি এবং ঐতিহ্যবাহী হাতে গড়া গহনার এক্সক্লুসিভ কালেকশন।' 
                : 'Authentic Dhakai Jamdani Sarees, Tangail Handlooms, Premium Silk Panjabis & Artisan Gold Jewelry carefully crafted for your grandest moments.'}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button
                onClick={() => onSelectCategory('saree')}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-rose-950 font-bold text-sm sm:text-base hover:from-amber-400 hover:to-amber-300 transition-all shadow-lg hover:shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
              >
                <span>{lang === 'bn' ? 'জামদানি কালেকশন দেখুন' : 'Explore Jamdani Sarees'}</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => onSelectCategory('panjabi')}
                className="px-6 py-3 rounded-full bg-rose-900/80 border border-amber-400/40 text-amber-200 font-semibold text-sm sm:text-base hover:bg-rose-800 hover:text-amber-100 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>{lang === 'bn' ? 'পাঞ্জাবি কালেকশন' : 'View Panjabis'}</span>
              </button>

              <button
                onClick={onOpenAIStylist}
                className="px-5 py-3 rounded-full bg-amber-500/10 border border-amber-300/40 text-amber-300 hover:bg-amber-500/20 text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Sparkles size={16} className="text-amber-400" />
                <span>{lang === 'bn' ? 'AI স্টাইল সাজেস্টর' : 'AI Wardrobe Guide'}</span>
              </button>
            </div>

            {/* Value Props Badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-amber-500/20 max-w-lg mx-auto lg:mx-0">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <ShieldCheck size={20} className="text-amber-400 mb-1" />
                <span className="text-xs font-bold text-amber-100">{lang === 'bn' ? '১০০% আসল তাঁত' : '100% Handloom'}</span>
                <span className="text-[10px] text-amber-300/70">{lang === 'bn' ? 'কারিগরদের হাতে গড়া' : 'Artisan Handcrafted'}</span>
              </div>

              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <Truck size={20} className="text-amber-400 mb-1" />
                <span className="text-xs font-bold text-amber-100">{lang === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash On Delivery'}</span>
                <span className="text-[10px] text-amber-300/70">{lang === 'bn' ? 'সারাদেশে হোম ডেলিভারি' : 'All Over Bangladesh'}</span>
              </div>

              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <RefreshCw size={20} className="text-amber-400 mb-1" />
                <span className="text-xs font-bold text-amber-100">{lang === 'bn' ? 'সহজ ৭ দিনের রিটার্ন' : 'Easy 7-Day Return'}</span>
                <span className="text-[10px] text-amber-300/70">{lang === 'bn' ? 'ঝামেলামুক্ত গ্যারান্টি' : 'Hassle-Free Policy'}</span>
              </div>
            </div>
          </div>

          {/* Right Showcase Cards Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-3 sm:space-y-4">
              <div className="relative rounded-2xl overflow-hidden group shadow-xl border border-amber-500/30">
                <img
                  src={HERO_IMAGES.banner}
                  alt="Rongila Rup Boutique Banner"
                  referrerPolicy="no-referrer"
                  className="w-full h-48 sm:h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rose-950 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3 text-amber-100">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">{lang === 'bn' ? 'এক্সক্লুসিভ' : 'Exclusive'}</span>
                  <h3 className="text-xs sm:text-sm font-serif font-bold line-clamp-1">{lang === 'bn' ? 'উৎসব ফ্যাশন কালেকশন' : 'Festive Heritage Collection'}</h3>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden group shadow-xl border border-amber-500/30">
                <img
                  src={HERO_IMAGES.jewellery}
                  alt="Traditional Gold Jewelry"
                  referrerPolicy="no-referrer"
                  className="w-full h-36 sm:h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rose-950 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-amber-100">
                  <span className="text-[10px] font-bold text-amber-400 uppercase">{lang === 'bn' ? 'গহনা' : 'Jewelry'}</span>
                  <h3 className="text-xs font-serif font-bold line-clamp-1">{lang === 'bn' ? 'অ্যান্টিক ব্রাইডাল সেট' : 'Bridal Choker Sets'}</h3>
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6">
              <div className="relative rounded-2xl overflow-hidden group shadow-xl border border-amber-500/30">
                <img
                  src={HERO_IMAGES.jamdani}
                  alt="Dhakai Jamdani Saree"
                  referrerPolicy="no-referrer"
                  className="w-full h-36 sm:h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rose-950 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-amber-100">
                  <span className="text-[10px] font-bold text-amber-400 uppercase">{lang === 'bn' ? 'শাড়ি' : 'Sarees'}</span>
                  <h3 className="text-xs font-serif font-bold line-clamp-1">{lang === 'bn' ? 'ঢাকাই জামদানি' : 'Dhakai Jamdani'}</h3>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden group shadow-xl border border-amber-500/30">
                <img
                  src={HERO_IMAGES.panjabi}
                  alt="Silk Designer Panjabi"
                  referrerPolicy="no-referrer"
                  className="w-full h-48 sm:h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rose-950 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3 text-amber-100">
                  <span className="text-[10px] font-bold text-amber-400 uppercase">{lang === 'bn' ? 'পাঞ্জাবি' : 'Panjabi'}</span>
                  <h3 className="text-xs sm:text-sm font-serif font-bold line-clamp-1">{lang === 'bn' ? 'রেশম সিল্ক কালেকশন' : 'Resham Silk Specials'}</h3>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
