import { Controller, Get, Param, Query } from '@nestjs/common';
import { PropertiesService } from './properties.service.js';
import type { Property } from './properties.service.js';

@Controller('api/properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  getAll(
    @Query('category') category?: string,
    @Query('featured') featured?: string,
  ): Property[] {
    const isFeatured = featured === 'true' ? true : featured === 'false' ? false : undefined;
    return this.propertiesService.findAll(category, isFeatured);
  }

  @Get(':id')
  getById(@Param('id') id: string): Property {
    return this.propertiesService.findOne(id);
  }
}
