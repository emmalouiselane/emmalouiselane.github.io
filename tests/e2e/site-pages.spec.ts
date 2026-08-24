import { expect, test } from '@playwright/test';
import { readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const distDirectory = join(process.cwd(), 'dist');

function generatedRoutes(directory = distDirectory): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      return generatedRoutes(path);
    }

    if (entry.isFile() && entry.name === 'index.html') {
      const routeDirectory = relative(distDirectory, directory).split(sep).join('/');
      return [routeDirectory ? `/${routeDirectory}/` : '/'];
    }

    return [];
  }).sort();
}

test('every generated page responds and exposes the main content area', async ({ page }) => {
  test.setTimeout(180_000);

  const routes = generatedRoutes();
  expect(routes.length).toBeGreaterThan(0);

  for (const route of routes) {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });

    expect(response?.status(), `${route} should respond successfully`).toBe(200);
    await expect(page.locator('main#main-content'), `${route} should contain main content`)
      .toBeVisible();
    await expect(page, `${route} should have a page title`).toHaveTitle(/.+/);
  }
});

test('CV summaries and professional experience can be expanded', async ({ page }) => {
  await page.goto('/about/my-cv/', { waitUntil: 'domcontentloaded' });

  const broaderSummaryToggle = page.locator('[data-summary-toggle="broader"]');
  const dotnetSummaryToggle = page.locator('[data-summary-toggle="dotnet"]');
  const javascriptSummaryToggle = page.locator('[data-summary-toggle="javascript"]');

  await expect(broaderSummaryToggle).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-summary-panel="broader"]')).toBeVisible();
  await expect(page.locator('[data-summary-panel="dotnet"]')).toBeHidden();
  await expect(page.locator('[data-summary-panel="javascript"]')).toBeHidden();

  await dotnetSummaryToggle.click();
  await expect(dotnetSummaryToggle).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-summary-panel="dotnet"]')).toBeVisible();

  await javascriptSummaryToggle.click();
  await expect(javascriptSummaryToggle).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-summary-panel="javascript"]')).toBeVisible();

  const roles = page.locator('#cv-timeline .cv-role');
  await expect(roles).toHaveCount(6);
  await expect(roles.nth(0)).toBeVisible();
  await expect(roles.nth(1)).toBeVisible();
  await expect(roles.nth(2)).toBeVisible();
  await expect(roles.nth(3)).toBeHidden();
  await expect(roles.nth(4)).toBeHidden();
  await expect(roles.nth(5)).toBeHidden();

  const experienceToggle = page.locator('[data-experience-toggle]');
  await expect(experienceToggle).toHaveText('Load more');

  await experienceToggle.click();
  await expect(roles.nth(3)).toBeVisible();
  await expect(roles.nth(4)).toBeVisible();
  await expect(roles.nth(5)).toBeVisible();
  await expect(experienceToggle).toHaveText('Show less experience');

  await experienceToggle.click();
  await expect(roles.nth(3)).toBeHidden();
  await expect(experienceToggle).toHaveText('Load more');
});
