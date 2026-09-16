import { describe, it, expect, beforeEach } from 'vitest';
import { InquiriesService, CreateInquiryDto } from './inquiries.service.js';

describe('InquiriesService', () => {
  let service: InquiriesService;

  beforeEach(() => {
    service = new InquiriesService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should successfully store a valid human inquiry and assign reference code', () => {
    const dto: CreateInquiryDto = {
      fullName: 'Vikramaditya Singhania',
      email: 'vikram@singhaniaestates.com',
      phone: '+91 98250 12345',
      propertyInterest: 'General Franchise Partnership (Vadodara)',
      specialRequests: 'Schedule boardroom consultation',
      tourType: 'Shivmax Franchise Consultation',
    };

    const result = service.create(dto);

    expect(result).toBeDefined();
    expect(result.id).toMatch(/^inq_/);
    expect(result.referenceCode).toMatch(/^SHV-VIP-\d{6}$/);
    expect(result.status).toBe('Confirmed');
    expect(result.dedicatedConcierge).toBeDefined();
    expect(result.createdAt).toBeDefined();

    // Verify it was stored in memory
    const stored = service.findAll();
    expect(stored.length).toBe(1);
    expect(stored[0].id).toBe(result.id);
  });

  it('should silently drop bot submissions with honeypot fax_number without storing in DB', () => {
    const botDto: CreateInquiryDto = {
      fullName: 'Spam Bot 3000',
      email: 'bot@spamnetwork.ru',
      phone: '+1 800 555 0199',
      fax_number: '555-1234-SPAM', // Honeypot trap triggered
    };

    const result = service.create(botDto);

    // Returns a dummy success response to not alert the bot
    expect(result.id).toMatch(/^inq_bot_/);
    expect(result.referenceCode).toBeDefined();

    // Verify it was NOT added to the database/inquiries list
    const stored = service.findAll();
    expect(stored.length).toBe(0);
  });
});
