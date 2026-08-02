import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, ArrowRight, ShoppingBag } from 'lucide-react';
import { Language, AIStylistMessage, Product } from '../types';

interface AIStylistWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  products: Product[];
  onQuickViewProduct: (p: Product) => void;
}

export const AIStylistWidget: React.FC<AIStylistWidgetProps> = ({
  isOpen,
  onClose,
  lang,
  products,
  onQuickViewProduct
}) => {
  const [messages, setMessages] = useState<AIStylistMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: lang === 'bn'
        ? 'নমস্কার/সালাম! আমি "রঙিলা রূপ AI স্টাইলিস্ট"। গায়ে হলুদ, বিয়ে, বৈশাখ, ঈদ বা যেকোনো উৎসবের পোশাক ও গহনা নির্বাচনে আপনাকে সাহায্য করতে প্রস্তুত। আপনি কি ধরণের পোশাক খুঁজছেন?'
        : 'Welcome! I am your "Rongila Rup AI Stylist". I can help you find the perfect sarees, panjabis, or traditional jewelry for any wedding, Boishakh, Eid, or festive occasion. What are you looking for today?',
      recommendedProductIds: ['rr-saree-001', 'rr-panjabi-001'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const presetQuestions = lang === 'bn' ? [
    'গায়ে হলুদের জন্য শাড়ি ও ম্যাচিং গহনা দেখাও',
    '৫,০০০ টাকার মধ্যে ঈদ বা অনুষ্ঠানের পাঞ্জাবি',
    'বউভাতের জন্য সবচেয়ে গর্জিয়াস শাড়ি কোনটা?',
    'পহেলা বৈশাখ ও ফাল্গুনের বাসন্তী কালেকশন'
  ] : [
    'Show me sarees & matching jewelry for Gaye Holud',
    'Best silk Panjabi under 5,000 BDT',
    'Which is the most gorgeous saree for wedding reception?',
    'Basanti Yellow spring collection'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const queryText = textToSend || input;
    if (!queryText.trim() || loading) return;

    const userMsg: AIStylistMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/stylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          lang,
          catalog: products
        })
      });

      const data = await response.json();

      const assistantMsg: AIStylistMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || (lang === 'bn' ? 'স্টাইলিস্ট আপনাকে সুন্দর একটি সাজ সাজেস্ট করেছে!' : 'Here are style recommendations for you!'),
        recommendedProductIds: data.recommendedProductIds || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: lang === 'bn' 
            ? 'নেটওয়ার্ক সমস্যার কারণে কিছু সময় পর চেষ্টা করুন। আমাদের ঢাকাই জামদানি ও রয়্যাল ব্লু পাঞ্জাবি দেখতে পারেন!'
            : 'Temporarily unable to connect. Check out our Dhakai Jamdani and Royal Blue Panjabis!',
          recommendedProductIds: ['rr-saree-001', 'rr-panjabi-001'],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm flex justify-end items-end p-2 sm:p-4">
      <div className="w-full max-w-lg bg-stone-50 rounded-3xl shadow-2xl h-[85vh] flex flex-col overflow-hidden border border-amber-500/30">
        
        {/* Header */}
        <div className="px-5 py-3.5 bg-rose-950 text-amber-50 flex items-center justify-between border-b border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 p-0.5 flex items-center justify-center shadow-md">
              <Bot size={20} className="text-rose-950" />
            </div>
            <div>
              <h3 className="text-sm font-serif font-bold text-amber-100 flex items-center gap-1">
                <span>{lang === 'bn' ? 'রঙিলা রূপ AI স্টাইলিস্ট' : 'Rongila Rup AI Stylist'}</span>
                <Sparkles size={14} className="text-amber-400 animate-pulse" />
              </h3>
              <span className="text-[10px] text-amber-300/80">
                {lang === 'bn' ? 'অনলাইন ফ্যাশন অ্যাডভাইজর' : 'Online Fashion Advisor'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-rose-900 text-amber-200 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Chat Message List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-rose-950 text-amber-100 rounded-br-none'
                    : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none space-y-2'
                }`}
              >
                <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                {/* Recommended Product Cards inside chat */}
                {msg.recommendedProductIds && msg.recommendedProductIds.length > 0 && (
                  <div className="pt-2 border-t border-stone-100 space-y-2">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                      {lang === 'bn' ? 'সাজেস্টেড কালেকশন:' : 'Suggested Products:'}
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {msg.recommendedProductIds.map(id => {
                        const matched = products.find(p => p.id === id);
                        if (!matched) return null;
                        return (
                          <div 
                            key={matched.id}
                            onClick={() => onQuickViewProduct(matched)}
                            className="flex items-center gap-2.5 p-2 bg-amber-50/70 hover:bg-amber-100/80 rounded-xl border border-amber-200 cursor-pointer transition-colors"
                          >
                            <img src={matched.image} alt={matched.nameEn} className="w-10 h-12 object-cover rounded-lg shrink-0" referrerPolicy="no-referrer" />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-serif font-bold text-[11px] text-stone-900 truncate">
                                {lang === 'bn' ? matched.nameBn : matched.nameEn}
                              </h5>
                              <span className="text-xs font-bold text-rose-900">৳{matched.price.toLocaleString()}</span>
                            </div>
                            <ArrowRight size={14} className="text-amber-700" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[9px] text-stone-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-stone-500 text-xs italic p-2 bg-white rounded-2xl border border-stone-200 w-max">
              <Bot size={14} className="animate-spin text-amber-600" />
              <span>{lang === 'bn' ? 'স্টাইলিস্ট সাজেশন তৈরি করছে...' : 'AI Stylist is thinking...'}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Preset Prompt Pills */}
        <div className="p-2.5 bg-amber-50/80 border-t border-stone-200 overflow-x-auto flex gap-2">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 rounded-full bg-white border border-amber-300 text-[11px] font-medium text-amber-950 hover:bg-amber-50 shrink-0 transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={lang === 'bn' ? 'স্টাইলিস্টকে যেকোনো প্রশ্ন জিজ্ঞেস করুন...' : 'Ask your style question...'}
            className="flex-1 px-3.5 py-2 bg-stone-100 border border-stone-200 rounded-full text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={loading || !input.trim()}
            className="p-2 rounded-full bg-rose-950 hover:bg-rose-900 text-amber-300 disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Send size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};
