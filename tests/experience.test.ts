import { describe, expect, it } from 'vitest';

import { calculateYearsExperience } from '../src/lib/experience';

describe('calculateYearsExperience', () => {
  const startDate = new Date(2012, 8, 1);

  it('returns the completed years before the anniversary', () => {
    expect(calculateYearsExperience(new Date(2024, 7, 31), startDate)).toBe(11);
  });

  it('counts the anniversary as a completed year', () => {
    expect(calculateYearsExperience(new Date(2024, 8, 1), startDate)).toBe(12);
  });

  it('continues to calculate correctly after the anniversary', () => {
    expect(calculateYearsExperience(new Date(2025, 10, 24), startDate)).toBe(13);
  });
});
