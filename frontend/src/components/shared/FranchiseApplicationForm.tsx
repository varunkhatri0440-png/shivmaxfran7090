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
      redirectToWhatsApp({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        city: formData.city.trim(),
        category: effectiveCategory,
        timeline: formData.timeline,
        message: formData.message.trim(),
      });
    } catch {
      setOtpError('Connection error verifying PIN. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  /**
   * OTP input handlers (support paste, arrow keys, backspace)
   */
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
    if (pastedData) {
      const chars = pastedData.slice(0, 6).split('');
      const newDigits = [...otpDigits];
      chars.forEach((c, i) => {
        if (i < 6) newDigits[i] = c;
      });
      setOtpDigits(newDigits);
      setOtpError('');
      const focusIndex = Math.min(5, chars.length);
      otpInputRefs.current[focusIndex]?.focus();
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '');
    if (cleaned.length > 1) {
      // User pasted full OTP into input
      const pasted = cleaned.slice(0, 6).split('');
      const newDigits = [...otpDigits];
      pasted.forEach((d, i) => {
        if (i < 6) newDigits[i] = d;
      });
      setOtpDigits(newDigits);
      setOtpError('');
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
      <div className="p-4 sm:p-6 rounded-2xl bg-[#0a0d14] border border-[#d4af37]/40 text-left space-y-4 sm:space-y-5 animate-in fade-in duration-300 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-white">Application Already Registered</h3>
            <p className="text-[10.5px] sm:text-[11px] font-mono uppercase tracking-wider text-[#d4af37]">Single-Review Guarantee Active</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-light">
          An official franchise application is already recorded in the Shivmax Directorate for this mobile number (
          <span className="text-[#fbf5b7] font-mono font-medium">{formData.phone}</span>).
        </p>

        <div className="p-3 sm:p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-slate-400 space-y-1">
          <div className="text-[#fbf5b7] font-medium">&bull; 1 Application Per Candidate Policy</div>
          <p className="text-[11px] leading-relaxed">
            To guarantee direct, personal evaluation by Mr. Vivek Mishra, duplicate submissions are restricted. Your dossier is currently under executive review.
          </p>
        </div>

        <div className="space-y-2 pt-1">
          <a
            href={directWhatsAppDesk}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[50px] py-3.5 px-4 rounded-xl text-black bg-gradient-to-r from-[#d4af37] via-[#fff2b2] to-[#cba328] hover:brightness-105 active:scale-[0.99] transition-all shadow-[0_4px_22px_rgba(212,175,55,0.4)] border border-[#fff2b2]/50 flex items-center justify-center gap-2 text-center cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-black shrink-0" />
            <span className="text-[12px] sm:text-[13px] font-bold tracking-wider uppercase text-black leading-tight">
              Connect Directly with Executive Desk
            </span>
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
  // VIEW: 6-DIGIT OTP VERIFICATION MODAL / SCREEN (100% Responsive Grid)
  // =========================================================================
  if (viewState === 'otp') {
    return (
      <div className="w-full text-left space-y-4 sm:space-y-5 animate-in fade-in duration-300">
        <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-[#0c1017] via-[#080a0f] to-[#0e1219] border border-[#d4af37]/45 space-y-4 sm:space-y-5 shadow-2xl">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-widest text-[#d4af37]">
                Identity Verification PIN
              </span>
            </div>
            <button
              type="button"
              onClick={() => setViewState('form')}
              className="text-[11px] font-mono text-slate-400 hover:text-[#d4af37] transition-colors flex items-center gap-1 cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Edit Details</span>
            </button>
          </div>

          {/* Prompt description */}
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-serif text-white font-bold">
              Enter 6-Digit Verification PIN
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              We sent a 6-digit confirmation code to{' '}
              <span className="text-[#fbf5b7] font-medium font-mono break-all">{formData.email}</span>. Please enter it below to confirm your genuine franchise candidacy.
            </p>
          </div>

          {otpError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/50 border border-red-500/60 text-red-200 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="leading-snug">{otpError}</span>
            </div>
          )}

          {/* 6 Individual PIN Input Boxes - Fluid 6-Col Grid guarantees 0 overflow */}
          <div className="w-full max-w-sm sm:max-w-md mx-auto py-1">
            <div className="grid grid-cols-6 gap-1.5 xs:gap-2 sm:gap-2.5 w-full">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    otpInputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  onPaste={handleOtpPaste}
                  onFocus={(e) => e.target.select()}
                  aria-label={`Verification PIN digit ${idx + 1}`}
                  className="w-full aspect-[4/5] sm:aspect-square max-h-13 sm:max-h-14 text-center text-lg sm:text-2xl font-mono font-bold text-[#fbf5b7] bg-[#05070c] border border-[#d4af37]/40 focus:border-[#d4af37] focus:bg-[#0c1017] focus:shadow-[0_0_15px_rgba(212,175,55,0.4)] rounded-lg sm:rounded-xl outline-none transition-all flex items-center justify-center select-all"
                />
              ))}
            </div>
          </div>

          {/* Validity & Resend */}
          <div className="flex items-center justify-between gap-2 flex-wrap text-[11px] sm:text-xs font-mono text-slate-400 pt-0.5">
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Valid for 10 min
            </span>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendCooldown > 0}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                resendCooldown > 0 ? 'text-slate-500 cursor-not-allowed' : 'text-[#d4af37] hover:text-[#fbf5b7] underline'
              }`}
            >
              <RefreshCw className={`w-3 h-3 ${resendCooldown > 0 ? 'animate-spin' : ''}`} />
              <span>{resendCooldown > 0 ? `Resend PIN in ${resendCooldown}s` : 'Resend PIN'}</span>
            </button>
          </div>

          {/* Verification Submit Button */}
          <button
            type="button"
            onClick={handleVerifyOtp}
            disabled={isVerifying || otpDigits.join('').length !== 6}
            className="w-full min-h-[50px] py-3.5 px-4 rounded-xl text-black bg-gradient-to-r from-[#d4af37] via-[#fff2b2] to-[#cba328] hover:brightness-105 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_4px_22px_rgba(212,175,55,0.4)] border border-[#fff2b2]/50 cursor-pointer flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <div className="flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-black shrink-0" />
                <span className="text-xs sm:text-[13px] font-bold tracking-wider uppercase text-black">
                  Confirming Identity...
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-center">
                <Check className="w-4 h-4 text-black stroke-[3] shrink-0" />
                <span className="text-[11.5px] xs:text-xs sm:text-[13px] font-bold tracking-wide uppercase text-black leading-tight">
                  Verify &amp; Connect to WhatsApp Desk
                </span>
              </div>
            )}
          </button>

          <p className="text-[10px] text-center text-slate-400 font-light">
            Protected by Shivmax Non-Disclosure &bull; 100% Confidential
          </p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: VERIFIED SUCCESS
  // =========================================================================
  if (viewState === 'verified') {
    return (
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0a0d14] border border-[#d4af37]/60 text-center space-y-4 animate-in fade-in duration-300 shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center mx-auto text-[#d4af37]">
          <Check className="w-6 h-6 stroke-[3]" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-serif text-white">Identity Verified Successfully</h3>
          <p className="text-xs text-slate-300">Connecting you to the Executive WhatsApp Desk...</p>
        </div>
        {successUrl && (
          <div className="pt-2">
            <a
              href={successUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-lg"
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
      <form noValidate onSubmit={(e) => { e.preventDefault(); handleInitiateSubmission(); }} className="space-y-3.5 text-left w-full">
        {generalError && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-950/50 border border-red-500/60 text-red-200 text-xs animate-in fade-in duration-200 shadow-lg">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span className="font-medium leading-snug">{generalError}</span>
          </div>
        )}

        {/* 1. Full Name */}
        <div className="space-y-1">
          <label htmlFor="mobile-franchise-fullName" className="text-[11px] font-mono uppercase tracking-wider text-[#d4af37]/90 block">
            Full Name *
          </label>
          <input
            id="mobile-franchise-fullName"
            type="text"
            placeholder="e.g. Rajesh Sharma"
            value={formData.fullName}
            onChange={(e) => handleFieldChange('fullName', e.target.value)}
            className={`w-full h-11 sm:h-12 px-3.5 rounded-xl bg-[#05070c]/90 border ${
              fieldErrors.fullName ? 'border-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-white/[0.12] focus:border-[#d4af37]'
            } text-sm text-white placeholder-slate-500 focus:bg-[#080b12] focus:shadow-[0_0_12px_rgba(212,175,55,0.2)] focus:outline-none transition-all`}
          />
          {fieldErrors.fullName && <p className="text-[10.5px] text-red-400 mt-1 pl-1">{fieldErrors.fullName}</p>}
        </div>

        {/* 2. Mobile Phone (WhatsApp) */}
        <div className="space-y-1">
          <label htmlFor="mobile-franchise-phone" className="text-[11px] font-mono uppercase tracking-wider text-[#d4af37]/90 block">
            Mobile Number (WhatsApp) *
          </label>
          <input
            id="mobile-franchise-phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            className={`w-full h-11 sm:h-12 px-3.5 rounded-xl bg-[#05070c]/90 border ${
              fieldErrors.phone ? 'border-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-white/[0.12] focus:border-[#d4af37]'
            } text-sm text-white placeholder-slate-500 font-mono focus:bg-[#080b12] focus:shadow-[0_0_12px_rgba(212,175,55,0.2)] focus:outline-none transition-all`}
          />
          {fieldErrors.phone && <p className="text-[10.5px] text-red-400 mt-1 pl-1">{fieldErrors.phone}</p>}
        </div>

        {/* 3. Email Address (For Verification PIN) */}
        <div className="space-y-1">
          <label htmlFor="mobile-franchise-email" className="text-[11px] font-mono uppercase tracking-wider text-[#d4af37]/90 block">
            Email Address (For Verification PIN) *
          </label>
          <input
            id="mobile-franchise-email"
            type="email"
            placeholder="e.g. rajesh@example.com"
            value={formData.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            className={`w-full h-11 sm:h-12 px-3.5 rounded-xl bg-[#05070c]/90 border ${
              fieldErrors.email ? 'border-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-white/[0.12] focus:border-[#d4af37]'
            } text-sm text-white placeholder-slate-500 focus:bg-[#080b12] focus:shadow-[0_0_12px_rgba(212,175,55,0.2)] focus:outline-none transition-all`}
          />
          {fieldErrors.email && <p className="text-[10.5px] text-red-400 mt-1 pl-1">{fieldErrors.email}</p>}
        </div>

        {/* 4. Target City / Location */}
        <div className="space-y-1">
          <label htmlFor="mobile-franchise-city" className="text-[11px] font-mono uppercase tracking-wider text-[#d4af37]/90 block">
            Target City / Location *
          </label>
          <input
            id="mobile-franchise-city"
            type="text"
            placeholder="e.g. Vadodara, Gujarat"
            value={formData.city}
            onChange={(e) => handleFieldChange('city', e.target.value)}
            className={`w-full h-11 sm:h-12 px-3.5 rounded-xl bg-[#05070c]/90 border ${
              fieldErrors.city ? 'border-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-white/[0.12] focus:border-[#d4af37]'
            } text-sm text-white placeholder-slate-500 focus:bg-[#080b12] focus:shadow-[0_0_12px_rgba(212,175,55,0.2)] focus:outline-none transition-all`}
          />
          {fieldErrors.city && <p className="text-[10.5px] text-red-400 mt-1 pl-1">{fieldErrors.city}</p>}
        </div>

        {/* 5. Theme-Matched Luxury Dropdown (Mobile) */}
        <div className="space-y-1 relative z-30" ref={dropdownRef}>
          <label id="mobile-franchise-category-label" className="text-[11px] font-mono uppercase tracking-wider text-[#d4af37]/90 block">
            Your Profile Category *
          </label>
          <div className="relative">
            <button
              type="button"
              role="combobox"
              aria-labelledby="mobile-franchise-category-label"
              aria-expanded={isCategoryOpen}
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="w-full h-11 sm:h-12 px-3.5 rounded-xl bg-[#05070c]/90 border border-[#d4af37]/40 hover:border-[#d4af37] focus:border-[#d4af37] text-left text-sm text-white transition-all cursor-pointer flex items-center justify-between shadow-inner"
            >
              <span className="truncate">{formData.category}</span>
              <ChevronDown className={`w-4 h-4 text-[#d4af37] transition-transform duration-300 ml-2 flex-shrink-0 ${isCategoryOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCategoryOpen && (
              <div
                role="listbox"
                className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl bg-[#090c13] border border-[#d4af37]/50 shadow-[0_20px_60px_rgba(0,0,0,0.98)] backdrop-blur-2xl py-1.5 max-h-[280px] overflow-y-auto overscroll-contain"
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
                id="mobile-franchise-customCategory"
                type="text"
                placeholder="Specify your background / profession..."
                value={formData.customCategory}
                onChange={(e) => handleFieldChange('customCategory', e.target.value)}
                className={`w-full h-11 px-3.5 rounded-xl bg-[#05070c]/90 border ${
                  fieldErrors.customCategory ? 'border-red-500/80' : 'border-[#d4af37]/50'
                } text-sm text-white placeholder-slate-500 focus:outline-none transition-all`}
              />
              {fieldErrors.customCategory && <p className="text-[10px] text-red-400 mt-1 pl-1">{fieldErrors.customCategory}</p>}
            </div>
          )}
        </div>

        {/* 6. Verify & Submit Button */}
        <button
          type="button"
          onClick={handleInitiateSubmission}
          disabled={isSubmitting}
          className="relative z-20 w-full min-h-[50px] py-3.5 px-4 rounded-xl text-black bg-gradient-to-r from-[#d4af37] via-[#fff2b2] to-[#cba328] hover:brightness-105 active:scale-[0.99] transition-all shadow-[0_4px_22px_rgba(212,175,55,0.4)] border border-[#fff2b2]/50 cursor-pointer flex items-center justify-center gap-2 mt-2 pointer-events-auto select-auto"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-black shrink-0" />
              <span className="text-xs sm:text-[13px] font-bold tracking-wider uppercase text-black">
                Verifying Application Eligibility...
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-center">
              <Send className="w-3.5 h-3.5 text-black shrink-0" />
              <span className="text-[11.5px] xs:text-xs sm:text-[13px] font-bold tracking-wide uppercase text-black leading-tight">
                Verify Mobile &amp; Connect to WhatsApp Desk
              </span>
            </div>
          )}
        </button>

        <p className="text-[10px] text-center text-slate-400 font-light pt-0.5">
          Protected by Shivmax Non-Disclosure &bull; 100% Confidential Direct Desk Review
        </p>
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
        className="relative z-20 w-full min-h-[50px] py-3.5 px-5 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase text-black bg-gradient-to-r from-[#d4af37] via-[#fff2b2] to-[#cba328] hover:brightness-105 active:scale-[0.99] transition-all shadow-[0_4px_25px_rgba(212,175,55,0.45)] border border-[#fff2b2]/50 cursor-pointer flex items-center justify-center gap-2 mt-2 pointer-events-auto select-auto"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-black shrink-0" />
            <span>Verifying Application Eligibility...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Send className="w-4 h-4 text-black shrink-0" />
            <span>Submit &amp; Connect to Executive WhatsApp Desk</span>
          </div>
        )}
      </button>

      <p className="text-[10.5px] text-center text-slate-400 font-light">
        Protected by Shivmax Non-Disclosure &bull; 100% Confidential Direct Desk Review
      </p>
    </form>
  );
}
