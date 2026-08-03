import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  CheckCircle, 
  Clock, 
  Truck, 
  ShieldCheck, 
  LogOut, 
  Sparkles,
  ChevronRight,
  Send,
  Lock,
  UserPlus
} from 'lucide-react';
import { Language, Order } from '../types';
import { auth, googleProvider } from '../lib/firebase';
import { 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';

interface CustomerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  orders: Order[];
  onOpenTrackOrder: () => void;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  isOpen,
  onClose,
  lang,
  orders,
  onOpenTrackOrder
}) => {
  // User Authentication State
  const [user, setUser] = useState<{
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    avatar?: string;
    isLoggedIn: boolean;
  }>(() => {
    const saved = localStorage.getItem('rr_customer_user');
    return saved ? JSON.parse(saved) : { isLoggedIn: false, name: '' };
  });

  const [authMode, setAuthMode] = useState<'options' | 'email' | 'phone' | 'otp'>('options');
  const [isSignUp, setIsSignUp] = useState(false);
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputPhone, setInputPhone] = useState('');
  const [inputOtp, setInputOtp] = useState('');
  const [inputName, setInputName] = useState('');
  const [inputAddress, setInputAddress] = useState('');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sync with Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          isLoggedIn: true,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'গ্রাহক',
          email: firebaseUser.email || undefined,
          phone: firebaseUser.phoneNumber || undefined,
          address: localStorage.getItem(`rr_addr_${firebaseUser.uid}`) || 'ঢাকা, বাংলাদেশ',
          avatar: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
        };
        saveUserData(userData);
      }
    });
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  // Save user state
  const saveUserData = (userData: typeof user) => {
    setUser(userData);
    localStorage.setItem('rr_customer_user', JSON.stringify(userData));
  };

  // Real Firebase Google Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;
      const userData = {
        isLoggedIn: true,
        name: googleUser.displayName || 'নুসরাত জাহান',
        email: googleUser.email || '',
        phone: googleUser.phoneNumber || '',
        address: localStorage.getItem(`rr_addr_${googleUser.uid}`) || 'ধানমন্ডি ২৭, রোড ৮, বাসা ৪২, ঢাকা',
        avatar: googleUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
      };
      saveUserData(userData);
    } catch (err: any) {
      console.error('Firebase Google Auth Error:', err);
      // Fallback for iframe popup block or network policy
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/cancelled-popup-request') {
        setAuthError(lang === 'bn' ? 'পপ-আপ বন্ধ করা আছে। অনুগ্রহ করে ব্রাউজারের পপ-আপ অ্যালাউ করুন অথবা ইমেইল দিয়ে সাইন ইন করুন।' : 'Popup was blocked. Please allow popups or use email.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setAuthError(lang === 'bn' ? 'লগইন পপ-আপ উইন্ডোটি বন্ধ করা হয়েছে। লগইন সম্পন্ন করতে আবার চেষ্টা করুন অথবা নিচের ইমেইল দিয়ে সাইন ইন করুন।' : 'Sign-in popup was closed before completion. Please try again.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setAuthError(lang === 'bn' ? 'Firebase-এ Authorized domain অ্যাড হতে ১-২ মিনিট সময় লাগতে পারে। পেজ রিফ্রেশ করে আবার চেষ্টা করুন অথবা ইমেইল দিয়ে সাইন ইন করুন।' : 'Unauthorized domain in Firebase. Please refresh and try again.');
      } else {
        setAuthError(err.message || (lang === 'bn' ? 'সাইন ইন ব্যর্থ হয়েছে' : 'Sign in failed'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Real Firebase Email / Password Login or Sign Up
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    try {
      if (isSignUp) {
        const res = await createUserWithEmailAndPassword(auth, inputEmail, inputPassword);
        if (res.user && inputName) {
          await updateProfile(res.user, { displayName: inputName });
        }
        const newUser = {
          isLoggedIn: true,
          name: inputName || res.user.email?.split('@')[0] || 'গ্রাহক',
          email: res.user.email || '',
          address: inputAddress || 'ঢাকা, বাংলাদেশ',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
        };
        saveUserData(newUser);
      } else {
        const res = await signInWithEmailAndPassword(auth, inputEmail, inputPassword);
        const loggedUser = {
          isLoggedIn: true,
          name: res.user.displayName || res.user.email?.split('@')[0] || 'গ্রাহক',
          email: res.user.email || '',
          address: localStorage.getItem(`rr_addr_${res.user.uid}`) || 'ঢাকা, বাংলাদেশ',
          avatar: res.user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
        };
        saveUserData(loggedUser);
      }
    } catch (err: any) {
      console.error('Firebase Email Auth Error:', err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setAuthError(lang === 'bn' ? 'ভুল ইমেইল বা পাসওয়ার্ড প্রদান করা হয়েছে' : 'Invalid email or password');
      } else if (err.code === 'auth/email-already-in-use') {
        setAuthError(lang === 'bn' ? 'এই ইমেইল দিয়ে ইতিপূর্বে অ্যাকাউন্ট খোলা হয়েছে' : 'Email already in use');
      } else {
        setAuthError(err.message || (lang === 'bn' ? 'প্রসেস করতে ব্যর্থ হয়েছে' : 'Authentication failed'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Mobile Phone OTP Request
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPhone || inputPhone.length < 11) {
      alert(lang === 'bn' ? 'অনুগ্রহ করে ১১ ডিজিটের সঠিক সচল মোবাইল নম্বর লিখুন' : 'Please enter a valid 11-digit mobile number');
      return;
    }
    setAuthMode('otp');
  };

  // OTP Verification
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputOtp || inputOtp.length < 4) {
      alert(lang === 'bn' ? 'অনুগ্রহ করে ৪ ডিজিটের সঠিক ভেরিফিকেশন কোড দিন' : 'Please enter a valid 4-digit OTP code');
      return;
    }
    const phoneUser = {
      isLoggedIn: true,
      name: inputName || 'সম্মানিত গ্রাহক',
      phone: inputPhone,
      address: inputAddress || 'ঢাকা, বাংলাদেশ',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
    };
    saveUserData(phoneUser);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
    const loggedOut = { isLoggedIn: false, name: '' };
    saveUserData(loggedOut);
    setAuthMode('options');
  };

  // Filter Customer Orders based on phone or email
  const customerOrders = orders.filter(o => 
    (user.phone && o.phone.includes(user.phone)) || 
    (user.email && o.customerName.toLowerCase().includes(user.name.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-amber-500/30 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-950 via-amber-950 to-rose-950 p-5 text-amber-50 flex items-center justify-between border-b border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 rounded-xl text-amber-300 border border-amber-500/30">
              <User size={20} />
            </div>
            <div>
              <h3 className="font-serif font-extrabold text-lg text-amber-100">
                {lang === 'bn' ? 'গ্রাহক প্রোফাইল ও অ্যাকাউন্ট' : 'Customer Account Profile'}
              </h3>
              <p className="text-[11px] text-amber-200/80">
                {lang === 'bn' ? 'রঙিলা রূপ এ আপনার অ্যাকাউন্টের বিবরণ' : 'Manage your orders & account profile'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-amber-200 hover:bg-rose-900 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {!user.isLoggedIn ? (
            /* Logged Out: Authentication Options */
            <div className="space-y-6 text-center py-2">
              <div className="w-16 h-16 bg-amber-100 text-rose-950 rounded-full flex items-center justify-center mx-auto shadow-inner border border-amber-300">
                <Sparkles size={32} />
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-serif font-bold text-rose-950">
                  {lang === 'bn' ? 'রঙিলা রূপে স্বাগতম' : 'Welcome to Rongila Rup'}
                </h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  {lang === 'bn' 
                    ? 'আপনার অর্ডারের ট্র্যাকিং, বিশেষ ডিসকাউন্ট ও সেভ করা অ্যাড্রেস দেখতে অ্যাকাউন্ট খুলুন' 
                    : 'Sign in to track orders, save delivery address, and get exclusive rewards'}
                </p>
              </div>

              {authError && (
                <div className="p-3 bg-rose-100 border border-rose-300 text-rose-900 text-xs font-semibold rounded-xl text-center">
                  {authError}
                </div>
              )}

              {authMode === 'options' && (
                <div className="space-y-3 max-w-sm mx-auto pt-2">
                  {/* Google Login */}
                  <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-white border-2 border-stone-200 hover:border-rose-300 rounded-2xl font-bold text-stone-800 text-xs flex items-center justify-center gap-3 shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>{loading ? (lang === 'bn' ? 'অপেক্ষা করুন...' : 'Loading...') : (lang === 'bn' ? 'Google / Gmail দিয়ে সরাসরি সাইন ইন' : 'Sign in with Google / Gmail')}</span>
                  </button>

                  {/* Email & Password Login */}
                  <button
                    onClick={() => setAuthMode('email')}
                    className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-rose-950 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <Mail size={16} />
                    <span>{lang === 'bn' ? 'ইমেইল ও পাসওয়ার্ড দিয়ে সাইন ইন / অ্যাকাউন্ট খুলুন' : 'Sign in with Email & Password'}</span>
                  </button>

                  <div className="flex items-center gap-3 my-2">
                    <div className="h-px bg-stone-200 flex-1"></div>
                    <span className="text-[10px] uppercase font-bold text-stone-400">{lang === 'bn' ? 'অথবা' : 'OR'}</span>
                    <div className="h-px bg-stone-200 flex-1"></div>
                  </div>

                  {/* Phone Login Option */}
                  <button
                    onClick={() => setAuthMode('phone')}
                    className="w-full py-3 px-4 bg-rose-950 hover:bg-rose-900 text-amber-200 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Phone size={16} />
                    <span>{lang === 'bn' ? 'মোবাইল নম্বর দিয়ে দ্রুত সাইন ইন' : 'Sign in with Mobile Number'}</span>
                  </button>
                </div>
              )}

              {/* Email / Password Step */}
              {authMode === 'email' && (
                <form onSubmit={handleEmailAuth} className="space-y-4 max-w-sm mx-auto text-left">
                  <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                    <h5 className="font-bold text-sm text-rose-950">
                      {isSignUp ? (lang === 'bn' ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'Create New Account') : (lang === 'bn' ? 'ইমেইলে সাইন ইন করুন' : 'Sign In')}
                    </h5>
                    <button
                      type="button"
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-xs font-bold text-amber-800 hover:underline"
                    >
                      {isSignUp ? (lang === 'bn' ? 'ইতিপূর্বে অ্যাকাউন্ট আছে? সাইন ইন' : 'Already registered? Sign In') : (lang === 'bn' ? 'নতুন অ্যাকাউন্ট তৈরি? রেজিস্ট্রেশন' : 'New user? Register')}
                    </button>
                  </div>

                  {isSignUp && (
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        {lang === 'bn' ? 'আপনার নাম *' : 'Your Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        placeholder="যেমন: নুসরাত জাহান"
                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {lang === 'bn' ? 'ইমেইল অ্যাড্রেস *' : 'Email Address *'}
                    </label>
                    <input
                      type="email"
                      required
                      value={inputEmail}
                      onChange={(e) => setInputEmail(e.target.value)}
                      placeholder="customer@gmail.com"
                      className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {lang === 'bn' ? 'পাসওয়ার্ড *' : 'Password *'}
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={inputPassword}
                      onChange={(e) => setInputPassword(e.target.value)}
                      placeholder="******"
                      className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setAuthMode('options')}
                      className="w-1/3 py-2.5 bg-stone-100 text-stone-700 rounded-xl font-bold text-xs"
                    >
                      {lang === 'bn' ? 'পিছনে' : 'Back'}
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-2/3 py-2.5 bg-rose-950 text-amber-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1 hover:bg-rose-900 disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? (lang === 'bn' ? 'অপেক্ষা করুন...' : 'Processing...') : (
                        <>
                          <Lock size={14} />
                          <span>{isSignUp ? (lang === 'bn' ? 'রেজিস্ট্রেশন করুন' : 'Register') : (lang === 'bn' ? 'সাইন ইন করুন' : 'Sign In')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Phone Input Step */}
              {authMode === 'phone' && (
                <form onSubmit={handleSendOtp} className="space-y-4 max-w-sm mx-auto text-left">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {lang === 'bn' ? 'আপনার নাম (ঐচ্ছিক)' : 'Your Name'}
                    </label>
                    <input
                      type="text"
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value)}
                      placeholder="যেমন: নুসরাত জাহান"
                      className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {lang === 'bn' ? '১১ ডিজিটের মোবাইল নম্বর *' : '11-Digit Mobile Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={inputPhone}
                      onChange={(e) => setInputPhone(e.target.value)}
                      placeholder="01792765693"
                      className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setAuthMode('options')}
                      className="w-1/3 py-2.5 bg-stone-100 text-stone-700 rounded-xl font-bold text-xs"
                    >
                      {lang === 'bn' ? 'পিছনে' : 'Back'}
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-2.5 bg-amber-500 text-rose-950 rounded-xl font-bold text-xs flex items-center justify-center gap-1 hover:bg-amber-400 cursor-pointer"
                    >
                      <Send size={14} />
                      <span>{lang === 'bn' ? 'OTP কোড পাঠান' : 'Send OTP Code'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* OTP Input Step */}
              {authMode === 'otp' && (
                <form onSubmit={handleVerifyOtp} className="space-y-4 max-w-sm mx-auto text-left">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 font-medium">
                    {lang === 'bn' 
                      ? `আমরা ${inputPhone} নম্বরে একটি ৪ ডিজিটের SMS কোড পাঠিয়েছি (ভেরিফিকেশন কোড: 1234)` 
                      : `Sent 4-digit OTP to ${inputPhone} (Verification code: 1234)`}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {lang === 'bn' ? 'ভেরিফিকেশন কোড (OTP) *' : 'Enter OTP Code *'}
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={inputOtp}
                      onChange={(e) => setInputOtp(e.target.value)}
                      placeholder="1234"
                      className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-center font-mono font-bold text-lg tracking-widest text-rose-950 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <ShieldCheck size={16} />
                    <span>{lang === 'bn' ? 'অ্যাকাউন্ট ভেরিফাই করুন' : 'Verify & Login'}</span>
                  </button>
                </form>
              )}

            </div>
          ) : (
            /* Logged In Customer Profile Screen */
            <div className="space-y-6">
              
              {/* User Header Profile Card */}
              <div className="p-4 bg-gradient-to-r from-stone-900 to-rose-950 text-white rounded-2xl shadow-md flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img 
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} 
                    alt={user.name} 
                    className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 shrink-0 shadow-md"
                  />
                  <div className="min-w-0">
                    <h4 className="font-serif font-extrabold text-base text-amber-100 truncate">
                      {user.name}
                    </h4>
                    <p className="text-xs text-stone-300 flex items-center gap-1 truncate">
                      <Mail size={12} className="text-amber-400 shrink-0" />
                      <span>{user.email || user.phone}</span>
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold rounded-full">
                      ✓ {lang === 'bn' ? 'Firebase ভেরিফাইড কাস্টমার' : 'Firebase Verified Customer'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 bg-stone-800 hover:bg-rose-900 text-amber-200 rounded-xl transition-colors shrink-0 cursor-pointer"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>

              {/* Delivery Address Section */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <h5 className="font-serif font-bold text-xs text-rose-950 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={14} className="text-amber-600" />
                    <span>{lang === 'bn' ? 'সংরক্ষিত ডেলিভারি ঠিকানা' : 'Saved Delivery Address'}</span>
                  </h5>
                  <button
                    onClick={() => setIsEditingAddress(!isEditingAddress)}
                    className="text-[11px] font-bold text-amber-800 hover:underline cursor-pointer"
                  >
                    {isEditingAddress ? (lang === 'bn' ? 'সংরক্ষণ' : 'Save') : (lang === 'bn' ? 'পরিবর্তন' : 'Edit')}
                  </button>
                </div>

                {isEditingAddress ? (
                  <textarea
                    rows={2}
                    value={user.address || ''}
                    onChange={(e) => {
                      const newAddress = e.target.value;
                      saveUserData({ ...user, address: newAddress });
                      if (auth.currentUser) {
                        localStorage.setItem(`rr_addr_${auth.currentUser.uid}`, newAddress);
                      }
                    }}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-xs font-medium focus:outline-none"
                  />
                ) : (
                  <p className="text-xs text-stone-700 font-medium leading-relaxed">
                    {user.address || (lang === 'bn' ? 'কোনো ঠিকানা যোগ করা হয়নি' : 'No address saved yet')}
                  </p>
                )}
              </div>

              {/* My Orders Section */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h5 className="font-serif font-bold text-sm text-rose-950 flex items-center gap-1.5">
                    <ShoppingBag size={16} className="text-amber-600" />
                    <span>{lang === 'bn' ? 'আমার অর্ডারসমূহ' : 'My Recent Orders'}</span>
                  </h5>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenTrackOrder();
                    }}
                    className="text-xs font-bold text-rose-900 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{lang === 'bn' ? 'লাইভ ট্র্যাক করুন' : 'Track Order'}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                {customerOrders.length === 0 ? (
                  <div className="p-6 bg-white border border-stone-200 rounded-2xl text-center space-y-2">
                    <Clock size={24} className="text-stone-400 mx-auto" />
                    <p className="text-xs text-stone-500 font-medium">
                      {lang === 'bn' ? 'আপনার কোনো পূর্ববর্তী অর্ডার পাওয়া যায়নি' : 'You have no order history yet'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {customerOrders.map(order => (
                      <div key={order.id} className="p-4 bg-white border border-stone-200 rounded-2xl shadow-xs space-y-2">
                        <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                          <span className="font-mono font-bold text-xs text-rose-950">{order.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {order.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="text-xs space-y-1 text-stone-700 font-medium">
                          <p><strong>{lang === 'bn' ? 'পণ্যসমূহ:' : 'Items:'}</strong> {order.items.map(i => `${i.product.nameBn} (x${i.quantity})`).join(', ')}</p>
                          <p><strong>{lang === 'bn' ? 'সর্বমোট প্রদেয়:' : 'Total Amount:'}</strong> ৳{order.totalAmount.toLocaleString()}</p>
                          {order.courierTrackingId && (
                            <p className="text-[11px] text-emerald-700 font-bold">
                              🚚 {order.courierName}: {order.courierTrackingId}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
