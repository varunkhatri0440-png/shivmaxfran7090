import { describe, it, expect, beforeEach } from 'vitest';
import { StatsService } from './stats.service.js';

describe('StatsService', () => {
  let service: StatsService;

  beforeEach(() => {
    service = new StatsService();
  });

  it('should return statistical highlights and credentials', () => {
    const stats = service.getStats();
    expect(stats).toBeDefined();
    expect(stats.portfolioValue).toBeDefined();
    expect(stats.satisfactionRate).toBeDefined();
    expect(stats.reraRegistered).toContain('GUJRERA');
    expect(stats.highlights).toBeInstanceOf(Array);
    expect(stats.testimonials).toBeInstanceOf(Array);
  });
});
