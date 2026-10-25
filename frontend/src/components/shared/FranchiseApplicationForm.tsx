'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, ChevronDown, Check, AlertCircle, ExternalLink } from 'lucide-react';
import { submitInquiry } from '@/lib/api';
import { redirectToWhatsApp, getWhatsAppUrl } from '@/lib/whatsapp';

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
  });

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string>('');
  const [successUrl, setSuccessUrl] = useState<string | null>(null);

  // Close category dropdown on click outside
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

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full Name is required';
    }

    const digitsOnly = formData.phone.replace(/[^0-9]/g, '');
    if (!digitsOnly || digitsOnly.length < 7) {
      errors.phone = 'Please enter a valid phone number with at least 7 digits';
    }

    if (!formData.email.trim() || !formData.email.includes('@') || !formData.email.includes('.')) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.city.trim()) {
      errors.city = 'Target city / location is required';
    }

    if (formData.category === 'Other / Custom Profile' && !formData.customCategory.trim()) {
      errors.customCategory = 'Please specify your profession or background';
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstKey = Object.keys(errors)[0];
      setGeneralError(errors[firstKey]);

      // Focus the first invalid input
      const inputId = isMobile ? `mobile-franchise-${firstKey}` : `desktop-franchise-${firstKey}`;
      const el = document.getElementById(inputId);
      if (el) el.focus();
      return false;
    }

    setGeneralError('');
    return true;
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
      if (generalError === fieldErrors[field]) {
        setGeneralError('');
      }
    }
  };

  const submitApplication = async (preOpenedWindow?: Window | null) => {
    const isValid = validate();
    if (!isValid) {
      if (preOpenedWindow && !preOpenedWindow.closed) {
        try {
          preOpenedWindow.close();
        } catch {}
      }
      return;
    }

    setIsSubmitting(true);
    setGeneralError('');

    const fallbackCode = `SHV-VIP-${Math.floor(100000 + Math.random() * 900000)}`;
    const submissionData = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      city: formData.city.trim(),
      category: effectiveCategory,
      timeline: formData.timeline,
      message: formData.message.trim(),
      referenceCode: fallbackCode,
      source: 'shivmax.com',
      propertyInterest: `Franchise Application: ${effectiveCategory} (${formData.city.trim()})`,
      specialRequests: formData.message.trim() ? `Notes: ${formData.message.trim()}` : 'Shivmax Franchise Consultation',
      tourType: 'Shivmax Franchise Consultation',
    };

    // 1. Immediately cache locally in browser
    if (typeof window !== 'undefined') {
      try {
        const cacheKey = 'shivmax_franchise_inquiries_cache';
        const existing = JSON.parse(localStorage.getItem(cacheKey) || '[]');
        existing.unshift({
          ...submissionData,
          submittedAt: new Date().toISOString(),
        });
        localStorage.setItem(cacheKey, JSON.stringify(existing.slice(0, 50)));
      } catch {}
    }

    // 2. Immediate Background Beacon (survives redirects, zero latency)
    let crmApiUrl = process.env.NEXT_PUBLIC_CRM_API_URL;
    if (!crmApiUrl) {
      if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        crmApiUrl = 'http://localhost:5001/api';
      } else {
        crmApiUrl = 'https://crm-shivmax.onrender.com/api';
      }
    }

    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      try {
        const beaconBlob = new Blob([JSON.stringify(submissionData)], { type: 'application/json' });
        navigator.sendBeacon(`${crmApiUrl}/public/franchise-inquiry`, beaconBlob);
      } catch {}
    }

    // 3. Fast CRM API Sync with rapid 1.2s timeout so applicant is never kept waiting
    let finalCode = fallbackCode;
    try {
      type ApiRes = { success: boolean; data?: { referenceCode?: string } };
      const res = await Promise.race<ApiRes>([
        submitInquiry(submissionData),
        new Promise<ApiRes>((resolve) =>
          setTimeout(() => resolve({ success: true, data: { referenceCode: fallbackCode } }), 1200)
        ),
      ]);
      if (res?.data?.referenceCode) {
        finalCode = res.data.referenceCode;
      }
    } catch (syncErr) {
      console.warn('Proceeding with verified WhatsApp dispatch:', syncErr);
    }

    const finalUrl = getWhatsAppUrl({
      fullName: submissionData.fullName,
      phone: submissionData.phone,
      email: submissionData.email,
      city: submissionData.city,
      category: effectiveCategory,
      timeline: submissionData.timeline,
      message: submissionData.message,
      referenceCode: finalCode,
    });

    setSuccessUrl(finalUrl);

    // 4. Redirect to WhatsApp without popup blocker issues
    redirectToWhatsApp(
      {
        fullName: submissionData.fullName,
        phone: submissionData.phone,
        email: submissionData.email,
        city: submissionData.city,
        category: effectiveCategory,
        timeline: submissionData.timeline,
        message: submissionData.message,
        referenceCode: finalCode,
      },
      preOpenedWindow
    );

    setIsSubmitting(false);
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Defeat popup blockers on PC browsers: Open a window synchronously during the user click event
    let preOpenedWindow: Window | null = null;
    const isMobileDevice = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
    if (!isMobileDevice && typeof window !== 'undefined') {
      try {
        preOpenedWindow = window.open('about:blank', '_blank');
      } catch (err) {
        console.warn('Synchronous popup open prevented:', err);
      }
    }

    submitApplication(preOpenedWindow);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    let preOpenedWindow: Window | null = null;
    const isMobileDevice = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
    if (!isMobileDevice && typeof window !== 'undefined') {
      try {
        preOpenedWindow = window.open('about:blank', '_blank');
      } catch (err) {
        console.warn('Synchronous popup open prevented:', err);
      }
    }

    submitApplication(preOpenedWindow);
  };

  if (isMobile) {
    return (
      <form noValidate onSubmit={handleFormSubmit} className="space-y-3.5 text-left">
        {generalError && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        <div>
          <input
            id="mobile-franchise-fullName"
            type="text"
            aria-label="Full Name"
            placeholder="Full Name *"
            value={formData.fullName}
            onChange={(e) => handleFieldChange('fullName', e.target.value)}
            className={`w-full px-3.5 py-3 rounded-xl bg-white/[0.04] border ${
              fieldErrors.fullName ? 'border-red-500/80 focus:border-red-500' : 'border-white/[0.1] focus:border-[#d4af37]'
            } text-base sm:text-xs text-white placeholder-slate-500 focus:outline-none transition-all`}
          />
          {fieldErrors.fullName && <p className="text-[10px] text-red-400 mt-1 pl-1">{fieldErrors.fullName}</p>}
        </div>

        <div>
          <input
            id="mobile-franchise-phone"
            type="tel"
            aria-label="Mobile Number (WhatsApp)"
            placeholder="Mobile Number (WhatsApp) *"
            value={formData.phone}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            className={`w-full px-3.5 py-3 rounded-xl bg-white/[0.04] border ${
              fieldErrors.phone ? 'border-red-500/80 focus:border-red-500' : 'border-white/[0.1] focus:border-[#d4af37]'
            } text-base sm:text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-mono`}
          />
          {fieldErrors.phone && <p className="text-[10px] text-red-400 mt-1 pl-1">{fieldErrors.phone}</p>}
        </div>

        <div>
          <input
            id="mobile-franchise-email"
            type="email"
            aria-label="Email Address"
            placeholder="Email Address *"
            value={formData.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            className={`w-full px-3.5 py-3 rounded-xl bg-white/[0.04] border ${
              fieldErrors.email ? 'border-red-500/80 focus:border-red-500' : 'border-white/[0.1] focus:border-[#d4af37]'
            } text-base sm:text-xs text-white placeholder-slate-500 focus:outline-none transition-all`}
          />
          {fieldErrors.email && <p className="text-[10px] text-red-400 mt-1 pl-1">{fieldErrors.email}</p>}
        </div>

        <div>
          <input
            id="mobile-franchise-city"
            type="text"
            aria-label="Target City"
            placeholder="Target City *"
            value={formData.city}
            onChange={(e) => handleFieldChange('city', e.target.value)}
            className={`w-full px-3.5 py-3 rounded-xl bg-white/[0.04] border ${
              fieldErrors.city ? 'border-red-500/80 focus:border-red-500' : 'border-white/[0.1] focus:border-[#d4af37]'
            } text-base sm:text-xs text-white placeholder-slate-500 focus:outline-none transition-all`}
          />
          {fieldErrors.city && <p className="text-[10px] text-red-400 mt-1 pl-1">{fieldErrors.city}</p>}
        </div>

        {/* Theme-Matched Luxury Dropdown (Mobile) */}
        <div className="relative z-30" ref={dropdownRef}>
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
              className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl bg-[#090c13] border border-[#d4af37]/50 shadow-[0_20px_60px_rgba(0,0,0,0.98)] backdrop-blur-2xl py-1.5 max-h-[320px] overflow-y-auto overscroll-contain"
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
          <div>
            <input
              id="mobile-franchise-customCategory"
              type="text"
              aria-label="Specify your background or profession"
              placeholder="Please specify your profession or background *"
              value={formData.customCategory}
              onChange={(e) => handleFieldChange('customCategory', e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border ${
                fieldErrors.customCategory ? 'border-red-500/80 focus:border-red-500' : 'border-[#d4af37]/50 focus:border-[#d4af37]'
              } text-xs text-white placeholder-slate-500 focus:outline-none transition-all`}
            />
            {fieldErrors.customCategory && <p className="text-[10px] text-red-400 mt-1 pl-1">{fieldErrors.customCategory}</p>}
          </div>
        )}

        <button
          type="button"
          onClick={handleButtonClick}
          disabled={isSubmitting}
          className="relative z-20 w-full py-3.5 rounded-xl text-xs font-semibold tracking-wider uppercase text-black bg-gradient-to-r from-[#d4af37] to-[#fbf5b7] hover:brightness-110 active:scale-[0.99] transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 pointer-events-auto select-auto"
        >
          {isSubmitting ? (
            <span>Connecting to WhatsApp...</span>
          ) : (
            <>
              <Send className="w-3.5 h-3.5 text-black" />
              <span>Submit to Executive WhatsApp Desk</span>
            </>
          )}
        </button>

        {successUrl && (
          <div className="pt-1 text-center">
            <a
              href={successUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#fbf5b7] hover:text-white underline underline-offset-4"
            >
              <span>Click here if WhatsApp did not open automatically</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </form>
    );
  }

  return (
    <form noValidate onSubmit={handleFormSubmit} className="space-y-3.5 xl:space-y-4 text-left">
      {/* Visual Validation Notice */}
      {generalError && (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-950/50 border border-red-500/60 text-red-200 text-xs animate-in fade-in duration-200 shadow-lg">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="font-medium">{generalError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 xl:gap-4">
        {/* Full Name */}
        <div className="space-y-1">
          <label htmlFor="desktop-franchise-fullName" className="text-[10.5px] font-mono uppercase tracking-wider text-slate-300 block">
            Full Name *
          </label>
          <input
            id="desktop-franchise-fullName"
            type="text"
            placeholder="e.g. Rajesh Kumar"
            value={formData.fullName}
            onChange={(e) => handleFieldChange('fullName', e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border ${
              fieldErrors.fullName ? 'border-red-500/80 focus:border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-white/[0.1] focus:border-[#d4af37]'
            } focus:outline-none text-base sm:text-xs text-white placeholder-slate-500 transition-all`}
          />
          {fieldErrors.fullName && <p className="text-[10px] text-red-400 font-mono pl-1">{fieldErrors.fullName}</p>}
        </div>

        {/* Mobile / WhatsApp */}
        <div className="space-y-1">
          <label htmlFor="desktop-franchise-phone" className="text-[10.5px] font-mono uppercase tracking-wider text-slate-300 block">
            Mobile Number (WhatsApp) *
          </label>
          <input
            id="desktop-franchise-phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border ${
              fieldErrors.phone ? 'border-red-500/80 focus:border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-white/[0.1] focus:border-[#d4af37]'
            } focus:outline-none text-base sm:text-xs text-white placeholder-slate-500 transition-all font-mono`}
          />
          {fieldErrors.phone && <p className="text-[10px] text-red-400 font-mono pl-1">{fieldErrors.phone}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 xl:gap-4">
        {/* Email */}
        <div className="space-y-1">
          <label htmlFor="desktop-franchise-email" className="text-[10.5px] font-mono uppercase tracking-wider text-slate-300 block">
            Email Address *
          </label>
          <input
            id="desktop-franchise-email"
            type="email"
            placeholder="rajesh@example.com"
            value={formData.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border ${
              fieldErrors.email ? 'border-red-500/80 focus:border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-white/[0.1] focus:border-[#d4af37]'
            } focus:outline-none text-base sm:text-xs text-white placeholder-slate-500 transition-all`}
          />
          {fieldErrors.email && <p className="text-[10px] text-red-400 font-mono pl-1">{fieldErrors.email}</p>}
        </div>

        {/* Target City */}
        <div className="space-y-1">
          <label htmlFor="desktop-franchise-city" className="text-[10.5px] font-mono uppercase tracking-wider text-slate-300 block">
            Target City / Location *
          </label>
          <input
            id="desktop-franchise-city"
            type="text"
            placeholder="e.g. Vadodara, Ahmedabad, Surat"
            value={formData.city}
            onChange={(e) => handleFieldChange('city', e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border ${
              fieldErrors.city ? 'border-red-500/80 focus:border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-white/[0.1] focus:border-[#d4af37]'
            } focus:outline-none text-base sm:text-xs text-white placeholder-slate-500 transition-all`}
          />
          {fieldErrors.city && <p className="text-[10px] text-red-400 font-mono pl-1">{fieldErrors.city}</p>}
        </div>
      </div>

      {/* Target Profile Category — Theme-Matched Luxury Dropdown */}
      <div className="space-y-1 relative z-30" ref={dropdownRef}>
        <label id="desktop-franchise-category-label" className="text-[10.5px] font-mono uppercase tracking-wider text-slate-300 block">
          Your Profile Category *
        </label>
        <div className="relative">
          <button
            type="button"
            role="combobox"
            aria-labelledby="desktop-franchise-category-label"
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
              aria-labelledby="desktop-franchise-category-label"
              className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl bg-[#090c13] border border-[#d4af37]/50 shadow-[0_20px_60px_rgba(0,0,0,0.98)] backdrop-blur-2xl py-1.5 max-h-[260px] overflow-y-auto overscroll-contain"
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
              id="desktop-franchise-customCategory"
              type="text"
              aria-label="Specify your background or profession"
              placeholder="Specify your background / profession (e.g. Doctor, Architect, Consultant)..."
              value={formData.customCategory}
              onChange={(e) => handleFieldChange('customCategory', e.target.value)}
              className={`w-full px-4 py-2 rounded-xl bg-white/[0.04] border ${
                fieldErrors.customCategory ? 'border-red-500/80 focus:border-red-500' : 'border-[#d4af37]/40 focus:border-[#d4af37]'
              } focus:outline-none text-base sm:text-xs text-white placeholder-slate-500 transition-all`}
            />
            {fieldErrors.customCategory && <p className="text-[10px] text-red-400 font-mono pl-1">{fieldErrors.customCategory}</p>}
          </div>
        )}
      </div>

      {/* Special Strategic Notes */}
      <div className="space-y-1">
        <label htmlFor="desktop-franchise-message" className="text-[10.5px] font-mono uppercase tracking-wider text-slate-300 block">
          Background &amp; Strategic Ambitions (Optional)
        </label>
        <textarea
          id="desktop-franchise-message"
          rows={2}
          placeholder="Share relevant domain background, network reach, or preferred location..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-[#d4af37] focus:outline-none text-base sm:text-xs text-white placeholder-slate-500 transition-all resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={isSubmitting}
        className="relative z-20 w-full py-3.5 rounded-xl text-xs font-semibold tracking-[0.2em] uppercase text-black bg-gradient-to-r from-[#d4af37] via-[#fbf5b7] to-[#b38728] hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_0_30px_rgba(212,175,55,0.35)] cursor-pointer flex items-center justify-center gap-2 mt-2 pointer-events-auto select-auto"
      >
        {isSubmitting ? (
          <span>Connecting to WhatsApp Desk...</span>
        ) : (
          <>
            <Send className="w-3.5 h-3.5 text-black" />
            <span>Submit &amp; Connect to Executive WhatsApp Desk</span>
          </>
        )}
      </button>

      {successUrl && (
        <div className="pt-1 text-center animate-in fade-in">
          <a
            href={successUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#fbf5b7] hover:text-white underline underline-offset-4"
          >
            <span>Click here if WhatsApp did not open automatically</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      <p className="text-[10.5px] text-center text-slate-400 font-light">
        Protected by Shivmax Non-Disclosure &bull; 100% Confidential Direct Desk Review
      </p>
    </form>
  );
}
