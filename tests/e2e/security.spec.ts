import { expect, test } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const detailRoute = (base: string) => {
  const slug = readdirSync(join(process.cwd(), 'dist', base), { withFileTypes: true })
    .find(entry => entry.isDirectory() && entry.name !== 'page')!.name;
  return `/${base}/${slug}/`;
};

test.beforeEach(async ({ page }) => {
  // Deterministic third-party responses still go through the browser's real CSP checks.
  await page.route('https://tinylytics.app/**', route => route.fulfill({
    contentType: 'application/javascript',
    body: 'window.analyticsLoaded = true; fetch("https://tinylytics.app/test");',
  }));
  await page.route('https://open.spotify.com/embed/**', route => route.fulfill({
    contentType: 'text/html', body: '<!doctype html><title>Spotify test player</title>',
  }));
  await page.route('https://sparklane.dev/2D-portfolio/', route => route.fulfill({
    contentType: 'text/html',
    body: '<!doctype html><title>Demo</title><body><script>document.body.dataset.scriptsAllowed = "yes";</script>',
  }));
  await page.addInitScript(() => {
    (window as any).policyViolations = [];
    document.addEventListener('securitypolicyviolation', event => {
      (window as any).policyViolations.push(`${event.effectiveDirective}: ${event.blockedURI}`);
    });
  });
});

test('generated pages authorise scripts with CSP; automatic redirects have no scripts', () => {
  function check(directory: string) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) check(path);
      else if (entry.name.endsWith('.html')) {
        const html = readFileSync(path, 'utf8');
        const policy = html.match(/<meta\b[^>]*http-equiv="content-security-policy"[^>]*content="([^"]+)"/)?.[1];
        if (!policy) {
          // Astro's configured legacy redirects contain only a meta refresh and link.
          expect(html, path).toContain('http-equiv="refresh"');
          expect(html, path).not.toMatch(/<script\b|\son(?:click|load|error)=/i);
          continue;
        }
        expect(policy, path).toBeTruthy();
        expect(policy, path).toContain("object-src 'none'");
        expect(policy, path).toContain("script-src-attr 'none'");
        const policyPosition = html.indexOf('http-equiv="content-security-policy"');
        for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\b[^>]*>/gi)) {
          const [, attributes, code] = match;
          if (attributes.includes('application/ld+json')) continue;
          expect(match.index, `${path}: executable script precedes CSP`).toBeGreaterThan(policyPosition);
          if (attributes.includes('src=') || !code.trim()) continue;
          const hash = createHash('sha256').update(code).digest('base64');
          expect(policy, `${path}: unauthorised inline script`).toContain(`sha256-${hash}`);
        }
        expect(html, path).not.toMatch(/\son(?:click|load|error)=/i);
      }
    }
  }
  check(join(process.cwd(), 'dist'));
});

test('production pages hydrate without CSP violations', async ({ page }) => {
  test.setTimeout(60_000);
  for (const route of ['/', '/about/', '/about/my-cv/', '/blog-posts/',
    '/portfolio/', '/portfolio/2D-portfolio-preview/', '/digital-garden/listening/',
    '/digital-garden/gaming/stardew-valley/', '/digital-garden/recipes/',
    detailRoute('digital-garden/recipes')]) {
    await page.goto(route);
    await expect(page.locator('astro-island[ssr]'), route).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => (window as any).analyticsLoaded), { message: route }).toBe(true);
    expect(await page.evaluate(() => (window as any).policyViolations), route).toEqual([]);
  }
});

test('theme preference, tabs, and commit modal work with CSP enabled', async ({ page }) => {
  await page.goto('/about/');
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.getByRole('button', { name: 'Toggle theme' }).first().click();
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('theme'))).toBe('light');
  await page.reload();
  await expect(page.locator('html')).not.toHaveClass(/dark/);

  await page.locator('#space-btn').click();
  await expect(page.locator('#space-content')).toBeVisible();
  await expect(page.locator('#philosophy-content')).toBeHidden();
  await page.getByRole('button', { name: 'View recent commits' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeHidden();

  await page.goto('/digital-garden/gaming/stardew-valley/');
  await page.locator('#museum-tab').click();
  await expect(page.locator('#museum')).toBeVisible();
  await expect(page.locator('#mods')).toBeHidden();
  expect(await page.evaluate(() => (window as any).policyViolations)).toEqual([]);
});

test('CSP blocks injected scripts, event handlers and untrusted frames', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const script = document.createElement('script');
    script.textContent = 'window.injectedScriptRan = true';
    document.body.append(script);
    const button = document.createElement('button');
    button.setAttribute('onclick', 'window.injectedHandlerRan = true');
    document.body.append(button);
    button.click();
    const frame = document.createElement('iframe');
    frame.src = 'https://untrusted.invalid/';
    document.body.append(frame);
  });
  await expect.poll(() => page.evaluate(() => (window as any).policyViolations.length)).toBeGreaterThanOrEqual(3);
  expect(await page.evaluate(() => Boolean((window as any).injectedScriptRan || (window as any).injectedHandlerRan))).toBe(false);
  const violations = await page.evaluate(() => (window as any).policyViolations);
  expect(violations).toEqual(expect.arrayContaining([
    expect.stringMatching(/^script-src-elem:/), expect.stringMatching(/^script-src-attr:/), expect.stringMatching(/^frame-src:/),
  ]));
});

test('the portfolio demo runs scripts in a restricted sandbox', async ({ page }) => {
  await page.goto('/portfolio/2D-portfolio-preview/');
  const frame = page.locator('.portfolio-detail-iframe');
  await expect(frame).toHaveAttribute('sandbox', 'allow-scripts');
  await expect(frame).toHaveAttribute('referrerpolicy', 'no-referrer');
  await expect(frame.contentFrame().locator('body')).toHaveAttribute('data-scripts-allowed', 'yes');
  expect(await page.evaluate(() => {
    try { return Boolean(document.querySelector('iframe')?.contentWindow?.document); }
    catch { return false; }
  })).toBe(false);
});
