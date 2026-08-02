import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  Smartphone, 
  ShieldCheck, 
  Download,
  Copy,
  ShoppingBag
} from 'lucide-react';
import { CartItem, Language, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  cartItems: CartItem[];
  discountAmount: number;
  shippingFee: number;
  onClearCart: () => void;
  onOrderPlaced?: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  lang,
  cartItems,
  discountAmount,
  shippingFee,
  onClearCart,
  onOrderPlaced
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad' | 'card'>('cod');
  const [notes, setNotes] = useState('');

  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalAmount = subtotal - discountAmount + shippingFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) return;

    const orderId = `RR-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: orderId,
      items: [...cartItems],
      totalAmount,
      shippingFee,
      discount: discountAmount,
      customerName: name,
      phone,
      address,
      city,
      paymentMethod,
      status: 'processing',
      createdAt: new Date().toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };

    setConfirmedOrder(newOrder);
    if (onOrderPlaced) {
      onOrderPlaced(newOrder);
    }
    onClearCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-500/20 my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 bg-rose-950 text-amber-50 flex items-center justify-between border-b border-amber-500/20">
          <h2 className="text-xl font-serif font-bold text-amber-100 flex items-center gap-2">
            <ShieldCheck className="text-amber-400" size={22} />
            <span>{lang === 'bn' ? 'অর্ডার সম্পন্ন করুন' : 'Complete Your Order'}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-rose-900 text-amber-200 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {!confirmedOrder ? (
          /* Order Form */
          <form onSubmit={handlePlaceOrder} className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
            
            {/* Delivery Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-serif font-bold text-rose-950 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
                <MapPin size={16} className="text-amber-600" />
                <span>{lang === 'bn' ? '১. ডেলিভারির তথ্য' : '1. Delivery Information'}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {lang === 'bn' ? 'আপনার পূর্ণ নাম *' : 'Full Name *'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={lang === 'bn' ? 'যেমন: তানজিনা রহমান' : 'e.g. Tanjina Rahman'}
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                    <User size={14} className="absolute left-3 top-2.5 text-stone-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {lang === 'bn' ? 'মোবাইল নম্বর *' : 'Mobile Number *'}
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01700-000000"
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                    <Phone size={14} className="absolute left-3 top-2.5 text-stone-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {lang === 'bn' ? 'পূর্ণাঙ্গ ঠিকানা *' : 'Full Address *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={lang === 'bn' ? 'বাসা/রোড নম্বর, এলাকা, থানা' : 'House/Road No, Area, Thana'}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {lang === 'bn' ? 'জেলা/শহর *' : 'City/District *'}
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="Dhaka">ঢাকা (Dhaka)</option>
                    <option value="Chittagong">চট্টগ্রাম (Chittagong)</option>
                    <option value="Sylhet">সিলেট (Sylhet)</option>
                    <option value="Rajshahi">রাজশাহী (Rajshahi)</option>
                    <option value="Khulna">খুলনা (Khulna)</option>
                    <option value="Barisal">বরিশাল (Barisal)</option>
                    <option value="Rangpur">রংপুর (Rangpur)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">
                  {lang === 'bn' ? 'বিশেষ বার্তা (অপশনাল)' : 'Special Delivery Notes (Optional)'}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={lang === 'bn' ? 'যেমন: বিকেলে ডেলিভারি দিলে ভালো হয়' : 'e.g. Deliver preferably in afternoon'}
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <h3 className="text-sm font-serif font-bold text-rose-950 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
                <CreditCard size={16} className="text-amber-600" />
                <span>{lang === 'bn' ? '২. পেমেন্ট পদ্ধতি' : '2. Payment Method'}</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-rose-950 bg-rose-50 ring-2 ring-rose-950/20'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <ShieldCheck className="text-emerald-600" size={20} />
                  <div>
                    <div className="text-xs font-bold text-stone-900">{lang === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}</div>
                    <div className="text-[10px] text-stone-500">{lang === 'bn' ? 'পণ্য পেয়ে পেমেন্ট' : 'Pay on Receive'}</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentMethod === 'bkash'
                      ? 'border-pink-600 bg-pink-50 ring-2 ring-pink-600/20'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <Smartphone className="text-pink-600" size={20} />
                  <div>
                    <div className="text-xs font-bold text-pink-700">bKash (বিকাশ)</div>
                    <div className="text-[10px] text-stone-500">01700-000000</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('nagad')}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentMethod === 'nagad'
                      ? 'border-orange-600 bg-orange-50 ring-2 ring-orange-600/20'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <Smartphone className="text-orange-600" size={20} />
                  <div>
                    <div className="text-xs font-bold text-orange-700">Nagad (নগদ)</div>
                    <div className="text-[10px] text-stone-500">01700-000000</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600/20'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <CreditCard className="text-indigo-600" size={20} />
                  <div>
                    <div className="text-xs font-bold text-indigo-700">Card / Visa</div>
                    <div className="text-[10px] text-stone-500">Online Payment</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Total Order Summary Box */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex justify-between text-xs text-stone-600">
                <span>{lang === 'bn' ? 'মোট পণ্যের মূল্য:' : 'Subtotal:'}</span>
                <span className="font-bold">৳{subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-xs text-emerald-600 font-bold">
                  <span>{lang === 'bn' ? 'ডিসকাউন্ট:' : 'Discount:'}</span>
                  <span>-৳{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-stone-600">
                <span>{lang === 'bn' ? 'ডেলিভারি চার্জ:' : 'Shipping Fee:'}</span>
                <span className="font-bold">৳{shippingFee}</span>
              </div>
              <div className="flex justify-between text-base font-serif font-extrabold text-rose-950 pt-2 border-t border-stone-200">
                <span>{lang === 'bn' ? 'সর্বমোট প্রদেয়:' : 'Total Amount:'}</span>
                <span className="text-xl font-sans text-amber-700">৳{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-rose-950 font-extrabold text-base shadow-xl hover:from-amber-400 hover:to-amber-300 transition-all cursor-pointer"
            >
              {lang === 'bn' ? 'অর্ডার নিশ্চিত করুন' : 'Confirm Order Now'}
            </button>
          </form>
        ) : (
          /* Confirmation Receipt Modal View */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <CheckCircle size={36} />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-serif font-extrabold text-rose-950">
                {lang === 'bn' ? 'অভিনন্দন! আপনার অর্ডারটি গৃহীত হয়েছে' : 'Congratulations! Your Order is Placed'}
              </h3>
              <p className="text-xs text-stone-500">
                {lang === 'bn' ? 'রঙিলা রূপ থেকে কেনাকাটার জন্য আপনাকে ধন্যবাদ' : 'Thank you for shopping with Rongila Rup'}
              </p>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-left space-y-3 max-w-md mx-auto">
              <div className="flex justify-between items-center border-b border-amber-200 pb-2">
                <span className="text-xs font-bold text-amber-900">{lang === 'bn' ? 'অর্ডার আইডি:' : 'Order ID:'}</span>
                <span className="text-sm font-mono font-bold text-rose-900">{confirmedOrder.id}</span>
              </div>

              <div className="text-xs space-y-1 text-stone-700">
                <p><strong>{lang === 'bn' ? 'গ্রাহকের নাম:' : 'Customer:'}</strong> {confirmedOrder.customerName}</p>
                <p><strong>{lang === 'bn' ? 'মোবাইল:' : 'Phone:'}</strong> {confirmedOrder.phone}</p>
                <p><strong>{lang === 'bn' ? 'ঠিকানা:' : 'Address:'}</strong> {confirmedOrder.address}, {confirmedOrder.city}</p>
                <p><strong>{lang === 'bn' ? 'সর্বমোট মূল্য:' : 'Total Paid:'}</strong> ৳{confirmedOrder.totalAmount.toLocaleString()} ({confirmedOrder.paymentMethod.toUpperCase()})</p>
                <p><strong>{lang === 'bn' ? 'আনুমানিক ডেলিভারি:' : 'Est. Delivery:'}</strong> ২-৩ কার্যদিবসের মধ্যে</p>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(confirmedOrder.id);
                  alert(lang === 'bn' ? 'অর্ডার আইডি কপি করা হয়েছে!' : 'Order ID copied!');
                }}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-800 text-xs font-bold flex items-center gap-1.5 hover:bg-stone-200"
              >
                <Copy size={14} />
                <span>{lang === 'bn' ? 'আইডি কপি করুন' : 'Copy Order ID'}</span>
              </button>

              <button
                onClick={() => {
                  setConfirmedOrder(null);
                  onClose();
                }}
                className="px-6 py-2 rounded-xl bg-rose-950 text-amber-200 text-xs font-bold hover:bg-rose-900"
              >
                {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
