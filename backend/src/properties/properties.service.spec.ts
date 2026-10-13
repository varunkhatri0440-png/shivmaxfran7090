import { describe, it, expect, beforeEach } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { PropertiesService } from './properties.service.js';

describe('PropertiesService', () => {
  let service: PropertiesService;

  beforeEach(() => {
    service = new PropertiesService();
  });

  it('should return all properties when no filter is applied', () => {
    const all = service.findAll();
    expect(all).toBeInstanceOf(Array);
    expect(all.length).toBeGreaterThan(0);
  });

  it('should filter properties by category correctly', () => {
    const penthouses = service.findAll('Penthouse');
    expect(penthouses.length).toBeGreaterThan(0);
    penthouses.forEach((p) => {
      expect(p.category.toLowerCase()).toBe('penthouse');
    });
  });

  it('should filter properties by featured status', () => {
    const featured = service.findAll(undefined, true);
    expect(featured.length).toBeGreaterThan(0);
    featured.forEach((p) => {
      expect(p.featured).toBe(true);
    });
  });

  it('should return a specific property by ID', () => {
    const property = service.findOne('trishula-sky-penthouse');
    expect(property).toBeDefined();
    expect(property.id).toBe('trishula-sky-penthouse');
    expect(property.title).toBe('The Trishula Sky Penthouse');
  });

  it('should throw NotFoundException for non-existent property ID', () => {
    expect(() => service.findOne('non-existent-estate-id')).toThrow(NotFoundException);
  });
});
