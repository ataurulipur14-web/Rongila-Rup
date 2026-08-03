import React, { useState } from 'react';
import { 
  X, 
  Rocket, 
  Globe, 
  BarChart3, 
  Target, 
  Copy,
  Check,
  CreditCard,
  ExternalLink,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Language, Product } from '../types';

interface AdsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  product: Product | null;
  onLaunchCampaign: (updatedProduct: Product) => void;
}

export const AdsManagerModal: React.FC<AdsManagerModalProps> = ({
  isOpen,
  onClose,
  lang,
  product,
  onLaunchCampaign
}) => {
  const [platform, setPlatform] = useState<'facebook' | 'instagram' | 'google' | 'tiktok'>('facebook');
  const [dailyBudget, setDailyBudget] = useState<number>(500);
  const [durationDays, setDurationDays] = useState<number>(7);
  const [targetAudience, setTargetAudience] = useState<string>('women_18_45_bd');
  const [campaignGoal, setCampaignGoal] = useState<'sales' | 'messages' | 'traffic'>('sales');
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen || !product) return null;

  const totalBudget = dailyBudget * durationDays;
  const estimatedMinReach = Math.floor(dailyBudget * 28 * durationDays);
  const estimatedMaxReach = Math.floor(dailyBudget * 45 * durationDays);
  const estimatedClicks = Math.floor(dailyBudget * 2.5 * durationDays);

  const productUrl = `${window.location.origin}/#product-${product.id}`;

  const generatedCaption = `🌸 ${product.nameBn || product.nameEn} 🌸
✨ রঙিলা রূপ এর এক্সক্লুসিভ কালেকশন!

দাম: ৳${product.price.toLocaleString()} ${product.originalPrice ? `(পূর্বমূল্য ৳${product.originalPrice.toLocaleString()})` : ''}
ফেব্রিক: ${product.fabricBn || 'প্রিমিয়াম সুতি/সিল্ক'} | রঙ: ${product.colorBn || 'আকর্ষণীয়'}

🛒 সরাসরি ওয়েবসাইট থেকে ক্যাশ অন ডেলিভারিতে অর্ডার করুন:
👉 ${productUrl}

📞 কল বা হোয়াটসঅ্যাপ করুন: 01792765693
🚚 সারা বাংলাদেশে হোম ডেলিভারি ও ডেলিভারির সময় দেখে নেওয়ার সুবিধা!

#RongilaRup #JamdaniSaree #SilkPanjabi #BangladeshiFashion #AuthenticStyle`;

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(generatedCaption);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleLaunch = () => {
    const updated: Product = {
      ...product,
      isBoosted: true,
      boostStatus: 'Active',
      boostBudget: dailyBudget,
      boostReach: estimatedMaxReach
    };

    onLaunchCampaign(updated);
    alert(lang === 'bn' 
      ? `🚀 "${product.nameBn}" পণ্যটির এডভার্টাইজিং টেক্সট কপি হয়েছে এবং বুস্ট ক্যাম্পেইন ট্র্যাকারে মার্ক করা হয়েছে!\n\nএখন ফেসবুক পেজ বা ফেসবুক এডস ম্যানেজারে গিয়ে পোস্ট পিন করে Boost Post এ ক্লিক করুন।` 
      : `🚀 Campaign details set for "${product.nameEn}"! Copy caption and run ad on Facebook Ads Manager.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-amber-500/30 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-rose-950 to-amber-700 p-4 sm:p-5 text-amber-50 flex items-center justify-between border-b border-amber-500/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-rose-950 rounded-2xl font-black shadow-md border border-amber-300">
              <Rocket size={22} />
            </div>
            <div>
              <h3 className="font-serif font-black text-base sm:text-lg text-amber-100 flex items-center gap-2">
                <span>{lang === 'bn' ? 'প্রোডাক্ট ফেসবুক বুস্ট ও এডস তৈরি' : 'Direct Product Boost Builder'}</span>
                <span className="bg-amber-400 text-rose-950 text-[10px] px-2 py-0.5 rounded-full font-sans uppercase font-black">Meta Ads</span>
              </h3>
              <p className="text-xs text-amber-200/90 font-medium">
                {lang === 'bn' ? '১-ক্লিকে প্রোডাক্ট লিংক সহ বুস্ট ক্যাপশন ও এড সেটআপ গাইড' : '1-click caption copy with direct website purchase URL'}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-full text-amber-200 hover:bg-rose-900 transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {/* Target Product Summary Box */}
          <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl flex items-center gap-3.5">
            <img 
              src={product.image} 
              alt={product.nameEn} 
              className="w-14 h-18 object-cover rounded-xl border border-stone-200 shrink-0 shadow-xs" 
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0 flex-1 space-y-1">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                {product.category}
              </span>
              <h4 className="font-serif font-bold text-sm text-stone-900 truncate">
                {lang === 'bn' ? product.nameBn : product.nameEn}
              </h4>
              <p className="text-sm font-extrabold text-rose-950">৳{product.price.toLocaleString()}</p>
            </div>

            <button
              onClick={handleCopyCaption}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm ${
                isCopied ? 'bg-emerald-600 text-white' : 'bg-rose-950 text-amber-200 hover:bg-rose-900'
              }`}
            >
              {isCopied ? <Check size={16} /> : <Copy size={16} />}
              <span>{isCopied ? 'ক্যাপশন কপিড!' : 'পোস্ট টেক্সট কপি'}</span>
            </button>
          </div>

          {/* CRITICAL EXPLANATION BOX: HOW BOOST & PAYMENT WORKS */}
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl space-y-2.5">
            <div className="flex items-center gap-2 text-rose-950 font-extrabold text-xs">
              <CreditCard size={18} className="text-amber-700" />
              <span>💡 ফেসবুকে প্রোডাক্ট বুস্ট করার সঠিক নিয়ম ও পেমেন্ট নির্দেশিকা:</span>
            </div>

            <ol className="list-decimal pl-4 space-y-1.5 text-stone-800 leading-relaxed font-medium">
              <li>
                <strong>ফেসবুক পেমেন্ট কার্ড যুক্ত করা:</strong> ফেসবুকে বুস্ট করার বিল সরাসরি ফেসবুককে আপনার ব্যাংক মাস্টারকার্ড/ভিসা কার্ড দিয়ে দিতে হয়। কার্ড না থাকলে ফেসবুক বিলিং পেজে গিয়ে কার্ড অ্যাড করুন।
              </li>
              <li>
                <strong>১-ক্লিকে পোস্ট ক্যাপশন কপি:</strong> উপরের <span className="bg-rose-950 text-amber-200 px-1.5 py-0.5 rounded font-bold">পোস্ট টেক্সট কপি</span> বাটনে চাপ দিন। এতে এই প্রোডাক্টের ছবি, দাম ও ওয়েবসাইটের লিঙ্ক কপি হয়ে যাবে।
              </li>
              <li>
                <strong>ফেসবুক পেজে পোস্ট ও Boost:</strong> আপনার ফেসবুক পেজে নতুন পোস্ট তৈরি করে টেক্সটটি পেস্ট করুন এবং ছবি আপলোড করে <strong>Boost Post</strong> বাটনে ক্লিক করুন।
              </li>
            </ol>

            <div className="pt-1 flex flex-wrap gap-2">
              <a
                href="https://adsmanager.facebook.com/billing"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-1 text-[11px] shadow-sm transition-all"
              >
                <CreditCard size={14} />
                <span>ফেসবুক কার্ড/বিলিং অপশন (Facebook Billing)</span>
                <ExternalLink size={12} />
              </a>

              <a
                href="https://adsmanager.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center gap-1 text-[11px] shadow-sm transition-all"
              >
                <Rocket size={14} className="text-amber-400" />
                <span>Ads Manager এ যাবেন</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Generated Caption Preview Card */}
          <div className="space-y-1.5">
            <label className="font-serif font-bold text-stone-900 block text-xs flex items-center justify-between">
              <span>ফেসবুক পেজের জন্য প্রস্তুতকৃ্ত পোস্ট ক্যাপশন:</span>
              <span className="text-stone-500 text-[11px]">Direct Order URL Included</span>
            </label>

            <div className="p-3 bg-stone-900 text-stone-200 rounded-2xl font-mono text-[11px] leading-relaxed relative group">
              <pre className="whitespace-pre-wrap font-sans text-stone-100">{generatedCaption}</pre>
            </div>
          </div>

          {/* Step 1: Select Ad Platform */}
          <div className="space-y-2">
            <label className="font-serif font-bold text-rose-950 block text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Globe size={14} className="text-amber-600" />
              <span>১. এড প্ল্যাটফর্ম সিলেক্ট করুন:</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'facebook', name: 'Facebook Feed', icon: '📘', color: 'border-blue-500 bg-blue-50 text-blue-900' },
                { id: 'instagram', name: 'Instagram Reels', icon: '📸', color: 'border-rose-500 bg-rose-50 text-rose-900' },
                { id: 'google', name: 'Google Search', icon: '🔍', color: 'border-amber-500 bg-amber-50 text-amber-900' },
                { id: 'tiktok', name: 'TikTok Video', icon: '🎵', color: 'border-stone-800 bg-stone-100 text-stone-900' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPlatform(item.id as any)}
                  className={`p-2.5 rounded-2xl border-2 text-center transition-all cursor-pointer font-bold flex flex-col items-center gap-1 ${
                    platform === item.id ? item.color + ' shadow-md scale-102' : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-[11px]">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Campaign Objective */}
          <div className="space-y-2">
            <label className="font-serif font-bold text-rose-950 block text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Target size={14} className="text-amber-600" />
              <span>২. এডভার্টাইজিং লক্ষ্য (Campaign Objective):</span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'sales', label: 'ডাইরেক্ট সেলস', desc: 'ওয়েবসাইটে সরাসরি অর্ডার আনা' },
                { id: 'messages', label: 'মেসেঞ্জার ইনবক্স', desc: 'কাস্টমার ইনবক্স ইনকোয়ারি' },
                { id: 'traffic', label: 'সর্বোচ্চ রিচ', desc: 'বেশি মানুষের কাছে পৌঁছানো' },
              ].map(g => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setCampaignGoal(g.id as any)}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    campaignGoal === g.id ? 'border-amber-500 bg-amber-50 font-bold text-rose-950 ring-1 ring-amber-500' : 'border-stone-200 bg-white text-stone-600'
                  }`}
                >
                  <span className="font-bold text-xs block">{g.label}</span>
                  <span className="text-[10px] text-stone-500 mt-0.5 block">{g.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Budget & Duration Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-amber-50/60 border border-amber-200 rounded-2xl">
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold text-stone-800">
                <span>দৈনিক এড বাজেট:</span>
                <span className="text-rose-950 font-extrabold text-sm">৳{dailyBudget.toLocaleString()} / দিন</span>
              </div>
              <input
                type="range"
                min="200"
                max="5000"
                step="100"
                value={dailyBudget}
                onChange={(e) => setDailyBudget(Number(e.target.value))}
                className="w-full accent-rose-950 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-bold text-stone-800">
                <span>ক্যাম্পেইন মেয়াদ:</span>
                <span className="text-rose-950 font-extrabold text-sm">{durationDays} দিন</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full accent-rose-950 cursor-pointer"
              />
            </div>
          </div>

          {/* Live Forecast Analytics Box */}
          <div className="p-3.5 bg-gradient-to-r from-rose-950 via-stone-900 to-rose-950 text-white rounded-2xl space-y-2.5 shadow-md border border-amber-500/30">
            <h5 className="font-serif font-bold text-amber-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 size={14} />
              <span>ক্যাম্পেইন ফলাফল পূর্বাভাস (Estimated Performance)</span>
            </h5>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-xs">
                <span className="text-[10px] text-amber-200 block">আনুমানিক রিচ</span>
                <span className="font-mono font-extrabold text-sm text-amber-400">
                  ~{estimatedMinReach.toLocaleString()}
                </span>
              </div>

              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-xs">
                <span className="text-[10px] text-amber-200 block">ক্লিকস/ট্রাফিক</span>
                <span className="font-mono font-extrabold text-sm text-emerald-400">
                  ~{estimatedClicks.toLocaleString()}
                </span>
              </div>

              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-xs">
                <span className="text-[10px] text-amber-200 block">মোট বাজেট</span>
                <span className="font-mono font-extrabold text-sm text-amber-200">
                  ৳{totalBudget.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Launch Button */}
          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-stone-100 text-stone-700 font-bold rounded-2xl hover:bg-stone-200 transition-colors"
            >
              বন্ধ করুন
            </button>

            <button
              type="button"
              onClick={handleLaunch}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 via-rose-600 to-amber-500 hover:from-amber-400 hover:to-rose-500 text-rose-950 font-black text-xs rounded-2xl flex items-center gap-2 shadow-xl border border-amber-300 cursor-pointer"
            >
              <Rocket size={16} />
              <span>🚀 ক্যাপশন কপি করুন ও বুস্ট ট্রেস সক্রিয় করুন</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

