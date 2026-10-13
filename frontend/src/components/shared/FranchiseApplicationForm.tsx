'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, ChevronDown, Check } from 'lucide-react';
import { submitInquiry } from '@/lib/api';
import { redirectToWhatsApp } from '@/lib/whatsapp';

const PROFILE_CATEGORIES = [
  'Salaried Professional (Job Worker)',
  'Existing Entrepreneur (Business Person)',
  'Senior Officer / Community Leader',
  'NRI / Institutional Investor',
  'Other / Custom Profile',
];

interface FranchiseApplicationFormProps {
  isMobile?: boolean;
}

export default function FranchiseApplicationForm({ isMobile = false }: FranchiseApplicationFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: 'Vadodara, Gujarat',
    category: 'Salaried Professional (Job Worker)',
    customCategory: '',
    timeline: 'Immediate',
    message: '',
    fax_number: '',
  });

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const effectiveCategory =
    formData.category === 'Other / Custom Profile'
      ? (formData.customCategory.trim() ? `Custom: ${formData.customCategory.trim()}` : 'Other / Custom Profile')
      : formData.category;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Anti-bot honeypot defense
    if (formData.fax_number) {
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    let referenceCode = '';

    type ApiResponse = {
      success: boolean;
      message: string;
      data?: { referenceCode?: string };
    };

    try {
      const apiPromise = submitInquiry({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        propertyInterest: `Franchise Application: ${effectiveCategory} (${formData.city})`,
        specialRequests: formData.message ? `Notes: ${formData.message}` : 'Shivmax Franchise Consultation',
        tourType: 'Shivmax Franchise Consultation',
      });

      const fallbackCode = `SHV-VIP-${Math.floor(100000 + Math.random() * 900000)}`;

      const res = await Promise.race<ApiResponse>([
        apiPromise,
        new Promise<ApiResponse>((r) =>
          setTimeout(
            () =>
              r({
                success: true,
                message: 'Application recorded. Connecting to WhatsApp...',
                data: { referenceCode: fallbackCode },
              }),
            700
          )
        ),
      ]);

      referenceCode = res?.data?.referenceCode || fallbackCode;
    } catch (err: unknown) {
      console.warn('API submission error, proceeding directly to WhatsApp:', err);
    } finally {
      redirectToWhatsApp({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        category: effectiveCategory,
        timeline: formData.timeline,
        message: formData.message,
        referenceCode,
      });
      setIsSubmitting(false);
    }
  };

  if (isMobile) {
    return (
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Anti-Bot Honeypot Field */}
        <div className="opacity-0 absolute -left-[9999px] -top-[9999px] h-0 w-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <input
            type="text"
            name="fax_number"
            tabIndex={-1}
            autoComplete="off"
            value={formData.fax_number}
            onChange={(e) => setFormData({ ...formData, fax_number: e.target.value })}
          />
        </div>

        <input
          type="text"
          required
          aria-label="Full Name"
          placeholder="Full Name *"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className="w-full px-3.5 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-base sm:text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
        />
        <input
          type="tel"
          required
          aria-label="Mobile Number (WhatsApp)"
          pattern="[0-9+\s\-()]{7,25}"
          title="Please enter a valid phone number between 7 and 25 digits"
          placeholder="Mobile Number (WhatsApp) *"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-3.5 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-base sm:text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37] font-mono"
        />
        <input
          type="email"
          required
          aria-label="Email Address"
          placeholder="Email Address *"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3.5 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-base sm:text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
        />
        <input
          type="text"
          required
          aria-label="Target City"
          placeholder="Target City *"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          className="w-full px-3.5 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-base sm:text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
        />

        {/* Theme-Matched Luxury Dropdown (Mobile) */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            role="combobox"
            aria-expanded={isCategoryOpen}
            aria-controls="mobile-category-list"
            aria-haspopup="listbox"
            aria-label="Select Profile Category"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="w-full px-3.5 py-3 rounded-xl bg-[#0a0d14] border border-[#d4af37]/40 hover:border-[#d4af37] focus:border-[#d4af37] text-left text-xs text-white transition-all cursor-pointer flex items-center justify-between"
          >
            <span className="truncate">{formData.category}</span>
            <ChevronDown className={`w-4 h-4 text-[#d4af37] transition-transform duration-300 ml-2 flex-shrink-0 ${isCategoryOpen ? 'rotate-180' : ''}`} />
          </button>

          {isCategoryOpen && (
            <div
              id="mobile-category-list"
              role="listbox"
              aria-label="Profile Categories"
              className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl bg-[#090c13] border border-[#d4af37]/45 shadow-[0_15px_45px_rgba(0,0,0,0.95)] backdrop-blur-2xl py-1.5 overflow-hidden"
            >
              {PROFILE_CATEGORIES.map((cat) => {
                const isSelected = formData.category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setFormData({ ...formData, category: cat });
                      setIsCategoryOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#d4af37]/15 text-[#fbf5b7] font-medium'
                        : 'text-slate-300 hover:text-white hover:bg-[#d4af37]/10'
                    }`}
                  >
                    <span>{cat}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#d4af37]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {formData.category === 'Other / Custom Profile' && (
          <input
            type="text"
            required
            aria-label="Specify your background or profession"
            placeholder="Please specify your profession or background *"
            value={formData.customCategory}
            onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-[#d4af37]/50 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
          />
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-xl text-xs font-semibold tracking-wider uppercase text-black bg-gradient-to-r from-[#d4af37] to-[#fbf5b7] shadow-lg cursor-pointer flex items-center justify-center gap-2"
        >
          {isSubmitting ? 'Connecting...' : 'Submit to Executive WhatsApp Desk'}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      {/* Anti-Bot Honeypot Field */}
      <div className="opacity-0 absolute -left-[9999px] -top-[9999px] h-0 w-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <input
          type="text"
          name="fax_number"
          tabIndex={-1}
          autoComplete="off"
          value={formData.fax_number}
          onChange={(e) => setFormData({ ...formData, fax_number: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="franchise-fullname" className="text-[10.5px] font-mono uppercase tracking-wider text-slate-300 block">
            Full Name *
          </label>
          <input
            id="franchise-fullname"
            type="text"
            required
            placeholder="e.g. Rajesh Kumar"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-[#d4af37] focus:outline-none text-base sm:text-xs text-white placeholder-slate-500 transition-all"
          />
        </div>

        {/* Mobile / WhatsApp */}
        <div className="space-y-1.5">
          <label htmlFor="franchise-phone" className="text-[10.5px] font-mono uppercase tracking-wider text-slate-300 block">
            Mobile Number (WhatsApp) *
          </label>
          <input
            id="franchise-phone"
            type="tel"
            required
            pattern="[0-9+\s\-()]{7,25}"
            title="Please enter a valid phone number between 7 and 25 digits"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-[#d4af37] focus:outline-none text-base sm:text-xs text-white placeholder-slate-500 transition-all font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="franchise-email" className="text-[10.5px] font-mono uppercase tracking-wider text-slate-300 block">
            Email Address *
          </label>
          <input
            id="franchise-email"
            type="email"
            required
            placeholder="rajesh@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-[#d4af37] focus:outline-none text-base sm:text-xs text-white placeholder-slate-500 transition-all"
          />
        </div>

        {/* Target City */}
        <div className="space-y-1.5">
          <label htmlFor="franchise-city" className="text-[10.5px] font-mono uppercase tracking-wider text-slate-300 block">
            Target City / Location *
          </label>
          <input
            id="franchise-city"
            type="text"
            required
            placeholder="e.g. Vadodara, Ahmedabad, Surat"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-[#d4af37] focus:outline-none text-base sm:text-xs text-white placeholder-slate-500 transition-all"
          />
        </div>
      </div>

      {/* Target Profile Category — Theme-Matched Luxury Dropdown */}
      <div className="space-y-1.5" ref={dropdownRef}>
        <label id="franchise-category-label" className="text-[10.5px] font-mono uppercase tracking-wider text-slate-300 block">
          Your Profile Category *
        </label>
        <div className="relative">
          <button
            type="button"
            role="combobox"
            aria-labelledby="franchise-category-label"
            aria-expanded={isCategoryOpen}
            aria-controls="desktop-category-list"
            aria-haspopup="listbox"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="w-full px-4 py-2.5 rounded-xl bg-[#0a0d14] border border-[#d4af37]/40 hover:border-[#d4af37] focus:border-[#d4af37] text-left text-base sm:text-xs text-white transition-all cursor-pointer flex items-center justify-between shadow-inner"
          >
            <span className="truncate">{formData.category}</span>
            <ChevronDown className={`w-4 h-4 text-[#d4af37] transition-transform duration-300 ml-2 flex-shrink-0 ${isCategoryOpen ? 'rotate-180' : ''}`} />
          </button>

          {isCategoryOpen && (
            <div
              id="desktop-category-list"
              role="listbox"
              aria-labelledby="franchise-category-label"
              className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl bg-[#090c13] border border-[#d4af37]/45 shadow-[0_15px_45px_rgba(0,0,0,0.95)] backdrop-blur-2xl py-1.5 overflow-hidden"
            >
              {PROFILE_CATEGORIES.map((cat) => {
                const isSelected = formData.category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setFormData({ ...formData, category: cat });
                      setIsCategoryOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#d4af37]/15 text-[#fbf5b7] font-medium'
                        : 'text-slate-300 hover:text-white hover:bg-[#d4af37]/10'
                    }`}
                  >
                    <span>{cat}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#d4af37]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Custom Profile Specification Field */}
        {formData.category === 'Other / Custom Profile' && (
          <div className="pt-1.5 animate-in fade-in duration-200">
            <input
              type="text"
              required
              aria-label="Specify your background or profession"
              placeholder="Specify your background / profession (e.g. Doctor, Architect, Consultant)..."
              value={formData.customCategory}
              onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-white/[0.04] border border-[#d4af37]/40 focus:border-[#d4af37] focus:outline-none text-base sm:text-xs text-white placeholder-slate-500 transition-all"
            />
          </div>
        )}
      </div>

      {/* Special Strategic Notes */}
      <div className="space-y-1.5">
        <label htmlFor="franchise-message" className="text-[10.5px] font-mono uppercase tracking-wider text-slate-300 block">
          Background &amp; Strategic Ambitions (Optional)
        </label>
        <textarea
          id="franchise-message"
          rows={2}
          placeholder="Share relevant domain background, network reach, or preferred location..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-[#d4af37] focus:outline-none text-base sm:text-xs text-white placeholder-slate-500 transition-all resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 rounded-xl text-xs font-semibold tracking-[0.2em] uppercase text-black bg-gradient-to-r from-[#d4af37] via-[#fbf5b7] to-[#b38728] hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_0_30px_rgba(212,175,55,0.35)] cursor-pointer flex items-center justify-center gap-2 mt-2"
      >
        {isSubmitting ? (
          <span>Generating Credentials...</span>
        ) : (
          <>
            <Send className="w-3.5 h-3.5 text-black" />
            <span>Submit &amp; Connect to Executive WhatsApp Desk</span>
          </>
        )}
      </button>

      <p className="text-[10.5px] text-center text-slate-400 font-light">
        Protected by Shivmax Non-Disclosure &bull; 100% Confidential Direct Desk Review
      </p>
    </form>
  );
}
