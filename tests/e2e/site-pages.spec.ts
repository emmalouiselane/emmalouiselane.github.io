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
