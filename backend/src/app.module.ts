import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PropertiesModule } from './properties/properties.module.js';
import { InquiriesModule } from './inquiries/inquiries.module.js';
import { StatsModule } from './stats/stats.module.js';

@Module({
  imports: [PropertiesModule, InquiriesModule, StatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
