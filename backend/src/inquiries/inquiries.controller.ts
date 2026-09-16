import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateInquiryDto, InquiriesService, InquiryRecord } from './inquiries.service.js';

@Controller('api/inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Post()
  create(@Body() dto: CreateInquiryDto): {
    success: boolean;
    message: string;
    data: InquiryRecord;
  } {
    const record = this.inquiriesService.create(dto);
    return {
      success: true,
      message: `Your private viewing request has been confirmed under reference ${record.referenceCode}. A personal luxury concierge has been assigned.`,
      data: record,
    };
  }

  @Get()
  getAll(): InquiryRecord[] {
    return this.inquiriesService.findAll();
  }
}
