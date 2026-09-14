'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, Shield } from 'lucide-react';
import { submitInquiry } from '@/lib/api';
import { redirectToWhatsApp } from '@/lib/whatsapp';

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
    timeline: 'Immediate (Within 30 Days)',
    message: '',
    fax_number: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
        propertyInterest: `Franchise Application: ${formData.category} (${formData.city})`,
        specialRequests: `Timeline: ${formData.timeline}. Notes: ${formData.message}`,
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
        category: formData.category,
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
          placeholder="Full Name *"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className="w-full px-3.5 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-base sm:text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
        />
        <input
          type="tel"
          required
          placeholder="Mobile Number (WhatsApp) *"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-3.5 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-base sm:text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37] font-mono"
        />
        <input
          type="email"
          required
          placeholder="Email Address *"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3.5 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-base sm:text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
        />
        <input
          type="text"
          required
          placeholder="Target City *"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          className="w-full px-3.5 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-base sm:text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
        />
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-3.5 py-3 rounded-xl bg-[#0a0d14] border border-white/[0.1] text-base sm:text-xs text-white focus:outline-none focus:border-[#d4af37]"
        >
          <option value="Salaried Professional (Job Worker)">Salaried Professional</option>
          <option value="Existing Entrepreneur (Business Person)">Existing Entrepreneur</option>
          <option value="Retired Officer / Senior Leader">Retired Officer / Senior Leader</option>
          <option value="NRI / Institutional Investor">NRI / Institutional Investor</option>
        </select>
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
          <label className="text-[10.5px] font-mono uppercase tracking-wider text-slate-300 block">
            Full Name *
          </label>
          <input
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
          <label className="text-[10.5px] font-mono uppercase tracking-wider text-slate-300 block">
            Mobile Number (WhatsApp) *
          </label>
          <input
            type="tel"
            required
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
          <label className="text-[10.5px] font-mono uppercase tracking-wider text-slate-300 block">
            Email Address *
          </label>
          <input
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
          <label className="text-[10.5px] font-mono uppercase tracking-wider text-slate-300 block">
            Target City / Location *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Vadodara, Ahmedabad, Surat"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-[#d4af37] focus:outline-none text-base sm:text-xs text-white placeholder-slate-500 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Target Profile Category */}
        <div className="space-y-1.5">
          <label className="text-[10.5px] font-mono uppercase tracking-wider text-slate-300 block">
            Your Profile Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[#0a0d14] border border-white/[0.1] focus:border-[#d4af37] focus:outline-none text-base sm:text-xs text-white transition-all cursor-pointer"
          >
            <option value="Salaried Professional (Job Worker)">Salaried Professional (Job Worker)</option>
            <option value="Existing Entrepreneur (Business Person)">Existing Entrepreneur (Business Person)</option>
            <option value="Retired Officer / Senior Leader">Retired Officer / Senior Leader</option>
            <option value="NRI / Institutional Investor">NRI / Institutional Investor</option>
          </select>
        </div>

        {/* Investment & Launch Timeline */}
        <div className="space-y-1.5">
          <label className="text-[10.5px] font-mono uppercase tracking-wider text-slate-300 block">
            Target Launch Timeline
          </label>
          <select
            value={formData.timeline}
            onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[#0a0d14] border border-white/[0.1] focus:border-[#d4af37] focus:outline-none text-base sm:text-xs text-white transition-all cursor-pointer"
          >
            <option value="Immediate (Within 30 Days)">Immediate (Within 30 Days)</option>
            <option value="1 to 2 Months">1 to 2 Months</option>
            <option value="Quarterly Planning">Quarterly Planning</option>
            <option value="Exploratory Evaluation">Exploratory Evaluation</option>
          </select>
        </div>
      </div>

      {/* Special Strategic Notes */}
      <div className="space-y-1.5">
        <label className="text-[10.5px] font-mono uppercase tracking-wider text-slate-300 block">
          Background &amp; Strategic Ambitions (Optional)
        </label>
        <textarea
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
