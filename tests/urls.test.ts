import { describe, expect, it } from 'vitest';
import { portfolioEmbedUrl, safeExternalUrl } from '../src/lib/urls';

describe('external CMS URLs', () => {
  it.each([undefined, null, '', '/relative', '//example.com', 'javascript:alert(1)',
    'data:text/html,test', 'http://example.com', 'https://user:pass@example.com',
    'https://example.com:8080'])('rejects unsafe or unsupported URLs: %s', value => {
    expect(safeExternalUrl(value)).toBeUndefined();
  });

  it('preserves valid HTTPS links and their queries', () => {
    expect(safeExternalUrl(' https://example.com/book?id=1 ')).toBe('https://example.com/book?id=1');
  });

  it('only permits exact, explicitly trusted demo origins', () => {
    expect(portfolioEmbedUrl('https://sparklane.dev/2D-portfolio/')).toBe('https://sparklane.dev/2D-portfolio/');
    for (const value of ['https://evil.example', 'https://sparklane.dev.evil.example/',
      'https://evil.sparklane.dev/', 'https://sparklane.dev@evil.example/']) {
      expect(portfolioEmbedUrl(value)).toBeUndefined();
    }
  });
});
