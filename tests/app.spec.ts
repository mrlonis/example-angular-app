import { expect, test } from '@playwright/test';

test.describe('App', () => {
  test('shows the application title in the document title', async ({ page }) => {
    await page.goto('');

    await expect(page).toHaveTitle(/Example Angular App/);
  });
});

test.describe('App shell and routing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads the tab layout and mat table content on the default route', async ({ page }) => {
    await expect(page.locator('[role="tab"]', { hasText: 'Mat Table' })).toBeVisible();
    await expect(page.locator('[role="tab"]', { hasText: 'iframe-resizer' })).toBeVisible();
    await expect(
      page.locator('tr.mat-mdc-row.example-element-row').first().locator('td.mat-column-name'),
    ).toContainText('Hydrogen');
  });

  test('loads the toolbar route directly', async ({ page }) => {
    await page.goto('/toolbar');

    await expect(page.locator('app-mat-toolbar')).toBeAttached();
    await expect(page.locator('mat-toolbar')).toContainText('My App');
  });

  test('opens the side drawer from the toolbar menu button', async ({ page }) => {
    await page.goto('/toolbar');

    await expect(page.locator('mat-drawer')).not.toHaveClass(/mat-drawer-opened/);
    await page.locator('mat-toolbar button').first().click();
    await expect(page.locator('mat-drawer')).toHaveClass(/mat-drawer-opened/);
    await expect(page.locator('mat-drawer')).toContainText('Mat Table');
    await expect(page.locator('mat-drawer')).toContainText('iframe-resizer');
  });
});
