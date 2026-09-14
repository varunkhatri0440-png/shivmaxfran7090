/**
 * WhatsApp Integration Utility for Shivmax Real Estate Franchise Applications
 * Direct target WhatsApp number: +91 8160351486
 */

export interface FranchiseInquiryData {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  category: string;
  timeline: string;
  message?: string;
  referenceCode?: string;
}

export const WHATSAPP_PHONE_NUMBER = '918160351486';

/**
 * Builds a compact, high-impact executive WhatsApp message
 */
export function buildWhatsAppMessage(data: FranchiseInquiryData): string {
  const name = data.fullName.trim() || 'Valued Applicant';
  const phone = data.phone.trim() || 'Not Provided';
  const email = data.email.trim() || 'Not Provided';
  const city = data.city.trim() || 'Vadodara, Gujarat';
  const category = data.category.trim() || 'Salaried Professional';
  const timeline = data.timeline.trim() || 'Immediate';
  const refCode =
    data.referenceCode ||
    `SHV-VIP-${Math.floor(100000 + Math.random() * 900000)}`;

  const lines = [
    '🔱 *SHIVMAX REAL ESTATE* 🔱',
    '⚜️ _Franchise Partnership Application_',
    '━━━━━━━━━━━━━━━━━━━━━',
    `👤 *Name:* ${name}`,
    `📞 *Phone:* ${phone}`,
    `✉️ *Email:* ${email}`,
    `📍 *Territory:* ${city}`,
    `💼 *Profile:* ${category}`,
    `⏱️ *Timeline:* ${timeline}`,
  ];

  if (data.message && data.message.trim()) {
    lines.push(`📝 *Note:* "${data.message.trim()}"`);
  }

  lines.push('━━━━━━━━━━━━━━━━━━━━━');
  lines.push(`🆔 *Ref:* \`${refCode}\` • ★★★★★ VIP`);
  lines.push('✨ _365-Day Fully-Funded Launch_');

  return lines.join('\n');
}

/**
 * Generates the universal WhatsApp URL with encoded message
 */
export function getWhatsAppUrl(data: FranchiseInquiryData): string {
  const text = buildWhatsAppMessage(data);
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE_NUMBER}&text=${encodeURIComponent(text)}`;
}

/**
 * Dispatches the user directly to WhatsApp with their filled-in details
 */
export function redirectToWhatsApp(data: FranchiseInquiryData) {
  if (typeof window === 'undefined') return;
  const url = getWhatsAppUrl(data);

  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
  );

  if (isMobile) {
    // Native deep-link redirect for mobile
    window.location.href = url;
  } else {
    // Open WhatsApp Web or Desktop application in a new tab on desktop
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      window.location.href = url;
    }
  }
}
