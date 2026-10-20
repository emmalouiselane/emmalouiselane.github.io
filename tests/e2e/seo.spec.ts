import { expect, test } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

test.describe('content is available to crawlers without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('home and all collection pages expose headings and content links', async ({ page }) => {
    for (const [route, linkSelector] of [
      ['/', '.home-card[href^="/blog-posts/"]'],
      ['/blog-posts/', '.post-list-item__link'],
      ['/digital-garden/reading/', '.garden-card-links a[href^="/digital-garden/reading/"]'],
      ['/digital-garden/watching/', '.garden-list-card__footer a'],
    ]) {
      await page.goto(route);
      await expect(page.locator('main h1')).toBeVisible();
      expect(await page.locator(`main ${linkSelector}`).count()).toBeGreaterThan(0);
      await expect(page.locator('main')).not.toContainText('Loading');
    }
  });

  test('pagination serves distinct content and uses self-referencing canonicals', async ({ page }) => {
    for (const [base, cards] of [
      ['/blog-posts/', '.post-list-item h2'],
      ['/digital-garden/reading/', '.review-list-item h2'],
      ['/digital-garden/watching/', '.watch-list-item h2'],
    ]) {
      await page.goto(base);
      const firstTitles = await page.locator(cards).allTextContents();
      const next = page.getByRole('link', { name: 'Next', exact: true });
      await expect(next).toHaveAttribute('href', `${base}page/2/`);
      await next.click();
      await expect(page).toHaveURL(new RegExp(`${base}page/2/$`));
      const secondTitles = await page.locator(cards).allTextContents();
      expect(secondTitles.length).toBeGreaterThan(0);
      expect(secondTitles.some(title => firstTitles.includes(title))).toBe(false);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://sparklane.dev${base}page/2/`);
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `https://sparklane.dev${base}page/2/`);
    }
  });

  test('homepage show/hide controls work without JavaScript', async ({ page }) => {
    await page.goto('/');
    const latest = page.locator('#latest-additions-content');
    const garden = page.locator('#digital-garden-content');
    const latestControl = page.locator('summary').filter({ hasText: 'Want to see the latest additions?' });
    const gardenControl = page.locator('summary').filter({ hasText: 'More from the digital garden?' });
    await expect(latest).toBeHidden();
    await expect(garden).toBeHidden();
    await expect(gardenControl).toBeHidden();

    await latestControl.click();
    await expect(latest).toBeVisible();
    await expect(latestControl.locator('.home-disclosure__hide')).toBeVisible();
    await expect(gardenControl).toBeVisible();
    await latestControl.click();
    await expect(latest).toBeHidden();
    await expect(latestControl.locator('.home-disclosure__show')).toBeVisible();
    await expect(gardenControl).toBeHidden();

    await latestControl.click();
    await gardenControl.focus();
    await page.keyboard.press('Enter');
    await expect(garden).toBeVisible();
    await expect(gardenControl.locator('.home-disclosure__hide')).toBeVisible();

    await latestControl.click();
    await expect(gardenControl).toBeHidden();
    await expect(garden).toBeHidden();
    await latestControl.click();
    await expect(gardenControl).toBeVisible();
    await expect(garden).toBeVisible();

    await gardenControl.focus();
    await page.keyboard.press('Enter');
    await expect(garden).toBeHidden();
    await expect(gardenControl.locator('.home-disclosure__show')).toBeVisible();
  });
});

test('journal filtering survives hydration and makes no browser-side CMS requests', async ({ page }) => {
  const cmsRequests: string[] = [];
  page.on('request', request => {
    const requestUrl = request.url();
    try {
      if (new URL(requestUrl).hostname === 'graphql.contentful.com') cmsRequests.push(requestUrl);
    } catch {
      // Ignore non-standard URLs that cannot be parsed.
    }
  });
  await page.goto('/blog-posts/page/2/');
  await page.getByRole('button', { name: 'Toggle filters' }).click();
  const firstTitle = await page.locator('.post-list-item h2').first().textContent();
  await page.getByLabel('Search posts').fill(firstTitle!);
  await expect(page.locator('.post-list-item')).toHaveCount(1);
  await expect(page.locator('.post-list-item h2')).toHaveText(firstTitle!);
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('.post-list-item')).toHaveCount(6);
  await expect(page.locator('.blog-pagination a[aria-current="page"]')).toHaveText('2');
  expect(cmsRequests).toEqual([]);
});

