import React, { useState, useEffect } from 'react';
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
  ShoppingBag,
  AlertTriangle,
  QrCode,
  Printer,
  Check
} from 'lucide-react';
import QRCode from 'qrcode';
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
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad' | 'rocket'>('cod');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [trxId, setTrxId] = useState('');
  const [notes, setNotes] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  const STORE_BKASH_NUMBER = '01792765693';

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalAmount = subtotal - discountAmount + shippingFee;

  // Generate real scannable QR Code when order is confirmed
  useEffect(() => {
    if (confirmedOrder) {
      const verifyUrl = `${window.location.origin}/?orderId=${confirmedOrder.id}&verify=true`;
      QRCode.toDataURL(verifyUrl, {
        width: 220,
        margin: 1,
        color: {
          dark: '#4c0519',
          light: '#ffffff'
        }
      })
      .then(url => setQrCodeDataUrl(url))
      .catch(err => console.error('QR code generation error:', err));
    }
  }, [confirmedOrder]);

  const copyStoreNumber = () => {
    navigator.clipboard.writeText(STORE_BKASH_NUMBER);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  // Bangladeshi Mobile Number Validation Helper (Supports 01... and +8801...)
  const isValidBdPhone = (p: string) => {
    const clean = p.replace(/[^0-9]/g, '');
    if (clean.length === 11 && /^01[3-9]\d{8}$/.test(clean)) return true;
    if (clean.length === 13 && clean.startsWith('8801') && /^8801[3-9]\d{8}$/.test(clean)) return true;
    return false;
  };

  // Detailed Address Validation Helper
  const isValidAddress = (addr: string) => {
    const trimmed = addr.trim();
    return trimmed.length >= 6;
  };

  // Strict bKash / Nagad Transaction ID Validation Helper
  const isValidTrxId = (trx: string) => {
    const clean = trx.trim().toUpperCase();
    if (clean.length < 8 || clean.length > 12) return false;
    if (!/^[A-Z0-9]{8,12}$/.test(clean)) return false;
    const fakes = ['12345678', '123456789', '00000000', '11111111', 'XXXXXXXX', 'ABCDEFGH', 'TEST1234', 'TRXID1234', '1234567890'];
    return !fakes.includes(clean);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // 1. Full Name Check
    if (!name || name.trim().length < 3) {
      const msg = lang === 'bn' 
        ? 'অনুগ্রহ করে আপনার সঠিক পূর্ণ নাম লিখুন (কমপক্ষে ৩ অক্ষর)।' 
        : 'Please enter a valid full name (at least 3 characters).';
      setValidationError(msg);
      return;
    }

    // 2. Mobile Number Check
    if (!isValidBdPhone(phone)) {
      const msg = lang === 'bn' 
        ? 'অনুগ্রহ করে ১১ ডিজিটের সঠিক সচল মোবাইল নম্বর দিন (যেমন: 01712345678 বা 01812345678)। ভুয়া নম্বর গ্রহণযোগ্য নয়।' 
        : 'Please enter a valid 11-digit Bangladeshi mobile number (e.g., 01712345678).';
      setValidationError(msg);
      return;
    }

    // 3. Address Check
    if (!isValidAddress(address)) {
      const msg = lang === 'bn' 
        ? 'অনুগ্রহ করে আপনার বিস্তারিত ডেলিভারি ঠিকানা লিখুন (বাসা/রোড নম্বর, এলাকা, থানা, জেলাসহ কমপক্ষে ১০ অক্ষর)।' 
        : 'Please enter a detailed delivery address (at least 10 characters with house/road/area).';
      setValidationError(msg);
      return;
    }

    // 4. Mobile Banking (bKash / Nagad) Validation
    if (paymentMethod === 'bkash' || paymentMethod === 'nagad') {
      const senderNum = paymentPhone || phone;
      if (!isValidBdPhone(senderNum)) {
        const msg = lang === 'bn' 
          ? 'অনুগ্রহ করে পেমেন্ট করার সঠিক ১১ ডিজিটের বিকাশ/নগদ সেন্ডার মোবাইল নম্বরটি দিন।' 
          : 'Please enter the valid 11-digit sender phone number used for payment.';
        setValidationError(msg);
        return;
      }

      if (!isValidTrxId(trxId)) {
        const msg = lang === 'bn' 
          ? 'অনুগ্রহ করে আপনার মেসেজ থেকে সঠিক bKash/Nagad Transaction ID (TrxID) দিন। TrxID সাধারণত ৮ থেকে ১২ অক্ষরের ক্যারেক্টার হয় (যেমন: 9J84A2K9L)। ভুয়া আইডি দিলে অর্ডার বাতিল হবে।' 
          : 'Please enter a valid bKash/Nagad Transaction ID (8-12 characters, e.g., 9J84A2K9L). Fake IDs are rejected.';
        setValidationError(msg);
        return;
      }
    }

    // Payment Status Logic
    const isPaidOnline = paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'card';
    const paymentStatus: Order['paymentStatus'] = isPaidOnline ? 'VERIFIED_PAID' : 'UNPAID';
    const amountDue = isPaidOnline ? 0 : totalAmount;

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
      paymentStatus,
      amountDue,
      paymentPhone: paymentPhone || phone,
      trxId: trxId.trim().toUpperCase(),
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
            
            {/* Validation Error Alert Box */}
            {validationError && (
              <div className="p-4 bg-rose-50 border-2 border-rose-500/30 rounded-2xl flex items-start gap-3 text-rose-900 animate-shake">
                <AlertTriangle size={20} className="text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs font-semibold leading-relaxed">
                  <p className="font-bold text-rose-950 mb-0.5">
                    {lang === 'bn' ? 'তথ্য সঠিক নয়!' : 'Invalid Information!'}
                  </p>
                  <p>{validationError}</p>
                </div>
              </div>
            )}

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
                      placeholder="01792765693"
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
                    <div className="text-[10px] text-stone-500 font-mono">01792765693</div>
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
                    <div className="text-[10px] text-stone-500 font-mono">01792765693</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('rocket')}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentMethod === 'rocket'
                      ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-600/20'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <Smartphone className="text-purple-600" size={20} />
                  <div>
                    <div className="text-xs font-bold text-purple-700">Rocket (রকেট)</div>
                    <div className="text-[10px] text-stone-500 font-mono">01792765693</div>
                  </div>
                </button>
              </div>

              {/* Mobile Banking (bKash / Nagad / Rocket) Payment Step-by-Step Instructions & TrxID Input */}
              {(paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket') && (
                <div className="p-4 bg-gradient-to-br from-pink-50 via-amber-50 to-purple-50 border border-pink-200 rounded-2xl space-y-3 text-xs animate-fade-in">
                  <div className="flex items-center justify-between border-b border-pink-200/60 pb-2">
                    <span className="font-bold text-stone-900 flex items-center gap-1.5">
                      <Smartphone size={16} className={paymentMethod === 'bkash' ? 'text-pink-600' : paymentMethod === 'nagad' ? 'text-orange-600' : 'text-purple-600'} />
                      <span>{paymentMethod === 'bkash' ? 'বিকাশ সেন্ড মানি নির্দেশিকা:' : paymentMethod === 'nagad' ? 'নগদ সেন্ড মানি নির্দেশিকা:' : 'রকেট সেন্ড মানি নির্দেশিকা:'}</span>
                    </span>
                    <span className="text-[11px] font-bold text-rose-900 bg-white px-2 py-0.5 rounded-full border border-pink-200">
                      Send Money
                    </span>
                  </div>

                  {/* Step instructions */}
                  <ol className="list-decimal list-inside text-stone-700 space-y-1 text-[11px] font-medium leading-relaxed">
                    <li>আপনার {paymentMethod === 'bkash' ? 'বিকাশ' : paymentMethod === 'nagad' ? 'নগদ' : 'রকেট'} অ্যাপে প্রবেশ করুন।</li>
                    <li>
                      <span className="font-bold text-stone-900">Send Money</span> বিকল্প সিলেক্ট করে আমাদের অফিশিয়াল নম্বরে সেন্ড মানি করুন:
                    </li>
                  </ol>

                  {/* Merchant Number Box */}
                  <div className="p-3 bg-white rounded-xl border border-pink-300 flex items-center justify-between shadow-xs">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block">
                        {paymentMethod === 'bkash' ? 'bKash Personal/Merchant Number' : 'Nagad Personal Number'}
                      </span>
                      <span className="text-base font-mono font-extrabold text-rose-950 tracking-wider">
                        01792765693
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={copyStoreNumber}
                      className="px-3 py-1.5 bg-rose-950 hover:bg-rose-900 text-amber-200 font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer text-[11px]"
                    >
                      <Copy size={12} />
                      <span>{copiedNumber ? (lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (lang === 'bn' ? 'নম্বর কপি করুন' : 'Copy')}</span>
                    </button>
                  </div>

                  <p className="text-[11px] font-semibold text-rose-900">
                    * প্রদেয় পরিমাণ: <strong className="text-sm font-sans font-extrabold">৳{totalAmount.toLocaleString()}</strong>
                  </p>

                  {/* Customer TrxID and Sender Phone inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-pink-200">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-800 mb-1">
                        {lang === 'bn' ? 'যে নম্বর থেকে টাকা পাঠিয়েছেন *' : 'Sender bKash/Nagad Number *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={paymentPhone}
                        onChange={(e) => setPaymentPhone(e.target.value)}
                        placeholder="01792765693"
                        className="w-full px-3 py-2 bg-white border border-pink-300 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-800 mb-1">
                        {lang === 'bn' ? 'Transaction ID (TrxID) *' : 'Transaction ID (TrxID) *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                        placeholder="e.g. 9J84A2K9L"
                        className="w-full px-3 py-2 bg-white border border-pink-300 rounded-xl text-xs font-mono font-bold text-stone-900 uppercase focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Total Order Summary Box */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="pb-2 border-b border-stone-200 space-y-1.5">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                  {lang === 'bn' ? 'অর্ডারের পণ্যসমূহ:' : 'Ordered Items:'}
                </span>
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs text-stone-700">
                    <span className="truncate max-w-[200px] sm:max-w-[280px] font-medium">
                      {lang === 'bn' ? item.product.nameBn : item.product.nameEn} <span className="font-bold text-rose-950">({item.quantity}টি)</span>
                    </span>
                    <span className="font-mono font-bold text-stone-900">
                      {item.quantity} × ৳{item.product.price.toLocaleString()} = ৳{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

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
          <div className="p-6 md:p-8 text-center space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <CheckCircle size={36} />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-serif font-extrabold text-rose-950">
                {lang === 'bn' ? 'অভিনন্দন! আপনার অর্ডারটি সফলভাবে গৃহীত হয়েছে' : 'Congratulations! Your Order is Placed'}
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                {lang === 'bn' ? 'রঙিলা রূপ থেকে কেনাকাটার জন্য আপনাকে অশেষ ধন্যবাদ' : 'Thank you for shopping with Rongila Rup'}
              </p>
            </div>

            {/* Payment Status Banner */}
            {confirmedOrder.paymentStatus === 'VERIFIED_PAID' ? (
              <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-md space-y-1 border-2 border-emerald-400">
                <div className="flex items-center justify-center gap-2 font-bold text-sm uppercase tracking-wide">
                  <ShieldCheck size={20} />
                  <span>{lang === 'bn' ? 'পেমেন্ট সম্পন্ন (PAID)' : 'PAYMENT COMPLETE (PAID)'}</span>
                </div>
                <p className="text-xs font-semibold text-emerald-100">
                  {lang === 'bn' 
                    ? '✅ আপনি ইতিমধ্যে বিকাশ/নগদে মূল্য পরিশোধ করেছেন। ডেলিভারির সময় আপনাকে আর কোনো টাকা দিতে হবে না (অবশিষ্ট প্রদেয়: ৳০)।' 
                    : '✅ Payment received online via bKash/Nagad. You do NOT need to pay the delivery driver (Amount Due: ৳0).'}
                </p>
              </div>
            ) : (
              <div className="p-4 bg-amber-500 text-rose-950 rounded-2xl shadow-md space-y-1 border-2 border-amber-400">
                <div className="flex items-center justify-center gap-2 font-extrabold text-sm uppercase tracking-wide">
                  <Smartphone size={20} />
                  <span>{lang === 'bn' ? 'ক্যাশ অন ডেলিভারি (Cash on Delivery)' : 'CASH ON DELIVERY'}</span>
                </div>
                <p className="text-xs font-bold text-rose-950">
                  {lang === 'bn'
                    ? `📦 পণ্য হাতে পাওয়ার পর ডেলিভারিম্যানকে প্রদেয়: ৳${confirmedOrder.totalAmount.toLocaleString()}`
                    : `📦 Amount to pay delivery driver upon arrival: ৳${confirmedOrder.totalAmount.toLocaleString()}`}
                </p>
              </div>
            )}

            {/* Order Invoice Details & Scannable QR Code */}
            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 text-left space-y-4 max-w-md mx-auto relative overflow-hidden">
              <div className="flex justify-between items-start border-b border-stone-200 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                    {lang === 'bn' ? 'অর্ডার ট্র্যাকিং আইডি' : 'ORDER TRACKING ID'}
                  </span>
                  <span className="text-lg font-mono font-black text-rose-950">{confirmedOrder.id}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                    {lang === 'bn' ? 'তারিখ' : 'DATE'}
                  </span>
                  <span className="text-xs font-bold text-stone-700">{confirmedOrder.createdAt}</span>
                </div>
              </div>

              <div className="text-xs space-y-1.5 text-stone-800 font-medium">
                <p><strong className="text-stone-900">{lang === 'bn' ? 'গ্রাহকের নাম:' : 'Customer:'}</strong> {confirmedOrder.customerName}</p>
                <p><strong className="text-stone-900">{lang === 'bn' ? 'মোবাইল নম্বর:' : 'Phone:'}</strong> {confirmedOrder.phone}</p>
                <p><strong className="text-stone-900">{lang === 'bn' ? 'ডেলিভারি ঠিকানা:' : 'Address:'}</strong> {confirmedOrder.address}, {confirmedOrder.city}</p>
                <p><strong className="text-stone-900">{lang === 'bn' ? 'পেমেন্ট মেথড:' : 'Payment:'}</strong> {confirmedOrder.paymentMethod.toUpperCase()} {confirmedOrder.trxId ? `(TrxID: ${confirmedOrder.trxId})` : ''}</p>
                <p><strong className="text-stone-900">{lang === 'bn' ? 'প্রদেয় বাকি (Amount Due):' : 'Amount Due:'}</strong> <span className={confirmedOrder.amountDue === 0 ? "text-emerald-600 font-extrabold text-sm" : "text-amber-700 font-extrabold text-sm"}>৳{confirmedOrder.amountDue.toLocaleString()}</span></p>
              </div>

              {/* Real Scannable QR Code Box */}
              <div className="pt-3 border-t border-stone-200 flex items-center justify-between bg-white p-3 rounded-xl border border-stone-300">
                <div className="space-y-0.5 max-w-[220px]">
                  <p className="text-xs font-bold text-rose-950 flex items-center gap-1">
                    <QrCode size={14} className="text-amber-600" />
                    <span>{lang === 'bn' ? 'স্ক্যান করতে QR কোড' : 'Scannable QR Verification'}</span>
                  </p>
                  <p className="text-[10px] text-stone-500 leading-tight">
                    {lang === 'bn' 
                      ? 'যেকোনো মোবাইল ক্যামেরা দিয়ে এই QR কোড স্ক্যান করলে সরাসরি অরিজিনাল অর্ডার ভেরিফিকেশন দেখতে পাবেন।' 
                      : 'Scan with any phone camera to verify real order status.'}
                  </p>
                </div>
                {qrCodeDataUrl ? (
                  <img 
                    src={qrCodeDataUrl} 
                    alt={`QR Code for ${confirmedOrder.id}`} 
                    className="w-20 h-20 border border-stone-300 rounded-lg p-1 bg-white shadow-xs shrink-0" 
                  />
                ) : (
                  <div className="w-20 h-20 bg-stone-100 rounded-lg flex items-center justify-center text-[10px] text-stone-400">
                    Generating...
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(confirmedOrder.id);
                  alert(lang === 'bn' ? 'অর্ডার আইডি কপি করা হয়েছে!' : 'Order ID copied!');
                }}
                className="px-4 py-2.5 rounded-xl bg-stone-100 text-stone-800 text-xs font-bold flex items-center gap-1.5 hover:bg-stone-200 transition-colors cursor-pointer"
              >
                <Copy size={14} />
                <span>{lang === 'bn' ? 'আইডি কপি করুন' : 'Copy Order ID'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-amber-500 text-rose-950 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-400 transition-colors cursor-pointer"
              >
                <Printer size={14} />
                <span>{lang === 'bn' ? 'ইনভয়েস প্রিন্ট' : 'Print Invoice'}</span>
              </button>

              <button
                onClick={() => {
                  setConfirmedOrder(null);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-rose-950 text-amber-200 text-xs font-bold hover:bg-rose-900 transition-colors cursor-pointer"
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
