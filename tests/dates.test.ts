import { expect, it } from 'vitest';
import { formatDate } from '../src/lib/dates';

it('formats CMS dates consistently across build and browser time zones', () => {
  expect(formatDate('2026-10-20')).toBe('20 Oct 2026');
  expect(formatDate('2026-10-20T23:30:00-05:00')).toBe('21 Oct 2026');
  expect(formatDate('invalid')).toBe('');
});
