import { describe, it, expect, beforeEach } from 'vitest';
import { PropertiesController } from './properties.controller.js';
import { PropertiesService } from './properties.service.js';

describe('PropertiesController', () => {
  let controller: PropertiesController;
  let service: PropertiesService;

  beforeEach(() => {
    service = new PropertiesService();
    controller = new PropertiesController(service);
  });

  it('should return all properties from controller', () => {
    const result = controller.getAll();
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should parse boolean query params and filter correctly', () => {
    const featuredOnly = controller.getAll(undefined, 'true');
    expect(featuredOnly.length).toBeGreaterThan(0);
    featuredOnly.forEach((p) => expect(p.featured).toBe(true));
  });

  it('should return property by param ID', () => {
    const property = controller.getById('trishula-sky-penthouse');
    expect(property.id).toBe('trishula-sky-penthouse');
  });
});
