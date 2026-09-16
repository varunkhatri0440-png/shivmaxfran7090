import { Injectable } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateInquiryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  fullName!: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(150)
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  phone!: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  propertyInterest?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  preferredDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  budgetTier?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  specialRequests?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  tourType?: string;

  // Bot honeypot field (should be empty from legitimate humans)
  @IsOptional()
  @IsString()
  fax_number?: string;
}

export interface InquiryRecord extends CreateInquiryDto {
  id: string;
  referenceCode: string;
  status: 'Confirmed' | 'Reviewing' | 'Advisor Assigned';
  dedicatedConcierge: string;
  createdAt: string;
}

@Injectable()
export class InquiriesService {
  private inquiries: InquiryRecord[] = [];

  create(dto: CreateInquiryDto): InquiryRecord {
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const conciergeNames = [
      'Devendra Singhania, Senior Estate Partner',
      'Ananya Mehra, Private Client Advisor',
      'Vikram Oberoi, Executive Director of Acquisitions',
    ];
    const assignedConcierge =
      conciergeNames[Math.floor(Math.random() * conciergeNames.length)];

    // Bot honeypot check: If hidden honeypot field is filled, silently return without storing
    if (dto.fax_number) {
      return {
        ...dto,
        id: `inq_bot_${Date.now()}`,
        referenceCode: `SHV-VIP-${randomCode}`,
        status: 'Confirmed',
        dedicatedConcierge: assignedConcierge,
        createdAt: new Date().toISOString(),
      };
    }

    const record: InquiryRecord = {
      ...dto,
      id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      referenceCode: `SHV-VIP-${randomCode}`,
      status: 'Confirmed',
      dedicatedConcierge: assignedConcierge,
      createdAt: new Date().toISOString(),
    };

    this.inquiries.unshift(record);
    return record;
  }

  findAll(): InquiryRecord[] {
    return this.inquiries;
  }
}
