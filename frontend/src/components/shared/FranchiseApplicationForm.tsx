'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  ChevronDown,
  Check,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  KeyRound,
  RefreshCw,
  ArrowLeft,
  MessageCircle,
} from 'lucide-react';
import { sendFranchiseOtp, verifyFranchiseOtp, submitInquiry } from '@/lib/api';
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

  // Flow states: 'form' | 'otp' | 'already_applied' | 'verified'
  const [viewState, setViewState] = useState<'form' | 'otp' | 'already_applied' | 'verified'>('form');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');
  const [successUrl, setSuccessUrl] = useState<string | null>(null);

  // 6-digit OTP input state
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown timer for resending OTP
  const [resendCooldown, setResendCooldown] = useState(0);

  // Pre-opened window reference to eliminate popup-blocker issues on desktop
  const preOpenedWinRef = useRef<Window | null>(null);

  // Handle countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

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
    if (!digitsOnly || digitsOnly.length < 10) {
      errors.phone = 'Please enter a valid 10-digit mobile number';
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

  /**
   * STEP 1: Applicant clicks Submit.
   * Validates form, checks duplication, and dispatches real 6-digit OTP.
   */
  const handleInitiateSubmission = async () => {
    const isValid = validate();
    if (!isValid) return;

    setIsSubmitting(true);
    setGeneralError('');

    // Pre-open window synchronously during user click to defeat desktop popup blockers
    const isMobileDevice = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
    if (!isMobileDevice && typeof window !== 'undefined') {
      try {
        preOpenedWinRef.current = window.open('about:blank', '_blank');
      } catch (err) {
        console.warn('Pre-open tab blocked:', err);
      }
    }

    const payload = {
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      city: formData.city.trim(),
      category: effectiveCategory,
      timeline: formData.timeline,
      message: formData.message.trim(),
      source: 'shivmax.com',
      propertyInterest: `Franchise Application: ${effectiveCategory} (${formData.city.trim()})`,
      specialRequests: formData.message.trim() ? `Notes: ${formData.message.trim()}` : 'Shivmax Franchise Consultation',
      tourType: 'Shivmax Franchise Consultation',
    };

    try {
      const res = await sendFranchiseOtp(payload);

      if (!res.success) {
        // Close pre-opened window if not proceeding
        if (preOpenedWinRef.current && !preOpenedWinRef.current.closed) {
          try {
            preOpenedWinRef.current.close();
          } catch {}
        }

        if (res.code === 'ALREADY_SUBMITTED') {
          setViewState('already_applied');
          setIsSubmitting(false);
          return;
        }

        setGeneralError(res.error || 'Could not dispatch verification code. Please check your details.');
        setIsSubmitting(false);
        return;
      }

      // Success: Proceed to OTP verification screen
      setViewState('otp');
      setResendCooldown(45);
      setOtpError('');
      setOtpDigits(['', '', '', '', '', '']);

      // Focus first OTP digit box after render
      setTimeout(() => {
        if (otpInputRefs.current[0]) {
          otpInputRefs.current[0].focus();
        }
      }, 150);
    } catch {
      setGeneralError('Network error connecting to verification desk. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Resend 6-digit OTP PIN
   */
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setOtpError('');

    const payload = {
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      city: formData.city.trim(),
      category: effectiveCategory,
      timeline: formData.timeline,
      message: formData.message.trim(),
      source: 'shivmax.com',
    };

    const res = await sendFranchiseOtp(payload);
    if (res.success) {
      setResendCooldown(60);
      setOtpError('');
    } else {
      setOtpError(res.error || 'Could not resend verification PIN. Please wait a moment.');
    }
  };

  /**
   * STEP 2: Verify 6-digit OTP entered by applicant
   */
  const handleVerifyOtp = async () => {
    const fullOtp = otpDigits.join('').trim();
    if (fullOtp.length !== 6) {
      setOtpError('Please enter the full 6-digit verification code.');
      return;
    }

    setIsVerifying(true);
    setOtpError('');

    try {
      const res = await verifyFranchiseOtp(formData.phone.trim(), fullOtp);

      if (!res.success) {
        setOtpError(res.error || 'Incorrect verification PIN. Please try again.');
        setIsVerifying(false);
        return;
      }

      // Verified successfully!
      setViewState('verified');

      const finalUrl = getWhatsAppUrl({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        city: formData.city.trim(),
        category: effectiveCategory,
        timeline: formData.timeline,
        message: formData.message.trim(),
      });

      setSuccessUrl(finalUrl);

      // Cache locally
      if (typeof window !== 'undefined') {
        try {
          const cacheKey = 'shivmax_franchise_inquiries_cache';
          const existing = JSON.parse(localStorage.getItem(cacheKey) || '[]');
          existing.unshift({
            ...formData,
            category: effectiveCategory,
            verified: true,
            submittedAt: new Date().toISOString(),
          });
          localStorage.setItem(cacheKey, JSON.stringify(existing.slice(0, 50)));
        } catch {}
      }

      // Direct to WhatsApp
      redirectToWhatsApp(
        {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          city: formData.city.trim(),
          category: effectiveCategory,
          timeline: formData.timeline,
          message: formData.message.trim(),
        },
        preOpenedWinRef.current
      );
    } catch {
      setOtpError('Connection error verifying PIN. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  /**
   * OTP input handlers (support paste, arrow keys, backspace)
   */
  const handleOtpChange = (index: number, val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '');
    if (cleaned.length > 1) {
      // User pasted full OTP
      const pasted = cleaned.slice(0, 6).split('');
      const newDigits = [...otpDigits];
      pasted.forEach((d, i) => {
        if (i < 6) newDigits[i] = d;
      });
      setOtpDigits(newDigits);
      const nextFocus = Math.min(5, pasted.length);
      otpInputRefs.current[nextFocus]?.focus();
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = cleaned;
    setOtpDigits(newDigits);
    setOtpError('');

    if (cleaned && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'Enter') {
      handleVerifyOtp();
    }
  };

  // =========================================================================
  // VIEW: ALREADY APPLIED (Prevents duplicate submissions permanently)
  // =========================================================================
  if (viewState === 'already_applied') {
    const directWhatsAppDesk =
      'https://api.whatsapp.com/send?phone=918160351486&text=' +
      encodeURIComponent(
        `🔱 *SHIVMAX REAL ESTATE* 🔱\nHello Executive Desk, my name is ${formData.fullName.trim()} (${formData.phone.trim()}). I have already submitted my official Franchise Application and would like to request an update on my review file.`
      );

    return (
      <div className="p-6 rounded-2xl bg-[#0a0d14] border border-[#d4af37]/40 text-left space-y-5 animate-in fade-in duration-300 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
            <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
          </div>
          <div>
            <h3 className="text-base font-serif font-bold text-white">Application Already Registered</h3>
            <p className="text-[11px] font-mono uppercase tracking-wider text-[#d4af37]">Single-Review Guarantee Active</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-light">
          An official franchise application is already recorded in the Shivmax Directorate for this mobile number (
          <span className="text-[#fbf5b7] font-mono font-medium">{formData.phone}</span>).
        </p>

        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-slate-400 space-y-1">
          <div className="text-[#fbf5b7] font-medium">&bull; 1 Application Per Candidate Policy</div>
          <p className="text-[11px] leading-relaxed">
            To guarantee direct, personal evaluation by Mr. Vivek Mishra, duplicate submissions are restricted. Your dossier is currently under executive review.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <a
            href={directWhatsAppDesk}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-xl text-xs font-semibold tracking-wider uppercase text-black bg-gradient-to-r from-[#d4af37] via-[#fbf5b7] to-[#b38728] hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-black" />
            <span>Connect Directly with Executive Desk</span>
          </a>

          <button
            type="button"
            onClick={() => setViewState('form')}
            className="w-full py-2.5 rounded-xl text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer text-center"
          >
            &larr; Use a Different Contact Number
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: 6-DIGIT OTP VERIFICATION MODAL / SCREEN
  // =========================================================================
  if (viewState === 'otp') {
    return (
      <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-[#0c1017] via-[#080a0f] to-[#0e1219] border border-[#d4af37]/50 text-left space-y-5 animate-in fade-in duration-300 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2.5">
            <KeyRound className="w-4 h-4 text-[#d4af37]" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#d4af37]">
              Identity Verification PIN
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (preOpenedWinRef.current && !preOpenedWinRef.current.closed) {
                try {
                  preOpenedWinRef.current.close();
                } catch {}
              }
              setViewState('form');
            }}
            className="text-[11px] font-mono text-slate-400 hover:text-[#d4af37] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Edit Details</span>
          </button>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-serif text-white">Enter Verification Code</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-light">
            We sent a 6-digit confirmation PIN to{' '}
            <span className="text-[#fbf5b7] font-medium font-mono">{formData.email}</span>. Please enter it below to confirm your genuine franchise candidacy.
          </p>
        </div>

        {otpError && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/50 border border-red-500/60 text-red-200 text-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{otpError}</span>
          </div>
        )}

        {/* 6 Individual PIN Input Boxes */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 py-2">
          {otpDigits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                otpInputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={digit}
              onChange={(e) => handleOtpChange(idx, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(idx, e)}
              className="w-11 sm:w-12 h-13 sm:h-14 text-center text-xl font-mono font-bold text-white bg-[#05070c] border border-[#d4af37]/40 focus:border-[#d4af37] focus:shadow-[0_0_15px_rgba(212,175,55,0.4)] rounded-xl outline-none transition-all"
            />
          ))}
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
          <span>Valid for 10 minutes</span>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendCooldown > 0}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              resendCooldown > 0 ? 'text-slate-600 cursor-not-allowed' : 'text-[#d4af37] hover:text-[#fbf5b7] underline'
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${resendCooldown > 0 ? 'animate-spin' : ''}`} />
            <span>{resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleVerifyOtp}
          disabled={isVerifying || otpDigits.join('').length !== 6}
          className="w-full py-3.5 rounded-xl text-xs font-semibold tracking-[0.2em] uppercase text-black bg-gradient-to-r from-[#d4af37] via-[#fbf5b7] to-[#b38728] hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_25px_rgba(212,175,55,0.35)] cursor-pointer flex items-center justify-center gap-2"
        >
          {isVerifying ? (
            <span>Confirming Identity...</span>
          ) : (
            <>
              <Check className="w-4 h-4 text-black stroke-[3]" />
              <span>Verify &amp; Connect to WhatsApp Desk</span>
            </>
          )}
        </button>

        <p className="text-[10px] text-center text-slate-400">
          Protected by Shivmax Non-Disclosure &bull; 100% Confidential
        </p>
      </div>
    );
  }

  // =========================================================================
  // VIEW: VERIFIED SUCCESS
  // =========================================================================
  if (viewState === 'verified') {
    return (
      <div className="p-6 rounded-2xl bg-[#0a0d14] border border-[#d4af37]/60 text-center space-y-4 animate-in fade-in duration-300 shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center mx-auto text-[#d4af37]">
          <Check className="w-6 h-6 stroke-[3]" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-serif text-white">Identity Verified Successfully</h3>
          <p className="text-xs text-slate-300">Connecting you to the Executive WhatsApp Desk...</p>
        </div>
        {successUrl && (
          <div className="pt-2">
            <a
              href={successUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-wider hover:brightness-110 transition-all"
            >
              <span>Click Here if WhatsApp Did Not Open</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW: PRIMARY FORM (Mobile & Desktop with OTP Verification Trigger)
  // =========================================================================
  if (isMobile) {
    return (
      <form noValidate onSubmit={(e) => { e.preventDefault(); handleInitiateSubmission(); }} className="space-y-3.5 text-left">
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
            placeholder="Full Name *"
            value={formData.fullName}
            onChange={(e) => handleFieldChange('fullName', e.target.value)}
            className={`w-full px-3.5 py-3 rounded-xl bg-white/[0.04] border ${
              fieldErrors.fullName ? 'border-red-500/80' : 'border-white/[0.1] focus:border-[#d4af37]'
            } text-base sm:text-xs text-white placeholder-slate-500 focus:outline-none transition-all`}
          />
          {fieldErrors.fullName && <p className="text-[10px] text-red-400 mt-1 pl-1">{fieldErrors.fullName}</p>}
        </div>

        <div>
          <input
            id="mobile-franchise-phone"
            type="tel"
            placeholder="Mobile Number (WhatsApp) *"
            value={formData.phone}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            className={`w-full px-3.5 py-3 rounded-xl bg-white/[0.04] border ${
              fieldErrors.phone ? 'border-red-500/80' : 'border-white/[0.1] focus:border-[#d4af37]'
            } text-base sm:text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-mono`}
          />
          {fieldErrors.phone && <p className="text-[10px] text-red-400 mt-1 pl-1">{fieldErrors.phone}</p>}
        </div>

        <div>
          <input
            id="mobile-franchise-email"
            type="email"
            placeholder="Email Address (For Verification PIN) *"
            value={formData.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            className={`w-full px-3.5 py-3 rounded-xl bg-white/[0.04] border ${
              fieldErrors.email ? 'border-red-500/80' : 'border-white/[0.1] focus:border-[#d4af37]'
            } text-base sm:text-xs text-white placeholder-slate-500 focus:outline-none transition-all`}
          />
          {fieldErrors.email && <p className="text-[10px] text-red-400 mt-1 pl-1">{fieldErrors.email}</p>}
        </div>

        <div>
          <input
            id="mobile-franchise-city"
            type="text"
            placeholder="Target City *"
            value={formData.city}
            onChange={(e) => handleFieldChange('city', e.target.value)}
            className={`w-full px-3.5 py-3 rounded-xl bg-white/[0.04] border ${
              fieldErrors.city ? 'border-red-500/80' : 'border-white/[0.1] focus:border-[#d4af37]'
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
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="w-full px-3.5 py-3 rounded-xl bg-[#0a0d14] border border-[#d4af37]/40 hover:border-[#d4af37] focus:border-[#d4af37] text-left text-xs text-white transition-all cursor-pointer flex items-center justify-between"
          >
            <span className="truncate">{formData.category}</span>
            <ChevronDown className={`w-4 h-4 text-[#d4af37] transition-transform duration-300 ml-2 flex-shrink-0 ${isCategoryOpen ? 'rotate-180' : ''}`} />
          </button>

          {isCategoryOpen && (
            <div
              role="listbox"
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
              placeholder="Please specify your profession or background *"
              value={formData.customCategory}
              onChange={(e) => handleFieldChange('customCategory', e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border ${
                fieldErrors.customCategory ? 'border-red-500/80' : 'border-[#d4af37]/50'
              } text-xs text-white placeholder-slate-500 focus:outline-none transition-all`}
            />
            {fieldErrors.customCategory && <p className="text-[10px] text-red-400 mt-1 pl-1">{fieldErrors.customCategory}</p>}
          </div>
        )}

        <button
          type="button"
          onClick={handleInitiateSubmission}
          disabled={isSubmitting}
          className="relative z-20 w-full py-3.5 rounded-xl text-xs font-semibold tracking-wider uppercase text-black bg-gradient-to-r from-[#d4af37] to-[#fbf5b7] hover:brightness-110 active:scale-[0.99] transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 pointer-events-auto select-auto"
        >
          {isSubmitting ? (
            <span>Verifying Application Eligibility...</span>
          ) : (
            <>
              <Send className="w-3.5 h-3.5 text-black" />
              <span>Verify Mobile &amp; Connect to WhatsApp Desk</span>
            </>
          )}
        </button>
      </form>
    );
  }

  // DESKTOP PRIMARY FORM
  return (
    <form noValidate onSubmit={(e) => { e.preventDefault(); handleInitiateSubmission(); }} className="space-y-3.5 xl:space-y-4 text-left">
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
              fieldErrors.fullName ? 'border-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-white/[0.1] focus:border-[#d4af37]'
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
              fieldErrors.phone ? 'border-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-white/[0.1] focus:border-[#d4af37]'
            } focus:outline-none text-base sm:text-xs text-white placeholder-slate-500 transition-all font-mono`}
          />
          {fieldErrors.phone && <p className="text-[10px] text-red-400 font-mono pl-1">{fieldErrors.phone}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 xl:gap-4">
        {/* Email */}
        <div className="space-y-1">
          <label htmlFor="desktop-franchise-email" className="text-[10.5px] font-mono uppercase tracking-wider text-slate-300 block">
            Email Address (For Verification PIN) *
          </label>
          <input
            id="desktop-franchise-email"
            type="email"
            placeholder="rajesh@example.com"
            value={formData.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border ${
              fieldErrors.email ? 'border-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-white/[0.1] focus:border-[#d4af37]'
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
              fieldErrors.city ? 'border-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-white/[0.1] focus:border-[#d4af37]'
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
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="w-full px-4 py-2.5 rounded-xl bg-[#0a0d14] border border-[#d4af37]/40 hover:border-[#d4af37] focus:border-[#d4af37] text-left text-base sm:text-xs text-white transition-all cursor-pointer flex items-center justify-between shadow-inner"
          >
            <span className="truncate">{formData.category}</span>
            <ChevronDown className={`w-4 h-4 text-[#d4af37] transition-transform duration-300 ml-2 flex-shrink-0 ${isCategoryOpen ? 'rotate-180' : ''}`} />
          </button>

          {isCategoryOpen && (
            <div
              role="listbox"
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

        {formData.category === 'Other / Custom Profile' && (
          <div className="pt-1.5 animate-in fade-in duration-200">
            <input
              id="desktop-franchise-customCategory"
              type="text"
              placeholder="Specify your background / profession (e.g. Doctor, Architect, Consultant)..."
              value={formData.customCategory}
              onChange={(e) => handleFieldChange('customCategory', e.target.value)}
              className={`w-full px-4 py-2 rounded-xl bg-white/[0.04] border ${
                fieldErrors.customCategory ? 'border-red-500/80' : 'border-[#d4af37]/40'
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
        onClick={handleInitiateSubmission}
        disabled={isSubmitting}
        className="relative z-20 w-full py-3.5 rounded-xl text-xs font-semibold tracking-[0.2em] uppercase text-black bg-gradient-to-r from-[#d4af37] via-[#fbf5b7] to-[#b38728] hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_0_30px_rgba(212,175,55,0.35)] cursor-pointer flex items-center justify-center gap-2 mt-2 pointer-events-auto select-auto"
      >
        {isSubmitting ? (
          <span>Verifying Application Eligibility...</span>
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
