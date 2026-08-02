import React, { useState } from 'react';
import { X, Search, Truck, CheckCircle2, Clock, MapPin, PhoneCall } from 'lucide-react';
import { Language } from '../types';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  if (!isOpen) return null;

  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderId.trim() })
      });
      const data = await res.json();
      setTrackingData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-stone-50 rounded-3xl shadow-2xl overflow-hidden border border-amber-500/20 my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 bg-rose-950 text-amber-50 flex items-center justify-between border-b border-amber-500/20">
          <div className="flex items-center gap-2">
            <Truck className="text-amber-400" size={22} />
            <h3 className="text-base font-serif font-bold text-amber-100">
              {lang === 'bn' ? 'অর্ডার ট্র্যাকিং সিস্টেম' : 'Order Tracking System'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-rose-900 text-amber-200 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Search Bar */}
          <form onSubmit={handleTrack} className="space-y-2">
            <label className="block text-xs font-bold text-stone-700">
              {lang === 'bn' ? 'আপনার অর্ডার আইডি লিখুন (যেমন: RR-894212)' : 'Enter Order ID (e.g. RR-894212)'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="RR-XXXXXX"
                required
                className="flex-1 px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-mono font-bold text-stone-900 uppercase focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-rose-950 hover:bg-rose-900 text-amber-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Search size={14} />
                <span>{lang === 'bn' ? 'খুঁজুন' : 'Search'}</span>
              </button>
            </div>
          </form>

          {/* Tracking Result View */}
          {trackingData && (
            <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-4 shadow-sm animate-fade-in">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <span className="text-[10px] text-stone-400 font-mono">ID: {trackingData.orderId}</span>
                  <h4 className="text-sm font-serif font-bold text-rose-950">
                    {lang === 'bn' ? trackingData.statusBn : 'Out for Delivery'}
                  </h4>
                </div>
                <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] font-bold rounded-full">
                  {trackingData.courier}
                </span>
              </div>

              <div className="text-xs text-stone-600 space-y-1">
                <p><strong>{lang === 'bn' ? 'ট্র্যাকিং কোড:' : 'Tracking Code:'}</strong> <span className="font-mono text-stone-900 font-bold">{trackingData.trackingCode}</span></p>
                <p><strong>{lang === 'bn' ? 'আনুমানিক সময়:' : 'Est. Delivery:'}</strong> <span className="text-emerald-700 font-bold">{trackingData.estimatedDelivery}</span></p>
              </div>

              {/* Steps Progress */}
              <div className="space-y-3 pt-2">
                {trackingData.steps.map((st: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 relative">
                    <div className={`p-1 rounded-full text-white shrink-0 z-10 ${st.done ? 'bg-emerald-600' : 'bg-stone-200 text-stone-400'}`}>
                      <CheckCircle2 size={16} />
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="font-bold text-stone-800">{st.label}</div>
                      <div className="text-[10px] text-stone-400">{st.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Helpline Footer */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-center gap-3">
            <PhoneCall className="text-amber-700 shrink-0" size={18} />
            <div>
              <div className="font-bold">{lang === 'bn' ? 'সহায়তা প্রয়োজন?' : 'Need Delivery Assistance?'}</div>
              <div className="text-[11px] text-stone-600">
                {lang === 'bn' ? 'আমাদের কাস্টমার কেয়ারে কল করুন: +৮৮০ ১৭০০-০০০০০০' : 'Call Customer Care: +880 1700-000000'}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
