import { describe, it, expect, beforeEach } from 'vitest';
import { InquiriesController } from './inquiries.controller.js';
import { InquiriesService, CreateInquiryDto } from './inquiries.service.js';

describe('InquiriesController', () => {
  let controller: InquiriesController;
  let service: InquiriesService;

  beforeEach(() => {
    service = new InquiriesService();
    controller = new InquiriesController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should process inquiry submissions and return structured success envelope', () => {
    const dto: CreateInquiryDto = {
      fullName: 'Ananya Birla',
      email: 'ananya@birla-capital.com',
      phone: '+91 99000 88888',
      propertyInterest: 'Franchise Allotment: Alkapuri',
    };

    const response = controller.create(dto);

    expect(response.success).toBe(true);
    expect(response.message).toContain('Your private viewing request has been confirmed');
    expect(response.data).toBeDefined();
    expect(response.data.fullName).toBe('Ananya Birla');
  });

  it('should return all recorded inquiries', () => {
    const dto: CreateInquiryDto = {
      fullName: 'Rahul Bajaj',
      email: 'rahul@bajaj.com',
      phone: '+91 97111 22222',
    };

    controller.create(dto);
    const list = controller.getAll();

    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBe(1);
    expect(list[0].fullName).toBe('Rahul Bajaj');
  });
});