test('legacy recipe URLs redirect to the matching garden recipes', async ({ page }) => {
  const recipeDirectory = join(process.cwd(), 'dist', 'digital-garden', 'recipes');
  const slugs = readdirSync(recipeDirectory, { withFileTypes: true })
    .filter(entry => entry.isDirectory()).map(entry => entry.name);
  expect(slugs.length).toBeGreaterThan(0);
  for (const slug of ['', ...slugs]) {
    const oldPath = `/workshop/recipes/${slug ? `${slug}/` : ''}`;
    const destination = `/digital-garden/recipes/${slug ? `${slug}/` : ''}`;
    const html = readFileSync(join(process.cwd(), 'dist', oldPath, 'index.html'), 'utf8');
    expect(html, oldPath).toMatch(/http-equiv="refresh"/);
    expect(html, oldPath).toContain(destination.replace(/\/$/, ''));
    expect(html, oldPath).not.toMatch(/<script\b/);
  }
  await page.goto('/workshop/recipes/');
  await expect(page).toHaveURL(/\/digital-garden\/recipes\/$/);
  await page.goto(`/workshop/recipes/${slugs[0]}/`);
  await expect(page).toHaveURL(new RegExp(`/digital-garden/recipes/${slugs[0]}/$`));
  await expect(page.locator('main h1')).toBeVisible();
});

test('structured data is valid JSON and old redirect routes are excluded from the sitemap', async ({ page }) => {
  const sitemap = readFileSync(join(process.cwd(), 'dist', 'sitemap-0.xml'), 'utf8');
  expect(sitemap).toContain('https://sparklane.dev/freelance/');
  expect(sitemap).not.toContain('/workshop/');
  expect(sitemap).not.toContain('/404');
  const detailRoute = (base: string) => {
    const slug = readdirSync(join(process.cwd(), 'dist', base), { withFileTypes: true })
      .find(entry => entry.isDirectory() && entry.name !== 'page')?.name;
    expect(slug, `${base} needs published content`).toBeTruthy();
    return `/${base}/${slug}/`;
  };
  for (const [route, type] of [
    ['/', 'WebSite'],
    ['/freelance/', 'Service'],
    [detailRoute('blog-posts'), 'BlogPosting'],
    [detailRoute('digital-garden/recipes'), 'Recipe'],
  ]) {
    await page.goto(route);
    const data = await page.locator('script[type="application/ld+json"]').allTextContents();
    const entities = data.flatMap(json => {
      const entity = JSON.parse(json);
      return entity['@graph'] || [entity];
    });
    const entity = entities.find(entity => entity['@type'] === type);
    expect(entity, `${route} should have ${type} data`).toBeTruthy();
    if (type === 'BlogPosting') {
      expect(entity.author.name).toBe('Emma Lane');
      expect(entity.datePublished).toBeTruthy();
    }
    if (type === 'Recipe') {
      expect(entity.recipeIngredient.length).toBeGreaterThan(0);
      expect(entity.recipeInstructions.length).toBeGreaterThan(0);
    }
  }
});

test('freelance page works at desktop and mobile widths', async ({ page }, testInfo) => {
  for (const width of [1280, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/freelance/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Email me at emma@sparklane.dev', exact: true })).toHaveAttribute('href', /^mailto:emma@sparklane\.dev/);
    const overflows = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflows).toBe(false);
    await page.screenshot({ path: testInfo.outputPath(`freelance-${width}.png`), fullPage: true });
  }
});
