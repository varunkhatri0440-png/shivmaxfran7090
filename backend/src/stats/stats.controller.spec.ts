import { describe, it, expect, beforeEach } from 'vitest';
import { StatsController } from './stats.controller.js';
import { StatsService } from './stats.service.js';

describe('StatsController', () => {
  let controller: StatsController;
  let service: StatsService;

  beforeEach(() => {
    service = new StatsService();
    controller = new StatsController(service);
  });

  it('should delegate getStats to StatsService', () => {
    const stats = controller.getStats();
    expect(stats.portfolioValue).toBeDefined();
    expect(stats.reraRegistered).toContain('GUJRERA');
  });
});
